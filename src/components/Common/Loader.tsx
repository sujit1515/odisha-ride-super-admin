'use client'

import React from 'react'

interface PremiumLoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  text?: string
  className?: string
  fullScreen?: boolean
  center?: boolean
}

const SIZE_PX: Record<NonNullable<PremiumLoaderProps['size']>, number> = {
  sm: 22,
  md: 34,
  lg: 48,
  xl: 68,
}

const THICKNESS: Record<NonNullable<PremiumLoaderProps['size']>, number> = {
  sm: 2,
  md: 2.5,
  lg: 3,
  xl: 3.5,
}

export default function PremiumLoader({
  size = 'lg',
  text,
  className = '',
  fullScreen = false,
  center = true,
}: PremiumLoaderProps) {
  const dim = SIZE_PX[size]
  const thickness = THICKNESS[size]

  const containerClasses = fullScreen
    ? 'fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm'
    : center
    ? 'flex flex-col items-center justify-center py-10 px-4 w-full min-h-[140px]'
    : 'inline-flex items-center gap-2'

  return (
    <div className={`${containerClasses} ${className}`}>
      <div
        className="premium-arc-spinner"
        style={
          {
            width: dim,
            height: dim,
            '--thickness': `${thickness}px`,
          } as React.CSSProperties
        }
      >
        <span className="premium-arc-tip" style={{ width: thickness * 1.7, height: thickness * 1.7 }} />
      </div>

      {text && (
        <span
          className={`font-medium text-slate-500 tracking-wide ${
            size === 'sm' ? 'text-xs mt-2' : 'mt-3 text-sm'
          }`}
        >
          {text}
        </span>
      )}

      <style jsx>{`
        .premium-arc-spinner {
          position: relative;
          border-radius: 50%;
          background: conic-gradient(
            from 0deg,
            transparent 0%,
            rgba(37, 99, 235, 0.15) 55%,
            #2563eb 100%
          );
          -webkit-mask: radial-gradient(
            farthest-side,
            transparent calc(100% - var(--thickness) - 1px),
            #000 calc(100% - var(--thickness))
          );
          mask: radial-gradient(
            farthest-side,
            transparent calc(100% - var(--thickness) - 1px),
            #000 calc(100% - var(--thickness))
          );
          animation: premium-arc-spin 0.85s linear infinite;
        }

        .premium-arc-tip {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          border-radius: 50%;
          background: #2563eb;
          box-shadow: 0 0 6px rgba(37, 99, 235, 0.6);
        }

        @keyframes premium-arc-spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  )
}