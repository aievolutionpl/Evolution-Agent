# Hermes Workspace — Windows installer
#
# Usage (run in a PowerShell as Administrator for first-time WSL install,
# otherwise a normal PowerShell window is fine):
#
#   iwr https://raw.githubusercontent.com/outsourc-e/hermes-workspace/main/scripts/install.ps1 -UseBasicParsing | iex
#
# What it does:
#   1. Verifies WSL + a default Linux distro is available (offers to install
#      Ubuntu via `wsl --install -d Ubuntu` if not).
#   2. Forwards the install to the canonical bash installer running inside
#      WSL. The Python-based hermes-agent runtime lives there.
#   3. Adds a Start Menu shortcut + scheduled task entry that launches the
#      workspace UI on user login.
#
# Re-runnable: skips anything already configured.

[CmdletBinding()]
param(
  [string]$Distro = 'Ubuntu',
  [string]$InstallSh = 'https://raw.githubusercontent.com/outsourc-e/hermes-workspace/main/install.sh',
  [switch]$NoStartup
)

$ErrorActionPreference = 'Stop'

function Write-Banner {
  Write-Host ''
  Write-Host '   +--------------------------------------------+' -ForegroundColor Cyan
  Write-Host '   |  HERMES WORKSPACE - Windows installer      |' -ForegroundColor Cyan
  Write-Host '   |  outsourc-e/hermes-workspace               |' -ForegroundColor Cyan
  Write-Host '   +--------------------------------------------+' -ForegroundColor Cyan
  Write-Host ''
}

function Write-Cyan ($msg)   { Write-Host $msg -ForegroundColor Cyan }
function Write-Green ($msg)  { Write-Host $msg -ForegroundColor Green }
function Write-Yellow ($msg) { Write-Host $msg -ForegroundColor Yellow }
function Write-Red ($msg)    { Write-Host $msg -ForegroundColor Red }

function Test-CommandExists ($name) {
  try {
    $null = Get-Command $name -ErrorAction Stop
    return $true
  } catch {
    return $false
  }
}

function Test-WslReady {
  if (-not (Test-CommandExists 'wsl.exe')) { return $false }
  try {
    $output = & wsl.exe -l -q 2>$null
    if ($LASTEXITCODE -ne 0) { return $false }
    $distros = @($output | ForEach-Object { ($_ -replace "`0", '').Trim() } | Where-Object { $_ })
    return ($distros.Count -gt 0)
  } catch {
    return $false
  }
}

function Invoke-WslBash ($command) {
  & wsl.exe -d $Distro -- bash -lc $command
  if ($LASTEXITCODE -ne 0) {
    throw "WSL command failed (exit $LASTEXITCODE): $command"
  }
}

# ---------------------------------------------------------------------------

Write-Banner
Write-Cyan '-> Checking prerequisites...'

if (-not (Test-WslReady)) {
  Write-Yellow '  WSL is not configured yet. The hermes-agent runtime is Python-based and runs inside WSL on Windows.'
  Write-Yellow ''
  Write-Yellow '  Run this once (in an Administrator PowerShell), then re-run this installer:'
  Write-Host  '      wsl --install -d Ubuntu' -ForegroundColor White
  Write-Yellow ''
  Write-Yellow '  After the reboot Windows prompts for, finish the Ubuntu first-run (set username + password), then re-run:'
  Write-Host  "      iwr $InstallSh -UseBasicParsing | iex" -ForegroundColor White
  Write-Yellow ''
  exit 1
}
Write-Green ('  WSL ready (distro: {0}) OK' -f $Distro)

# Forward the install to the bash installer inside WSL. It handles Node, git,
# pnpm, hermes-agent, and the workspace clone in a single re-runnable step.
Write-Cyan ('-> Running the canonical installer inside WSL ({0})...' -f $Distro)
$cmd = "curl -fsSL '$InstallSh' | bash"
try {
  Invoke-WslBash $cmd
} catch {
  Write-Red ('  Installer failed inside WSL: {0}' -f $_)
  Write-Yellow '  You can run it manually:'
  Write-Host  ("      wsl -d {0} -- bash -lc `"{1}`"" -f $Distro, $cmd) -ForegroundColor White
  exit 1
}
Write-Green '  hermes-agent + workspace installed inside WSL OK'

# ---------------------------------------------------------------------------
# Start Menu shortcut + (optional) Windows-side autostart that forwards into
# the WSL tmux session created by scripts/start-hermes-workspace.ps1.

if (-not $NoStartup) {
  Write-Cyan '-> Wiring Windows-side autostart shortcut...'

  $scriptInWsl = '~/hermes-workspace/scripts/start-hermes-workspace.ps1'
  $workspaceUrl = 'http://localhost:3000'

  $startupDir = [Environment]::GetFolderPath('Startup')
  $shortcutPath = Join-Path $startupDir 'Hermes Evolution Agent.lnk'

  $launcher = Join-Path $env:LOCALAPPDATA 'HermesWorkspace\launch.ps1'
  New-Item -ItemType Directory -Path (Split-Path $launcher) -Force | Out-Null
  @"
Set-Location $PSHOME
Start-Process pwsh -ArgumentList '-NoLogo','-NoProfile','-File','`"$($PSScriptRoot)\..\..\..\hermes-workspace\scripts\start-hermes-workspace.ps1`"','-Distro','$Distro' -WindowStyle Hidden
Start-Process '$workspaceUrl'
"@ | Set-Content -Path $launcher -Encoding UTF8

  $wshShell = New-Object -ComObject WScript.Shell
  $shortcut = $wshShell.CreateShortcut($shortcutPath)
  $shortcut.TargetPath = (Get-Command pwsh -ErrorAction SilentlyContinue)?.Source
  if (-not $shortcut.TargetPath) {
    $shortcut.TargetPath = "$env:WINDIR\System32\WindowsPowerShell\v1.0\powershell.exe"
  }
  $shortcut.Arguments = "-NoLogo -NoProfile -File `"$launcher`""
  $shortcut.IconLocation = "$env:WINDIR\System32\shell32.dll,13"
  $shortcut.WorkingDirectory = (Split-Path $launcher)
  $shortcut.Description = 'Launch Hermes Evolution Agent (Workspace UI on http://localhost:3000)'
  $shortcut.Save()

  Write-Green ('  Startup shortcut: {0} OK' -f $shortcutPath)
}

# ---------------------------------------------------------------------------

Write-Host ''
Write-Host '============================================' -ForegroundColor White
Write-Green '  Install complete!'
Write-Host '============================================' -ForegroundColor White
Write-Host ''
Write-Host 'Next steps:'
Write-Host ('  1) Open WSL ({0}) and start the gateway + workspace:' -f $Distro)
Write-Host  '       wsl -d ' $Distro ' -- bash -lc ''cd ~/hermes-workspace && pnpm start:all''' -ForegroundColor White
Write-Host  '  2) Open http://localhost:3000 in your browser.'
Write-Host ''
Write-Cyan 'Happy building.'
