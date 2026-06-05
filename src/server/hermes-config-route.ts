import fs from 'node:fs'
import path from 'node:path'
import YAML from 'yaml'
import { z } from 'zod'

import { isAuthenticated } from './auth-middleware'
import { ensureGatewayProbed, getCapabilities } from './gateway-capabilities'
import { normalizeHermesConfigState } from './hermes-config-migration'
import {
  applyHermesConfigPatch,
  parseEnvFile,
  readHermesConfigFiles,
  resolveHermesConfigPaths,
  stringifyEnv,
} from './hermes-config-store'
import {
  ensureDiscovery,
  getDiscoveredModels,
  getDiscoveryStatus,
} from './local-provider-discovery'
import { createCapabilityUnavailablePayload } from '@/lib/feature-gates'

type AuthResult = Response | true

const ACTION_MESSAGES: Record<string, string> = {
  'set-default-model': 'Default model updated.',
  'set-api-key': 'API key saved.',
  'remove-api-key': 'API key removed.',
  'set-custom-provider': 'Custom provider saved.',
  'remove-custom-provider': 'Custom provider removed.',
  'remove-provider': 'Provider removed.',
}

const LEGACY_SAVE_MESSAGE = 'Saved.'

const PatchActionSchema = z.discriminatedUnion('action', [
  z.object({
    action: z.literal('set-default-model'),
    providerId: z.string().min(1),
    modelId: z.string().min(1),
  }),
  z.object({
    action: z.literal('set-api-key'),
    envKey: z.string().min(1),
    value: z.string(),
  }),
  z.object({
    action: z.literal('remove-api-key'),
    envKey: z.string().min(1),
  }),
  z.object({
    action: z.literal('set-custom-provider'),
    provider: z.object({
      name: z.string().min(1),
      baseUrl: z.string().min(1),
      apiKeyEnv: z.string().optional(),
      apiMode: z.string().optional(),
    }),
  }),
  z.object({
    action: z.literal('remove-custom-provider'),
    name: z.string().min(1),
  }),
  z.object({
    action: z.literal('remove-provider'),
    provider: z.string().min(1),
  }),
])

const LegacyPatchSchema = z.object({
  config: z.record(z.string(), z.unknown()).optional(),
  env: z.record(z.string(), z.union([z.string(), z.null()])).optional(),
})

const PathValuePatchSchema = z.object({
  path: z.string().min(1),
  value: z.unknown(),
})

const PROVIDER_ENV_KEYS: Record<string, Array<string>> = {
  anthropic: ['ANTHROPIC_API_KEY'],
  openai: ['OPENAI_API_KEY'],
  google: ['GOOGLE_API_KEY', 'GEMINI_API_KEY'],
  openrouter: ['OPENROUTER_API_KEY'],
  minimax: ['MINIMAX_API_KEY'],
  deepseek: ['DEEPSEEK_API_KEY'],
  custom: ['CUSTOM_API_KEY'],
}

async function authorize(request: Request): Promise<AuthResult> {
  const result = isAuthenticated(request) as AuthResult
  if (result !== true) return result
  await ensureGatewayProbed()
  return true
}

function unavailablePayload(extra: Record<string, unknown> = {}): Response {
  return Response.json({
    ...createCapabilityUnavailablePayload('config'),
    config: {},
    providers: [],
    customProviders: [],
    activeProvider: '',
    activeModel: '',
    ...extra,
  })
}

export async function handleHermesConfigGet({
  request,
}: {
  request: Request
}): Promise<Response> {
  const auth = await authorize(request)
  if (auth !== true) return auth

  const paths = resolveHermesConfigPaths()
  const files = readHermesConfigFiles(paths)

  if (!getCapabilities().config) {
    const state = normalizeHermesConfigState({
      paths,
      config: files.config,
      env: files.env,
      authProfiles: files.authProfiles,
      localProviders: [],
      localModels: [],
    })
    const providers = state.providers.map((p) => ({
      ...p,
      maskedKeys: p.maskedCredentials,
    }))

    return unavailablePayload({
      ...state,
      ok: false,
      providers,
      claudeHome: paths.hermesHome,
    })
  }

  await ensureDiscovery()
  const state = normalizeHermesConfigState({
    paths,
    config: files.config,
    env: files.env,
    authProfiles: files.authProfiles,
    localProviders: getDiscoveryStatus(),
    localModels: getDiscoveredModels(),
  })

  // Legacy /api/claude-config consumers read provider.maskedKeys; alias it.
  const providers = state.providers.map((p) => ({
    ...p,
    maskedKeys: p.maskedCredentials,
  }))

  return Response.json({
    ...state,
    providers,
    claudeHome: paths.hermesHome,
  })
}

function deepMerge(
  target: Record<string, unknown>,
  source: Record<string, unknown>,
): void {
  for (const [key, value] of Object.entries(source)) {
    if (
      value &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      target[key] &&
      typeof target[key] === 'object' &&
      !Array.isArray(target[key])
    ) {
      deepMerge(
        target[key] as Record<string, unknown>,
        value as Record<string, unknown>,
      )
    } else {
      target[key] = value
    }
  }
}

function applyLegacyConfigBody(
  configPath: string,
  updates: Record<string, unknown>,
): void {
  let current: Record<string, unknown> = {}
  try {
    const raw = fs.readFileSync(configPath, 'utf-8')
    const parsed = YAML.parse(raw)
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      current = parsed as Record<string, unknown>
    }
  } catch {}

  for (const [key, value] of Object.entries(updates)) {
    if (value === null) {
      delete current[key]
      delete updates[key]
    }
  }
  deepMerge(current, updates)
  fs.mkdirSync(path.dirname(configPath), { recursive: true })
  fs.writeFileSync(configPath, YAML.stringify(current), 'utf-8')
}

function applyLegacyEnvBody(
  envPath: string,
  envUpdates: Record<string, string | null>,
): void {
  let current: Record<string, string> = {}
  try {
    current = parseEnvFile(fs.readFileSync(envPath, 'utf-8'))
  } catch {}

  for (const [key, value] of Object.entries(envUpdates)) {
    if (value === '' || value === null) delete current[key]
    else current[key] = value
  }
  fs.mkdirSync(path.dirname(envPath), { recursive: true })
  fs.writeFileSync(envPath, stringifyEnv(current), 'utf-8')
}

function setPathValue(
  target: Record<string, unknown>,
  dottedPath: string,
  value: unknown,
): void {
  const segments = dottedPath
    .split('.')
    .map((segment) => segment.trim())
    .filter(Boolean)
  if (segments.length === 0) return

  let current = target
  for (const segment of segments.slice(0, -1)) {
    const existing = current[segment]
    if (!existing || typeof existing !== 'object' || Array.isArray(existing)) {
      current[segment] = {}
    }
    current = current[segment] as Record<string, unknown>
  }

  current[segments[segments.length - 1]] = value
}

function applyPathValueBody(
  configPath: string,
  dottedPath: string,
  value: unknown,
): void {
  const update: Record<string, unknown> = {}
  setPathValue(update, dottedPath, value)
  applyLegacyConfigBody(configPath, update)
}

function applyRemoveProviderBody(
  paths: ReturnType<typeof resolveHermesConfigPaths>,
  providerId: string,
): void {
  const config = readHermesConfigFiles(paths).config
  const envUpdates: Record<string, null> = {}
  for (const envKey of PROVIDER_ENV_KEYS[providerId] ?? []) {
    envUpdates[envKey] = null
  }

  if (Object.keys(envUpdates).length > 0) {
    applyLegacyEnvBody(paths.envPath, envUpdates)
  }

  const customProviders = Array.isArray(config.custom_providers)
    ? config.custom_providers.filter((entry) => {
        if (!entry || typeof entry !== 'object' || Array.isArray(entry))
          return true
        const record = entry as Record<string, unknown>
        return record.name !== providerId && record.id !== providerId
      })
    : null

  if (customProviders) {
    if (customProviders.length === 0)
      applyLegacyConfigBody(paths.configPath, { custom_providers: null })
    else
      applyLegacyConfigBody(paths.configPath, {
        custom_providers: customProviders,
      })
  }
}

export async function handleHermesConfigPatch({
  request,
}: {
  request: Request
}): Promise<Response> {
  const auth = await authorize(request)
  if (auth !== true) return auth

  if (!getCapabilities().config) {
    return new Response(
      JSON.stringify(
        createCapabilityUnavailablePayload('config', {
          error: 'Configuration updates are unavailable on this backend.',
        }),
      ),
      { status: 503, headers: { 'Content-Type': 'application/json' } },
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ ok: false, error: 'Invalid JSON' }, { status: 400 })
  }

  const paths = resolveHermesConfigPaths()
  const hasAction =
    body !== null &&
    typeof body === 'object' &&
    typeof (body as { action?: unknown }).action === 'string'

  if (hasAction) {
    const parsed = PatchActionSchema.safeParse(body)
    if (!parsed.success) {
      return Response.json(
        {
          ok: false,
          error: 'Invalid patch action body',
          issues: parsed.error.issues,
        },
        { status: 400 },
      )
    }
    if (parsed.data.action === 'remove-provider') {
      applyRemoveProviderBody(paths, parsed.data.provider)
      return Response.json({
        ok: true,
        message: ACTION_MESSAGES[parsed.data.action],
      })
    }

    const result = applyHermesConfigPatch(paths, parsed.data)
    return Response.json({
      ...result,
      message: ACTION_MESSAGES[parsed.data.action],
    })
  }

  const pathValue = PathValuePatchSchema.safeParse(body)
  if (pathValue.success) {
    applyPathValueBody(
      paths.configPath,
      pathValue.data.path,
      pathValue.data.value,
    )
    return Response.json({ ok: true, message: LEGACY_SAVE_MESSAGE })
  }

  const legacy = LegacyPatchSchema.safeParse(body)
  if (!legacy.success) {
    return Response.json(
      { ok: false, error: 'Invalid request body', issues: legacy.error.issues },
      { status: 400 },
    )
  }

  if (legacy.data.config)
    applyLegacyConfigBody(paths.configPath, legacy.data.config)
  if (legacy.data.env) applyLegacyEnvBody(paths.envPath, legacy.data.env)

  return Response.json({ ok: true, message: LEGACY_SAVE_MESSAGE })
}
