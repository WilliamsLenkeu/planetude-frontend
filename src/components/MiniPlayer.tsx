export default function MiniPlayer() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[var(--color-card-bg)] border-t border-[var(--color-border-light)] px-4 py-3 flex items-center justify-between z-40">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[var(--color-bg-tertiary)] rounded-lg flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5 text-[var(--color-text-muted)]"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
            />
          </svg>
        </div>
        <div>
          <p className="text-sm font-medium text-[var(--color-text-primary)]">
            Pas de lecture
          </p>
          <p className="text-xs text-[var(--color-text-muted)]">
            Lo-Fi en pause
          </p>
        </div>
      </div>
    </div>
  )
}
