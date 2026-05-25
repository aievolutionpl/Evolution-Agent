/**
 * Hermes installation detection.
 *
 * Inspects the local machine to answer two questions:
 *   1. Is the `hermes` CLI installed (binary on PATH or in a known location)?
 *   2. Is the hermes-agent source tree present (so we can fall back to running
 *      `python -m uvicorn webapi.app:app` directly)?
 *
 * The result is consumed by:
 *   - `/api/hermes-status` (powers onboarding + startup screen UI)
 *   - The onboarding wizard's "Verify Hermes" step
 *   - The startup screen's failure state
 *
 * Detection is intentionally cheap (filesystem only — no spawned subprocesses
 * unless `withVersion: true`). The version probe shells out to `hermes
 * --version` with a short timeout and is skipped on Windows-native installs.
 */

import { exec } from 'node:child_process'
import { existsSync } from 'node:fs'
import { homedir, platform as osPlatform } from 'node:os'
import { resolve } from 'node:path'
import { promisify } from 'node:util'
import {
  isClaudeAgentHealthy,
  resolveClaudeAgentDir,
  resolveClaudeBinary,
} from './claude-agent'

const execAsync = promisify(exec)

const VERSION_TIMEOUT_MS = 2_000

export type HermesPlatform = 'macos' | 'windows' | 'linux' | 'unknown'

export type HermesInstallStatus = {
  /** True when either the `hermes` binary or the hermes-agent source dir is present. */
  installed: boolean
  /** True when the gateway is currently responding on its health endpoint. */
  running: boolean
  /** True when the binary is installed but the gateway is not running — we
   *  can offer a one-click "Start Hermes" action. */
  startable: boolean
  /** Resolved location of the `hermes` CLI, if any. */
  binaryPath: string | null
  /** Resolved hermes-agent source tree, if any. */
  agentDir: string | null
  /** Detected platform — used to show the right install command. */
  platform: HermesPlatform
  /** Output of `hermes --version` when withVersion is true, otherwise null. */
  version: string | null
  /** OS-appropriate setup instructions. */
  install: HermesInstallInstructions
}

export type HermesInstallInstructions = {
  /** Human-readable summary ("macOS / Linux installer"). */
  label: string
  /** A single copy-pasteable shell command. */
  command: string
  /** Friendly short description of what the command does. */
  description: string
  /** True when we can not auto-install from the workspace (Windows native). */
  manualOnly: boolean
  /** URL of full docs / download page. */
  docsUrl: string
  /** Extra steps shown after the primary command (e.g. WSL prep on Windows). */
  prerequisites?: Array<{ title: string; command: string; note?: string }>
}

const INSTALL_SH_URL = 'https://raw.githubusercontent.com/outsourc-e/hermes-workspace/main/install.sh'
const INSTALL_PS1_URL = 'https://raw.githubusercontent.com/outsourc-e/hermes-workspace/main/scripts/install.ps1'
const DOCS_URL = 'https://github.com/outsourc-e/hermes-workspace#install'

export function detectHermesPlatform(): HermesPlatform {
  const p = osPlatform()
  if (p === 'darwin') return 'macos'
  if (p === 'win32') return 'windows'
  if (p === 'linux') return 'linux'
  return 'unknown'
}

export function getInstallInstructions(
  platform: HermesPlatform,
): HermesInstallInstructions {
  if (platform === 'windows') {
    return {
      label: 'Windows installer',
      command: `powershell -ExecutionPolicy Bypass -Command "iwr ${INSTALL_PS1_URL} -UseBasicParsing | iex"`,
      description:
        'Runs the PowerShell installer. It will install WSL + Ubuntu if needed, then install hermes-agent inside WSL.',
      manualOnly: true,
      docsUrl: DOCS_URL,
      prerequisites: [
        {
          title: 'Enable WSL (one-time, if not already installed)',
          command: 'wsl --install -d Ubuntu',
          note: 'Reboot when prompted. WSL hosts the Python-based hermes-agent runtime.',
        },
      ],
    }
  }

  if (platform === 'macos') {
    return {
      label: 'macOS installer',
      command: `curl -fsSL ${INSTALL_SH_URL} | bash`,
      description:
        'Installs hermes-agent via the official upstream installer, clones the workspace, and registers a LaunchAgent so the gateway autostarts on login.',
      manualOnly: false,
      docsUrl: DOCS_URL,
    }
  }

  if (platform === 'linux') {
    return {
      label: 'Linux installer',
      command: `curl -fsSL ${INSTALL_SH_URL} | bash`,
      description:
        'Installs hermes-agent and the workspace under ~/hermes-workspace. Re-running it is safe.',
      manualOnly: false,
      docsUrl: DOCS_URL,
    }
  }

  return {
    label: 'Manual install',
    command: `curl -fsSL ${INSTALL_SH_URL} | bash`,
    description: 'See the docs for platform-specific guidance.',
    manualOnly: true,
    docsUrl: DOCS_URL,
  }
}

/**
 * Probe the version with a short timeout. Returns null if the binary is not
 * present, errors out, or doesn't respond in time.
 */
async function probeHermesVersion(binary: string): Promise<string | null> {
  try {
    const { stdout } = await execAsync(`"${binary}" --version`, {
      timeout: VERSION_TIMEOUT_MS,
    })
    const trimmed = stdout.trim()
    if (!trimmed) return null
    // `hermes --version` outputs e.g. "hermes-agent 0.10.2". Take the last
    // whitespace-separated token if it looks like a semver-ish value.
    const lastToken = trimmed.split(/\s+/).pop() ?? trimmed
    return /^\d/.test(lastToken) ? lastToken : trimmed
  } catch {
    return null
  }
}

/**
 * Detect Hermes installation + run state.
 *
 * `withVersion` controls whether we shell out to read `hermes --version`. The
 * status endpoint always asks for the version; lighter callers can skip it.
 */
export async function detectHermes(
  options: { withVersion?: boolean } = {},
): Promise<HermesInstallStatus> {
  const platform = detectHermesPlatform()
  const binaryPath = resolveClaudeBinary()
  const agentDir = resolveClaudeAgentDir()
  const installed = Boolean(binaryPath) || Boolean(agentDir)

  // Also accept a binary on PATH that we couldn't find via the known paths —
  // e.g. installed via brew. existsSync handles that for the standard
  // install locations; `which hermes` would catch others but adds another
  // subprocess. Skip for now — covered by the version probe below.

  const running = await isClaudeAgentHealthy()

  let version: string | null = null
  if (options.withVersion && binaryPath) {
    version = await probeHermesVersion(binaryPath)
  }

  return {
    installed,
    running,
    startable: installed && !running,
    binaryPath,
    agentDir,
    platform,
    version,
    install: getInstallInstructions(platform),
  }
}

/**
 * Like `detectHermes` but never shells out — useful for tight loops or
 * polling. The version field is always null.
 */
export async function detectHermesQuick(): Promise<HermesInstallStatus> {
  return detectHermes({ withVersion: false })
}

/** Exposed for tests. */
export const __INTERNAL = {
  INSTALL_SH_URL,
  INSTALL_PS1_URL,
  DOCS_URL,
  homedir,
  resolve,
  existsSync,
}
