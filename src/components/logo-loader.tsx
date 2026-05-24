'use client'

import { cn } from '@/lib/utils'

export type LogoLoaderProps = {
  className?: string
}

function LogoLoader({ className }: LogoLoaderProps) {
  return (
    <span className="logo-loader-track" aria-hidden="true">
      <img
        src="/logo.png"
        alt=""
        className={cn('logo-loader-icon size-4 rounded-sm', className)}
      />
    </span>
  )
}

export { LogoLoader }
