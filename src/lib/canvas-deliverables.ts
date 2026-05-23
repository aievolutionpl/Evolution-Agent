// Deliverable Canvas — focused asset-production mode (not a chat).
//
// Users fill a short brief, hit Generate, and Hermes produces a real
// deliverable (proposal, report, email, one-pager). The output lands in
// an editable markdown surface with version history.
//
// Storage: localStorage. Each deliverable is one entry; each version is
// appended in-place. No backend dependency.

export type DeliverableKind =
  | 'proposal'
  | 'report'
  | 'email'
  | 'one-pager'
  | 'memo'

export type DeliverableVersion = {
  createdAt: string
  content: string
  /** Short message describing what changed in this version. */
  note?: string
}

export type Deliverable = {
  id: string
  kind: DeliverableKind
  title: string
  brief: {
    audience: string
    objective: string
    tone: string
    context: string
    constraints: string
  }
  versions: Array<DeliverableVersion>
  createdAt: string
  updatedAt: string
}

export const DELIVERABLE_KINDS: Array<{
  id: DeliverableKind
  label: string
  icon: string
  description: string
}> = [
  {
    id: 'proposal',
    label: 'Proposal',
    icon: '📄',
    description: 'Tailored client proposal with problem, approach, timeline, price band.',
  },
  {
    id: 'report',
    label: 'Report',
    icon: '📊',
    description: 'Structured business report — KPIs, recap, risks, next-week priorities.',
  },
  {
    id: 'email',
    label: 'Email',
    icon: '✉️',
    description: 'Polished outbound email — outreach, follow-up, announcement.',
  },
  {
    id: 'one-pager',
    label: 'One-pager',
    icon: '🗒️',
    description: 'Single-page asset that explains a product, deal, or idea on one screen.',
  },
  {
    id: 'memo',
    label: 'Memo',
    icon: '📝',
    description: 'Internal memo — decision document, status update, post-mortem.',
  },
]

const STORAGE_KEY = 'aiel-deliverables'

type StoredState = { items: Array<Deliverable> }

function readState(): StoredState {
  if (typeof window === 'undefined') return { items: [] }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return { items: [] }
    const parsed = JSON.parse(raw) as StoredState
    return { items: Array.isArray(parsed.items) ? parsed.items : [] }
  } catch {
    return { items: [] }
  }
}

function writeState(next: StoredState): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    /* ignore */
  }
}

export function loadDeliverables(): Array<Deliverable> {
  return readState()
    .items.slice()
    .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
}

export function loadDeliverable(id: string): Deliverable | null {
  return readState().items.find((d) => d.id === id) || null
}

export function saveDeliverable(d: Deliverable): void {
  const state = readState()
  const idx = state.items.findIndex((it) => it.id === d.id)
  const now = new Date().toISOString()
  const next: Deliverable = { ...d, updatedAt: now, createdAt: d.createdAt || now }
  if (idx >= 0) state.items[idx] = next
  else state.items.unshift(next)
  writeState(state)
}

export function deleteDeliverable(id: string): void {
  const state = readState()
  state.items = state.items.filter((d) => d.id !== id)
  writeState(state)
}

export function appendVersion(
  id: string,
  content: string,
  note?: string,
): Deliverable | null {
  const state = readState()
  const idx = state.items.findIndex((it) => it.id === id)
  if (idx < 0) return null
  const now = new Date().toISOString()
  state.items[idx] = {
    ...state.items[idx],
    versions: [
      ...state.items[idx].versions,
      { createdAt: now, content, note },
    ],
    updatedAt: now,
  }
  writeState(state)
  return state.items[idx]
}

export function newDeliverableId(): string {
  return `dlv-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

/**
 * Builds the prompt that Hermes will run to draft this deliverable. The
 * Deliverable Canvas dispatches this to /chat via the existing
 * CHAT_RUN_COMMAND_EVENT, then the user pastes the response back as the
 * first version. (Inline streaming will be wired later when the chat
 * stream API is plumbed into the canvas.)
 */
export function buildBriefPrompt(d: Deliverable): string {
  const kindMeta = DELIVERABLE_KINDS.find((k) => k.id === d.kind)
  const lines = [
    `Produce a ${kindMeta?.label || d.kind}: "${d.title}".`,
    '',
    `Audience: ${d.brief.audience || '(not specified)'}`,
    `Objective: ${d.brief.objective || '(not specified)'}`,
    `Tone: ${d.brief.tone || 'executive, no fluff'}`,
    `Context: ${d.brief.context || '(none provided)'}`,
    `Constraints: ${d.brief.constraints || '(none)'}`,
    '',
    'Output as clean markdown ready to paste into the canvas editor.',
    'Use proper headings, lists, and a final "Next steps" section.',
  ]
  return lines.join('\n')
}
