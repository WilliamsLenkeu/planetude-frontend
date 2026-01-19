import { useQuery } from '@tanstack/react-query'
import { subjectService } from '../services/subject.service'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'

export default function Subjects() {
  const { data: subjects, isLoading } = useQuery({
    queryKey: ['subjects'],
    queryFn: () => subjectService.getAll()
  })

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">
            Matières
          </h1>
          <p className="text-[var(--color-text-secondary)]">
            Gérez vos matières
          </p>
        </div>
        <Button>Nouvelle matière</Button>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-[var(--color-text-secondary)]">Chargement...</p>
        </div>
      ) : subjects && subjects.length > 0 ? (
        <div className="grid gap-4">
          {subjects.map((subject) => (
            <Card key={subject._id} hover>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: subject.color }}
                  />
                  <span className="font-medium text-[var(--color-text-primary)]">
                    {subject.name}
                  </span>
                </div>
                <Button variant="ghost">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                    />
                  </svg>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <div className="text-center py-12">
            <p className="text-[var(--color-text-secondary)] mb-4">
              Aucune matière pour le moment
            </p>
            <Button>Ajouter ma première matière</Button>
          </div>
        </Card>
      )}
    </div>
  )
}
