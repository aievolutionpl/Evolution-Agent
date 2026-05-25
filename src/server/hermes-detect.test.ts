import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  isClaudeAgentHealthy,
  resolveClaudeAgentDir,
  resolveClaudeBinary,
} from './claude-agent'
import {
  detectHermes,
  detectHermesPlatform,
  getInstallInstructions,
} from './hermes-detect'

vi.mock('./claude-agent', () => ({
  isClaudeAgentHealthy: vi.fn(),
  resolveClaudeAgentDir: vi.fn(),
  resolveClaudeBinary: vi.fn(),
}))

describe('detectHermesPlatform', () => {
  it('returns a known platform', () => {
    const p = detectHermesPlatform()
    expect(['macos', 'windows', 'linux', 'unknown']).toContain(p)
  })
})

describe('getInstallInstructions', () => {
  it('returns a bash curl command for macOS', () => {
    const inst = getInstallInstructions('macos')
    expect(inst.manualOnly).toBe(false)
    expect(inst.command).toMatch(/curl/)
    expect(inst.command).toMatch(/install\.sh/)
    expect(inst.docsUrl).toMatch(/^https?:/)
  })

  it('returns a bash curl command for Linux', () => {
    const inst = getInstallInstructions('linux')
    expect(inst.manualOnly).toBe(false)
    expect(inst.command).toMatch(/curl/)
    expect(inst.command).toMatch(/install\.sh/)
  })

  it('returns a PowerShell + WSL command for Windows', () => {
    const inst = getInstallInstructions('windows')
    expect(inst.manualOnly).toBe(true)
    expect(inst.command).toMatch(/powershell/i)
    expect(inst.command).toMatch(/install\.ps1/)
    expect(inst.prerequisites?.[0]?.command).toMatch(/wsl --install/)
  })

  it('returns docs+manual flag for unknown platforms', () => {
    const inst = getInstallInstructions('unknown')
    expect(inst.manualOnly).toBe(true)
    expect(inst.docsUrl).toMatch(/^https?:/)
  })
})

describe('detectHermes', () => {
  beforeEach(() => {
    vi.mocked(isClaudeAgentHealthy).mockReset()
    vi.mocked(resolveClaudeAgentDir).mockReset()
    vi.mocked(resolveClaudeBinary).mockReset()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('reports installed=false when binary and dir are missing', async () => {
    vi.mocked(resolveClaudeBinary).mockReturnValue(null)
    vi.mocked(resolveClaudeAgentDir).mockReturnValue(null)
    vi.mocked(isClaudeAgentHealthy).mockResolvedValue(false)

    const status = await detectHermes()
    expect(status.installed).toBe(false)
    expect(status.running).toBe(false)
    expect(status.startable).toBe(false)
    expect(status.binaryPath).toBeNull()
    expect(status.agentDir).toBeNull()
    expect(status.install.command).toBeTruthy()
  })

  it('reports installed=true when only the binary is found', async () => {
    vi.mocked(resolveClaudeBinary).mockReturnValue('/home/me/.claude/bin/claude')
    vi.mocked(resolveClaudeAgentDir).mockReturnValue(null)
    vi.mocked(isClaudeAgentHealthy).mockResolvedValue(false)

    const status = await detectHermes()
    expect(status.installed).toBe(true)
    expect(status.running).toBe(false)
    expect(status.startable).toBe(true)
    expect(status.binaryPath).toBe('/home/me/.claude/bin/claude')
  })

  it('reports installed=true when only the source dir is present', async () => {
    vi.mocked(resolveClaudeBinary).mockReturnValue(null)
    vi.mocked(resolveClaudeAgentDir).mockReturnValue('/home/me/hermes-agent')
    vi.mocked(isClaudeAgentHealthy).mockResolvedValue(false)

    const status = await detectHermes()
    expect(status.installed).toBe(true)
    expect(status.startable).toBe(true)
  })

  it('reports running=true and startable=false when the gateway responds', async () => {
    vi.mocked(resolveClaudeBinary).mockReturnValue('/home/me/.claude/bin/claude')
    vi.mocked(resolveClaudeAgentDir).mockReturnValue(null)
    vi.mocked(isClaudeAgentHealthy).mockResolvedValue(true)

    const status = await detectHermes()
    expect(status.installed).toBe(true)
    expect(status.running).toBe(true)
    expect(status.startable).toBe(false)
  })

  it('omits the version probe by default', async () => {
    vi.mocked(resolveClaudeBinary).mockReturnValue('/home/me/.claude/bin/claude')
    vi.mocked(resolveClaudeAgentDir).mockReturnValue(null)
    vi.mocked(isClaudeAgentHealthy).mockResolvedValue(false)

    const status = await detectHermes({ withVersion: false })
    expect(status.version).toBeNull()
  })
})
