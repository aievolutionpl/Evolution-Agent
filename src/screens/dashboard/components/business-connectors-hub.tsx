import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  ArrowRight01Icon,
  CheckmarkCircle02Icon,
  Plug01Icon,
} from '@hugeicons/core-free-icons'
import {
  BUSINESS_CONNECTORS,
  loadConnectedIds,
  markConnected,
  markDisconnected,
  type BusinessConnector,
} from '@/lib/business-connectors'
import { CHAT_RUN_COMMAND_EVENT } from '@/screens/chat/chat-events'
import type { ChatRunCommandDetail } from '@/screens/chat/chat-events'

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'inbox', label: 'Inbox' },
  { id: 'chat', label: 'Chat' },
  { id: 'docs', label: 'Docs' },
  { id: 'files', label: 'Files' },
  { id: 'crm', label: 'CRM' },
  { id: 'calendar', label: 'Calendar' },
  { id: 'code', label: 'Code' },
] as const

export function BusinessConnectorsHub() {
  const [connected, setConnected] = useState<Set<string>>(new Set())
  const [filter, setFilter] = useState<(typeof CATEGORIES)[number]['id']>('all')

  useEffect(() => {
    setConnected(loadConnectedIds())
  }, [])

  const visible = useMemo(
    () =>
      filter === 'all'
        ? BUSINESS_CONNECTORS
        : BUSINESS_CONNECTORS.filter((c) => c.category === filter),
    [filter],
  )

  function toggle(id: string) {
    setConnected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
        markDisconnected(id)
      } else {
        next.add(id)
        markConnected(id)
      }
      return next
    })
  }

  const total = BUSINESS_CONNECTORS.length
  const connectedCount = connected.size

  return (
    <section
      className="rounded-2xl p-5 sm:p-6"
      style={{
        background: 'var(--theme-card)',
        border: '1px solid var(--theme-border)',
      }}
    >
      <header className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <HugeiconsIcon
              icon={Plug01Icon}
              size={16}
              strokeWidth={1.6}
              style={{ color: 'var(--theme-accent)' }}
            />
            <h3
              className="text-sm font-semibold tracking-tight"
              style={{ color: 'var(--theme-text)' }}
            >
              Connect your stack
            </h3>
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-medium"
              style={{
                background: 'var(--theme-accent-subtle)',
                color: 'var(--theme-accent)',
              }}
            >
              {connectedCount} / {total} connected
            </span>
          </div>
          <p className="mt-1 text-xs" style={{ color: 'var(--theme-muted)' }}>
            One-click integrations — Hermes works directly inside the tools your team already uses.
          </p>
        </div>
        <Link
          to="/mcp"
          className="inline-flex items-center gap-1 self-start text-xs font-medium sm:self-end"
          style={{ color: 'var(--theme-accent)' }}
        >
          Browse all integrations <HugeiconsIcon icon={ArrowRight01Icon} size={11} strokeWidth={2} />
        </Link>
      </header>

      <div className="mb-3 flex flex-wrap gap-1.5">
        {CATEGORIES.map((c) => {
          const active = filter === c.id
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setFilter(c.id)}
              className="rounded-full px-2.5 py-1 text-[11px] font-medium transition"
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

      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((c) => (
          <ConnectorCard
            key={c.id}
            connector={c}
            connected={connected.has(c.id)}
            onToggle={() => toggle(c.id)}
          />
        ))}
      </div>
    </section>
  )
}

function ConnectorCard({
  connector,
  connected,
  onToggle,
}: {
  connector: BusinessConnector
  connected: boolean
  onToggle: () => void
}) {
  const [expanded, setExpanded] = useState(false)
  const navigate = useNavigate()

  function runExample(example: string) {
    navigate({ to: '/chat' }).then(() => {
      const detail: ChatRunCommandDetail = { command: example }
      window.dispatchEvent(new CustomEvent(CHAT_RUN_COMMAND_EVENT, { detail }))
    })
  }

  return (
    <div
      className="flex flex-col gap-2 rounded-xl p-3.5"
      style={{
        background: connected ? 'var(--theme-card2)' : 'var(--theme-card)',
        border: '1px solid',
        borderColor: connected ? 'var(--theme-accent-border)' : 'var(--theme-border)',
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2.5">
          <div
            className="flex size-9 shrink-0 items-center justify-center rounded-md text-[13px] font-bold text-white"
            style={{ background: connector.accent }}
            aria-hidden
          >
            {connector.glyph}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span
                className="text-sm font-semibold"
                style={{ color: 'var(--theme-text)' }}
              >
                {connector.name}
              </span>
              {connected && (
                <HugeiconsIcon
                  icon={CheckmarkCircle02Icon}
                  size={12}
                  strokeWidth={2}
                  style={{ color: 'var(--theme-success)' }}
                />
              )}
              {connector.comingSoon && (
                <span
                  className="rounded-full px-1.5 py-0.5 text-[9px] uppercase tracking-wider"
                  style={{
                    background: 'var(--theme-card2)',
                    border: '1px solid var(--theme-border)',
                    color: 'var(--theme-muted)',
                  }}
                >
                  soon
                </span>
              )}
            </div>
            <p className="mt-0.5 text-[11px] leading-snug" style={{ color: 'var(--theme-muted)' }}>
              {connector.short}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onToggle}
          disabled={connector.comingSoon}
          className="shrink-0 rounded-md px-2.5 py-1 text-[11px] font-semibold transition"
          style={{
            background: connected ? 'var(--theme-card)' : 'var(--theme-accent)',
            color: connected ? 'var(--theme-text)' : '#02110F',
            border: '1px solid',
            borderColor: connected ? 'var(--theme-border)' : 'var(--theme-accent)',
            cursor: connector.comingSoon ? 'not-allowed' : 'pointer',
            opacity: connector.comingSoon ? 0.6 : 1,
          }}
        >
          {connected ? 'Connected' : 'Connect'}
        </button>
      </div>

      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="text-left text-[11px] font-medium transition"
        style={{ color: 'var(--theme-accent)' }}
      >
        {expanded ? '− Hide examples' : '+ What Hermes can do'}
      </button>

      {expanded && (
        <ul className="mt-1 flex flex-col gap-1.5">
          {connector.examples.map((ex) => (
            <li key={ex}>
              <button
                type="button"
                onClick={() => runExample(ex)}
                className="w-full rounded-md p-2 text-left text-[11px] leading-snug transition"
                style={{
                  background: 'var(--theme-panel)',
                  border: '1px solid var(--theme-border-subtle)',
                  color: 'var(--theme-text)',
                }}
                title="Try this in chat"
              >
                <span style={{ color: 'var(--theme-accent)' }}>→</span> {ex}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
