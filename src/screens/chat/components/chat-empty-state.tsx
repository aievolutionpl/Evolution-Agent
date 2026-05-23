import { HugeiconsIcon } from '@hugeicons/react'
import {
  Analytics01Icon,
  Mail01Icon,
  Search01Icon,
  Settings02Icon,
} from '@hugeicons/core-free-icons'
import { motion } from 'motion/react'
import { useEffect, useState } from 'react'

type ProfileSummary = {
  name: string
  model?: string
  active?: boolean
}

type SuggestionChip = {
  label: string
  description: string
  prompt: string
  icon: unknown
}

// Business-focused shortcuts — AI Evolution Labs flagship workflows.
// Click a chip → composer is pre-filled with a prompt that produces a
// real deliverable on the first turn.
const SUGGESTIONS: Array<SuggestionChip> = [
  {
    label: 'Client brief / proposal',
    description: 'Draft a tailored proposal or pitch in minutes',
    prompt:
      'Draft a 1-page client proposal. Ask me 3 short questions first (industry, goal, budget band), then produce: problem framing, proposed approach (3 phases), deliverables, timeline, price band. Keep it executive, no fluff.',
    icon: Mail01Icon,
  },
  {
    label: 'Business report / analysis',
    description: 'KPIs, executive recaps, weekly reviews',
    prompt:
      'Help me produce a weekly business report. Ask which data sources I have (sheet, CRM, file). Then generate: headline KPIs, week-over-week deltas, 3 wins, 3 risks, 3 next-week priorities. Output as markdown ready to paste into Notion.',
    icon: Analytics01Icon,
  },
  {
    label: 'Workflow automation',
    description: 'Multi-step recipes — cron, MCP, integrations',
    prompt:
      'Design a workflow automation for me. Ask what manual task I want to remove (1-2 sentences). Then propose: trigger, steps, tools/MCP integrations to use, exit criteria, and how I can run it from this workspace. End with a runnable plan.',
    icon: Settings02Icon,
  },
  {
    label: 'Market intelligence',
    description: 'Competitor scan, news monitor, due diligence',
    prompt:
      'Run a competitor scan. Ask for 2-4 competitor names or URLs and my own positioning. Then deliver a teardown: positioning, pricing tier, audience, channels, top claims, content cadence, gaps I can exploit. Output as a comparison table + 5-bullet "where we win".',
    icon: Search01Icon,
  },
]

type ChatEmptyStateProps = {
  onSuggestionClick?: (prompt: string) => void
  compact?: boolean
}

export function ChatEmptyState({
  onSuggestionClick,
  compact = false,
}: ChatEmptyStateProps) {
  const [activeProfile, setActiveProfile] = useState<ProfileSummary | null>(null)

  useEffect(() => {
    fetch('/api/profiles/list')
      .then((res) => res.json())
      .then((data) => {
        const profiles = data?.profiles as Array<ProfileSummary> | undefined
        const active = profiles?.find((p) => p.active)
        if (active) setActiveProfile(active)
      })
      .catch(() => {
        // silently ignore — profile info is cosmetic
      })
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="flex h-full flex-col items-center justify-center px-4 py-8"
    >
      <div className="flex max-w-2xl flex-col items-center text-center">
        {/* AI Evolution Labs brand mark */}
        <div className="relative mb-6">
          <img
            src="/aievolutionlabs-logo.svg"
            alt="AI Evolution Labs"
            className="relative size-20 rounded-lg"
            style={{
              border: '1px solid var(--theme-accent-border)',
              padding: '6px',
              background: 'var(--theme-card)',
              boxShadow:
                '0 0 32px color-mix(in srgb, var(--theme-accent) 22%, transparent)',
            }}
          />
        </div>

        <p
          className="micro-label mb-2"
          style={{ color: 'var(--theme-accent)' }}
        >
          AI Evolution Labs · Hermes
        </p>

        <h2
          className="editorial-display text-3xl"
          style={{ color: 'var(--theme-text)' }}
        >
          Your business. Automated.
        </h2>

        {activeProfile && (
          <span className="mt-2 text-xs" style={{ color: 'var(--theme-accent-secondary)' }}>
            {activeProfile.name}
            {activeProfile.model ? ` · ${activeProfile.model}` : ''}
          </span>
        )}

        {!compact && (
          <p className="mt-3 text-sm" style={{ color: 'var(--theme-muted)' }}>
            Pick a business workflow — or just describe what you need.
          </p>
        )}

        {/* Business shortcuts — 2x2 grid on >sm, stacked on mobile */}
        <div className="mt-7 grid w-full grid-cols-1 gap-2.5 sm:grid-cols-2">
          {SUGGESTIONS.map((suggestion) => (
            <button
              key={suggestion.label}
              type="button"
              onClick={() => onSuggestionClick?.(suggestion.prompt)}
              className="group flex cursor-pointer items-start gap-3 rounded-lg p-3.5 text-left transition-all"
              style={{
                background: 'var(--theme-card)',
                border: '1px solid var(--theme-border)',
                color: 'var(--theme-text)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--theme-card2)'
                e.currentTarget.style.borderColor = 'var(--theme-accent-border)'
                e.currentTarget.style.boxShadow =
                  '0 0 18px color-mix(in srgb, var(--theme-accent) 16%, transparent)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--theme-card)'
                e.currentTarget.style.borderColor = 'var(--theme-border)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div
                className="flex size-9 shrink-0 items-center justify-center rounded-md"
                style={{
                  background: 'var(--theme-accent-subtle)',
                  border: '1px solid var(--theme-accent-border)',
                }}
              >
                <HugeiconsIcon
                  icon={suggestion.icon as any}
                  size={18}
                  strokeWidth={1.6}
                  style={{ color: 'var(--theme-accent)' }}
                />
              </div>
              <div className="flex flex-col items-start gap-0.5">
                <span
                  className="text-sm font-semibold"
                  style={{ color: 'var(--theme-text)' }}
                >
                  {suggestion.label}
                </span>
                <span
                  className="text-[11px] leading-snug"
                  style={{ color: 'var(--theme-muted)' }}
                >
                  {suggestion.description}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
