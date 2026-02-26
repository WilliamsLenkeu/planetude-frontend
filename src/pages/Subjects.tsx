import { useQuery } from '@tanstack/react-query'
import { subjectService } from '../services/subject.service'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { PageHeader } from '../components/PageHeader'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { Plus, MoreHorizontal } from 'lucide-react'

export default function Subjects() {
  const { data: subjects, isLoading } = useQuery({
    queryKey: ['subjects'],
    queryFn: () => subjectService.getAll(),
  })

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Matières"
        description="Gérez vos matières"
        action={
          <Button>
            <Plus size={18} />
            Nouvelle matière
          </Button>
        }
      />

      {isLoading ? (
        <div className="flex justify-center py-16">
          <LoadingSpinner fullScreen={false} />
        </div>
      ) : subjects && subjects.length > 0 ? (
        <div className="grid gap-4">
          {subjects.map((subject) => (
            <Card key={subject._id} hover>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full shrink-0"
                    style={{ backgroundColor: subject.color }}
                  />
                  <span className="font-medium" style={{ color: 'var(--color-text)' }}>
                    {subject.name}
                  </span>
                </div>
                <Button variant="ghost" className="shrink-0">
                  <MoreHorizontal size={18} />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <div className="text-center py-12">
            <p className="mb-4" style={{ color: 'var(--color-text-muted)' }}>
              Aucune matière pour le moment
            </p>
            <Button>
              <Plus size={18} />
              Ajouter ma première matière
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}
