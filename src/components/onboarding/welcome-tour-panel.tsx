import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useNavigate } from '@tanstack/react-router'
import { useWelcomeTour } from '@/hooks/use-welcome-tour'
import {
  ONBOARDING_LANGS,
  ONBOARDING_STRINGS,
  type OnboardingLang,
} from '@/lib/onboarding-i18n'
import { CHAT_RUN_COMMAND_EVENT } from '@/screens/chat/chat-events'
import type { ChatRunCommandDetail } from '@/screens/chat/chat-events'

export function WelcomeTourPanel() {
  const { open, lang, setLang, dismiss } = useWelcomeTour()
  const [stepIdx, setStepIdx] = useState(0)
  const navigate = useNavigate()

  const strings = ONBOARDING_STRINGS[lang]
  const total = strings.steps.length
  const current = strings.steps[stepIdx]
  const isLast = stepIdx === total - 1

  function changeLang(next: OnboardingLang) {
    setLang(next)
    setStepIdx(0)
  }

  function next() {
    if (stepIdx < total - 1) setStepIdx((i) => i + 1)
  }

  function prev() {
    if (stepIdx > 0) setStepIdx((i) => i - 1)
  }

  function launchSampleTask() {
    dismiss()
    navigate({ to: '/chat' }).then(() => {
      const detail: ChatRunCommandDetail = {
        command: strings.ctaSampleTask.prompt,
      }
      window.dispatchEvent(
        new CustomEvent(CHAT_RUN_COMMAND_EVENT, { detail }),
      )
    })
  }

  if (!open) return null

  return (
    <AnimatePresence>
      <motion.div
        key="welcome-tour-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
        style={{ background: 'rgba(0, 8, 6, 0.72)', backdropFilter: 'blur(8px)' }}
        onClick={dismiss}
      >
        <motion.div
          key="welcome-tour-panel"
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.98 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-2xl overflow-hidden rounded-2xl"
          style={{
            background: 'var(--theme-panel)',
            border: '1px solid var(--theme-accent-border)',
            boxShadow:
              '0 30px 80px rgba(0,0,0,0.55), 0 0 0 1px color-mix(in srgb, var(--theme-accent) 12%, transparent), 0 0 64px color-mix(in srgb, var(--theme-accent) 18%, transparent)',
          }}
        >
          {/* Header strip with logo + brand */}
          <div
            className="flex items-center justify-between px-6 py-4"
            style={{
              background:
                'linear-gradient(180deg, color-mix(in srgb, var(--theme-accent) 8%, transparent), transparent)',
              borderBottom: '1px solid var(--theme-border-subtle)',
            }}
          >
            <div className="flex items-center gap-3">
              <img
                src="/aievolutionlabs-logo.svg"
                alt="AI Evolution Labs"
                className="size-9 rounded-md"
                style={{
                  border: '1px solid var(--theme-accent-border)',
                  padding: '3px',
                  background: 'var(--theme-card)',
                }}
              />
              <div className="flex flex-col leading-tight">
                <span
                  className="text-[10px] uppercase tracking-[0.18em]"
                  style={{ color: 'var(--theme-accent)' }}
                >
                  {strings.brandLabel}
                </span>
                <span
                  className="text-sm font-semibold"
                  style={{ color: 'var(--theme-text)' }}
                >
                  {strings.tagline}
                </span>
              </div>
            </div>

            {/* Language picker */}
            <div className="flex items-center gap-1.5" aria-label={strings.langPickerLabel}>
              {ONBOARDING_LANGS.map((l) => {
                const active = l.id === lang
                return (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => changeLang(l.id)}
                    className="rounded-md px-2 py-1 text-[11px] font-medium transition"
                    style={{
                      background: active ? 'var(--theme-accent-subtle)' : 'transparent',
                      border: '1px solid',
                      borderColor: active
                        ? 'var(--theme-accent-border)'
                        : 'var(--theme-border-subtle)',
                      color: active ? 'var(--theme-accent)' : 'var(--theme-muted)',
                    }}
                    aria-pressed={active}
                  >
                    <span className="mr-1">{l.flag}</span>
                    {l.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Body */}
          <div className="px-6 py-7">
            <div
              className="mb-2 text-[10px] uppercase tracking-[0.2em]"
              style={{ color: 'var(--theme-muted)' }}
            >
              {strings.welcome.stepLabel(stepIdx + 1, total)}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={`${lang}-${stepIdx}`}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                <h2
                  className="text-2xl font-semibold tracking-tight"
                  style={{ color: 'var(--theme-text)' }}
                >
                  {current.title}
                </h2>
                <p
                  className="mt-2 text-sm leading-relaxed"
                  style={{ color: 'var(--theme-muted)' }}
                >
                  {current.body}
                </p>

                {current.highlights.length > 0 && (
                  <ul className="mt-5 flex flex-col gap-2">
                    {current.highlights.map((line) => (
                      <li
                        key={line}
                        className="flex items-start gap-2.5 rounded-lg p-3 text-sm"
                        style={{
                          background: 'var(--theme-card)',
                          border: '1px solid var(--theme-border)',
                          color: 'var(--theme-text)',
                        }}
                      >
                        <span
                          className="mt-1 inline-block size-1.5 shrink-0 rounded-full"
                          style={{ background: 'var(--theme-accent)' }}
                        />
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {isLast && (
                  <div className="mt-6 flex justify-center">
                    <button
                      type="button"
                      onClick={launchSampleTask}
                      className="rounded-md px-5 py-2.5 text-sm font-semibold transition"
                      style={{
                        background: 'var(--theme-accent)',
                        color: '#02110F',
                        boxShadow:
                          '0 0 28px color-mix(in srgb, var(--theme-accent) 35%, transparent)',
                      }}
                    >
                      {strings.ctaSampleTask.label}
                    </button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer / nav */}
          <div
            className="flex items-center justify-between gap-3 px-6 py-4"
            style={{
              background: 'var(--theme-card)',
              borderTop: '1px solid var(--theme-border-subtle)',
            }}
          >
            {/* Progress dots */}
            <div className="flex items-center gap-1.5">
              {strings.steps.map((_, i) => (
                <span
                  key={i}
                  className="block h-1.5 rounded-full transition-all"
                  style={{
                    width: i === stepIdx ? 22 : 8,
                    background:
                      i <= stepIdx ? 'var(--theme-accent)' : 'var(--theme-border)',
                  }}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={dismiss}
                className="rounded-md px-3 py-1.5 text-xs font-medium transition"
                style={{ color: 'var(--theme-muted)' }}
              >
                {strings.welcome.ctaSkip}
              </button>
              {stepIdx > 0 && (
                <button
                  type="button"
                  onClick={prev}
                  className="rounded-md px-3 py-1.5 text-xs font-medium transition"
                  style={{
                    background: 'var(--theme-card2)',
                    border: '1px solid var(--theme-border)',
                    color: 'var(--theme-text)',
                  }}
                >
                  {strings.welcome.ctaPrev}
                </button>
              )}
              {!isLast && (
                <button
                  type="button"
                  onClick={next}
                  className="rounded-md px-4 py-1.5 text-xs font-semibold transition"
                  style={{
                    background: 'var(--theme-accent)',
                    color: '#02110F',
                  }}
                >
                  {strings.welcome.ctaNext}
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
