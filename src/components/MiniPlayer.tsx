import { Music } from 'lucide-react'

export default function MiniPlayer() {
  return (
    <div
      className="hidden md:flex fixed bottom-0 left-0 right-0 items-center gap-4 px-4 py-3 border-t z-30"
      style={{
        backgroundColor: 'color-mix(in srgb, var(--color-card-bg) 98%, transparent)',
        backdropFilter: 'blur(12px)',
        borderColor: 'var(--color-border)',
      }}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
        style={{ backgroundColor: 'var(--color-bg-tertiary)' }}
      >
        <Music size={22} style={{ color: 'var(--color-text-muted)' }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate" style={{ color: 'var(--color-text)' }}>
          Pas de lecture
        </p>
        <p className="text-xs truncate" style={{ color: 'var(--color-text-muted)' }}>
          Lo-Fi en pause
        </p>
      </div>
    </div>
  )
}
