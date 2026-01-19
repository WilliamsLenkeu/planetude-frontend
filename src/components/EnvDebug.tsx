export default function EnvDebug() {
  if (import.meta.env.PROD) return null

  return (
    <div className="fixed top-20 right-4 p-3 bg-[var(--color-card-bg)] border border-[var(--color-border-light)] rounded-lg text-xs font-mono z-50 max-w-xs">
      <div className="font-bold text-[var(--color-text-primary)] mb-2">Debug Info</div>
      <div className="space-y-1 text-[var(--color-text-secondary)]">
        <div>API: {import.meta.env.VITE_API_URL || 'Not set'}</div>
        <div>Mode: {import.meta.env.MODE}</div>
        <div>Dev: {import.meta.env.DEV.toString()}</div>
      </div>
    </div>
  )
}
