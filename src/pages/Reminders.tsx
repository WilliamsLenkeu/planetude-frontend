import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { reminderService, type Reminder } from '../services/reminder.service'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import toast from 'react-hot-toast'

export default function Reminders() {
  const queryClient = useQueryClient()

  const { data: reminders, isLoading } = useQuery({
    queryKey: ['reminders'],
    queryFn: () => reminderService.getAll()
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => reminderService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders'] })
      toast.success('Rappel supprimé')
    }
  })

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">
            Rappels
          </h1>
          <p className="text-[var(--color-text-secondary)]">
            Gérez vos rappels
          </p>
        </div>
        <Button>Nouveau rappel</Button>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-[var(--color-text-secondary)]">Chargement...</p>
        </div>
      ) : reminders && reminders.length > 0 ? (
        <div className="grid gap-4">
          {reminders.map((reminder: Reminder) => (
            <Card key={reminder._id} hover>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-[var(--color-text-primary)] mb-1">
                    {reminder.title}
                  </h3>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    {new Date(reminder.date).toLocaleString('fr-FR')}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => deleteMutation.mutate(reminder._id)}
                >
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
                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
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
              Aucun rappel pour le moment
            </p>
            <Button>Créer mon premier rappel</Button>
          </div>
        </Card>
      )}
    </div>
  )
}
