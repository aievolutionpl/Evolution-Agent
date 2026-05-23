import { useMemo, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Add01Icon,
  ArrowRight01Icon,
  Cancel01Icon,
  Download01Icon,
  Upload01Icon,
  PlayIcon,
  Delete02Icon,
  PencilEdit02Icon,
  Refresh01Icon,
} from '@hugeicons/core-free-icons'
import {
  type Playbook,
  loadPlaybooks,
  savePlaybook,
  deletePlaybook,
  restoreBuiltins,
  renderPlaybookPrompt,
  newPlaybookId,
  exportPlaybooks,
  importPlaybooks,
} from '@/lib/playbooks'
import { CHAT_RUN_COMMAND_EVENT } from '@/screens/chat/chat-events'
import type { ChatRunCommandDetail } from '@/screens/chat/chat-events'

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'sales', label: 'Sales' },
  { id: 'marketing', label: 'Marketing' },
  { id: 'ops', label: 'Ops' },
  { id: 'finance', label: 'Finance' },
  { id: 'research', label: 'Research' },
  { id: 'custom', label: 'Custom' },
] as const

export function PlaybooksScreen() {
  const [playbooks, setPlaybooks] = useState<Array<Playbook>>(() => loadPlaybooks())
  const [filter, setFilter] = useState<(typeof CATEGORIES)[number]['id']>('all')
  const [runTarget, setRunTarget] = useState<Playbook | null>(null)
  const [editTarget, setEditTarget] = useState<Playbook | null>(null)
  const navigate = useNavigate()

  function refresh() {
    setPlaybooks(loadPlaybooks())
  }

  const visible = useMemo(
    () => (filter === 'all' ? playbooks : playbooks.filter((p) => p.category === filter)),
    [filter, playbooks],
  )

  function handleRun(playbook: Playbook, values: Record<string, string>) {
    const prompt = renderPlaybookPrompt(playbook, values)
    setRunTarget(null)
    navigate({ to: '/chat' }).then(() => {
      const detail: ChatRunCommandDetail = { command: prompt }
      window.dispatchEvent(new CustomEvent(CHAT_RUN_COMMAND_EVENT, { detail }))
    })
  }

  function handleSave(playbook: Playbook) {
    savePlaybook(playbook)
    setEditTarget(null)
    refresh()
  }

  function handleDelete(id: string) {
    if (!window.confirm('Delete this playbook?')) return
    deletePlaybook(id)
    refresh()
  }

  function handleExport() {
    const data = exportPlaybooks()
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `aiel-playbooks-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleImport() {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'application/json'
    input.onchange = async () => {
      const file = input.files?.[0]
      if (!file) return
      try {
        const text = await file.text()
        const count = importPlaybooks(text)
        refresh()
        window.alert(`Imported ${count} playbook(s).`)
      } catch (e) {
        window.alert(`Import failed: ${e instanceof Error ? e.message : String(e)}`)
      }
    }
    input.click()
  }

  return (
    <div className="min-h-full">
      <div className="mx-auto max-w-6xl px-4 py-6 md:px-8 md:py-10">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p
              className="text-[10px] uppercase tracking-[0.22em]"
              style={{ color: 'var(--theme-accent)' }}
            >
              AI Evolution Labs · Hermes
            </p>
            <h1
              className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl"
              style={{ color: 'var(--theme-text)' }}
            >
              Playbooks
            </h1>
            <p className="mt-1 text-sm" style={{ color: 'var(--theme-muted)' }}>
              Reusable business recipes. Fill a short form → Hermes produces a real deliverable.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() =>
                setEditTarget({
                  id: newPlaybookId(),
                  name: '',
                  description: '',
                  icon: '✨',
                  category: 'custom',
                  promptTemplate: '',
                  fields: [],
                  createdAt: '',
                  updatedAt: '',
                })
              }
              className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold"
              style={{ background: 'var(--theme-accent)', color: '#02110F' }}
            >
              <HugeiconsIcon icon={Add01Icon} size={14} strokeWidth={2} /> New playbook
            </button>
            <button
              type="button"
              onClick={handleImport}
              className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs"
              style={{
                background: 'var(--theme-card)',
                border: '1px solid var(--theme-border)',
                color: 'var(--theme-text)',
              }}
            >
              <HugeiconsIcon icon={Upload01Icon} size={14} strokeWidth={1.6} /> Import
            </button>
            <button
              type="button"
              onClick={handleExport}
              className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs"
              style={{
                background: 'var(--theme-card)',
                border: '1px solid var(--theme-border)',
                color: 'var(--theme-text)',
              }}
            >
              <HugeiconsIcon icon={Download01Icon} size={14} strokeWidth={1.6} /> Export
            </button>
            <button
              type="button"
              onClick={() => {
                restoreBuiltins()
                refresh()
              }}
              className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs"
              style={{ color: 'var(--theme-muted)' }}
              title="Restore built-in playbooks if you previously deleted them"
            >
              <HugeiconsIcon icon={Refresh01Icon} size={14} strokeWidth={1.6} /> Restore
            </button>
          </div>
        </div>

        {/* Category filter */}
        <div className="mb-5 flex flex-wrap gap-1.5">
          {CATEGORIES.map((c) => {
            const active = filter === c.id
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setFilter(c.id)}
                className="rounded-full px-3 py-1 text-xs font-medium transition"
                style={{
                  background: active ? 'var(--theme-accent-subtle)' : 'transparent',
                  border: '1px solid',
                  borderColor: active ? 'var(--theme-accent-border)' : 'var(--theme-border)',
                  color: active ? 'var(--theme-accent)' : 'var(--theme-muted)',
                }}
              >
                {c.label}
              </button>
            )
          })}
        </div>

        {/* Grid */}
        {visible.length === 0 ? (
          <div
            className="rounded-2xl p-10 text-center"
            style={{
              background: 'var(--theme-card)',
              border: '1px dashed var(--theme-border)',
              color: 'var(--theme-muted)',
            }}
          >
            No playbooks in this category yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((pb) => (
              <PlaybookCard
                key={pb.id}
                playbook={pb}
                onRun={() => setRunTarget(pb)}
                onEdit={() => setEditTarget(pb)}
                onDelete={() => handleDelete(pb.id)}
              />
            ))}
          </div>
        )}
      </div>

      {runTarget && (
        <RunDialog
          playbook={runTarget}
          onCancel={() => setRunTarget(null)}
          onRun={(values) => handleRun(runTarget, values)}
        />
      )}

      {editTarget && (
        <EditDialog
          playbook={editTarget}
          onCancel={() => setEditTarget(null)}
          onSave={handleSave}
        />
      )}
    </div>
  )
}

function PlaybookCard({
  playbook,
  onRun,
  onEdit,
  onDelete,
}: {
  playbook: Playbook
  onRun: () => void
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      className="group relative flex flex-col gap-3 rounded-xl p-4 transition"
      style={{
        background: 'var(--theme-card)',
        border: '1px solid var(--theme-border)',
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-3">
          <div
            className="flex size-10 shrink-0 items-center justify-center rounded-md text-xl"
            style={{
              background: 'var(--theme-accent-subtle)',
              border: '1px solid var(--theme-accent-border)',
            }}
          >
            {playbook.icon}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3
                className="text-sm font-semibold leading-tight"
                style={{ color: 'var(--theme-text)' }}
              >
                {playbook.name || 'Untitled playbook'}
              </h3>
              {playbook.builtin && (
                <span
                  className="rounded-full px-1.5 py-0.5 text-[9px] uppercase tracking-wider"
                  style={{
                    background: 'var(--theme-accent-subtle)',
                    color: 'var(--theme-accent)',
                  }}
                >
                  AIEL
                </span>
              )}
            </div>
            <p
              className="mt-1 line-clamp-2 text-xs leading-snug"
              style={{ color: 'var(--theme-muted)' }}
            >
              {playbook.description}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between gap-2">
        <span
          className="text-[10px] uppercase tracking-wider"
          style={{ color: 'var(--theme-muted)' }}
        >
          {playbook.category} · {playbook.fields.length} input{playbook.fields.length === 1 ? '' : 's'}
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onEdit}
            aria-label="Edit"
            className="rounded-md p-1.5 transition"
            style={{ color: 'var(--theme-muted)' }}
          >
            <HugeiconsIcon icon={PencilEdit02Icon} size={14} strokeWidth={1.6} />
          </button>
          <button
            type="button"
            onClick={onDelete}
            aria-label="Delete"
            className="rounded-md p-1.5 transition"
            style={{ color: 'var(--theme-muted)' }}
          >
            <HugeiconsIcon icon={Delete02Icon} size={14} strokeWidth={1.6} />
          </button>
          <button
            type="button"
            onClick={onRun}
            className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-semibold"
            style={{ background: 'var(--theme-accent)', color: '#02110F' }}
          >
            <HugeiconsIcon icon={PlayIcon} size={12} strokeWidth={2} /> Run
          </button>
        </div>
      </div>
    </motion.div>
  )
}

function RunDialog({
  playbook,
  onCancel,
  onRun,
}: {
  playbook: Playbook
  onCancel: () => void
  onRun: (values: Record<string, string>) => void
}) {
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(playbook.fields.map((f) => [f.key, ''])),
  )
  const allRequired = playbook.fields
    .filter((f) => f.required)
    .every((f) => (values[f.key] || '').trim().length > 0)

  return (
    <Backdrop onClick={onCancel}>
      <DialogShell title={`Run · ${playbook.name}`} onClose={onCancel}>
        <p className="text-xs" style={{ color: 'var(--theme-muted)' }}>
          {playbook.description}
        </p>

        {playbook.fields.length === 0 ? (
          <p className="mt-4 text-sm" style={{ color: 'var(--theme-muted)' }}>
            This playbook has no inputs — it will run as-is.
          </p>
        ) : (
          <div className="mt-4 flex flex-col gap-3">
            {playbook.fields.map((f) => (
              <label key={f.key} className="flex flex-col gap-1">
                <span
                  className="text-[11px] font-medium"
                  style={{ color: 'var(--theme-text)' }}
                >
                  {f.label}
                  {f.required ? <span style={{ color: 'var(--theme-accent)' }}> *</span> : null}
                </span>
                <input
                  type="text"
                  value={values[f.key] || ''}
                  placeholder={f.placeholder}
                  onChange={(e) =>
                    setValues((v) => ({ ...v, [f.key]: e.target.value }))
                  }
                  className="rounded-md px-3 py-2 text-sm outline-none transition"
                  style={{
                    background: 'var(--composer-bg)',
                    border: '1px solid var(--composer-border)',
                    color: 'var(--theme-text)',
                  }}
                />
              </label>
            ))}
          </div>
        )}

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md px-3 py-1.5 text-xs"
            style={{ color: 'var(--theme-muted)' }}
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!allRequired}
            onClick={() => onRun(values)}
            className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold"
            style={{
              background: allRequired ? 'var(--theme-accent)' : 'var(--theme-card2)',
              color: allRequired ? '#02110F' : 'var(--theme-muted)',
              cursor: allRequired ? 'pointer' : 'not-allowed',
            }}
          >
            Run in chat <HugeiconsIcon icon={ArrowRight01Icon} size={12} strokeWidth={2} />
          </button>
        </div>
      </DialogShell>
    </Backdrop>
  )
}

function EditDialog({
  playbook,
  onCancel,
  onSave,
}: {
  playbook: Playbook
  onCancel: () => void
  onSave: (p: Playbook) => void
}) {
  const [draft, setDraft] = useState<Playbook>(playbook)
  const isNew = !playbook.name

  function set<K extends keyof Playbook>(key: K, value: Playbook[K]) {
    setDraft((d) => ({ ...d, [key]: value }))
  }

  function addField() {
    set('fields', [...draft.fields, { key: `field_${draft.fields.length + 1}`, label: '', required: false }])
  }

  function updateField(idx: number, patch: Partial<Playbook['fields'][number]>) {
    const next = draft.fields.slice()
    next[idx] = { ...next[idx], ...patch }
    set('fields', next)
  }

  function removeField(idx: number) {
    set('fields', draft.fields.filter((_, i) => i !== idx))
  }

  const canSave = draft.name.trim().length > 0 && draft.promptTemplate.trim().length > 0

  return (
    <Backdrop onClick={onCancel}>
      <DialogShell title={isNew ? 'New playbook' : `Edit · ${playbook.name}`} onClose={onCancel} wide>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[80px_1fr]">
          <label className="flex flex-col gap-1">
            <span className="text-[11px]" style={{ color: 'var(--theme-text)' }}>Icon</span>
            <input
              type="text"
              maxLength={4}
              value={draft.icon}
              onChange={(e) => set('icon', e.target.value)}
              className="rounded-md px-3 py-2 text-center text-lg outline-none"
              style={{
                background: 'var(--composer-bg)',
                border: '1px solid var(--composer-border)',
                color: 'var(--theme-text)',
              }}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-[11px]" style={{ color: 'var(--theme-text)' }}>Name</span>
            <input
              type="text"
              value={draft.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="Weekly sales recap"
              className="rounded-md px-3 py-2 text-sm outline-none"
              style={{
                background: 'var(--composer-bg)',
                border: '1px solid var(--composer-border)',
                color: 'var(--theme-text)',
              }}
            />
          </label>
        </div>

        <label className="mt-3 flex flex-col gap-1">
          <span className="text-[11px]" style={{ color: 'var(--theme-text)' }}>Description</span>
          <input
            type="text"
            value={draft.description}
            onChange={(e) => set('description', e.target.value)}
            placeholder="Short one-liner shown on the card"
            className="rounded-md px-3 py-2 text-sm outline-none"
            style={{
              background: 'var(--composer-bg)',
              border: '1px solid var(--composer-border)',
              color: 'var(--theme-text)',
            }}
          />
        </label>

        <label className="mt-3 flex flex-col gap-1">
          <span className="text-[11px]" style={{ color: 'var(--theme-text)' }}>Category</span>
          <select
            value={draft.category}
            onChange={(e) => set('category', e.target.value as Playbook['category'])}
            className="rounded-md px-3 py-2 text-sm outline-none"
            style={{
              background: 'var(--composer-bg)',
              border: '1px solid var(--composer-border)',
              color: 'var(--theme-text)',
            }}
          >
            <option value="sales">Sales</option>
            <option value="marketing">Marketing</option>
            <option value="ops">Ops</option>
            <option value="finance">Finance</option>
            <option value="research">Research</option>
            <option value="custom">Custom</option>
          </select>
        </label>

        <label className="mt-3 flex flex-col gap-1">
          <span className="text-[11px]" style={{ color: 'var(--theme-text)' }}>
            Prompt template — use <code style={{ color: 'var(--theme-accent)' }}>{'{{field_key}}'}</code> to insert inputs
          </span>
          <textarea
            value={draft.promptTemplate}
            onChange={(e) => set('promptTemplate', e.target.value)}
            rows={8}
            className="rounded-md px-3 py-2 text-sm outline-none"
            style={{
              background: 'var(--composer-bg)',
              border: '1px solid var(--composer-border)',
              color: 'var(--theme-text)',
              fontFamily: 'JetBrains Mono, monospace',
            }}
          />
        </label>

        {/* Fields editor */}
        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[11px]" style={{ color: 'var(--theme-text)' }}>Input fields</span>
            <button
              type="button"
              onClick={addField}
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px]"
              style={{
                background: 'var(--theme-card2)',
                border: '1px solid var(--theme-border)',
                color: 'var(--theme-text)',
              }}
            >
              <HugeiconsIcon icon={Add01Icon} size={11} strokeWidth={2} /> Add field
            </button>
          </div>
          {draft.fields.length === 0 ? (
            <p className="text-xs" style={{ color: 'var(--theme-muted)' }}>
              No inputs — the playbook will run with the prompt as-is.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {draft.fields.map((f, i) => (
                <div
                  key={i}
                  className="grid grid-cols-[1fr_1fr_auto_auto] items-center gap-2 rounded-md p-2"
                  style={{ background: 'var(--theme-card2)', border: '1px solid var(--theme-border)' }}
                >
                  <input
                    type="text"
                    value={f.key}
                    onChange={(e) => updateField(i, { key: e.target.value })}
                    placeholder="field_key"
                    className="rounded-md px-2 py-1 text-xs outline-none"
                    style={{
                      background: 'var(--composer-bg)',
                      border: '1px solid var(--composer-border)',
                      color: 'var(--theme-text)',
                      fontFamily: 'JetBrains Mono, monospace',
                    }}
                  />
                  <input
                    type="text"
                    value={f.label}
                    onChange={(e) => updateField(i, { label: e.target.value })}
                    placeholder="Label shown to user"
                    className="rounded-md px-2 py-1 text-xs outline-none"
                    style={{
                      background: 'var(--composer-bg)',
                      border: '1px solid var(--composer-border)',
                      color: 'var(--theme-text)',
                    }}
                  />
                  <label className="flex items-center gap-1 text-[11px]" style={{ color: 'var(--theme-muted)' }}>
                    <input
                      type="checkbox"
                      checked={!!f.required}
                      onChange={(e) => updateField(i, { required: e.target.checked })}
                    />
                    required
                  </label>
                  <button
                    type="button"
                    onClick={() => removeField(i)}
                    aria-label="Remove field"
                    className="p-1"
                    style={{ color: 'var(--theme-muted)' }}
                  >
                    <HugeiconsIcon icon={Cancel01Icon} size={14} strokeWidth={1.6} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md px-3 py-1.5 text-xs"
            style={{ color: 'var(--theme-muted)' }}
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!canSave}
            onClick={() => onSave(draft)}
            className="rounded-md px-3 py-1.5 text-xs font-semibold"
            style={{
              background: canSave ? 'var(--theme-accent)' : 'var(--theme-card2)',
              color: canSave ? '#02110F' : 'var(--theme-muted)',
              cursor: canSave ? 'pointer' : 'not-allowed',
            }}
          >
            {isNew ? 'Create playbook' : 'Save changes'}
          </button>
        </div>
      </DialogShell>
    </Backdrop>
  )
}

function Backdrop({
  children,
  onClick,
}: {
  children: React.ReactNode
  onClick: () => void
}) {
  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,8,6,0.72)', backdropFilter: 'blur(6px)' }}
      onClick={onClick}
    >
      <div onClick={(e) => e.stopPropagation()}>{children}</div>
    </div>
  )
}

function DialogShell({
  title,
  onClose,
  children,
  wide,
}: {
  title: string
  onClose: () => void
  children: React.ReactNode
  wide?: boolean
}) {
  return (
    <div
      className={`w-full overflow-hidden rounded-2xl ${wide ? 'max-w-2xl' : 'max-w-md'}`}
      style={{
        background: 'var(--theme-panel)',
        border: '1px solid var(--theme-accent-border)',
        boxShadow:
          '0 30px 80px rgba(0,0,0,0.55), 0 0 48px color-mix(in srgb, var(--theme-accent) 14%, transparent)',
      }}
    >
      <div
        className="flex items-center justify-between px-5 py-3"
        style={{ borderBottom: '1px solid var(--theme-border-subtle)' }}
      >
        <h3
          className="text-sm font-semibold tracking-tight"
          style={{ color: 'var(--theme-text)' }}
        >
          {title}
        </h3>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="rounded-md p-1.5"
          style={{ color: 'var(--theme-muted)' }}
        >
          <HugeiconsIcon icon={Cancel01Icon} size={14} strokeWidth={1.6} />
        </button>
      </div>
      <div className="max-h-[75vh] overflow-y-auto px-5 py-5">{children}</div>
    </div>
  )
}
