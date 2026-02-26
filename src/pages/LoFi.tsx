import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { PageHeader } from '../components/PageHeader'
import { Music } from 'lucide-react'

export default function LoFi() {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Lo-Fi"
        description="Musique d'ambiance pour étudier"
      />

      <Card>
        <h2 className="font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
          <Music size={20} />
          Player
        </h2>
        <div className="text-center py-12" style={{ color: 'var(--color-text-muted)' }}>
          <p className="text-sm mb-4">Fonctionnalité en développement</p>
          <Button variant="secondary">Actualiser</Button>
        </div>
      </Card>
    </div>
  )
}
