interface LoadingSpinnerProps {
  fullScreen?: boolean
  label?: string
}

export const LoadingSpinner = ({ fullScreen = false, label = 'Chargement...' }: LoadingSpinnerProps) => {
  const spinner = (
    <div
      className="rounded-full border-2 border-[var(--color-border-light)] border-t-[var(--color-primary)] animate-spin"
      style={{ width: fullScreen ? 40 : 24, height: fullScreen ? 40 : 24 }}
    />
  )

  if (fullScreen) {
    return (
      <div
        className="fixed inset-0 flex flex-col items-center justify-center gap-4 z-50"
        style={{ backgroundColor: 'var(--color-background, var(--color-bg-secondary))' }}
      >
        {spinner}
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          {label}
        </p>
      </div>
    )
  }

  return spinner
}
