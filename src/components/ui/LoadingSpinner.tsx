export const LoadingSpinner = ({ fullScreen = false }: { fullScreen?: boolean }) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[var(--color-bg-secondary)] z-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-[var(--color-border-light)] border-t-[var(--color-accent)] rounded-full animate-spin" />
          <p className="text-sm text-[var(--color-text-secondary)]">Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-6 h-6 border-2 border-[var(--color-border-light)] border-t-[var(--color-accent)] rounded-full animate-spin" />
  )
}
