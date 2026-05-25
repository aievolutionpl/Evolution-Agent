'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Alert02Icon,
  CheckmarkCircle02Icon,
  Copy01Icon,
  Download04Icon,
  PlayIcon,
  Plug01Icon,
  RefreshIcon,
  Rocket01Icon,
  SparklesIcon,
} from '@hugeicons/core-free-icons'
import type { HermesInstallStatus } from '@/lib/hermes-status-types'
import { cn } from '@/lib/utils'
import { ProviderLogo } from '@/components/provider-logo'
import { writeTextToClipboard } from '@/lib/clipboard'

const KNOWN_PROVIDER_PREFIXES = [
  'openrouter',
  'anthropic',
  'openai',
  'openai-codex',
  'nous',
  'ollama',
  'atomic-chat',
  'zai',
  'kimi-coding',
  'minimax',
  'minimax-cn',
]

function stripProviderPrefix(model: string): string {
  if (!model) return model
  const slash = model.indexOf('/')
  if (slash === -1) return model
  const prefix = model.slice(0, slash)
  if (KNOWN_PROVIDER_PREFIXES.includes(prefix)) {
    return model.slice(slash + 1)
  }
  return model
}

export const ONBOARDING_KEY = 'claude-onboarding-complete'
export const ONBOARDING_COMPLETE_EVENT = 'claude:onboarding-complete'

function dispatchOnboardingCompletionChanged(completed: boolean) {
  if (typeof window === 'undefined') return
  window.dispatchEvent(
    new CustomEvent(ONBOARDING_COMPLETE_EVENT, {
      detail: { completed },
    }),
  )
}

type Step = 'welcome' | 'hermes' | 'connect' | 'provider' | 'test' | 'done'

type GatewayStatusResponse = {
  agent?: {
    installed?: boolean
    running?: boolean
  }
  capabilities?: {
    health?: boolean
    chatCompletions?: boolean
    models?: boolean
    streaming?: boolean
    sessions?: boolean
    skills?: boolean
    memory?: boolean
    config?: boolean
    jobs?: boolean
  }
  claudeUrl?: string
}

const PROVIDERS = [
  {
    id: 'nous',
    name: 'Nous Portal',
    logo: '/providers/nous.png',
    desc: 'Free via OAuth',
    authType: 'oauth',
  },
  {
    id: 'openai-codex',
    name: 'OpenAI Codex',
    logo: '/providers/openai.png',
    desc: 'Free via ChatGPT Pro',
    authType: 'oauth',
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    logo: '/providers/anthropic.png',
    desc: 'API key required',
    authType: 'api_key',
    envKey: 'ANTHROPIC_API_KEY',
  },
  {
    id: 'openrouter',
    name: 'OpenRouter',
    logo: '/providers/openrouter.png',
    desc: 'API key required',
    authType: 'api_key',
    envKey: 'OPENROUTER_API_KEY',
  },
  {
    id: 'ollama',
    name: 'Ollama',
    logo: '/providers/ollama.png',
    desc: 'Local models, no key needed',
    authType: 'none',
  },
  {
    id: 'atomic-chat',
    name: 'Atomic Chat',
    logo: '/providers/atomic-chat.png',
    desc: 'Local LLMs via Atomic Chat desktop app',
    authType: 'none',
  },
  {
    id: 'custom',
    name: 'Custom (OpenAI-compat)',
    logo: '/providers/openai.png',
    desc: 'Any OpenAI-compatible endpoint',
    authType: 'custom',
  },
]

function getEnhancedFeatureNames(
  capabilities?: GatewayStatusResponse['capabilities'],
): Array<string> {
  if (!capabilities) return []
  const features: Array<{ enabled?: boolean; label: string }> = [
    { enabled: capabilities.sessions, label: 'Sessions' },
    { enabled: capabilities.skills, label: 'Skills' },
    { enabled: capabilities.memory, label: 'Memory' },
    { enabled: capabilities.config, label: 'In-app config' },
    { enabled: capabilities.jobs, label: 'Jobs' },
  ]

  return features
    .filter((feature) => feature.enabled)
    .map((feature) => feature.label)
}

export function ClaudeOnboarding() {
  const [show, setShow] = useState(false)
  const [step, setStep] = useState<Step>('welcome')
  const [hermesStatus, setHermesStatus] = useState<HermesInstallStatus | null>(null)
  const [hermesChecking, setHermesChecking] = useState(false)
  const [hermesStarting, setHermesStarting] = useState(false)
  const [hermesStartMessage, setHermesStartMessage] = useState<string>('')
  const [hermesCopied, setHermesCopied] = useState<string | null>(null)
  const [backendStatus, setBackendStatus] = useState<
    'idle' | 'checking' | 'ready' | 'error'
  >('idle')
  const [startingAgent, setStartingAgent] = useState(false)
  const [backendInfo, setBackendInfo] = useState<GatewayStatusResponse | null>(
    null,
  )
  const [backendMessage, setBackendMessage] = useState('')
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null)
  const [apiKey, setApiKey] = useState('')
  const [baseUrl, setBaseUrl] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [availableModels, setAvailableModels] = useState<Array<string>>([])
  const [selectedModel, setSelectedModel] = useState('')
  const [testStatus, setTestStatus] = useState<
    'idle' | 'testing' | 'success' | 'error'
  >('idle')
  const [testMessage, setTestMessage] = useState('')
  const [configuredModel, setConfiguredModel] = useState('')
  const [discoveredProviders, setDiscoveredProviders] = useState<Array<{ id: string; name?: string; configured?: boolean }>>([])

  const [oauthStep, setOauthStep] = useState<
    'idle' | 'loading' | 'waiting' | 'success' | 'error'
  >('idle')
  const [oauthUserCode, setOauthUserCode] = useState('')
  const [oauthVerificationUrl, setOauthVerificationUrl] = useState('')
  const [oauthError, setOauthError] = useState('')
  const oauthPollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const provider = PROVIDERS.find((p) => p.id === selectedProvider)
  const needsApiKey =
    provider?.authType === 'api_key' || provider?.authType === 'custom'
  const needsBaseUrl =
    provider?.id === 'ollama' ||
    provider?.id === 'atomic-chat' ||
    provider?.authType === 'custom'
  const isOAuth = provider?.authType === 'oauth'
  const capabilities = backendInfo?.capabilities
  const canEditConfig = Boolean(capabilities?.config)
  const enhancedFeatures = getEnhancedFeatureNames(capabilities)
  const canFetchModels = Boolean(capabilities?.models)
  const backendSupportsChat = Boolean(capabilities?.chatCompletions)

  const loadCurrentConfig = useCallback(async () => {
    try {
      const res = await fetch('/api/claude-config')
      if (!res.ok) return
      const data = (await res.json()) as {
        activeModel?: string
        activeProvider?: string
        providers?: Array<{ id: string; name?: string; configured?: boolean }>
      }
      if (data.activeModel) {
        const normalizedModel = stripProviderPrefix(data.activeModel)
        setConfiguredModel(normalizedModel)
        setSelectedModel((current) => current || normalizedModel)
      }
      if (data.activeProvider) {
        setSelectedProvider((current) => current || data.activeProvider || null)
      }
      if (data.providers) {
        setDiscoveredProviders(data.providers)
      }
    } catch {}
  }, [])

  const loadModels = useCallback(async () => {
    if (!canFetchModels) return
    try {
      const modelsRes = await fetch('/api/models')
      if (!modelsRes.ok) return
      const modelsData = (await modelsRes.json()) as {
        data?: Array<{ id?: string }>
        models?: Array<{ id?: string }>
      }
      const rawModels = modelsData.data || modelsData.models || []
      const models = rawModels
        .map((model) => (typeof model.id === 'string' ? model.id : ''))
        .filter(Boolean)
        .slice(0, 20)

      setAvailableModels(models)
      setSelectedModel(
        (current) => current || stripProviderPrefix(models[0] || ''),
      )
    } catch {
      setAvailableModels([])
    }
  }, [canFetchModels])

  const checkHermes = useCallback(async (): Promise<HermesInstallStatus | null> => {
    setHermesChecking(true)
    try {
      const res = await fetch('/api/hermes-status?force=1', {
        signal: AbortSignal.timeout(5_000),
      })
      if (!res.ok) {
        setHermesStatus(null)
        return null
      }
      const data = (await res.json()) as HermesInstallStatus
      setHermesStatus(data)
      return data
    } catch {
      setHermesStatus(null)
      return null
    } finally {
      setHermesChecking(false)
    }
  }, [])

  const startHermes = useCallback(async () => {
    setHermesStarting(true)
    setHermesStartMessage('Starting Hermes Agent…')
    try {
      const res = await fetch('/api/start-claude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      const ct = res.headers.get('content-type') || ''
      if (!ct.includes('application/json')) {
        setHermesStartMessage(`Unexpected response (HTTP ${res.status}).`)
        return
      }
      const data = (await res.json()) as { ok?: boolean; message?: string; error?: string; hint?: string }
      if (res.ok && data.ok) {
        setHermesStartMessage(String(data.message || 'Started — waiting for the gateway…'))
        // Poll a few times for the gateway to come online.
        for (let i = 0; i < 8; i += 1) {
          await new Promise((r) => setTimeout(r, 1_500))
          const status = await checkHermes()
          if (status?.running) {
            setHermesStartMessage('Hermes Agent gateway is online ✓')
            return
          }
        }
        setHermesStartMessage('Started — still waiting for the gateway to respond.')
      } else {
        const msg = String(data.error || 'Could not start hermes-agent')
        setHermesStartMessage(`${msg}${data.hint ? `\nHint: ${data.hint}` : ''}`)
      }
    } catch (err) {
      setHermesStartMessage(err instanceof Error ? err.message : String(err))
    } finally {
      setHermesStarting(false)
    }
  }, [checkHermes])

  const copyHermesCommand = useCallback(async (command: string, key: string) => {
    try {
      await writeTextToClipboard(command)
      setHermesCopied(key)
      setTimeout(() => setHermesCopied(null), 2_000)
    } catch {
      // clipboard unavailable
    }
  }, [])

  const checkBackend = useCallback(async () => {
    setBackendStatus('checking')
    setBackendMessage('')

    try {
      const res = await fetch('/api/gateway-status')
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`)
      }

      const data = (await res.json()) as GatewayStatusResponse
      setBackendInfo(data)

      if (data.capabilities?.chatCompletions) {
        setBackendStatus('ready')
        setBackendMessage(
          data.capabilities.sessions
            ? 'Backend connected. Core chat works, and Hermes gateway enhancements are available.'
            : 'Backend connected. Core chat is ready.',
        )
        return
      }

      if (data.capabilities?.health) {
        setBackendStatus('error')
        setBackendMessage(
          'Backend is reachable, but /v1/chat/completions is not available yet.',
        )
        return
      }

      setBackendStatus('error')
      setBackendMessage('No compatible backend detected yet.')
    } catch (err) {
      setBackendInfo(null)
      setBackendStatus('error')
      setBackendMessage(
        err instanceof Error ? err.message : 'Connection check failed',
      )
    }
  }, [])


  const startGateway = useCallback(async () => {
    setStartingAgent(true)
    setBackendMessage('')

    try {
      const response = await fetch('/api/start-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      const payload = (await response.json().catch(() => ({}))) as {
        ok?: boolean
        error?: string
        message?: string
      }

      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || 'Failed to start Hermes Agent gateway')
      }

      setBackendMessage(
        payload.message === 'already running'
          ? 'Hermes Agent is already running.'
          : 'Hermes Agent gateway start requested. Rechecking status…',
      )
      await checkBackend()
    } catch (err) {
      setBackendStatus('error')
      setBackendMessage(
        err instanceof Error ? err.message : 'Failed to start Hermes Agent gateway',
      )
    } finally {
      setStartingAgent(false)
    }
  }, [checkBackend])

  const saveProviderConfig = useCallback(async () => {
    if (!selectedProvider) return true
    if (!canEditConfig) return true

    setSaving(true)
    setSaveError('')

    try {
      const prov = PROVIDERS.find((p) => p.id === selectedProvider)
      const body: Record<string, unknown> = {
        config: { model: { provider: selectedProvider } },
      }

      if (prov?.envKey && apiKey) {
        body.env = { [prov.envKey]: apiKey }
      }
      if (baseUrl) {
        body.config = {
          model: { provider: selectedProvider, base_url: baseUrl },
        }
      }

      const res = await fetch('/api/claude-config', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error(`Save failed: ${res.status}`)

      await loadCurrentConfig()
      await loadModels()
      return true
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save')
      return false
    } finally {
      setSaving(false)
    }
  }, [
    apiKey,
    baseUrl,
    canEditConfig,
    loadCurrentConfig,
    loadModels,
    selectedProvider,
  ])

  const saveModelSelection = useCallback(async () => {
    const modelToSave = stripProviderPrefix(selectedModel || configuredModel)
    if (!modelToSave) return true

    setConfiguredModel(modelToSave)

    if (!canEditConfig || !selectedProvider) return true

    try {
      const res = await fetch('/api/claude-config', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          config: {
            model: { provider: selectedProvider, default: modelToSave },
          },
        }),
      })
      if (!res.ok) throw new Error(`Save failed: ${res.status}`)
      return true
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save model')
      return false
    }
  }, [canEditConfig, configuredModel, selectedModel, selectedProvider])

  const testConnection = useCallback(async () => {
    setTestStatus('testing')
    setTestMessage('')

    try {
      const res = await fetch('/api/send-stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionKey: 'new',
          friendlyId: 'new',
          message:
            'Reply with one short sentence confirming the backend connection works.',
        }),
      })

      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const reader = res.body?.getReader()
      if (!reader) throw new Error('No stream returned')

      const decoder = new TextDecoder()
      let text = ''

      for (;;) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value)
        const matches = chunk.match(/(?:delta|text|content)":"([^"]+)"/g)
        if (matches) {
          for (const match of matches) {
            text += match.replace(/.*":"/, '').replace(/"$/, '')
          }
        }
      }

      setTestMessage(text.slice(0, 240) || 'Chat test succeeded.')
      setTestStatus('success')
      void checkBackend()
    } catch (err) {
      setTestMessage(err instanceof Error ? err.message : 'Connection failed')
      setTestStatus('error')
    }
  }, [checkBackend])

  const startNousOAuth = useCallback(async () => {
    setOauthStep('loading')
    setOauthError('')

    try {
      const res = await fetch('/api/oauth/device-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: 'nous' }),
      })
      const data = (await res.json()) as {
        device_code?: string
        user_code?: string
        verification_uri_complete?: string
        interval?: number
        error?: string
      }

      if (!res.ok || data.error) {
        setOauthError(data.error || 'Failed to start OAuth')
        setOauthStep('error')
        return
      }

      setOauthUserCode(data.user_code || '')
      setOauthVerificationUrl(data.verification_uri_complete || '')
      setOauthStep('waiting')

      if (data.verification_uri_complete) {
        window.open(data.verification_uri_complete, '_blank')
      }

      const intervalMs = Math.max((data.interval || 5) * 1000, 3000)
      oauthPollRef.current = setInterval(async () => {
        try {
          const pollRes = await fetch('/api/oauth/poll-token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              provider: 'nous',
              deviceCode: data.device_code,
            }),
          })
          const pollData = (await pollRes.json()) as {
            status: string
            message?: string
          }

          if (pollData.status === 'success') {
            if (oauthPollRef.current) clearInterval(oauthPollRef.current)
            setOauthStep('success')
            await saveProviderConfig()
            await loadModels()
            return
          }

          if (pollData.status === 'error') {
            if (oauthPollRef.current) clearInterval(oauthPollRef.current)
            setOauthError(pollData.message || 'Authentication failed')
            setOauthStep('error')
          }
        } catch {}
      }, intervalMs)
    } catch (err) {
      setOauthError(
        err instanceof Error ? err.message : 'Failed to start OAuth',
      )
      setOauthStep('error')
    }
  }, [loadModels, saveProviderConfig])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!localStorage.getItem(ONBOARDING_KEY)) {
      setShow(true)
    }
  }, [])

  useEffect(() => {
    return () => {
      if (oauthPollRef.current) clearInterval(oauthPollRef.current)
    }
  }, [])

  useEffect(() => {
    if (oauthPollRef.current) clearInterval(oauthPollRef.current)
    setOauthStep('idle')
    setOauthUserCode('')
    setOauthVerificationUrl('')
    setOauthError('')
  }, [selectedProvider])

  useEffect(() => {
    if (show) {
      void loadCurrentConfig()
    }
  }, [loadCurrentConfig, show])

  const complete = useCallback(() => {
    localStorage.setItem(ONBOARDING_KEY, 'true')
    dispatchOnboardingCompletionChanged(true)
    setShow(false)
  }, [])

  if (!show) return null

  const cardStyle: React.CSSProperties = {
    backgroundColor: 'var(--theme-card)',
    border: '1px solid var(--theme-border)',
    color: 'var(--theme-text)',
  }
  const mutedStyle: React.CSSProperties = { color: 'var(--theme-muted)' }
  const inputStyle: React.CSSProperties = {
    backgroundColor: 'var(--theme-bg)',
    border: '1px solid var(--theme-border)',
    color: 'var(--theme-text)',
  }
  const futuristicCardStyle: React.CSSProperties = {
    backgroundColor: 'rgba(15, 23, 42, 0.78)',
    border: '1px solid rgba(99, 102, 241, 0.18)',
    color: 'var(--theme-text)',
    boxShadow:
      '0 30px 80px -20px rgba(15, 23, 42, 0.85), 0 0 0 1px rgba(99, 102, 241, 0.08) inset, 0 0 60px -10px rgba(0, 229, 255, 0.18)',
    backdropFilter: 'blur(20px) saturate(140%)',
  }

  const stepOrder: Array<Step> = ['welcome', 'hermes', 'connect', 'provider', 'test', 'done']
  const stepIndex = stepOrder.indexOf(step)
  const stepLabels: Record<Step, string> = {
    welcome: 'Welcome',
    hermes: 'Hermes',
    connect: 'Connect',
    provider: 'Provider',
    test: 'Test',
    done: 'Ready',
  }

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center overflow-hidden px-4"
      style={{
        backgroundColor: 'rgba(2, 6, 23, 0.85)',
        backgroundImage:
          'radial-gradient(900px 600px at 20% 10%, rgba(99,102,241,0.20), transparent 60%), radial-gradient(700px 500px at 85% 90%, rgba(0,229,255,0.12), transparent 60%), radial-gradient(500px 400px at 80% 10%, rgba(192,38,211,0.10), transparent 60%)',
        backdropFilter: 'blur(14px)',
      }}
    >
      {/* Subtle grid backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          maskImage:
            'radial-gradient(ellipse at center, black 30%, transparent 75%)',
        }}
      />
      <div className="relative w-full max-w-md">
        {/* Step progress (outside the animating card so it doesn't flicker) */}
        <div className="mb-3 flex items-center justify-center gap-2">
          {stepOrder.map((id, index) => {
            const isActive = index === stepIndex
            const isComplete = index < stepIndex
            return (
              <div
                key={id}
                className={cn(
                  'h-1.5 rounded-full transition-all duration-300',
                  isActive ? 'w-10' : 'w-4',
                )}
                title={stepLabels[id]}
                style={{
                  background: isActive
                    ? 'linear-gradient(90deg, #00E5FF 0%, #6366F1 100%)'
                    : isComplete
                      ? 'linear-gradient(90deg, rgba(99,102,241,0.6), rgba(0,229,255,0.6))'
                      : 'rgba(255,255,255,0.10)',
                  boxShadow: isActive
                    ? '0 0 12px rgba(99,102,241,0.45)'
                    : undefined,
                }}
              />
            )
          })}
        </div>
        <p
          className="mb-2 text-center text-[10px] font-medium uppercase tracking-[0.2em]"
          style={mutedStyle}
        >
          Step {stepIndex + 1} of {stepOrder.length} · {stepLabels[step]}
        </p>
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.97 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full overflow-hidden rounded-2xl p-8"
          style={futuristicCardStyle}
        >
          {/* Top accent gradient line */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-px"
            style={{
              background:
                'linear-gradient(90deg, transparent, rgba(0,229,255,0.55), rgba(99,102,241,0.55), transparent)',
            }}
          />
          {step === 'welcome' && (
            <div className="space-y-5 text-center">
              <div className="relative mx-auto size-24">
                {/* Outer orbiting halo */}
                <span
                  aria-hidden="true"
                  className="absolute inset-0 animate-ping rounded-3xl"
                  style={{
                    background:
                      'conic-gradient(from 0deg, rgba(0,229,255,0.6), rgba(99,102,241,0.45), rgba(192,38,211,0.4), rgba(0,229,255,0.6))',
                    filter: 'blur(14px)',
                    opacity: 0.35,
                  }}
                />
                <img
                  src="/aievolutionlabs-icon.svg"
                  alt="AI Evolution Labs"
                  className="relative mx-auto size-20 rounded-2xl"
                  style={{
                    filter:
                      'drop-shadow(0 12px 28px color-mix(in srgb, #00E5FF 45%, transparent))',
                  }}
                />
              </div>
              <div className="space-y-1.5">
                <h2
                  className="bg-gradient-to-r bg-clip-text text-xl font-bold text-transparent"
                  style={{
                    backgroundImage:
                      'linear-gradient(90deg, #67E8F9 0%, #A5B4FC 50%, #F0ABFC 100%)',
                  }}
                >
                  Welcome to Evolution Agent
                </h2>
                <p
                  className="text-[11px] font-medium uppercase tracking-[0.18em]"
                  style={mutedStyle}
                >
                  by AI Evolution Labs
                </p>
              </div>
              <p className="text-sm" style={mutedStyle}>
                Connect an OpenAI Codex / ChatGPT account, paste an API key, or
                run a local model — and you&apos;re ready to chat.
              </p>
              <div className="grid grid-cols-3 gap-2 pt-1 text-[11px]">
                {[
                  { icon: Plug01Icon, label: 'Connect', tint: '#22D3EE' },
                  { icon: SparklesIcon, label: 'Configure', tint: '#A78BFA' },
                  { icon: Rocket01Icon, label: 'Launch', tint: '#F472B6' },
                ].map(({ icon, label, tint }) => (
                  <div
                    key={label}
                    className="flex flex-col items-center gap-1.5 rounded-xl p-2.5"
                    style={{
                      background: `linear-gradient(160deg, color-mix(in srgb, ${tint} 18%, transparent), color-mix(in srgb, ${tint} 4%, transparent))`,
                      border: `1px solid color-mix(in srgb, ${tint} 28%, transparent)`,
                      color: 'var(--theme-text)',
                    }}
                  >
                    <HugeiconsIcon
                      icon={icon}
                      className="size-4"
                      style={{ color: tint }}
                    />
                    <span style={{ color: 'var(--theme-text)' }}>{label}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => {
                  setStep('hermes')
                  void checkHermes()
                }}
                className="group relative w-full overflow-hidden rounded-xl py-3 text-sm font-semibold text-white transition-all"
                style={{
                  background:
                    'linear-gradient(135deg, #00E5FF 0%, #6366F1 60%, #C026D3 100%)',
                  boxShadow:
                    '0 12px 32px -8px rgba(99, 102, 241, 0.55), 0 0 0 1px rgba(255,255,255,0.08) inset',
                }}
              >
                <span
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0))',
                  }}
                />
                <span className="relative">Get Started</span>
              </button>
              <button onClick={complete} className="text-xs" style={mutedStyle}>
                Skip setup
              </button>
            </div>
          )}

          {step === 'hermes' && (
            <div className="space-y-4 text-left">
              <div className="text-center">
                <div
                  className="mx-auto mb-3 flex size-14 items-center justify-center rounded-2xl"
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(99,102,241,0.18), rgba(0,229,255,0.10))',
                    color: '#A5B4FC',
                    boxShadow:
                      '0 0 0 1px rgba(165,180,252,0.20) inset, 0 12px 30px -10px rgba(99,102,241,0.45)',
                  }}
                >
                  <HugeiconsIcon icon={Download04Icon} className="size-7" />
                </div>
                <h2 className="text-lg font-bold">Verify Hermes Agent</h2>
                <p className="mt-1 text-xs" style={mutedStyle}>
                  The workspace needs Hermes Agent running locally. We&apos;ll detect it,
                  start it for you when possible, or guide you through the install.
                </p>
              </div>

              {hermesChecking && !hermesStatus ? (
                <div
                  className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3 text-sm"
                  style={mutedStyle}
                >
                  <span className="size-2 animate-pulse rounded-full bg-accent-500" />
                  Checking your machine…
                </div>
              ) : null}

              {hermesStatus ? (
                <>
                  <div className="grid grid-cols-3 gap-2">
                    <StatusPill
                      label="Installed"
                      ok={hermesStatus.installed}
                    />
                    <StatusPill label="Running" ok={hermesStatus.running} />
                    <StatusPill
                      label={hermesStatus.platform === 'unknown' ? 'OS' : labelForOs(hermesStatus.platform)}
                      ok
                      neutral
                    />
                  </div>

                  {hermesStatus.installed && hermesStatus.running ? (
                    <div
                      className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3 text-sm"
                      style={{ color: '#6EE7B7' }}
                    >
                      <p className="flex items-center gap-2 font-medium">
                        <HugeiconsIcon
                          icon={CheckmarkCircle02Icon}
                          className="size-4"
                        />
                        Hermes Agent is installed and running.
                      </p>
                      {hermesStatus.version ? (
                        <p className="mt-1 text-xs opacity-80">
                          version {hermesStatus.version}
                        </p>
                      ) : null}
                    </div>
                  ) : hermesStatus.installed ? (
                    <div className="space-y-3">
                      <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/5 p-3 text-sm text-indigo-200">
                        <p className="flex items-center gap-2 font-medium">
                          <HugeiconsIcon icon={Alert02Icon} className="size-4" />
                          Installed, but the gateway is not running.
                        </p>
                        <p className="mt-1 text-xs opacity-80">
                          Click <strong>Start Hermes</strong> below — we&apos;ll boot
                          it and verify the connection.
                        </p>
                      </div>
                      <button
                        onClick={startHermes}
                        disabled={hermesStarting}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-indigo-400 disabled:opacity-60"
                        style={{
                          boxShadow:
                            '0 10px 24px -10px rgba(99,102,241,0.55)',
                        }}
                      >
                        {hermesStarting ? (
                          <>
                            <span className="size-3 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                            Starting…
                          </>
                        ) : (
                          <>
                            <HugeiconsIcon icon={PlayIcon} className="size-4" />
                            Start Hermes
                          </>
                        )}
                      </button>
                      {hermesStartMessage ? (
                        <pre
                          className="whitespace-pre-wrap rounded-lg border border-white/10 bg-black/30 p-2.5 font-mono text-[11px] leading-5"
                          style={mutedStyle}
                        >
                          {hermesStartMessage}
                        </pre>
                      ) : null}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-3 text-sm text-amber-200">
                        <p className="flex items-center gap-2 font-medium">
                          <HugeiconsIcon
                            icon={Download04Icon}
                            className="size-4"
                          />
                          Hermes Agent is not installed yet.
                        </p>
                        <p className="mt-1 text-xs opacity-80">
                          {hermesStatus.install.description}
                        </p>
                      </div>

                      <div
                        className="rounded-xl border border-white/10 p-3"
                        style={cardStyle}
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <span
                            className="text-[11px] font-semibold uppercase tracking-wider"
                            style={mutedStyle}
                          >
                            {hermesStatus.install.label}
                          </span>
                          <button
                            onClick={() =>
                              void copyHermesCommand(
                                hermesStatus.install.command,
                                'primary',
                              )
                            }
                            className="flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[10px] font-medium hover:bg-white/10"
                          >
                            <HugeiconsIcon icon={Copy01Icon} className="size-3" />
                            {hermesCopied === 'primary' ? 'Copied' : 'Copy'}
                          </button>
                        </div>
                        <pre
                          className="overflow-x-auto rounded-md bg-black/40 p-2 font-mono text-[11px] leading-5"
                          style={{ color: 'var(--theme-text)' }}
                        >
                          <code>{hermesStatus.install.command}</code>
                        </pre>
                      </div>

                      {hermesStatus.install.prerequisites?.map((p, i) => (
                        <div
                          key={i}
                          className="rounded-xl border border-white/10 p-3"
                          style={cardStyle}
                        >
                          <div className="mb-2 flex items-center justify-between">
                            <span className="text-xs font-medium">
                              {p.title}
                            </span>
                            <button
                              onClick={() =>
                                void copyHermesCommand(p.command, `pre-${i}`)
                              }
                              className="flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[10px] font-medium hover:bg-white/10"
                            >
                              <HugeiconsIcon icon={Copy01Icon} className="size-3" />
                              {hermesCopied === `pre-${i}` ? 'Copied' : 'Copy'}
                            </button>
                          </div>
                          <pre
                            className="overflow-x-auto rounded-md bg-black/40 p-2 font-mono text-[11px] leading-5"
                            style={{ color: 'var(--theme-text)' }}
                          >
                            <code>{p.command}</code>
                          </pre>
                          {p.note ? (
                            <p className="mt-1.5 text-[11px]" style={mutedStyle}>
                              {p.note}
                            </p>
                          ) : null}
                        </div>
                      ))}

                      <p className="text-[11px]" style={mutedStyle}>
                        Run the command in a terminal, then click <strong>Re-check</strong>.
                      </p>
                    </div>
                  )}
                </>
              ) : null}

              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => void checkHermes()}
                  disabled={hermesChecking}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-semibold transition-colors disabled:opacity-50"
                  style={{ borderColor: 'var(--theme-border)' }}
                >
                  <HugeiconsIcon
                    icon={RefreshIcon}
                    className={cn(
                      'size-4',
                      hermesChecking && 'animate-spin',
                    )}
                  />
                  Re-check
                </button>
                <button
                  onClick={() => {
                    setStep('connect')
                    void checkBackend()
                  }}
                  className="flex-1 rounded-xl py-2.5 text-sm font-semibold text-white transition-all"
                  style={{
                    background:
                      hermesStatus?.running
                        ? 'linear-gradient(135deg, #10B981, #059669)'
                        : 'linear-gradient(135deg, #6366F1, #818CF8)',
                    boxShadow:
                      '0 10px 24px -10px rgba(99,102,241,0.45)',
                  }}
                >
                  {hermesStatus?.running ? 'Continue →' : 'Skip for now →'}
                </button>
              </div>
            </div>
          )}

          {step === 'connect' && (
            <div className="space-y-4 text-center">
              <div
                className="mx-auto flex size-14 items-center justify-center rounded-2xl"
                style={{
                  background:
                    'color-mix(in srgb, var(--theme-accent, #00E5FF) 12%, transparent)',
                  color: 'var(--theme-accent, #00E5FF)',
                }}
              >
                <HugeiconsIcon icon={Plug01Icon} className="size-7" />
              </div>
              <h2 className="text-lg font-bold">Connect Your Backend</h2>
              <p className="text-sm" style={mutedStyle}>
                Start by verifying that Evolution Agent can reach your
                OpenAI-compatible backend.
              </p>

              {backendStatus === 'checking' && (
                <div
                  className="flex items-center justify-center gap-2 text-sm"
                  style={mutedStyle}
                >
                  <span className="size-2 animate-pulse rounded-full bg-accent-500" />
                  Checking backend capabilities...
                </div>
              )}

              {backendStatus === 'ready' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-center gap-2 text-sm text-green-500">
                    <span className="size-2 rounded-full bg-green-500" />
                    {backendMessage}
                  </div>
                  <div
                    className="rounded-xl p-3 text-left text-xs"
                    style={cardStyle}
                  >
                    <p style={mutedStyle}>Backend URL</p>
                    <p className="mt-1 font-mono">
                      {backendInfo?.claudeUrl || 'Configured automatically'}
                    </p>
                  </div>
                </div>
              )}

              {backendStatus === 'error' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-center gap-2 text-sm text-red-400">
                    <span className="size-2 rounded-full bg-red-500" />
                    {backendMessage}
                  </div>
                </div>
              )}

              <div className="space-y-3 rounded-xl p-3 text-left text-xs" style={cardStyle}>
                <p className="font-medium text-white">Hermes Agent status</p>
                <p style={mutedStyle}>
                  Detected locally:{' '}
                  <span className="font-semibold" style={{ color: 'var(--theme-text)' }}>
                    {backendInfo?.agent?.installed ? 'Installed' : 'Not detected'}
                  </span>
                  {' · '}
                  Gateway:{' '}
                  <span className="font-semibold" style={{ color: 'var(--theme-text)' }}>
                    {backendInfo?.agent?.running ? 'Running' : 'Stopped'}
                  </span>
                </p>

                {backendInfo?.agent?.installed ? (
                  <div className="rounded-lg border px-3 py-2" style={{ borderColor: 'var(--theme-border)' }}>
                    <p className="font-medium text-white">Detected Hermes Agent</p>
                    <p className="mt-1" style={mutedStyle}>Use one click to start the gateway and connect it to the dashboard.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="font-medium text-white">Install Hermes Agent</p>
                    <p style={mutedStyle}>1) Open Terminal (macOS) or PowerShell (Windows).</p>
                    <p style={mutedStyle}>2) Run installer:</p>
                    <div className="rounded-lg px-3 py-2 font-mono text-[11px]" style={{ background: 'rgba(0,0,0,0.2)' }}>
                      curl -fsSL https://hermes-workspace.com/install.sh | bash
                    </div>
                    <p style={mutedStyle}>3) Start gateway:</p>
                    <div className="rounded-lg px-3 py-2 font-mono text-[11px]" style={{ background: 'rgba(0,0,0,0.2)' }}>
                      hermes gateway run
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => void checkBackend()}
                  className="flex-1 rounded-xl border py-3 text-sm font-semibold transition-colors"
                  style={{ borderColor: 'var(--theme-border)' }}
                >
                  Retry
                </button>
                <button
                  onClick={() => void startGateway()}
                  disabled={startingAgent}
                  className="flex-1 rounded-xl border py-3 text-sm font-semibold transition-colors disabled:opacity-50"
                  style={{ borderColor: 'var(--theme-border)' }}
                >
                  {startingAgent ? 'Starting gateway…' : 'Start Gateway'}
                </button>
                <button
                  onClick={() => {
                    setStep('provider')
                    void loadModels()
                  }}
                  disabled={backendStatus !== 'ready'}
                  className="flex-1 rounded-xl bg-accent-500 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-600 disabled:opacity-50"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {step === 'provider' && (
            <div className="space-y-4">
              <div className="text-center">
                <h2 className="text-lg font-bold">
                  Choose how to connect
                </h2>
                <p className="mt-1 text-xs" style={mutedStyle}>
                  {canEditConfig
                    ? 'Pick a provider, sign in or paste a key, then choose a model.'
                    : 'This backend manages provider settings externally. Confirm the model, then test chat.'}
                </p>
              </div>

              <div className="rounded-xl p-3 text-xs" style={cardStyle}>
                <p style={mutedStyle}>Backend mode</p>
                <p className="mt-1">
                  {backendInfo?.capabilities?.sessions
                    ? 'Hermes gateway detected'
                    : 'Portable OpenAI-compatible backend'}
                </p>
                {configuredModel ? (
                  <p className="mt-2" style={mutedStyle}>
                    Current model:{' '}
                    <span className="font-mono text-accent-400">
                      {configuredModel}
                    </span>
                  </p>
                ) : null}
              </div>

              <div className="grid max-h-72 grid-cols-1 gap-2 overflow-y-auto pr-1">
                {(() => {
                  const seen = new Set(PROVIDERS.map((p) => p.id))
                  const merged = [
                    ...PROVIDERS,
                    ...discoveredProviders
                      .filter((p) => p.id && !seen.has(p.id))
                      .map((p) => ({
                        id: p.id,
                        name: p.name || p.id,
                        logo: '/providers/openai.png',
                        desc: p.configured ? 'Configured provider' : 'Custom provider',
                        authType: 'custom' as const,
                      })),
                  ]

                  // Sort: OAuth (sign-in) options first, then API key, then local/custom.
                  const order: Record<string, number> = {
                    oauth: 0,
                    api_key: 1,
                    none: 2,
                    custom: 3,
                  }
                  const sorted = [...merged].sort(
                    (a, b) =>
                      (order[String(a.authType)] ?? 9) -
                      (order[String(b.authType)] ?? 9),
                  )

                  const badgeFor = (authType: string | undefined) => {
                    if (authType === 'oauth')
                      return { text: 'Sign in', tone: 'accent' as const }
                    if (authType === 'api_key')
                      return { text: 'API key', tone: 'neutral' as const }
                    if (authType === 'none')
                      return { text: 'Local', tone: 'green' as const }
                    return { text: 'Custom', tone: 'neutral' as const }
                  }

                  return sorted.map((p) => {
                    const badge = badgeFor(p.authType)
                    const isSelected = selectedProvider === p.id
                    return (
                      <button
                        key={p.id}
                        onClick={() => {
                          setSelectedProvider(p.id)
                          setApiKey('')
                          setBaseUrl('')
                          setSaveError('')
                        }}
                        className={cn(
                          'flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-all',
                          isSelected ? 'ring-2 ring-accent-500' : '',
                        )}
                        style={cardStyle}
                      >
                        <ProviderLogo
                          provider={p.id}
                          size={40}
                          className="shrink-0 rounded-xl"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold">
                              {p.name}
                            </span>
                            <span
                              className={cn(
                                'rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide',
                                badge.tone === 'accent' &&
                                  'bg-accent-500/15 text-accent-400',
                                badge.tone === 'green' &&
                                  'bg-green-500/15 text-green-400',
                                badge.tone === 'neutral' &&
                                  'bg-white/10 text-current',
                              )}
                              style={
                                badge.tone === 'neutral'
                                  ? mutedStyle
                                  : undefined
                              }
                            >
                              {badge.text}
                            </span>
                          </div>
                          <div className="text-xs" style={mutedStyle}>
                            {p.desc}
                          </div>
                        </div>
                        {isSelected ? (
                          <span className="ml-auto size-2.5 shrink-0 rounded-full bg-green-500" />
                        ) : null}
                      </button>
                    )
                  })
                })()}
              </div>

              {selectedProvider &&
                isOAuth &&
                selectedProvider === 'nous' &&
                canEditConfig && (
                  <div
                    className="space-y-3 rounded-xl p-4 text-left"
                    style={{ ...cardStyle, borderColor: 'var(--theme-border)' }}
                  >
                    {oauthStep === 'idle' && (
                      <button
                        onClick={startNousOAuth}
                        className="w-full rounded-lg bg-accent-500 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-600"
                      >
                        Connect with Nous Portal
                      </button>
                    )}
                    {oauthStep === 'loading' && (
                      <div
                        className="flex items-center justify-center gap-2 py-2 text-sm"
                        style={mutedStyle}
                      >
                        <span className="size-2 animate-pulse rounded-full bg-accent-500" />
                        Starting OAuth flow...
                      </div>
                    )}
                    {oauthStep === 'waiting' && (
                      <div className="space-y-3">
                        <div
                          className="flex items-center gap-2 text-sm"
                          style={mutedStyle}
                        >
                          <span className="size-2 animate-pulse rounded-full bg-yellow-400" />
                          Waiting for approval...
                        </div>
                        {oauthUserCode ? (
                          <div className="space-y-1 text-center">
                            <p className="text-xs" style={mutedStyle}>
                              Your code
                            </p>
                            <p className="text-2xl font-mono font-bold tracking-widest">
                              {oauthUserCode}
                            </p>
                          </div>
                        ) : null}
                        {oauthVerificationUrl ? (
                          <button
                            onClick={() =>
                              window.open(oauthVerificationUrl, '_blank')
                            }
                            className="w-full rounded-lg border py-2 text-xs font-medium"
                            style={{ borderColor: 'var(--theme-border)' }}
                          >
                            Open Nous Portal ↗
                          </button>
                        ) : null}
                      </div>
                    )}
                    {oauthStep === 'success' && (
                      <div className="flex items-center gap-2 text-sm text-green-500">
                        <span>✓</span>
                        <span>Authenticated successfully.</span>
                      </div>
                    )}
                    {oauthStep === 'error' && (
                      <div className="space-y-2">
                        <p className="text-xs text-red-400">
                          {oauthError || 'Authentication failed'}
                        </p>
                        <button
                          onClick={startNousOAuth}
                          className="w-full rounded-lg bg-accent-500 py-2 text-xs font-medium text-white"
                        >
                          Retry
                        </button>
                      </div>
                    )}
                  </div>
                )}

              {selectedProvider &&
                isOAuth &&
                selectedProvider === 'openai-codex' &&
                canEditConfig && (
                  <div
                    className="space-y-3 rounded-xl p-4 text-left"
                    style={{ ...cardStyle, borderColor: 'var(--theme-border)' }}
                  >
                    <div>
                      <p className="text-sm font-semibold">
                        Sign in with your ChatGPT account
                      </p>
                      <p className="mt-1 text-xs" style={mutedStyle}>
                        Re-uses your Codex / ChatGPT Pro login — no API key
                        needed. Run the command below in a terminal:
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <code
                        className="flex-1 rounded-lg px-3 py-2 font-mono text-xs"
                        style={{ background: 'rgba(0,0,0,0.25)' }}
                      >
                        claude auth login openai-codex
                      </code>
                      <button
                        onClick={() => {
                          try {
                            void navigator.clipboard.writeText(
                              'claude auth login openai-codex',
                            )
                          } catch {}
                        }}
                        className="rounded-lg border px-2.5 py-2 text-[11px] font-medium"
                        style={{ borderColor: 'var(--theme-border)' }}
                        title="Copy command"
                      >
                        Copy
                      </button>
                    </div>
                    <button
                      onClick={async () => {
                        await saveProviderConfig()
                        await loadModels()
                      }}
                      className="w-full rounded-lg bg-accent-500 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-accent-600"
                    >
                      I&apos;ve signed in — refresh
                    </button>
                  </div>
                )}

              {selectedProvider && (needsApiKey || needsBaseUrl) && (
                <div className="space-y-2 pt-1">
                  {needsBaseUrl ? (
                    <div>
                      <label
                        className="mb-1 block text-xs font-medium"
                        style={mutedStyle}
                      >
                        {selectedProvider === 'ollama'
                          ? 'Ollama URL'
                          : selectedProvider === 'atomic-chat'
                            ? 'Atomic Chat URL'
                            : 'Base URL'}
                      </label>
                      <input
                        type="text"
                        value={baseUrl}
                        onChange={(e) => setBaseUrl(e.target.value)}
                        placeholder={
                          selectedProvider === 'ollama'
                            ? 'http://localhost:11434'
                            : selectedProvider === 'atomic-chat'
                              ? 'http://127.0.0.1:1337/v1'
                              : 'https://api.example.com/v1'
                        }
                        className="w-full rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent-500"
                        style={inputStyle}
                      />
                    </div>
                  ) : null}
                  {needsApiKey ? (
                    <div>
                      <label
                        className="mb-1 block text-xs font-medium"
                        style={mutedStyle}
                      >
                        API Key
                      </label>
                      <input
                        type="password"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="sk-..."
                        className="w-full rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent-500"
                        style={inputStyle}
                      />
                    </div>
                  ) : null}
                </div>
              )}

              <div>
                <label
                  className="mb-1 block text-xs font-medium"
                  style={mutedStyle}
                >
                  Model
                </label>
                {availableModels.length > 0 ? (
                  <select
                    value={selectedModel}
                    onChange={(e) =>
                      setSelectedModel(stripProviderPrefix(e.target.value))
                    }
                    className="w-full rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent-500"
                    style={inputStyle}
                  >
                    {availableModels.map((model) => (
                      <option key={model} value={model}>
                        {stripProviderPrefix(model)}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    placeholder={configuredModel || 'gpt-4.1'}
                    className="w-full rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent-500"
                    style={inputStyle}
                  />
                )}
                <p className="mt-2 text-xs" style={mutedStyle}>
                  {canFetchModels
                    ? 'Models were fetched from the backend when available.'
                    : 'If your backend does not expose /v1/models, enter the model name manually.'}
                </p>
              </div>

              {!canEditConfig ? (
                <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-3 text-xs text-yellow-200">
                  In-app provider editing is unavailable on this backend. That
                  is optional. If the backend is already configured, continue to
                  the chat test.
                </div>
              ) : null}

              {saveError ? (
                <p className="text-xs text-red-400">{saveError}</p>
              ) : null}

              <div className="flex gap-2">
                {selectedProvider &&
                canEditConfig &&
                (needsApiKey || needsBaseUrl) ? (
                  <button
                    onClick={() => void saveProviderConfig()}
                    disabled={
                      saving || (needsApiKey && !apiKey && !needsBaseUrl)
                    }
                    className="flex-1 rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save Settings'}
                  </button>
                ) : null}
                <button
                  onClick={async () => {
                    let ok = true
                    if (
                      selectedProvider &&
                      canEditConfig &&
                      (!isOAuth || oauthStep === 'success')
                    ) {
                      ok = await saveProviderConfig()
                    }
                    if (ok) {
                      ok = await saveModelSelection()
                    }
                    if (ok) {
                      setStep('test')
                      setTestStatus('idle')
                      setTestMessage('')
                    }
                  }}
                  disabled={!backendSupportsChat}
                  className="flex-1 rounded-xl bg-accent-500 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-600 disabled:opacity-50"
                >
                  Continue →
                </button>
              </div>
            </div>
          )}

          {step === 'test' && (
            <div className="space-y-4 text-center">
              <div
                className="mx-auto flex size-14 items-center justify-center rounded-2xl"
                style={{
                  background:
                    'color-mix(in srgb, var(--theme-accent, #00E5FF) 12%, transparent)',
                  color: 'var(--theme-accent, #00E5FF)',
                }}
              >
                <HugeiconsIcon icon={SparklesIcon} className="size-7" />
              </div>
              <h2 className="text-lg font-bold">Test Chat</h2>
              <p className="text-sm" style={mutedStyle}>
                Verify that core chat works first. Enhanced gateway features
                are optional and appear automatically when supported.
              </p>

              <div
                className="rounded-xl p-3 text-left text-xs"
                style={cardStyle}
              >
                <p style={mutedStyle}>Backend</p>
                <p className="mt-1 font-mono">
                  {backendInfo?.claudeUrl || 'Configured automatically'}
                </p>
                {selectedModel || configuredModel ? (
                  <p className="mt-2" style={mutedStyle}>
                    Model:{' '}
                    <span className="font-mono text-accent-400">
                      {stripProviderPrefix(selectedModel || configuredModel)}
                    </span>
                  </p>
                ) : null}
              </div>

              {testStatus === 'idle' ? (
                <button
                  onClick={testConnection}
                  className="w-full rounded-xl bg-accent-500 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-600"
                >
                  Send Test Message
                </button>
              ) : null}

              {testStatus === 'testing' ? (
                <div
                  className="flex items-center justify-center gap-2 text-sm"
                  style={mutedStyle}
                >
                  <span className="size-2 animate-pulse rounded-full bg-accent-500" />
                  Waiting for the backend response...
                </div>
              ) : null}

              {testStatus === 'success' ? (
                <div className="space-y-3">
                  <div
                    className="rounded-xl p-3 text-left text-sm"
                    style={cardStyle}
                  >
                    <span className="font-medium text-green-500">
                      Assistant:
                    </span>{' '}
                    <span>{testMessage}</span>
                  </div>
                  <button
                    onClick={() => setStep('done')}
                    className="w-full rounded-xl bg-green-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-700"
                  >
                    Continue
                  </button>
                </div>
              ) : null}

              {testStatus === 'error' ? (
                <div className="space-y-3">
                  <div className="rounded-xl border border-red-500/30 bg-red-900/20 p-3 text-left text-sm">
                    <p className="mb-1 font-medium text-red-400">
                      Chat test failed
                    </p>
                    <p className="text-xs" style={mutedStyle}>
                      {testMessage}
                    </p>
                    {testMessage.includes('401') ||
                    testMessage.toLowerCase().includes('key') ? (
                      <p className="mt-2 text-xs text-yellow-400">
                        Check your provider credentials and account access.
                      </p>
                    ) : testMessage.toLowerCase().includes('model') ? (
                      <p className="mt-2 text-xs text-yellow-400">
                        Confirm the selected model exists on this backend.
                      </p>
                    ) : (
                      <p className="mt-2 text-xs text-yellow-400">
                        Confirm the backend is running and still reachable from
                        Evolution Agent.
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={testConnection}
                      className="flex-1 rounded-lg bg-accent-500 py-2 text-xs font-medium text-white"
                    >
                      Retry
                    </button>
                    <button
                      onClick={() => setStep('provider')}
                      className="flex-1 rounded-lg border py-2 text-xs font-medium"
                      style={{ borderColor: 'var(--theme-border)' }}
                    >
                      ← Back
                    </button>
                  </div>
                  <button
                    onClick={() => setStep('done')}
                    className="mx-auto block text-xs"
                    style={mutedStyle}
                  >
                    Skip for now
                  </button>
                </div>
              ) : null}
            </div>
          )}

          {step === 'done' && (
            <div className="space-y-4 text-center">
              <div
                className="mx-auto flex size-16 items-center justify-center rounded-2xl"
                style={{
                  background:
                    'color-mix(in srgb, #10b981 18%, transparent)',
                  color: '#10b981',
                }}
              >
                <HugeiconsIcon
                  icon={CheckmarkCircle02Icon}
                  className="size-9"
                />
              </div>
              <h2 className="text-xl font-bold">Workspace Ready</h2>
              <p className="text-sm" style={mutedStyle}>
                Core chat is set up.{' '}
                {enhancedFeatures.length > 0
                  ? 'This backend also exposes Hermes gateway enhancements.'
                  : 'If you later connect a Hermes gateway, enhanced features unlock automatically.'}
              </p>
              <div
                className="grid grid-cols-3 gap-2 text-xs"
                style={mutedStyle}
              >
                <div
                  className="flex flex-col items-center gap-1 rounded-xl p-2.5"
                  style={cardStyle}
                >
                  <HugeiconsIcon
                    icon={CheckmarkCircle02Icon}
                    className="size-4 text-green-500"
                  />
                  <div>Chat Ready</div>
                </div>
                <div
                  className="flex flex-col items-center gap-1 rounded-xl p-2.5"
                  style={cardStyle}
                >
                  <HugeiconsIcon icon={Plug01Icon} className="size-4" />
                  <div>
                    {enhancedFeatures.length > 0 ? 'Enhanced' : 'Portable'}
                  </div>
                </div>
                <div
                  className="flex flex-col items-center gap-1 rounded-xl p-2.5"
                  style={cardStyle}
                >
                  <HugeiconsIcon icon={SparklesIcon} className="size-4" />
                  <div>
                    {enhancedFeatures.length > 0
                      ? `${enhancedFeatures.length} Extras`
                      : 'Optional'}
                  </div>
                </div>
              </div>
              {enhancedFeatures.length > 0 ? (
                <p className="text-xs" style={mutedStyle}>
                  Available now: {enhancedFeatures.join(', ')}.
                </p>
              ) : null}
              <button
                onClick={complete}
                className="w-full rounded-xl bg-accent-500 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-600"
              >
                <span className="inline-flex items-center justify-center gap-2">
                  <HugeiconsIcon icon={Rocket01Icon} className="size-4" />
                  Open Workspace
                </span>
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
      </div>
    </div>
  )
}

function labelForOs(p: 'macos' | 'windows' | 'linux' | 'unknown'): string {
  if (p === 'macos') return 'macOS'
  if (p === 'windows') return 'Windows'
  if (p === 'linux') return 'Linux'
  return 'OS'
}

function StatusPill({
  label,
  ok,
  neutral,
}: {
  label: string
  ok: boolean
  neutral?: boolean
}) {
  const color = neutral
    ? { bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.12)', dot: '#A5B4FC' }
    : ok
      ? { bg: 'rgba(16,185,129,0.10)', border: 'rgba(16,185,129,0.30)', dot: '#10B981' }
      : { bg: 'rgba(244,114,182,0.10)', border: 'rgba(244,114,182,0.30)', dot: '#F472B6' }
  return (
    <div
      className="flex items-center gap-2 rounded-xl px-2.5 py-2 text-[11px] font-medium"
      style={{
        background: color.bg,
        border: `1px solid ${color.border}`,
        color: 'var(--theme-text)',
      }}
    >
      <span
        className="inline-block size-2 rounded-full"
        style={{ background: color.dot, boxShadow: `0 0 8px ${color.dot}` }}
      />
      <span className="truncate">{label}</span>
    </div>
  )
}
