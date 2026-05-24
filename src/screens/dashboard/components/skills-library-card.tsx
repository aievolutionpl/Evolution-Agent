import { HugeiconsIcon } from '@hugeicons/react'
import {
  Add01Icon,
  ArrowRight01Icon,
  Edit02Icon,
  PuzzleIcon,
  Search01Icon,
} from '@hugeicons/core-free-icons'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import type { DashboardOverview } from '@/server/dashboard-aggregator'
import { formatSkillName } from '@/screens/dashboard/lib/formatters'

type SkillRow = {
  id: string
  name: string
  category: string
  description: string
  enabled: boolean
}

/**
 * Browsable skills library card for the dashboard side rail.
 *
 * Replaces the older `SkillsUsageCard` with a denser view that surfaces:
 *   - a live filter input,
 *   - up to 6 skill rows with name + category,
 *   - inline "edit" affordance per row (jumps to /skills?focus=<id>),
 *   - explicit "+ Add new" and "Browse all" footer actions.
 *
 * Source: `/api/skills?tab=installed&limit=200&summary=search`.
 */
export function SkillsLibraryCard({
  usage,
  onOpen,
}: {
  usage: DashboardOverview['skillsUsage']
  onOpen: () => void
}) {
  const navigate = useNavigate()
  const [filter, setFilter] = useState('')

  const skillsQuery = useQuery({
    queryKey: ['dashboard', 'skills-library'],
    queryFn: async () => {
      const res = await fetch(
        '/api/skills?tab=installed&limit=200&summary=search',
      )
      if (!res.ok) return [] as Array<SkillRow>
      const data = (await res.json()) as {
        skills?: Array<Record<string, unknown>>
      }
      return (data.skills ?? []).map((s) => ({
        id: String(s.id ?? s.slug ?? s.name ?? ''),
        name: String(s.name ?? s.id ?? ''),
        category: String(s.category ?? 'general'),
        description: String(s.description ?? ''),
        enabled: s.enabled !== false,
      }))
    },
    staleTime: 30_000,
  })

  const skills = skillsQuery.data ?? []
  const installed = skills.length
  const enabled = skills.filter((s) => s.enabled).length
  const used = usage?.distinctSkills ?? 0

  const visible = useMemo(() => {
    const needle = filter.trim().toLowerCase()
    const ranked = needle
      ? skills.filter(
          (s) =>
            s.name.toLowerCase().includes(needle) ||
            s.category.toLowerCase().includes(needle) ||
            s.description.toLowerCase().includes(needle),
        )
      : [...skills].sort((a, b) => {
          if (a.enabled !== b.enabled) return a.enabled ? -1 : 1
          return a.name.localeCompare(b.name)
        })
    return ranked.slice(0, 6)
  }, [skills, filter])

  const openLibrary = () => {
    onOpen()
    navigate({ to: '/skills' })
  }

  const openEditor = (id: string) => {
    onOpen()
    navigate({ to: '/skills', search: { focus: id } as never })
  }

  return (
    <div
      className="group relative flex w-full flex-col gap-2 overflow-hidden rounded-xl border px-3 py-2.5"
      style={{
        background:
          'linear-gradient(150deg, color-mix(in srgb, var(--theme-card) 96%, transparent), color-mix(in srgb, var(--theme-card) 90%, transparent))',
        borderColor: 'var(--theme-border)',
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[2px]"
        style={{
          background:
            'linear-gradient(90deg, var(--theme-warning), color-mix(in srgb, var(--theme-warning) 40%, transparent), transparent)',
        }}
      />

      {/* header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <HugeiconsIcon
            icon={PuzzleIcon}
            size={12}
            color="var(--theme-warning)"
            strokeWidth={2}
          />
          <h3
            className="text-[10px] font-semibold uppercase tracking-[0.18em]"
            style={{ color: 'var(--theme-text)' }}
          >
            Skills library
          </h3>
        </div>
        <button
          type="button"
          onClick={openLibrary}
          className="inline-flex items-center gap-0.5 font-mono text-[9px] uppercase tracking-[0.15em] transition-colors hover:text-[var(--theme-accent)]"
          style={{ color: 'var(--theme-muted)' }}
        >
          browse all
          <HugeiconsIcon icon={ArrowRight01Icon} size={10} strokeWidth={2} />
        </button>
      </div>

      {/* counters strip */}
      <div
        className="flex items-baseline gap-2 font-mono text-[10px] uppercase tracking-[0.12em]"
        style={{ color: 'var(--theme-muted)' }}
      >
        <span
          className="text-[18px] font-bold tabular-nums leading-none"
          style={{ color: 'var(--theme-text)' }}
        >
          {installed}
        </span>
        <span>installed</span>
        <span aria-hidden>·</span>
        <span style={{ color: 'var(--theme-success)' }}>{enabled}</span>
        <span>on</span>
        {used > 0 ? (
          <>
            <span aria-hidden>·</span>
            <span style={{ color: 'var(--theme-accent)' }}>{used}</span>
            <span>used</span>
          </>
        ) : null}
      </div>

      {/* filter */}
      <label
        className="flex items-center gap-1.5 rounded-md border px-2 py-1.5"
        style={{
          background: 'color-mix(in srgb, var(--theme-card) 80%, transparent)',
          borderColor: 'var(--theme-border)',
        }}
      >
        <HugeiconsIcon
          icon={Search01Icon}
          size={11}
          color="var(--theme-muted)"
          strokeWidth={2}
        />
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter skills…"
          className="w-full bg-transparent font-mono text-[11px] outline-none placeholder:opacity-60"
          style={{ color: 'var(--theme-text)' }}
        />
      </label>

      {/* list */}
      {skillsQuery.isLoading ? (
        <div
          className="font-mono text-[11px] uppercase tracking-[0.12em]"
          style={{ color: 'var(--theme-muted)' }}
        >
          loading skills…
        </div>
      ) : visible.length === 0 ? (
        <div
          className="font-mono text-[11px] uppercase tracking-[0.12em]"
          style={{ color: 'var(--theme-muted)' }}
        >
          {filter
            ? `no skills match "${filter}"`
            : installed === 0
              ? 'no skills installed yet'
              : 'nothing to show'}
        </div>
      ) : (
        <ul className="flex flex-col gap-1">
          {visible.map((skill) => (
            <li
              key={skill.id || skill.name}
              className="group/row flex items-center justify-between gap-2 rounded-md px-1.5 py-1 transition-colors hover:bg-[color-mix(in_srgb,var(--theme-card)_70%,transparent)]"
            >
              <button
                type="button"
                onClick={() => openEditor(skill.id || skill.name)}
                className="flex min-w-0 flex-1 flex-col items-start gap-0.5 text-left"
              >
                <div className="flex w-full items-center gap-1.5">
                  <span
                    aria-hidden
                    className="inline-block size-1.5 shrink-0 rounded-full"
                    style={{
                      background: skill.enabled
                        ? 'var(--theme-success)'
                        : 'var(--theme-muted)',
                    }}
                  />
                  <span
                    className="truncate font-mono text-[11px]"
                    style={{ color: 'var(--theme-text)' }}
                    title={skill.name}
                  >
                    {formatSkillName(skill.name)}
                  </span>
                </div>
                <span
                  className="truncate font-mono text-[9px] uppercase tracking-[0.12em]"
                  style={{ color: 'var(--theme-muted)' }}
                >
                  {skill.category}
                </span>
              </button>
              <button
                type="button"
                onClick={() => openEditor(skill.id || skill.name)}
                aria-label={`Edit ${skill.name}`}
                className="inline-flex shrink-0 items-center gap-1 rounded-md border px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] opacity-0 transition-opacity hover:text-[var(--theme-accent)] group-hover/row:opacity-100"
                style={{
                  borderColor: 'var(--theme-border)',
                  color: 'var(--theme-muted)',
                }}
              >
                <HugeiconsIcon
                  icon={Edit02Icon}
                  size={10}
                  strokeWidth={2}
                />
                edit
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* footer actions */}
      <div className="mt-1 flex items-center gap-1.5">
        <button
          type="button"
          onClick={openLibrary}
          className="inline-flex flex-1 items-center justify-center gap-1 rounded-md border px-2 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] transition-all hover:scale-[1.01] hover:text-[var(--theme-accent)]"
          style={{
            borderColor: 'var(--theme-accent-border, var(--theme-border))',
            color: 'var(--theme-accent)',
            background:
              'color-mix(in srgb, var(--theme-accent) 8%, transparent)',
          }}
        >
          <HugeiconsIcon icon={Add01Icon} size={11} strokeWidth={2.5} />
          Add new
        </button>
        <button
          type="button"
          onClick={openLibrary}
          className="inline-flex flex-1 items-center justify-center gap-1 rounded-md border px-2 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors hover:text-[var(--theme-text)]"
          style={{
            borderColor: 'var(--theme-border)',
            color: 'var(--theme-muted)',
          }}
        >
          View all
          <HugeiconsIcon icon={ArrowRight01Icon} size={10} strokeWidth={2} />
        </button>
      </div>
    </div>
  )
}
