import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { PageHeader } from '../components/PageHeader'
import { Calendar, BookOpen, BarChart3 } from 'lucide-react'

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const shortcuts = [
    {
      title: 'Plannings',
      description: 'Gérez vos plannings d\'étude',
      icon: Calendar,
      to: '/planning',
    },
    {
      title: 'Matières',
      description: 'Organisez vos matières',
      icon: BookOpen,
      to: '/subjects',
    },
    {
      title: 'Statistiques',
      description: 'Suivez votre progression',
      icon: BarChart3,
      to: '/analytics',
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title={`Bonjour, ${user?.name || 'Utilisateur'}`}
        description="Voici votre tableau de bord"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {shortcuts.map(({ title, description, icon: Icon, to }) => (
          <Card
            key={to}
            hover
            className="cursor-pointer"
            onClick={() => navigate(to)}
          >
            <div className="flex items-start justify-between">
              <div
                className="p-2.5 rounded-xl"
                style={{ backgroundColor: 'var(--color-bg-tertiary)' }}
              >
                <Icon size={20} style={{ color: 'var(--color-primary)' }} />
              </div>
              <Badge variant="primary">Accès</Badge>
            </div>
            <h3 className="font-semibold mt-3 mb-1" style={{ color: 'var(--color-text)' }}>
              {title}
            </h3>
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
              {description}
            </p>
          </Card>
        ))}
      </div>

      <Card>
        <h2 className="font-semibold mb-4" style={{ color: 'var(--color-text)' }}>
          Progression récente
        </h2>
        <div className="text-center py-10" style={{ color: 'var(--color-text-muted)' }}>
          <p className="text-sm">Aucune progression enregistrée</p>
        </div>
      </Card>
    </div>
  )
}
