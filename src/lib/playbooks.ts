// Playbooks — saved business recipes for Hermes.
//
// A Playbook is a parameterised prompt template that produces a real
// deliverable in one chat turn. Users save successful workflows here
// so the team has a shared library instead of re-typing prompts.
//
// Storage: localStorage (no backend dependency). Export / import as
// JSON so playbooks are portable between machines and teammates.

export type PlaybookField = {
  key: string
  label: string
  placeholder?: string
  required?: boolean
}

export type Playbook = {
  id: string
  name: string
  description: string
  icon: string // emoji
  category: 'sales' | 'marketing' | 'ops' | 'finance' | 'research' | 'custom'
  /**
   * Prompt body with `{{field_key}}` placeholders. When run, the
   * placeholders get substituted with user-provided values.
   */
  promptTemplate: string
  fields: Array<PlaybookField>
  createdAt: string
  updatedAt: string
  /** Optional author for shared playbooks. */
  author?: string
  /** True if this is one of the built-in AIEL starter playbooks. */
  builtin?: boolean
}

const STORAGE_KEY = 'aiel-playbooks'

// ── Built-in starter playbooks — visible immediately on first load.
// Users can clone + edit them; deleting one means it stays gone (we
// remember "dismissed" built-ins so they don't pop back).
export const BUILTIN_PLAYBOOKS: Array<Playbook> = [
  {
    id: 'builtin.weekly-sales-recap',
    name: 'Weekly sales recap',
    description: 'Friday-afternoon executive summary of pipeline movement, deals closed, and at-risk accounts.',
    icon: '📊',
    category: 'sales',
    promptTemplate:
      'Produce a weekly sales recap for the week of {{week}}.\n\n' +
      'Source: {{source}}\n' +
      'Team: {{team}}\n\n' +
      'Output as markdown:\n' +
      '## Headline KPIs (4 numbers, WoW delta)\n' +
      '## Deals closed this week (5-row table)\n' +
      '## Pipeline movement (advanced / slipped / new)\n' +
      '## At-risk accounts (with reason)\n' +
      '## 3 priorities for next week\n\n' +
      'Tone: executive, no fluff.',
    fields: [
      { key: 'week', label: 'Week (e.g. "May 18 – May 24")', required: true },
      { key: 'source', label: 'Data source (CRM name / sheet URL / "ask me")', placeholder: 'HubSpot', required: true },
      { key: 'team', label: 'Team name', placeholder: 'EMEA Sales', required: false },
    ],
    createdAt: '2026-05-23T00:00:00.000Z',
    updatedAt: '2026-05-23T00:00:00.000Z',
    author: 'AI Evolution Labs',
    builtin: true,
  },
  {
    id: 'builtin.client-onboarding-pack',
    name: 'Client onboarding pack',
    description: 'Welcome email + intake form + 30-day timeline + week-1 check-in agenda for a new client.',
    icon: '🎁',
    category: 'sales',
    promptTemplate:
      'Build a full client onboarding pack.\n\n' +
      'Client: {{client_name}}\n' +
      'Engagement: {{engagement}}\n' +
      'Start date: {{start_date}}\n' +
      'Key contact: {{contact_name}}\n\n' +
      'Deliver 4 artefacts in this order:\n' +
      '1. Welcome email (warm, executive, max 180 words)\n' +
      '2. Intake form (8 questions, grouped)\n' +
      '3. 30-day timeline (week-by-week milestones)\n' +
      '4. Week-1 check-in agenda (30 min)\n\n' +
      'Use markdown headings. Make it ready to send.',
    fields: [
      { key: 'client_name', label: 'Client name', required: true },
      { key: 'engagement', label: 'Engagement (e.g. "Q3 brand refresh")', required: true },
      { key: 'start_date', label: 'Start date', required: true },
      { key: 'contact_name', label: 'Key contact name', required: true },
    ],
    createdAt: '2026-05-23T00:00:00.000Z',
    updatedAt: '2026-05-23T00:00:00.000Z',
    author: 'AI Evolution Labs',
    builtin: true,
  },
  {
    id: 'builtin.competitor-teardown',
    name: 'Competitor teardown',
    description: 'Structured competitive intelligence — positioning, pricing, audience, claims, gaps.',
    icon: '🔍',
    category: 'research',
    promptTemplate:
      'Run a competitor teardown.\n\n' +
      'Competitors: {{competitors}}\n' +
      'Our positioning: {{our_positioning}}\n\n' +
      'Output as markdown:\n' +
      '## At-a-glance comparison table (columns: positioning, primary audience, pricing tier, channels, headline claim)\n' +
      '## Per-competitor: 4-bullet teardown each\n' +
      '## Gaps we can exploit (5 bullets, action-oriented)\n' +
      '## "Where we win" elevator pitch (3 sentences max)',
    fields: [
      { key: 'competitors', label: 'Competitors (comma-separated names or URLs)', placeholder: 'Acme, BetaCorp, gamma.io', required: true },
      { key: 'our_positioning', label: 'Our positioning (1 sentence)', required: true },
    ],
    createdAt: '2026-05-23T00:00:00.000Z',
    updatedAt: '2026-05-23T00:00:00.000Z',
    author: 'AI Evolution Labs',
    builtin: true,
  },
  {
    id: 'builtin.campaign-brief',
    name: 'Marketing campaign brief',
    description: 'Audience, message, channel mix, KPIs, budget tiers — ready for the agency or the team.',
    icon: '📣',
    category: 'marketing',
    promptTemplate:
      'Produce a marketing campaign brief.\n\n' +
      'Campaign objective: {{objective}}\n' +
      'Target audience: {{audience}}\n' +
      'Budget band: {{budget}}\n' +
      'Launch window: {{launch}}\n\n' +
      'Output as markdown sections:\n' +
      '## Objective + success metric (1 KPI)\n' +
      '## Audience persona (3 bullets)\n' +
      '## Core message + 3 supporting proof points\n' +
      '## Channel mix (table: channel, role, weight)\n' +
      '## Asset list (5-row table: asset, owner, deadline)\n' +
      '## 3 budget scenarios (low / base / stretch)',
    fields: [
      { key: 'objective', label: 'Campaign objective (1 sentence)', required: true },
      { key: 'audience', label: 'Target audience', required: true },
      { key: 'budget', label: 'Budget band', placeholder: '€10k–€25k', required: true },
      { key: 'launch', label: 'Launch window', placeholder: 'Sep 1 – Oct 15', required: false },
    ],
    createdAt: '2026-05-23T00:00:00.000Z',
    updatedAt: '2026-05-23T00:00:00.000Z',
    author: 'AI Evolution Labs',
    builtin: true,
  },
  {
    id: 'builtin.weekly-ops-status',
    name: 'Weekly ops status',
    description: 'Cross-team status: shipped, blockers, ETAs, headcount asks.',
    icon: '⚙️',
    category: 'ops',
    promptTemplate:
      'Produce a weekly ops status for {{team}}.\n\n' +
      'Source: {{source}}\n\n' +
      'Output as markdown:\n' +
      '## Shipped this week (max 8 items)\n' +
      '## In-flight (with ETA)\n' +
      '## Blockers (with owner + impact)\n' +
      '## Headcount / tooling asks\n' +
      '## Next-week focus (3 bullets)',
    fields: [
      { key: 'team', label: 'Team', required: true },
      { key: 'source', label: 'Source (Notion / Linear / "ask me")', required: true },
    ],
    createdAt: '2026-05-23T00:00:00.000Z',
    updatedAt: '2026-05-23T00:00:00.000Z',
    author: 'AI Evolution Labs',
    builtin: true,
  },
]

type StoredState = {
  // Custom (user-created) playbooks live here in full.
  custom: Array<Playbook>
  // IDs of built-ins the user has explicitly hidden.
  dismissedBuiltins: Array<string>
}

function emptyState(): StoredState {
  return { custom: [], dismissedBuiltins: [] }
}

function readState(): StoredState {
  if (typeof window === 'undefined') return emptyState()
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return emptyState()
    const parsed = JSON.parse(raw) as Partial<StoredState>
    return {
      custom: Array.isArray(parsed.custom) ? parsed.custom : [],
      dismissedBuiltins: Array.isArray(parsed.dismissedBuiltins)
        ? parsed.dismissedBuiltins
        : [],
    }
  } catch {
    return emptyState()
  }
}

function writeState(next: StoredState): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    /* quota / private mode — silently drop */
  }
}

export function loadPlaybooks(): Array<Playbook> {
  const state = readState()
  const dismissed = new Set(state.dismissedBuiltins)
  const visibleBuiltins = BUILTIN_PLAYBOOKS.filter((p) => !dismissed.has(p.id))
  return [...visibleBuiltins, ...state.custom]
}

export function savePlaybook(playbook: Playbook): void {
  const state = readState()
  const now = new Date().toISOString()
  const idx = state.custom.findIndex((p) => p.id === playbook.id)
  const next: Playbook = {
    ...playbook,
    updatedAt: now,
    createdAt: playbook.createdAt || now,
  }
  if (idx >= 0) state.custom[idx] = next
  else state.custom.push(next)
  writeState(state)
}

export function deletePlaybook(id: string): void {
  const state = readState()
  const builtin = BUILTIN_PLAYBOOKS.find((p) => p.id === id)
  if (builtin) {
    if (!state.dismissedBuiltins.includes(id)) {
      state.dismissedBuiltins.push(id)
    }
  } else {
    state.custom = state.custom.filter((p) => p.id !== id)
  }
  writeState(state)
}

export function restoreBuiltins(): void {
  const state = readState()
  state.dismissedBuiltins = []
  writeState(state)
}

export function renderPlaybookPrompt(
  playbook: Playbook,
  values: Record<string, string>,
): string {
  return playbook.promptTemplate.replace(
    /\{\{(\w+)\}\}/g,
    (_, key: string) => values[key] || `[${key}]`,
  )
}

export function newPlaybookId(): string {
  return `pb-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export function exportPlaybooks(): string {
  return JSON.stringify(
    { version: 1, playbooks: loadPlaybooks() },
    null,
    2,
  )
}

export function importPlaybooks(json: string): number {
  const parsed = JSON.parse(json) as { playbooks?: Array<Playbook> }
  if (!parsed?.playbooks || !Array.isArray(parsed.playbooks)) {
    throw new Error('Invalid playbook export — missing "playbooks" array')
  }
  const state = readState()
  let imported = 0
  for (const pb of parsed.playbooks) {
    if (pb.builtin) continue
    // Force new ID to avoid collisions on import.
    const cloned: Playbook = {
      ...pb,
      id: newPlaybookId(),
      builtin: false,
      updatedAt: new Date().toISOString(),
    }
    state.custom.push(cloned)
    imported += 1
  }
  writeState(state)
  return imported
}
