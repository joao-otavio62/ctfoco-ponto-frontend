import { useState, type MouseEvent, type ReactNode } from 'react'

interface Ripple {
  id: number
  x: number
  y: number
  size: number
}

interface RippleButtonProps {
  children: ReactNode
  onClick: () => void
  disabled?: boolean
  className?: string
}

/**
 * Botão circular com efeito Ripple: uma "onda" de cor contrastante que se
 * expande a partir do ponto de toque, dando feedback visual imediato (RNF).
 */
export default function RippleButton({ children, onClick, disabled, className = '' }: RippleButtonProps) {
  const [ripples, setRipples] = useState<Ripple[]>([])

  function handleClick(e: MouseEvent<HTMLButtonElement>) {
    if (disabled) return

    const button = e.currentTarget
    const rect = button.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    const x = e.clientX - rect.left - size / 2
    const y = e.clientY - rect.top - size / 2
    const id = Date.now()

    setRipples((prev) => [...prev, { id, x, y, size }])
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id))
    }, 650)

    onClick()
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`relative overflow-hidden select-none transition-transform active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {children}
      {ripples.map((r) => (
        <span
          key={r.id}
          className="absolute rounded-full bg-white/70 pointer-events-none animate-ripple"
          style={{ left: r.x, top: r.y, width: r.size, height: r.size }}
        />
      ))}
    </button>
  )
}
