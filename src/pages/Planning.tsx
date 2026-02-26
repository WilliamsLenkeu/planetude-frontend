import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { planningService } from '../services/planning.service'
import { subjectService } from '../services/subject.service'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Input } from '../components/ui/Input'
import { Modal } from '../components/ui/Modal'
import { PageHeader } from '../components/PageHeader'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { Plus, Calendar, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'

const PERIODES = [
  { value: 'jour', label: 'Jour(s)' },
  { value: 'semaine', label: 'Semaine(s)' },
  { value: 'mois', label: 'Mois' },
  { value: 'semestre', label: 'Semestre' },
] as const

export default function Planning() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [modalOpen, setModalOpen] = useState(false)
  const [titre, setTitre] = useState('')
  const [dateDebut, setDateDebut] = useState(() =>
    new Date().toISOString().slice(0, 10)
  )
  const [periode, setPeriode] = useState<'jour' | 'semaine' | 'mois' | 'semestre'>('semaine')
  const [nombre, setNombre] = useState(1)
  const [matiereIds, setMatiereIds] = useState<string[]>([])

  const { data: plannings, isLoading } = useQuery({
    queryKey: ['plannings'],
    queryFn: () => planningService.getAll(),
  })

  const { data: subjects } = useQuery({
    queryKey: ['subjects'],
    queryFn: () => subjectService.getAll(),
  })

  const generateMutation = useMutation({
    mutationFn: () =>
      planningService.generate({
        titre: titre || undefined,
        periode,
        nombre,
        dateDebut,
        matiereIds: matiereIds.length > 0 ? matiereIds : undefined,
      }),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['plannings'] })
      toast.success('Génération lancée ! Le planning se remplit en cours.')
      setModalOpen(false)
      resetForm()
      if (result.planningId) {
        navigate(`/planning/${result.planningId}`)
      }
    },
    onError: (err: any) =>
      toast.error(err?.message || 'Erreur lors de la génération'),
  })

  const resetForm = () => {
    setTitre('')
    setDateDebut(new Date().toISOString().slice(0, 10))
    setPeriode('semaine')
    setNombre(1)
    setMatiereIds([])
  }

  const openModal = () => {
    resetForm()
    setModalOpen(true)
  }

  const toggleMatiere = (id: string) => {
    setMatiereIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Plannings"
        description="Gérez vos plannings d'étude"
        action={
          <Button onClick={openModal}>
            <Plus size={18} />
            Nouveau planning
          </Button>
        }
      />

      {isLoading ? (
        <div className="flex justify-center py-16">
          <LoadingSpinner fullScreen={false} />
        </div>
      ) : plannings && plannings.length > 0 ? (
        <div className="grid gap-4">
          {plannings.map((planning) => (
            <Card
              key={planning._id}
              hover
              onClick={() => navigate(`/planning/${planning._id}`)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold mb-1" style={{ color: 'var(--color-text)' }}>
                    {planning.titre}
                  </h3>
                  <p className="text-sm flex items-center gap-1.5" style={{ color: 'var(--color-text-muted)' }}>
                    <Calendar size={14} />
                    {new Date(planning.dateDebut).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <Badge variant="primary">{planning.sessions?.length || 0} sessions</Badge>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <div className="text-center py-12">
            <p className="mb-4" style={{ color: 'var(--color-text-muted)' }}>
              Aucun planning pour le moment
            </p>
            <Button onClick={openModal}>
              <Plus size={18} />
              Créer mon premier planning
            </Button>
          </div>
        </Card>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Nouveau planning"
      >
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
            generateMutation.mutate()
          }}
        >
          <Input
            label="Titre (optionnel)"
            placeholder="Ex: Semaine de partiels"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
          />
          <Input
            label="Date de début"
            type="date"
            value={dateDebut}
            onChange={(e) => setDateDebut(e.target.value)}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                Période
              </label>
              <select
                className="input"
                value={periode}
                onChange={(e) => setPeriode(e.target.value as typeof periode)}
              >
                {PERIODES.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
            <Input
              label="Nombre"
              type="number"
              min={1}
              max={52}
              value={nombre}
              onChange={(e) => setNombre(parseInt(e.target.value, 10) || 1)}
            />
          </div>
          {subjects && subjects.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                Matières (optionnel)
              </label>
              <div className="flex flex-wrap gap-2">
                {subjects.map((s) => (
                  <button
                    key={s._id}
                    type="button"
                    onClick={() => toggleMatiere(s._id)}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                    style={{
                      backgroundColor: matiereIds.includes(s._id)
                        ? s.color || '#3498db'
                        : 'var(--color-bg-tertiary)',
                      color: matiereIds.includes(s._id) ? '#fff' : 'var(--color-text-muted)',
                    }}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                Vide = toutes vos matières ou valeurs par défaut
              </p>
            </div>
          )}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setModalOpen(false)}
              className="flex-1"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={generateMutation.isPending}
            >
              {generateMutation.isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <LoadingSpinner fullScreen={false} />
                  Génération...
                </span>
              ) : (
                <>
                  <Sparkles size={18} />
                  Générer
                </>
              )}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
