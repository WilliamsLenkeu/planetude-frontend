export default function Header() {
  return (
    <header className="border-b border-[var(--color-border-light)] bg-[var(--color-card-bg)] px-4 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <h1 className="text-xl font-bold text-[var(--color-text-primary)]">
          PlanEtude
        </h1>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[var(--color-bg-tertiary)] rounded-full border border-[var(--color-border-light)]" />
        </div>
      </div>
    </header>
  )
}
