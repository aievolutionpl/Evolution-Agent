import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { AuthStatus } from '@/lib/claude-auth'
import type { HermesInstallStatus } from '@/lib/hermes-status-types'
import { writeTextToClipboard } from '@/lib/clipboard'
import { fetchClaudeAuthStatus } from '@/lib/claude-auth'
import { cn } from '@/lib/utils'

const POLL_INTERVAL_INITIAL_MS = 1_000
const POLL_INTERVAL_MAX_MS = 8_000
const FAILURE_REVEAL_MS = 5_000
// Fire one silent auto-start attempt this many ms after we still can't connect.
const AUTO_START_DELAY_MS = 4_000

type ClientPlatform = 'macos' | 'windows' | 'linux' | 'unknown'

function detectClientPlatform(): ClientPlatform {
  if (typeof navigator === 'undefined') return 'unknown'
  const ua = navigator.userAgent.toLowerCase()
  if (ua.includes('win')) return 'windows'
  if (ua.includes('mac')) return 'macos'
  if (ua.includes('linux')) return 'linux'
  return 'unknown'
}

type SetupStep = { title: string; command: string; note?: string }

function getFallbackSteps(platform: ClientPlatform): Array<SetupStep> {
  if (platform === 'windows') {
    return [
      {
        title: '1. Install or update WSL (one-time)',
        command: 'wsl --install -d Ubuntu',
        note: 'Run in an Administrator PowerShell. Reboot when prompted, then finish the Ubuntu first-run.',
      },
      {
        title: '2. Run the Windows installer',
        command:
          'iwr https://raw.githubusercontent.com/outsourc-e/hermes-workspace/main/scripts/install.ps1 -UseBasicParsing | iex',
        note: 'Installs hermes-agent inside WSL and adds a startup shortcut.',
      },
      {
        title: '3. Start the workspace',
        command: 'wsl -d Ubuntu -- bash -lc "cd ~/hermes-workspace && pnpm start:all"',
        note: 'Boots the gateway + UI together.',
      },
    ]
  }

  if (platform === 'macos') {
    return [
      {
        title: '1. Run the macOS installer',
        command:
          'curl -fsSL https://raw.githubusercontent.com/outsourc-e/hermes-workspace/main/install.sh | bash',
        note: 'Installs hermes-agent via the official installer and registers a LaunchAgent.',
      },
      {
        title: '2. Start the gateway',
        command: 'hermes gateway run',
        note: 'Already running after the installer if the LaunchAgent loaded.',
      },
      {
        title: '3. Open the workspace',
        command: 'cd ~/hermes-workspace && pnpm dev',
      },
    ]
  }

  return [
    {
      title: '1. Run the Linux installer',
      command:
        'curl -fsSL https://raw.githubusercontent.com/outsourc-e/hermes-workspace/main/install.sh | bash',
      note: 'Installs hermes-agent + clones the workspace under ~/hermes-workspace. Re-runnable.',
    },
    {
      title: '2. Start the gateway',
      command: 'hermes gateway run',
    },
    {
      title: '3. Open the workspace',
      command: 'cd ~/hermes-workspace && pnpm dev',
    },
  ]
}

type Props = { onConnected: (status: AuthStatus) => void }

declare global {
  interface Window {
    __dismissSplash?: () => void
  }
}

type Phase = 'connecting' | 'installing-detect' | 'no-hermes' | 'hermes-stopped' | 'unknown-failure'

export function ConnectionStartupScreen({ onConnected }: Props) {
  const [showFailureState, setShowFailureState] = useState(false)
  const [phase, setPhase] = useState<Phase>('connecting')
  const [serverStarting, setServerStarting] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [serverLog, setServerLog] = useState<Array<string>>([])
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null)
  const [showManual, setShowManual] = useState(false)
  const [hermesStatus, setHermesStatus] = useState<HermesInstallStatus | null>(null)
  const [elapsedSec, setElapsedSec] = useState(0)

  const platform = useRef<ClientPlatform>(detectClientPlatform())
  const fallbackSteps = useMemo(
    () => getFallbackSteps(platform.current),
    [],
  )
  // Server-detected platform overrides the UA-based guess once /api/hermes-status responds.
  const serverPlatform = hermesStatus?.platform ?? platform.current
  const platformSteps = useMemo(
    () => getFallbackSteps(serverPlatform),
    [serverPlatform],
  )

  const onConnectedRef = useRef(onConnected)
  useEffect(() => {
    onConnectedRef.current = onConnected
  }, [onConnected])

  const isDone = useRef(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const dismiss = window.__dismissSplash
    if (!dismiss) return
    const timer = setTimeout(() => dismiss(), 60)
    return () => clearTimeout(timer)
  }, [])

  // Tick a seconds counter for the connecting state so users have a sense of
  // progress while the gateway boots.
  useEffect(() => {
    if (showFailureState) return
    const start = Date.now()
    const tick = setInterval(() => {
      setElapsedSec(Math.floor((Date.now() - start) / 1000))
    }, 1000)
    return () => clearInterval(tick)
  }, [showFailureState])

  const refreshHermesStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/hermes-status', {
        signal: AbortSignal.timeout(3_000),
      })
      if (!res.ok) return null
      const data = (await res.json()) as HermesInstallStatus
      setHermesStatus(data)
      return data
    } catch {
      return null
    }
  }, [])

  useEffect(() => {
    isDone.current = false
    let pollTimer: ReturnType<typeof setTimeout> | null = null
    let autoStartTimer: ReturnType<typeof setTimeout> | null = null
    let autoStartFired = false

    const failureTimer = setTimeout(async () => {
      if (isDone.current) return
      setShowFailureState(true)
      setPhase('installing-detect')
      const status = await refreshHermesStatus()
      // Cleanup may have run during the await; re-check before continuing.
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (isDone.current) return
      if (!status) {
        setPhase('unknown-failure')
      } else if (!status.installed) {
        setPhase('no-hermes')
      } else if (!status.running) {
        setPhase('hermes-stopped')
      } else {
        setPhase('unknown-failure')
      }
    }, FAILURE_REVEAL_MS)

    // After a short grace period, fire /api/start-claude once silently.
    // If hermes-agent is installed and just not running, this brings it back
    // up without making the user click anything.
    const fireSilentAutoStart = async () => {
      if (autoStartFired || isDone.current) return
      autoStartFired = true
      try {
        const res = await fetch('/api/start-claude', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })
        const ct = res.headers.get('content-type') || ''
        if (!ct.includes('application/json')) return
        const data = (await res.json()) as { ok?: boolean; message?: string }
        if (res.ok && data.ok) {
          setServerLog([
            String(
              data.message ||
                'Auto-started Hermes Agent gateway — reconnecting…',
            ),
          ])
        }
      } catch {
        // silent: manual auto-start button stays available
      }
    }
    autoStartTimer = setTimeout(() => {
      void fireSilentAutoStart()
    }, AUTO_START_DELAY_MS)

    let pollDelay = POLL_INTERVAL_INITIAL_MS

    const tryConnect = async () => {
      try {
        const status = await fetchClaudeAuthStatus()
        if (isDone.current) return
        isDone.current = true
        clearTimeout(failureTimer)
        clearTimeout(autoStartTimer)
        if (pollTimer) clearTimeout(pollTimer)
        onConnectedRef.current(status)
      } catch {
        if (isDone.current) return
        // While polling, refresh the install status so the failure panel can
        // show contextual messaging the moment it appears.
        if (showFailureState) {
          void refreshHermesStatus()
        }
        pollTimer = setTimeout(tryConnect, pollDelay)
        pollDelay = Math.min(pollDelay * 2, POLL_INTERVAL_MAX_MS)
      }
    }

    void tryConnect()

    return () => {
      isDone.current = true
      if (pollTimer) clearTimeout(pollTimer)
      clearTimeout(autoStartTimer)
      clearTimeout(failureTimer)
    }
  }, [refreshHermesStatus, showFailureState])

  useEffect(() => {
    if (copiedIdx === null) return
    const timer = setTimeout(() => setCopiedIdx(null), 2_000)
    return () => clearTimeout(timer)
  }, [copiedIdx])

  const handleCopy = async (text: string, idx: number) => {
    try {
      await writeTextToClipboard(text)
      setCopiedIdx(idx)
    } catch {
      /* clipboard not available */
    }
  }

  const handleAutoStart = async () => {
    setServerStarting(true)
    setServerError(null)
    setServerLog(['Looking for hermes-agent...'])
    try {
      const res = await fetch('/api/start-claude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      const contentType = res.headers.get('content-type') || ''
      if (!contentType.includes('application/json')) {
        const msg = `Unexpected response (${res.status})`
        setServerLog([`Error: ${msg}`])
        setServerError(msg)
        setServerStarting(false)
        return
      }

      const data = (await res.json()) as Record<string, unknown>
      if (res.ok && data.ok) {
        setServerLog([
          String(data.message || 'Started — waiting for connection...'),
        ])
        setServerStarting(false)
        void refreshHermesStatus()
        return
      }

      const msg = String(data.error || 'Could not find hermes-agent')
      const hint = data.hint ? String(data.hint) : ''
      setServerLog([`Error: ${msg}`])
      if (hint) setServerLog((prev) => [...prev, `Hint: ${hint}`])
      setServerError(msg)
      setServerStarting(false)
      setShowManual(true)
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      setServerLog([`Failed: ${msg}`])
      setServerError(msg)
      setServerStarting(false)
      setShowManual(true)
    }
  }

  // Pick the primary install command for the detected platform.
  const primaryInstallCommand = hermesStatus
    ? hermesStatus.install.command
    : (platformSteps[0]?.command ?? '')
  const installLabel = hermesStatus
    ? hermesStatus.install.label
    : platform.current === 'windows'
      ? 'Windows installer'
      : platform.current === 'macos'
        ? 'macOS installer'
        : platform.current === 'linux'
          ? 'Linux installer'
          : 'Manual install'

  // ─── Render ─────────────────────────────────────────────────────────────

  const showInstallCard = phase === 'no-hermes'
  const showStartCard = phase === 'hermes-stopped'

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto px-6 py-10 text-white"
      style={{
        backgroundColor: '#0A0E1A',
        backgroundImage:
          'radial-gradient(800px 600px at 50% 0%, rgba(99, 102, 241, 0.15), transparent 60%), radial-gradient(600px 500px at 50% 100%, rgba(0, 229, 255, 0.08), transparent 60%)',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      <div className="flex w-full max-w-lg flex-col items-center text-center">
        {/* Animated logo with a glow halo */}
        <div className="relative mb-5">
          <span
            aria-hidden="true"
            className="absolute inset-0 -m-3 animate-ping rounded-3xl bg-indigo-400/20"
          />
          <img
            src="/logo.png"
            alt="Evolution Agent"
            className="relative h-20 w-20 rounded-2xl object-cover shadow-[0_12px_40px_rgba(0,0,0,0.45)]"
          />
        </div>

        <h1 className="text-[2rem] font-semibold tracking-tight text-white">
          Hermes Workspace
        </h1>

        {/* Connecting — staged checklist */}
        <div
          className={cn(
            'mt-5 w-full max-w-sm transition-opacity duration-300',
            showFailureState ? 'pointer-events-none h-0 opacity-0' : 'opacity-100',
          )}
          aria-hidden={showFailureState}
        >
          <BootChecklist elapsedSec={elapsedSec} hermesStatus={hermesStatus} />
        </div>

        {/* Failure state — setup guide */}
        <div
          className={cn(
            'w-full overflow-hidden transition-all duration-500 ease-out',
            showFailureState
              ? 'mt-6 max-h-[80rem] translate-y-0 opacity-100'
              : 'max-h-0 translate-y-2 opacity-0',
          )}
        >
          <div className="w-full rounded-3xl border border-white/10 bg-white/5 p-5 text-left shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-sm">
            {/* Header changes with detected state */}
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  'mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full text-base',
                  showInstallCard
                    ? 'bg-amber-500/15 text-amber-300'
                    : showStartCard
                      ? 'bg-indigo-500/15 text-indigo-300'
                      : 'bg-white/10 text-white/70',
                )}
                aria-hidden="true"
              >
                {showInstallCard ? '⤓' : showStartCard ? '▶' : '⚠'}
              </div>
              <div>
                <p className="text-base font-medium text-white">
                  {showInstallCard
                    ? 'Hermes Agent is not installed on this machine'
                    : showStartCard
                      ? 'Hermes Agent is installed but the gateway is not running'
                      : 'Let’s connect your backend'}
                </p>
                <p className="mt-1 text-sm leading-6 text-white/60">
                  {showInstallCard
                    ? `We detected your platform as ${labelForPlatform(serverPlatform)}. The one-liner below installs everything needed.`
                    : showStartCard
                      ? 'Click “Start Hermes” to boot the gateway. The workspace will reconnect automatically.'
                      : 'Hermes Workspace works with any OpenAI-compatible backend. Hermes Agent gateway APIs unlock enhanced features automatically when they are available.'}
                </p>
                {hermesStatus?.version ? (
                  <p className="mt-1 text-xs text-white/40">
                    Detected: hermes-agent {hermesStatus.version}
                  </p>
                ) : null}
              </div>
            </div>

            {/* Primary action card */}
            <div className="mt-5">
              {showInstallCard ? (
                <PrimaryInstallCard
                  label={installLabel}
                  command={primaryInstallCommand}
                  description={hermesStatus?.install.description}
                  manualOnly={Boolean(hermesStatus?.install.manualOnly)}
                  onCopy={(text) => handleCopy(text, -1)}
                  copied={copiedIdx === -1}
                />
              ) : (
                <button
                  type="button"
                  disabled={serverStarting}
                  onClick={handleAutoStart}
                  className={cn(
                    'w-full rounded-xl px-5 py-3 text-sm font-semibold transition',
                    serverStarting
                      ? 'cursor-not-allowed bg-indigo-900/70 text-indigo-200'
                      : 'bg-indigo-500 text-white hover:bg-indigo-400',
                  )}
                >
                  {serverStarting ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white/90" />
                      Detecting...
                    </span>
                  ) : showStartCard ? (
                    'Start Hermes Agent Gateway'
                  ) : (
                    'Auto-Start Hermes Agent Gateway'
                  )}
                </button>
              )}

              {/* Server log */}
              {serverLog.length > 0 ? (
                <div
                  className={cn(
                    'mt-3 rounded-xl border p-3',
                    serverError
                      ? 'border-red-500/20 bg-red-950/30'
                      : 'border-emerald-500/20 bg-emerald-950/30',
                  )}
                >
                  <pre className="whitespace-pre-wrap font-mono text-xs leading-5 text-white/70">
                    {serverLog.join('\n')}
                  </pre>
                </div>
              ) : null}

              {/* Show prerequisites (Windows: WSL) inline */}
              {showInstallCard && hermesStatus?.install.prerequisites?.length ? (
                <div className="mt-4 space-y-3">
                  {hermesStatus.install.prerequisites.map((step, idx) => (
                    <PrerequisiteCard
                      key={`prereq-${idx}`}
                      title={step.title}
                      command={step.command}
                      note={step.note}
                      copied={copiedIdx === 100 + idx}
                      onCopy={() => handleCopy(step.command, 100 + idx)}
                    />
                  ))}
                </div>
              ) : null}
            </div>

            {/* Divider */}
            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-white/10" />
              <button
                type="button"
                onClick={() => setShowManual(!showManual)}
                className="text-xs font-medium text-white/50 transition hover:text-white/70"
              >
                {showManual ? 'Hide' : 'Show'} manual setup
              </button>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            {/* Manual setup steps */}
            <div
              className={cn(
                'overflow-hidden transition-all duration-300',
                showManual ? 'max-h-[60rem] opacity-100' : 'max-h-0 opacity-0',
              )}
            >
              <div className="space-y-4">
                {(platformSteps.length ? platformSteps : fallbackSteps).map(
                  (step, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-white/8 bg-black/20 p-4"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-xs font-bold text-indigo-300">
                            {idx + 1}
                          </span>
                          <span className="text-sm font-medium text-white/90">
                            {step.title}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy(step.command, idx)}
                          className="shrink-0 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-white/60 transition hover:bg-white/10 hover:text-white/80"
                        >
                          {copiedIdx === idx ? '✓ Copied' : 'Copy'}
                        </button>
                      </div>
                      <pre className="mt-2 overflow-x-auto rounded-lg bg-black/40 p-3 font-mono text-xs leading-5 text-white/80">
                        <code>{step.command}</code>
                      </pre>
                      {step.note ? (
                        <p className="mt-2 text-xs text-white/40">{step.note}</p>
                      ) : null}
                    </div>
                  ),
                )}
              </div>

              {/* Env var hint */}
              <div className="mt-4 rounded-xl border border-white/6 bg-white/3 p-3">
                <p className="text-xs font-medium text-white/50">
                  Or point{' '}
                  <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-white/70">
                    HERMES_API_URL
                  </code>{' '}
                  at any OpenAI-compatible backend:
                </p>
                <pre className="mt-2 overflow-x-auto font-mono text-xs text-white/60">
                  HERMES_API_URL=http://your-server:8642 pnpm dev
                </pre>
              </div>
            </div>
          </div>
        </div>

        {!showFailureState ? (
          <p className="mt-6 text-xs text-white/45">
            This page auto-refreshes when a compatible backend is detected
          </p>
        ) : (
          <button
            type="button"
            onClick={() => {
              setShowFailureState(false)
              setElapsedSec(0)
              void refreshHermesStatus()
            }}
            className="mt-4 text-xs font-medium text-white/40 underline-offset-2 transition hover:text-white/70 hover:underline"
          >
            Recheck connection
          </button>
        )}
      </div>
    </div>
  )
}

type BootStepState = 'pending' | 'active' | 'done'

function BootChecklist({
  elapsedSec,
  hermesStatus,
}: {
  elapsedSec: number
  hermesStatus: HermesInstallStatus | null
}) {
  const detected = hermesStatus !== null
  const installed = Boolean(hermesStatus?.installed)
  const running = Boolean(hermesStatus?.running)

  const steps: Array<{ label: string; state: BootStepState }> = [
    {
      label: 'Detecting Hermes installation',
      state: detected ? 'done' : elapsedSec >= 0 ? 'active' : 'pending',
    },
    {
      label: 'Reaching gateway on localhost',
      state: running ? 'done' : installed ? 'active' : 'pending',
    },
    {
      label: 'Loading capabilities & skills',
      state: 'pending',
    },
    {
      label: 'Warming up models',
      state: 'pending',
    },
  ]

  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-white/45">
          Booting workspace
        </span>
        <span className="text-[11px] text-white/35 tabular-nums">
          {elapsedSec}s
        </span>
      </div>
      <ul className="mt-3 space-y-1.5 text-sm">
        {steps.map((step, idx) => (
          <li
            key={idx}
            className={cn(
              'flex items-center gap-2.5 transition-colors',
              step.state === 'done'
                ? 'text-white/85'
                : step.state === 'active'
                  ? 'text-white/70'
                  : 'text-white/30',
            )}
          >
            <StepGlyph state={step.state} />
            <span>{step.label}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function StepGlyph({ state }: { state: BootStepState }) {
  if (state === 'done') {
    return (
      <span
        aria-hidden="true"
        className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-400/20 text-[10px] font-semibold text-emerald-300"
      >
        ✓
      </span>
    )
  }
  if (state === 'active') {
    return (
      <span
        aria-hidden="true"
        className="inline-block h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-white/15 border-t-cyan-300"
      />
    )
  }
  return (
    <span
      aria-hidden="true"
      className="inline-block h-4 w-4 shrink-0 rounded-full border border-white/10"
    />
  )
}

function labelForPlatform(p: ClientPlatform): string {
  if (p === 'macos') return 'macOS'
  if (p === 'windows') return 'Windows'
  if (p === 'linux') return 'Linux'
  return 'your operating system'
}

function PrimaryInstallCard({
  label,
  command,
  description,
  manualOnly,
  copied,
  onCopy,
}: {
  label: string
  command: string
  description?: string
  manualOnly: boolean
  copied: boolean
  onCopy: (cmd: string) => void
}) {
  return (
    <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-amber-200">{label}</p>
        <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-200">
          {manualOnly ? 'Manual' : 'One-liner'}
        </span>
      </div>
      {description ? (
        <p className="mt-1 text-xs text-white/55">{description}</p>
      ) : null}
      <div className="mt-3 flex items-start gap-2">
        <pre className="flex-1 overflow-x-auto rounded-lg bg-black/40 p-3 font-mono text-xs leading-5 text-white/85">
          <code>{command}</code>
        </pre>
        <button
          type="button"
          onClick={() => onCopy(command)}
          className="shrink-0 rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-xs font-medium text-white/80 transition hover:bg-white/20"
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
    </div>
  )
}

function PrerequisiteCard({
  title,
  command,
  note,
  copied,
  onCopy,
}: {
  title: string
  command: string
  note?: string
  copied: boolean
  onCopy: () => void
}) {
  return (
    <div className="rounded-xl border border-white/8 bg-black/20 p-3">
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs font-medium text-white/80">{title}</span>
        <button
          type="button"
          onClick={onCopy}
          className="shrink-0 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-white/60 transition hover:bg-white/10 hover:text-white/80"
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      <pre className="mt-2 overflow-x-auto rounded-lg bg-black/40 p-2.5 font-mono text-[11px] leading-5 text-white/80">
        <code>{command}</code>
      </pre>
      {note ? <p className="mt-2 text-[11px] text-white/40">{note}</p> : null}
    </div>
  )
}
