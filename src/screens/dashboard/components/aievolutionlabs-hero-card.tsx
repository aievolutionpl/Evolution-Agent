import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowUpRight01Icon } from '@hugeicons/core-free-icons'
import { useState } from 'react'

const BRAND_URL = 'https://aievolutionlabs.io'

/**
 * Dashboard hero card — branded entrypoint that doubles as an outbound
 * link to aievolutionlabs.io.
 *
 * Image resolution order (each falls back if the previous 404s):
 *   1. /hermes-warrior.png        — user-supplied photo / artwork
 *   2. /hermes-golden-hero.svg    — gold-on-black SVG mock
 *   3. /aievolutionlabs-hero.jpg  — legacy cyan hero (if uploaded)
 *   4. /aievolutionlabs-hero.svg  — legacy SVG fallback (always present)
 */
export function AIEvolutionLabsHeroCard() {
  const sources = [
    '/hermes-warrior.png',
    '/hermes-golden-hero.svg',
    '/aievolutionlabs-hero.jpg',
    '/aievolutionlabs-hero.svg',
  ]
  const [sourceIndex, setSourceIndex] = useState(0)

  return (
    <a
      href={BRAND_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Visit AI Evolution Labs"
      className="group relative block w-full overflow-hidden rounded-2xl"
      style={{
        background: 'var(--theme-card)',
        border: '1px solid var(--theme-accent-border)',
        boxShadow:
          'var(--theme-shadow-2), 0 0 32px color-mix(in srgb, var(--theme-accent) 14%, transparent)',
      }}
    >
      <div className="relative aspect-[16/7] w-full sm:aspect-[16/6]">
        <img
          src={sources[sourceIndex]}
          alt="Hermes by AI Evolution Labs — Your business. Automated."
          loading="eager"
          className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          onError={() => {
            setSourceIndex((i) => Math.min(i + 1, sources.length - 1))
          }}
        />
        {/* gradient veil for legibility of overlay text */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.22) 55%, rgba(0,0,0,0) 100%)',
          }}
        />

        {/* Top-right brand chip */}
        <div
          className="pointer-events-none absolute right-4 top-4 flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-semibold tracking-wide"
          style={{
            background: 'rgba(10, 7, 3, 0.72)',
            border: '1px solid var(--theme-accent-border)',
            color: 'var(--theme-accent)',
            backdropFilter: 'blur(6px)',
          }}
        >
          AI EVOLUTION LABS
          <HugeiconsIcon
            icon={ArrowUpRight01Icon}
            size={12}
            strokeWidth={2}
          />
        </div>

        {/* Bottom-left overlay copy */}
        <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7">
          <p
            className="text-[10px] uppercase tracking-[0.22em]"
            style={{ color: 'var(--theme-accent-secondary)' }}
          >
            Hermes by AI Evolution Labs
          </p>
          <h2
            className="mt-1 text-xl font-semibold leading-tight sm:text-2xl"
            style={{ color: '#FFEAD0' }}
          >
            Your business. Automated.
          </h2>
          <p
            className="mt-1 text-xs sm:text-sm"
            style={{ color: 'rgba(255, 234, 208, 0.78)' }}
          >
            Visit aievolutionlabs.io →
          </p>
        </div>
      </div>
    </a>
  )
}
