// Business Connectors — curated, business-first list of integrations.
//
// Each connector wraps an MCP server or native integration the user can
// enable via /mcp or /settings. The hub renders them as polished cards
// with 3 example workflows each — so a user immediately sees the value
// of connecting their stack, instead of a generic MCP list.
//
// Connection state is read from localStorage (mocked for now). When the
// underlying MCP server reports as connected we will swap this for the
// live MCP capability check — the UI contract is the same.

export type BusinessConnector = {
  id: string
  name: string
  category: 'inbox' | 'chat' | 'docs' | 'files' | 'crm' | 'calendar' | 'code'
  short: string
  /** 3 example things Hermes can do once this is connected. */
  examples: Array<string>
  /** Route or external URL to wire the connection. */
  connectHref: string
  /** Hex / CSS color used for the brand chip. */
  accent: string
  /** Single-character symbol shown in the brand chip. */
  glyph: string
  /** If true, gated behind a backend that may not exist yet. */
  comingSoon?: boolean
}

export const BUSINESS_CONNECTORS: Array<BusinessConnector> = [
  {
    id: 'gmail',
    name: 'Gmail',
    category: 'inbox',
    short: 'Read, draft, send, triage email.',
    examples: [
      'Triage last 24h of inbox by importance and propose 3 reply drafts',
      'Search for client X and summarise the thread before my call',
      'Draft a follow-up email to anyone I have not replied to in 5+ days',
    ],
    connectHref: '/mcp?install=gmail',
    accent: '#EA4335',
    glyph: 'G',
  },
  {
    id: 'outlook',
    name: 'Outlook',
    category: 'inbox',
    short: 'Microsoft 365 mail + calendar.',
    examples: [
      'Summarise this week\'s meetings and produce action items by owner',
      'Block 2h focus blocks across my calendar around existing commitments',
      'Draft replies to flagged emails in my voice',
    ],
    connectHref: '/mcp?install=outlook',
    accent: '#0078D4',
    glyph: 'O',
    comingSoon: true,
  },
  {
    id: 'slack',
    name: 'Slack',
    category: 'chat',
    short: 'Read channels, post recaps, react.',
    examples: [
      'Daily recap of #general into a clean executive summary',
      'Watch #support for at-risk customer signals and ping me with severity',
      'Post the weekly metrics to #leadership on Friday at 4pm',
    ],
    connectHref: '/mcp?install=slack',
    accent: '#4A154B',
    glyph: 'S',
  },
  {
    id: 'notion',
    name: 'Notion',
    category: 'docs',
    short: 'Read pages, write back, build databases.',
    examples: [
      'Take this meeting transcript and save it as a structured Notion page',
      'Update the Q3 OKR page with this week\'s deltas from the source data',
      'Build a CRM database with these 12 properties + 3 saved views',
    ],
    connectHref: '/mcp?install=notion',
    accent: '#000000',
    glyph: 'N',
  },
  {
    id: 'gdrive',
    name: 'Google Drive',
    category: 'files',
    short: 'Search, read, summarise documents.',
    examples: [
      'Find the 2024 contract template and adapt it for client X',
      'Summarise every doc tagged "competitor-research" into one brief',
      'Move all unfiled docs to the right folders based on content',
    ],
    connectHref: '/mcp?install=gdrive',
    accent: '#1FA463',
    glyph: 'D',
  },
  {
    id: 'github',
    name: 'GitHub',
    category: 'code',
    short: 'PRs, issues, code search, releases.',
    examples: [
      'Daily standup recap from yesterday\'s PRs and issues across our repos',
      'Open an issue from this customer support ticket with the right labels',
      'Generate release notes for next deploy from merged PRs since last tag',
    ],
    connectHref: '/mcp?install=github',
    accent: '#1F2328',
    glyph: 'GH',
  },
  {
    id: 'hubspot',
    name: 'HubSpot',
    category: 'crm',
    short: 'Deals, contacts, pipeline, sequences.',
    examples: [
      'Show me deals that have not moved stage in 14+ days with owner',
      'Enrich this contact list and tag by ICP fit before outreach',
      'Generate weekly sales recap from pipeline movement',
    ],
    connectHref: '/mcp?install=hubspot',
    accent: '#FF7A59',
    glyph: 'H',
  },
  {
    id: 'pipedrive',
    name: 'Pipedrive',
    category: 'crm',
    short: 'Pipeline, deals, activities.',
    examples: [
      'Surface deals stuck in negotiation 7+ days and propose next moves',
      'Log this call as an activity on the right deal with summary',
      'Forecast this quarter from current pipeline + historical close rate',
    ],
    connectHref: '/mcp?install=pipedrive',
    accent: '#27292B',
    glyph: 'P',
    comingSoon: true,
  },
  {
    id: 'calendar',
    name: 'Google Calendar',
    category: 'calendar',
    short: 'Schedule, find free slots, prep meetings.',
    examples: [
      'Find 3 slots next week that work for me + 2 external guests',
      'Prep brief for my next meeting from the participant company data',
      'Block 4h on Friday for the Q3 board deck',
    ],
    connectHref: '/mcp?install=gcal',
    accent: '#4285F4',
    glyph: 'C',
  },
]

const STORAGE_KEY = 'aiel-connectors-state'

type ConnectorState = {
  connectedIds: Array<string>
}

function readState(): ConnectorState {
  if (typeof window === 'undefined') return { connectedIds: [] }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return { connectedIds: [] }
    const parsed = JSON.parse(raw) as ConnectorState
    return { connectedIds: Array.isArray(parsed.connectedIds) ? parsed.connectedIds : [] }
  } catch {
    return { connectedIds: [] }
  }
}

function writeState(next: ConnectorState): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    /* ignore */
  }
}

export function loadConnectedIds(): Set<string> {
  return new Set(readState().connectedIds)
}

export function markConnected(id: string): void {
  const state = readState()
  if (!state.connectedIds.includes(id)) state.connectedIds.push(id)
  writeState(state)
}

export function markDisconnected(id: string): void {
  const state = readState()
  state.connectedIds = state.connectedIds.filter((c) => c !== id)
  writeState(state)
}
