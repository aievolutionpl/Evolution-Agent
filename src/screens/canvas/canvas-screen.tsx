import { useMemo, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Add01Icon,
  ArrowRight01Icon,
  Clock01Icon,
  Delete02Icon,
  Download01Icon,
  PlayIcon,
  Copy01Icon,
  CheckmarkCircle02Icon,
} from '@hugeicons/core-free-icons'
import {
  DELIVERABLE_KINDS,
  type Deliverable,
  type DeliverableKind,
  appendVersion,
  buildBriefPrompt,
  deleteDeliverable,
  loadDeliverables,
  newDeliverableId,
  saveDeliverable,
} from '@/lib/canvas-deliverables'
import { CHAT_RUN_COMMAND_EVENT } from '@/screens/chat/chat-events'
import type { ChatRunCommandDetail } from '@/screens/chat/chat-events'

function emptyDeliverable(): Deliverable {
  const now = new Date().toISOString()
  return {
    id: newDeliverableId(),
    kind: 'proposal',
    title: '',
    brief: { audience: '', objective: '', tone: '', context: '', constraints: '' },
    versions: [],
    createdAt: now,
    updatedAt: now,
  }
}

export function CanvasScreen() {
  const [items, setItems] = useState<Array<Deliverable>>(() => loadDeliverables())
  const [activeId, setActiveId] = useState<string | null>(items[0]?.id ?? null)
  const [draft, setDraft] = useState<Deliverable>(() => items[0] || emptyDeliverable())
  const [editorContent, setEditorContent] = useState<string>(() =>
    items[0]?.versions[items[0].versions.length - 1]?.content || '',
  )
  const [copied, setCopied] = useState(false)
  const navigate = useNavigate()

  function refresh(nextActive?: string) {
    const list = loadDeliverables()
    setItems(list)
    const focus = list.find((d) => d.id === (nextActive ?? activeId))
    if (focus) {
      setDraft(focus)
      setActiveId(focus.id)
      setEditorContent(focus.versions[focus.versions.length - 1]?.content || '')
    } else if (list[0]) {
      setDraft(list[0])
      setActiveId(list[0].id)
      setEditorContent(list[0].versions[list[0].versions.length - 1]?.content || '')
    } else {
      const fresh = emptyDeliverable()
      setDraft(fresh)
      setActiveId(null)
      setEditorContent('')
    }
  }

  function pickItem(d: Deliverable) {
    setDraft(d)
    setActiveId(d.id)
    setEditorContent(d.versions[d.versions.length - 1]?.content || '')
  }

  function startNew() {
    const fresh = emptyDeliverable()
    setDraft(fresh)
    setActiveId(null)
    setEditorContent('')
  }

  function setBriefField<K extends keyof Deliverable['brief']>(k: K, v: string) {
    setDraft((d) => ({ ...d, brief: { ...d.brief, [k]: v } }))
  }

  function setKind(k: DeliverableKind) {
    setDraft((d) => ({ ...d, kind: k }))
  }

  function setTitle(t: string) {
    setDraft((d) => ({ ...d, title: t }))
  }

  function handleGenerate() {
    // Persist the brief first so the deliverable shows up in history.
    saveDeliverable(draft)
    const prompt = buildBriefPrompt(draft)
    navigate({ to: '/chat' }).then(() => {
      const detail: ChatRunCommandDetail = { command: prompt }
      window.dispatchEvent(new CustomEvent(CHAT_RUN_COMMAND_EVENT, { detail }))
    })
    refresh(draft.id)
  }

  function handleSaveVersion() {
    if (!editorContent.trim()) return
    const note = window.prompt('Short note for this version (optional):') || undefined
    saveDeliverable(draft)
    appendVersion(draft.id, editorContent, note ?? undefined)
    refresh(draft.id)
  }

  function handleDelete() {
    if (!activeId) return
    if (!window.confirm('Delete this deliverable and all its versions?')) return
    deleteDeliverable(activeId)
    refresh()
  }

  function handleExport() {
    if (!editorContent.trim()) return
    const slug =
      draft.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40) || 'deliverable'
    const blob = new Blob([editorContent], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${slug}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  async function handleCopy() {
    if (!editorContent.trim()) return
    try {
      await navigator.clipboard.writeText(editorContent)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      /* ignore */
    }
  }

  const kindMeta = useMemo(
    () => DELIVERABLE_KINDS.find((k) => k.id === draft.kind),
    [draft.kind],
  )

  return (
    <div className="min-h-full">
      <div className="grid h-[calc(100vh-0px)] grid-cols-1 md:grid-cols-[260px_1fr_300px]">
        {/* ── Left: list of past deliverables ─────────────────────────── */}
        <aside
          className="hidden flex-col gap-2 overflow-y-auto p-3 md:flex"
          style={{
            background: 'var(--theme-sidebar)',
            borderRight: '1px solid var(--theme-border)',
          }}
        >
          <div className="mb-2 flex items-center justify-between">
            <span
              className="text-[10px] uppercase tracking-[0.18em]"
              style={{ color: 'var(--theme-muted)' }}
            >
              Deliverables
            </span>
            <button
              type="button"
              onClick={startNew}
              className="rounded-md p-1 transition"
              aria-label="New deliverable"
              style={{ color: 'var(--theme-accent)' }}
            >
              <HugeiconsIcon icon={Add01Icon} size={14} strokeWidth={2} />
            </button>
          </div>
          {items.length === 0 ? (
            <p className="text-[11px]" style={{ color: 'var(--theme-muted)' }}>
              Nothing here yet. Start your first deliverable on the right.
            </p>
          ) : (
            items.map((it) => {
              const active = it.id === activeId
              const meta = DELIVERABLE_KINDS.find((k) => k.id === it.kind)
              return (
                <button
                  key={it.id}
                  type="button"
                  onClick={() => pickItem(it)}
                  className="flex items-start gap-2 rounded-lg p-2 text-left transition"
                  style={{
                    background: active ? 'var(--theme-accent-subtle)' : 'transparent',
                    border: '1px solid',
                    borderColor: active ? 'var(--theme-accent-border)' : 'transparent',
                  }}
                >
                  <span className="text-lg leading-none">{meta?.icon || '📄'}</span>
                  <span className="flex min-w-0 flex-col">
                    <span
                      className="truncate text-[12px] font-semibold"
                      style={{ color: 'var(--theme-text)' }}
                    >
                      {it.title || 'Untitled'}
                    </span>
                    <span
                      className="text-[10px]"
                      style={{ color: 'var(--theme-muted)' }}
                    >
                      {meta?.label} · v{it.versions.length}
                    </span>
                  </span>
                </button>
              )
            })
          )}
        </aside>

        {/* ── Centre: brief form + editor ─────────────────────────────── */}
        <main className="flex flex-col overflow-hidden">
          {/* Header */}
          <div
            className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
            style={{ borderBottom: '1px solid var(--theme-border)' }}
          >
            <div>
              <p
                className="text-[10px] uppercase tracking-[0.22em]"
                style={{ color: 'var(--theme-accent)' }}
              >
                AI Evolution Labs · Deliverable Canvas
              </p>
              <h1
                className="mt-0.5 text-xl font-semibold tracking-tight"
                style={{ color: 'var(--theme-text)' }}
              >
                {draft.title || 'New deliverable'}
              </h1>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={handleCopy}
                disabled={!editorContent.trim()}
                className="inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px]"
                style={{
                  background: 'var(--theme-card)',
                  border: '1px solid var(--theme-border)',
                  color: 'var(--theme-text)',
                  opacity: editorContent.trim() ? 1 : 0.5,
                }}
              >
                <HugeiconsIcon
                  icon={copied ? CheckmarkCircle02Icon : Copy01Icon}
                  size={11}
                  strokeWidth={1.6}
                />
                {copied ? 'Copied' : 'Copy'}
              </button>
              <button
                type="button"
                onClick={handleExport}
                disabled={!editorContent.trim()}
                className="inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px]"
                style={{
                  background: 'var(--theme-card)',
                  border: '1px solid var(--theme-border)',
                  color: 'var(--theme-text)',
                  opacity: editorContent.trim() ? 1 : 0.5,
                }}
              >
                <HugeiconsIcon icon={Download01Icon} size={11} strokeWidth={1.6} /> Export .md
              </button>
              <button
                type="button"
                onClick={handleSaveVersion}
                disabled={!editorContent.trim()}
                className="inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-semibold"
                style={{
                  background: editorContent.trim() ? 'var(--theme-accent)' : 'var(--theme-card2)',
                  color: editorContent.trim() ? '#02110F' : 'var(--theme-muted)',
                }}
              >
                Save version
              </button>
              {activeId && (
                <button
                  type="button"
                  onClick={handleDelete}
                  aria-label="Delete deliverable"
                  className="rounded-md p-1.5"
                  style={{ color: 'var(--theme-muted)' }}
                >
                  <HugeiconsIcon icon={Delete02Icon} size={13} strokeWidth={1.6} />
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-5 py-5">
            {/* Brief form */}
            <section
              className="rounded-xl p-4"
              style={{
                background: 'var(--theme-card)',
                border: '1px solid var(--theme-border)',
              }}
            >
              <div className="mb-3 flex flex-wrap gap-1.5">
                {DELIVERABLE_KINDS.map((k) => {
                  const active = draft.kind === k.id
                  return (
                    <button
                      key={k.id}
                      type="button"
                      onClick={() => setKind(k.id)}
                      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium transition"
                      style={{
                        background: active ? 'var(--theme-accent-subtle)' : 'transparent',
                        border: '1px solid',
                        borderColor: active
                          ? 'var(--theme-accent-border)'
                          : 'var(--theme-border)',
                        color: active ? 'var(--theme-accent)' : 'var(--theme-muted)',
                      }}
                    >
                      <span>{k.icon}</span> {k.label}
                    </button>
                  )
                })}
              </div>

              {kindMeta && (
                <p className="mb-3 text-[11px]" style={{ color: 'var(--theme-muted)' }}>
                  {kindMeta.description}
                </p>
              )}

              <input
                type="text"
                value={draft.title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={`Title — e.g. "Q3 proposal for Acme Co."`}
                className="mb-3 w-full rounded-md px-3 py-2 text-sm outline-none"
                style={{
                  background: 'var(--composer-bg)',
                  border: '1px solid var(--composer-border)',
                  color: 'var(--theme-text)',
                }}
              />

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <BriefField
                  label="Audience"
                  value={draft.brief.audience}
                  onChange={(v) => setBriefField('audience', v)}
                  placeholder="Who is this for? e.g. CFO of a mid-market SaaS"
                />
                <BriefField
                  label="Objective"
                  value={draft.brief.objective}
                  onChange={(v) => setBriefField('objective', v)}
                  placeholder="What outcome? e.g. close €40k contract by end of Q3"
                />
                <BriefField
                  label="Tone"
                  value={draft.brief.tone}
                  onChange={(v) => setBriefField('tone', v)}
                  placeholder="Executive, friendly, technical…"
                />
                <BriefField
                  label="Constraints"
                  value={draft.brief.constraints}
                  onChange={(v) => setBriefField('constraints', v)}
                  placeholder="Length, must-include, no-go topics…"
                />
              </div>

              <label className="mt-3 flex flex-col gap-1">
                <span className="text-[11px] font-medium" style={{ color: 'var(--theme-text)' }}>
                  Context
                </span>
                <textarea
                  value={draft.brief.context}
                  onChange={(e) => setBriefField('context', e.target.value)}
                  rows={3}
                  placeholder="Anything Hermes should know before writing — links, prior emails, raw data, decisions already made."
                  className="rounded-md px-3 py-2 text-sm outline-none"
                  style={{
                    background: 'var(--composer-bg)',
                    border: '1px solid var(--composer-border)',
                    color: 'var(--theme-text)',
                  }}
                />
              </label>

              <button
                type="button"
                onClick={handleGenerate}
                disabled={!draft.title.trim() || !draft.brief.objective.trim()}
                className="mt-4 inline-flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-semibold transition"
                style={{
                  background:
                    draft.title.trim() && draft.brief.objective.trim()
                      ? 'var(--theme-accent)'
                      : 'var(--theme-card2)',
                  color:
                    draft.title.trim() && draft.brief.objective.trim()
                      ? '#02110F'
                      : 'var(--theme-muted)',
                  boxShadow:
                    draft.title.trim() && draft.brief.objective.trim()
                      ? '0 0 22px color-mix(in srgb, var(--theme-accent) 28%, transparent)'
                      : 'none',
                }}
              >
                <HugeiconsIcon icon={PlayIcon} size={13} strokeWidth={2} /> Generate in chat
                <HugeiconsIcon icon={ArrowRight01Icon} size={12} strokeWidth={2} />
              </button>
              <p className="mt-2 text-[10px]" style={{ color: 'var(--theme-muted)' }}>
                Tip: paste the response back into the editor below, then{' '}
                <strong>Save version</strong> to lock it into history.
              </p>
            </section>

            {/* Editor */}
            <section
              className="flex-1 rounded-xl p-4"
              style={{
                background: 'var(--theme-card)',
                border: '1px solid var(--theme-border)',
              }}
            >
              <div className="mb-2 flex items-center justify-between">
                <span
                  className="text-[10px] uppercase tracking-[0.18em]"
                  style={{ color: 'var(--theme-muted)' }}
                >
                  Editor (markdown)
                </span>
                <span className="text-[10px]" style={{ color: 'var(--theme-muted)' }}>
                  {editorContent.length.toLocaleString()} chars
                </span>
              </div>
              <textarea
                value={editorContent}
                onChange={(e) => setEditorContent(e.target.value)}
                rows={18}
                placeholder="The generated deliverable lands here. Edit freely. Click Save version to lock changes into history."
                className="w-full rounded-md px-3 py-2 text-sm outline-none"
                style={{
                  background: 'var(--composer-bg)',
                  border: '1px solid var(--composer-border)',
                  color: 'var(--theme-text)',
                  fontFamily: 'JetBrains Mono, monospace',
                  minHeight: 320,
                }}
              />
            </section>
          </div>
        </main>

        {/* ── Right: version history ──────────────────────────────────── */}
        <aside
          className="hidden flex-col gap-2 overflow-y-auto p-3 md:flex"
          style={{
            background: 'var(--theme-sidebar)',
            borderLeft: '1px solid var(--theme-border)',
          }}
        >
          <div className="mb-2 flex items-center gap-1.5">
            <HugeiconsIcon
              icon={Clock01Icon}
              size={12}
              strokeWidth={1.6}
              style={{ color: 'var(--theme-muted)' }}
            />
            <span
              className="text-[10px] uppercase tracking-[0.18em]"
              style={{ color: 'var(--theme-muted)' }}
            >
              Version history
            </span>
          </div>
          {draft.versions.length === 0 ? (
            <p className="text-[11px]" style={{ color: 'var(--theme-muted)' }}>
              No versions yet. Generate and save your first one.
            </p>
          ) : (
            draft.versions
              .slice()
              .reverse()
              .map((v, i) => {
                const versionNumber = draft.versions.length - i
                return (
                  <button
                    key={v.createdAt + i}
                    type="button"
                    onClick={() => setEditorContent(v.content)}
                    className="flex flex-col items-start gap-1 rounded-lg p-2 text-left transition"
                    style={{
                      background: 'var(--theme-card)',
                      border: '1px solid var(--theme-border-subtle)',
                    }}
                  >
                    <span
                      className="text-[11px] font-semibold"
                      style={{ color: 'var(--theme-text)' }}
                    >
                      v{versionNumber}
                    </span>
                    <span className="text-[10px]" style={{ color: 'var(--theme-muted)' }}>
                      {new Date(v.createdAt).toLocaleString()}
                    </span>
                    {v.note && (
                      <span
                        className="line-clamp-2 text-[10px]"
                        style={{ color: 'var(--theme-muted)' }}
                      >
                        {v.note}
                      </span>
                    )}
                  </button>
                )
              })
          )}
        </aside>
      </div>
    </div>
  )
}

function BriefField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[11px] font-medium" style={{ color: 'var(--theme-text)' }}>
        {label}
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="rounded-md px-3 py-2 text-sm outline-none"
        style={{
          background: 'var(--composer-bg)',
          border: '1px solid var(--composer-border)',
          color: 'var(--theme-text)',
        }}
      />
    </label>
  )
}
