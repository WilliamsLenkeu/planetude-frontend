import { Card } from '../components/ui/Card'

export default function Themes() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">
          Thèmes
        </h1>
        <p className="text-[var(--color-text-secondary)]">
          Personnalisez votre interface
        </p>
      </div>

      <Card>
        <h2 className="font-semibold text-[var(--color-text-primary)] mb-4">
          Thèmes disponibles
        </h2>
        <div className="text-center py-8 text-[var(--color-text-secondary)]">
          <p className="text-sm">Fonctionnalité en développement</p>
        </div>
      </Card>
    </div>
  )
}
