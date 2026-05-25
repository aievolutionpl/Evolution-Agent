/**
 * Client-side types for `/api/hermes-status`. Mirrors the server-side type
 * in `src/server/hermes-detect.ts`. Kept here so client components don't
 * accidentally import server-only modules (and bundle node:os, etc.).
 */

export type HermesPlatform = 'macos' | 'windows' | 'linux' | 'unknown'

export type HermesInstallInstructions = {
  label: string
  command: string
  description: string
  manualOnly: boolean
  docsUrl: string
  prerequisites?: Array<{ title: string; command: string; note?: string }>
}

export type HermesInstallStatus = {
  installed: boolean
  running: boolean
  startable: boolean
  binaryPath: string | null
  agentDir: string | null
  platform: HermesPlatform
  version: string | null
  install: HermesInstallInstructions
}
