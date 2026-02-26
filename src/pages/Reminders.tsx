import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { reminderService, type Reminder } from '../services/reminder.service'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { PageHeader } from '../components/PageHeader'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import toast from 'react-hot-toast'
import { Plus, Trash2 } from 'lucide-react'

export default function Reminders() {
  const queryClient = useQueryClient()

  const { data: reminders, isLoading } = useQuery({
    queryKey: ['reminders'],
    queryFn: () => reminderService.getAll(),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => reminderService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders'] })
      toast.success('Rappel supprimé')
    },
  })

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Rappels"
        description="Gérez vos rappels"
        action={
          <Button>
            <Plus size={18} />
            Nouveau rappel
          </Button>
        }
      />

      {isLoading ? (
        <div className="flex justify-center py-16">
          <LoadingSpinner fullScreen={false} />
        </div>
      ) : reminders && reminders.length > 0 ? (
        <div className="grid gap-4">
          {reminders.map((reminder: Reminder) => (
            <Card key={reminder._id} hover>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold mb-1" style={{ color: 'var(--color-text)' }}>
                    {reminder.title}
                  </h3>
                  <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                    {new Date(reminder.date).toLocaleString('fr-FR')}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteMutation.mutate(reminder._id)
                  }}
                  className="shrink-0 text-red-600 hover:bg-red-50"
                >
                  <Trash2 size={18} />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <div className="text-center py-12">
            <p className="mb-4" style={{ color: 'var(--color-text-muted)' }}>
              Aucun rappel pour le moment
            </p>
            <Button>
              <Plus size={18} />
              Créer mon premier rappel
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}
