import { Card } from '../components/ui/Card'
import { PageHeader } from '../components/PageHeader'
import { BarChart3 } from 'lucide-react'

export default function Analytics() {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Statistiques"
        description="Suivez votre progression"
      />

      <Card>
        <h2 className="font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
          <BarChart3 size={20} />
          Analytics
        </h2>
        <div className="text-center py-12" style={{ color: 'var(--color-text-muted)' }}>
          <p className="text-sm">Aucune donnée pour le moment</p>
        </div>
      </Card>
    </div>
  )
}
