/**
 * `/api/hermes-status` — report Hermes installation and run state.
 *
 * Powers the onboarding wizard's verification step and the connection
 * startup screen. Returns a snapshot of:
 *   - Whether hermes-agent is installed locally
 *   - Whether the gateway is currently running
 *   - The detected platform
 *   - Version (when readable)
 *   - Platform-appropriate install instructions
 *
 * Cached for 2 seconds to absorb the polling the UI does while the user
 * watches the install/start finish.
 */
import { createFileRoute } from '@tanstack/react-router'
import { json } from '@tanstack/react-start'
import { requireLocalOrAuth } from '../../server/auth-middleware'
import {  detectHermes } from '../../server/hermes-detect'
import type {HermesInstallStatus} from '../../server/hermes-detect';

const CACHE_TTL_MS = 2_000
let cachedAt = 0
let cached: HermesInstallStatus | null = null

async function getStatus(force: boolean): Promise<HermesInstallStatus> {
  const now = Date.now()
  if (!force && cached && now - cachedAt < CACHE_TTL_MS) return cached
  const status = await detectHermes({ withVersion: true })
  cached = status
  cachedAt = now
  return status
}

export const Route = createFileRoute('/api/hermes-status')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        if (!requireLocalOrAuth(request)) {
          return json({ error: 'Unauthorized' }, { status: 401 })
        }
        const url = new URL(request.url)
        const force = url.searchParams.get('force') === '1'
        const status = await getStatus(force)
        return json(status)
      },
    },
  },
})
