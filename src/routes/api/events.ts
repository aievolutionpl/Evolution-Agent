import { createFileRoute } from '@tanstack/react-router'
import {
  ensureBusStarted,
  subscribeToChatEvents,
} from '../../server/chat-event-bus'

const MAX_EVENT_BYTES = 128 * 1024
const FLUSH_INTERVAL_MS = 75
const MAX_BUFFERED_EVENTS = 250

export const Route = createFileRoute('/api/events')({
  server: {
    handlers: {
      GET: async () => {
        await ensureBusStarted()

        const encoder = new TextEncoder()
        let unsubscribe: (() => void) | null = null
        let keepaliveInterval: ReturnType<typeof setInterval> | null = null
        let flushInterval: ReturnType<typeof setInterval> | null = null
        const queue: Array<Uint8Array> = []

        const pushChunk = (line: string) => {
          const encoded = encoder.encode(line)
          if (encoded.byteLength > MAX_EVENT_BYTES) {
            const overflowPayload = encoder.encode(
              `event: warning\ndata: ${JSON.stringify({ code: 'payload_too_large', size: encoded.byteLength, max: MAX_EVENT_BYTES })}\n\n`,
            )
            queue.push(overflowPayload)
            return
          }
          if (queue.length >= MAX_BUFFERED_EVENTS) {
            queue.shift()
          }
          queue.push(encoded)
        }

        const stream = new ReadableStream({
          start(controller) {
            // Send connected event immediately
            pushChunk(
              `retry: 3000\nevent: connected\ndata: ${JSON.stringify({ ts: Date.now(), reconnect: { strategy: 'exp-backoff', baseMs: 3000, maxMs: 30000 } })}\n\n`,
            )

            // Subscribe to chat event bus
            unsubscribe = subscribeToChatEvents((event) => {
              try {
                pushChunk(
                  `event: ${event.event}\ndata: ${JSON.stringify(event.data)}\n\n`,
                )
              } catch {
                // Stream closed
              }
            })

            flushInterval = setInterval(() => {
              try {
                while (queue.length > 0) {
                  controller.enqueue(queue.shift()!)
                }
              } catch {
                // stream closed
              }
            }, FLUSH_INTERVAL_MS)

            // Keepalive every 15s
            keepaliveInterval = setInterval(() => {
              try {
                controller.enqueue(encoder.encode(`: keepalive\n\n`))
              } catch {
                // Stream closed
              }
            }, 15_000)
          },
          cancel() {
            if (unsubscribe) unsubscribe()
            if (keepaliveInterval) clearInterval(keepaliveInterval)
            if (flushInterval) clearInterval(flushInterval)
          },
        })

        return new Response(stream, {
          status: 200,
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache, no-store',
            Connection: 'keep-alive',
            'X-Accel-Buffering': 'no',
          },
        })
      },
    },
  },
})
