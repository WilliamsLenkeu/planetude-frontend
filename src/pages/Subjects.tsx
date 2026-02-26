import { useState, useRef, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { subjectService } from '../services/subject.service'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Modal } from '../components/ui/Modal'
import { PageHeader } from '../components/PageHeader'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { Plus, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { HexColorPicker } from 'react-colorful'
import toast from 'react-hot-toast'
import type { Subject } from '../types'

const COLORS = ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#e91e63', '#607d8b']

export default function Subjects() {
  const queryClient = useQueryClient()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null)
  const [formName, setFormName] = useState('')
  const [formColor, setFormColor] = useState('#3498db')
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const menuRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const { data: subjects, isLoading } = useQuery({
    queryKey: ['subjects'],
    queryFn: () => subjectService.getAll(),
  })

  const createMutation = useMutation({
    mutationFn: (data: { name: string; color: string }) => subjectService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] })
      toast.success('Matière créée')
      closeModal()
    },
    onError: (err: any) => toast.error(err?.message || 'Erreur'),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name: string; color: string } }) =>
      subjectService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] })
      toast.success('Matière mise à jour')
      closeModal()
    },
    onError: (err: any) => toast.error(err?.message || 'Erreur'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => subjectService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] })
      toast.success('Matière supprimée')
      setOpenMenuId(null)
    },
    onError: (err: any) => toast.error(err?.message || 'Erreur'),
  })

  const openAddModal = () => {
    setEditingSubject(null)
    setFormName('')
    setFormColor(COLORS[Math.floor(Math.random() * COLORS.length)])
    setModalOpen(true)
  }

  const openEditModal = (subject: Subject) => {
    setEditingSubject(subject)
    setFormName(subject.name)
    setFormColor(subject.color || '#3498db')
    setModalOpen(true)
    setOpenMenuId(null)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditingSubject(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formName.trim()) {
      toast.error('Nom requis')
      return
    }
    if (editingSubject) {
      updateMutation.mutate({ id: editingSubject._id, data: { name: formName.trim(), color: formColor } })
    } else {
      createMutation.mutate({ name: formName.trim(), color: formColor })
    }
  }

  const handleDelete = (subject: Subject) => {
    if (window.confirm(`Supprimer "${subject.name}" ?`)) {
      deleteMutation.mutate(subject._id)
    }
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node
      const isInside = Object.values(menuRefs.current).some(
        (el) => el && el.contains(target)
      )
      if (!isInside) setOpenMenuId(null)
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Matières"
        description="Gérez vos matières"
        action={
          <Button onClick={openAddModal}>
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
                <div
                  className="relative shrink-0"
                  ref={(el) => { menuRefs.current[subject._id] = el }}
                >
                  <Button
                    variant="ghost"
                    className="shrink-0"
                    onClick={(e) => {
                      e.stopPropagation()
                      setOpenMenuId(openMenuId === subject._id ? null : subject._id)
                    }}
                  >
                    <MoreHorizontal size={18} />
                  </Button>
                  {openMenuId === subject._id && (
                    <div
                      className="absolute right-0 top-full mt-1 py-1 min-w-[140px] rounded-lg shadow-lg z-50 surface"
                      style={{ border: '1px solid var(--color-border)' }}
                    >
                      <button
                        onClick={() => openEditModal(subject)}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-[var(--color-bg-tertiary)] transition-colors text-left"
                        style={{ color: 'var(--color-text)' }}
                      >
                        <Pencil size={16} />
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDelete(subject)}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-red-50 text-red-600 transition-colors text-left"
                      >
                        <Trash2 size={16} />
                        Supprimer
                      </button>
                    </div>
                  )}
                </div>
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
            <Button onClick={openAddModal}>
              <Plus size={18} />
              Ajouter ma première matière
            </Button>
          </div>
        </Card>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={editingSubject ? 'Modifier la matière' : 'Nouvelle matière'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nom"
            placeholder="Ex: Mathématiques"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            required
          />
          <div>
            <label className="text-sm font-medium block mb-2" style={{ color: 'var(--color-text)' }}>
              Couleur
            </label>
            <div className="flex gap-2 flex-wrap">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setFormColor(c)}
                  className="w-8 h-8 rounded-full border-2 transition-transform hover:scale-110"
                  style={{
                    backgroundColor: c,
                    borderColor: formColor === c ? 'var(--color-primary)' : 'transparent',
                  }}
                />
              ))}
            </div>
            <div className="mt-3 [&_.react-colorful]:h-32 [&_.react-colorful]:w-full [&_.react-colorful]:max-w-[280px] [&_.react-colorful]:rounded-lg [&_.react-colorful]:overflow-hidden">
              <HexColorPicker color={formColor} onChange={setFormColor} />
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={closeModal} className="flex-1">
              Annuler
            </Button>
            <Button
              type="submit"
              isLoading={createMutation.isPending || updateMutation.isPending}
              className="flex-1"
            >
              {editingSubject ? 'Enregistrer' : 'Créer'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
