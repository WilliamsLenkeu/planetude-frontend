import { Card } from '../components/ui/Card'

export default function Analytics() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">
          Analytics
        </h1>
        <p className="text-[var(--color-text-secondary)]">
          Analyses détaillées
        </p>
      </div>

      <Card>
        <h2 className="font-semibold text-[var(--color-text-primary)] mb-4">
          Vue d'ensemble
        </h2>
        <div className="text-center py-8 text-[var(--color-text-secondary)]">
          <p className="text-sm">Fonctionnalité en développement</p>
        </div>
      </Card>
    </div>
  )
}
