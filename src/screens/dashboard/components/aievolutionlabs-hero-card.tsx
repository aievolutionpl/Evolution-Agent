import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowUpRight01Icon } from '@hugeicons/core-free-icons'

const BRAND_URL = 'https://aievolutionlabs.io'

/**
 * Dashboard hero card — branded entrypoint that doubles as an outbound
 * link to aievolutionlabs.io. Shows the AIEL marketing hero photo with
 * a graceful SVG fallback when the .jpg is not present in /public yet.
 *
 * The image stack uses two layered <img> tags. The JPG (when present) sits
 * on top; if it 404s we surface the SVG fallback underneath via onError.
 */
export function AIEvolutionLabsHeroCard() {
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
        {/* SVG fallback always renders; JPG overlays it when available */}
        <img
          src="/aievolutionlabs-hero.svg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 size-full object-cover"
        />
        <img
          src="/aievolutionlabs-hero.jpg"
          alt="AI Evolution Labs — Your business. Automated."
          loading="eager"
          className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          onError={(e) => {
            // If the JPG isn't uploaded yet, hide the broken img so the SVG below shows.
            ;(e.currentTarget as HTMLImageElement).style.display = 'none'
          }}
        />
        {/* gradient veil for legibility of overlay text */}
        <div
          className="absolute inset-0 bg-gradient-to-tr"
          style={{
            backgroundImage:
              'linear-gradient(to top, rgba(0,8,6,0.78) 0%, rgba(0,8,6,0.18) 55%, rgba(0,8,6,0) 100%)',
          }}
        />

        {/* Top-right brand chip */}
        <div className="pointer-events-none absolute right-4 top-4 flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-semibold tracking-wide"
          style={{
            background: 'rgba(2, 17, 15, 0.7)',
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
          <h2 className="mt-1 text-xl font-semibold leading-tight sm:text-2xl"
            style={{ color: '#E8FFFB' }}
          >
            Your business. Automated.
          </h2>
          <p className="mt-1 text-xs sm:text-sm"
            style={{ color: 'rgba(232, 255, 251, 0.78)' }}
          >
            Visit aievolutionlabs.io →
          </p>
        </div>
      </div>
    </a>
  )
}
