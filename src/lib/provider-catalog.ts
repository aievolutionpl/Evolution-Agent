export type ProviderAuthType = 'api-key' | 'oauth' | 'local' | 'cli-token'

export type ProviderInfo = {
  id: string
  name: string
  description: string
  authTypes: Array<ProviderAuthType>
  docsUrl: string
  configExample: string
  envKey?: string
}

export const CLAUDE_CONFIG_PATH = '~/.hermes/config.yaml'

export const PROVIDER_CATALOG: Array<ProviderInfo> = [
  {
    id: 'anthropic',
    name: 'Anthropic',
    description: 'Claude models — Haiku, Sonnet, and Opus.',
    authTypes: ['api-key', 'cli-token'],
    docsUrl: 'https://console.anthropic.com/settings/keys',
    envKey: 'ANTHROPIC_API_KEY',
    configExample: JSON.stringify(
      {
        auth: {
          profiles: {
            'anthropic:default': {
              provider: 'anthropic',
              apiKey: 'sk-your-key-here',
            },
          },
        },
      },
      null,
      2,
    ),
  },
  {
    id: 'openai',
    name: 'OpenAI',
    description: 'GPT and reasoning models for chat and tools.',
    authTypes: ['api-key'],
    docsUrl: 'https://platform.openai.com/api-keys',
    envKey: 'OPENAI_API_KEY',
    configExample: JSON.stringify(
      {
        auth: {
          profiles: {
            'openai:default': {
              provider: 'openai',
              apiKey: 'sk-your-key-here',
            },
          },
        },
      },
      null,
      2,
    ),
  },
  {
    id: 'google',
    name: 'Google',
    description: 'Gemini models with API key or OAuth.',
    authTypes: ['api-key', 'oauth'],
    docsUrl: 'https://aistudio.google.com/app/apikey',
    envKey: 'GOOGLE_API_KEY',
    configExample: JSON.stringify(
      {
        auth: {
          profiles: {
            'google:default': {
              provider: 'google',
              apiKey: 'sk-your-key-here',
            },
          },
        },
      },
      null,
      2,
    ),
  },
  {
    id: 'openrouter',
    name: 'OpenRouter',
    description: 'Unified access to many providers through one API.',
    authTypes: ['api-key'],
    docsUrl: 'https://openrouter.ai/keys',
    envKey: 'OPENROUTER_API_KEY',
    configExample: JSON.stringify(
      {
        auth: {
          profiles: {
            'openrouter:default': {
              provider: 'openrouter',
              apiKey: 'sk-your-key-here',
            },
          },
        },
      },
      null,
      2,
    ),
  },
  {
    id: 'minimax',
    name: 'MiniMax',
    description: 'MiniMax foundation models and multimodal APIs.',
    authTypes: ['api-key'],
    docsUrl: 'https://www.minimax.io/platform',
    envKey: 'MINIMAX_API_KEY',
    configExample: JSON.stringify(
      {
        auth: {
          profiles: {
            'minimax:default': {
              provider: 'minimax',
              apiKey: 'sk-your-key-here',
            },
          },
        },
      },
      null,
      2,
    ),
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    description: 'DeepSeek chat and reasoning models via API key.',
    authTypes: ['api-key'],
    docsUrl: 'https://platform.deepseek.com/api_keys',
    envKey: 'DEEPSEEK_API_KEY',
    configExample: JSON.stringify(
      {
        auth: {
          profiles: {
            'deepseek:default': {
              provider: 'deepseek',
              apiKey: 'sk-your-key-here',
            },
          },
        },
      },
      null,
      2,
    ),
  },
  {
    id: 'custom',
    name: 'Custom API',
    description:
      'OpenAI-compatible endpoint with your own base URL and API key.',
    authTypes: ['api-key'],
    docsUrl: 'https://platform.openai.com/docs/api-reference',
    envKey: 'CUSTOM_API_KEY',
    configExample: JSON.stringify(
      {
        custom_providers: [
          {
            name: 'custom',
            base_url: 'https://your-api.example.com/v1',
            key_env: 'CUSTOM_API_KEY',
            api_mode: 'openai',
          },
        ],
      },
      null,
      2,
    ),
  },
  {
    id: 'ollama',
    name: 'Ollama',
    description: 'Local models running on your machine via Ollama.',
    authTypes: ['local'],
    docsUrl: 'https://ollama.com/download',
    configExample: JSON.stringify(
      {
        auth: {
          profiles: {
            'ollama:local': {
              provider: 'ollama',
            },
          },
        },
      },
      null,
      2,
    ),
  },
  {
    id: 'atomic-chat',
    name: 'Atomic Chat',
    description:
      'Local LLMs via Atomic Chat — run Llama, Gemma, Qwen and more on your machine.',
    authTypes: ['local'],
    docsUrl: 'https://atomic.chat',
    configExample: JSON.stringify(
      {
        auth: {
          profiles: {
            'atomic-chat:local': {
              provider: 'atomic-chat',
            },
          },
        },
      },
      null,
      2,
    ),
  },
]

export function normalizeProviderId(value: string): string {
  return value.trim().toLowerCase()
}

export function getProviderInfo(providerId: string): ProviderInfo | null {
  const normalized = normalizeProviderId(providerId)
  for (const provider of PROVIDER_CATALOG) {
    if (provider.id === normalized) return provider
  }
  return null
}

export function getProviderDisplayName(providerId: string): string {
  const provider = getProviderInfo(providerId)
  if (provider) return provider.name

  const normalized = normalizeProviderId(providerId)
  if (!normalized) return 'Unknown Provider'

  return normalized
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map(function mapChunk(chunk) {
      return chunk.slice(0, 1).toUpperCase() + chunk.slice(1)
    })
    .join(' ')
}

export function getAuthTypeLabel(authType: ProviderAuthType): string {
  if (authType === 'api-key') return 'API Key'
  if (authType === 'oauth') return 'OAuth'
  if (authType === 'cli-token') return 'CLI Token'
  return 'Local'
}

export function buildConfigExample(
  provider: ProviderInfo,
  authType: ProviderAuthType,
): string {
  const profileKey =
    authType === 'local' ? `${provider.id}:local` : `${provider.id}:default`

  if (authType === 'oauth') {
    return JSON.stringify(
      {
        auth: {
          profiles: {
            [profileKey]: {
              provider: provider.id,
              oauth: {
                enabled: true,
              },
            },
          },
        },
      },
      null,
      2,
    )
  }

  if (authType === 'local') {
    return JSON.stringify(
      {
        auth: {
          profiles: {
            [profileKey]: {
              provider: provider.id,
            },
          },
        },
      },
      null,
      2,
    )
  }

  return provider.configExample
}
