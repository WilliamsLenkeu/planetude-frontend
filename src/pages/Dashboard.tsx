import { useAuth } from '../contexts/AuthContext'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'

export default function Dashboard() {
  const { user } = useAuth()

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">
          Bienvenue, {user?.name || 'Utilisateur'}
        </h1>
        <p className="text-[var(--color-text-secondary)]">
          Voici votre tableau de bord
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card hover className="cursor-pointer">
          <div className="flex items-start justify-between mb-4">
            <div className="p-2 bg-[var(--color-bg-tertiary)] rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5 text-[var(--color-text-primary)]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                />
              </svg>
            </div>
            <Badge variant="primary">Actif</Badge>
          </div>
          <h3 className="font-semibold text-[var(--color-text-primary)] mb-1">
            Plannings
          </h3>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Gérez vos plannings d'étude
          </p>
        </Card>

        <Card hover className="cursor-pointer">
          <div className="flex items-start justify-between mb-4">
            <div className="p-2 bg-[var(--color-bg-tertiary)] rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5 text-[var(--color-text-primary)]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                />
              </svg>
            </div>
          </div>
          <h3 className="font-semibold text-[var(--color-text-primary)] mb-1">
            Matières
          </h3>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Organisez vos matières
          </p>
        </Card>

        <Card hover className="cursor-pointer">
          <div className="flex items-start justify-between mb-4">
            <div className="p-2 bg-[var(--color-bg-tertiary)] rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5 text-[var(--color-text-primary)]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z"
                />
              </svg>
            </div>
          </div>
          <h3 className="font-semibold text-[var(--color-text-primary)] mb-1">
            Statistiques
          </h3>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Suivez votre progression
          </p>
        </Card>
      </div>

      <Card>
        <h2 className="font-semibold text-[var(--color-text-primary)] mb-4">
          Progression récente
        </h2>
        <div className="text-center py-8 text-[var(--color-text-secondary)]">
          <p className="text-sm">Aucune progression récente</p>
        </div>
      </Card>
    </div>
  )
}
