import { useState, useEffect } from 'react'
import { BookOpen, Plus, Trash2, Palette } from 'lucide-react'
import { motion } from 'framer-motion'
import { subjectService } from '../services/subject.service'
import type { Subject } from '../types'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import toast from 'react-hot-toast'

export default function Subjects() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [newSubject, setNewSubject] = useState({ name: '', color: '#ffafcc' })

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const data = await subjectService.getAll()
        setSubjects(data)
      } catch (error) {
        console.error('Erreur matières:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchSubjects()
  }, [])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSubject.name.trim()) return
    try {
      const created = await subjectService.create(newSubject)
      setSubjects([...subjects, created])
      setNewSubject({ name: '', color: '#ffafcc' })
      toast.success('Matière ajoutée ! ✨')
    } catch (error) {
      toast.error('Oups, petit souci... 🎀')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await subjectService.delete(id)
      setSubjects(subjects.filter(s => s._id !== id))
      toast.success('Matière supprimée !')
    } catch (error) {
      toast.error('Erreur lors de la suppression')
    }
  }

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-hello-black flex items-center justify-center gap-3">
          Mes Matières 🎨
        </h2>
        <p className="text-hello-black/60">"Personnalise tes dossiers avec tes couleurs préférées !"</p>
      </div>

      <div className="kawaii-card bg-white border-2 border-pink-milk p-6">
        <form onSubmit={handleAdd} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 space-y-2 w-full">
            <label className="text-xs font-bold text-hello-black/40 uppercase ml-2">Nom de la matière</label>
            <input 
              type="text"
              value={newSubject.name}
              onChange={e => setNewSubject({...newSubject, name: e.target.value})}
              placeholder="Ex: Alchimie des Couleurs 🧪"
              className="w-full bg-pink-milk/20 border-2 border-pink-milk/50 rounded-kawaii p-3 focus:outline-none focus:border-pink-candy"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-hello-black/40 uppercase ml-2">Couleur</label>
            <div className="flex items-center gap-3 bg-pink-milk/20 border-2 border-pink-milk/50 rounded-kawaii p-2">
              <input 
                type="color"
                value={newSubject.color}
                onChange={e => setNewSubject({...newSubject, color: e.target.value})}
                className="w-10 h-10 rounded-full cursor-pointer overflow-hidden border-2 border-white"
              />
              <span className="text-sm font-bold text-hello-black/60 pr-2">{newSubject.color.toUpperCase()}</span>
            </div>
          </div>
          <button type="submit" className="kawaii-button !py-3 !px-8 flex items-center gap-2">
            <Plus size={20} /> Ajouter
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((subject) => (
          <motion.div
            key={subject._id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="kawaii-card relative overflow-hidden group"
            style={{ borderLeft: `8px solid ${subject.color}` }}
          >
            <div className="flex justify-between items-start">
              <div className="p-2 bg-pink-milk/20 rounded-lg text-pink-candy">
                <BookOpen size={24} />
              </div>
              <button 
                onClick={() => handleDelete(subject._id)}
                className="p-2 text-hello-black/20 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={18} />
              </button>
            </div>
            <h3 className="text-lg font-bold text-hello-black mt-4">{subject.name}</h3>
            <div className="flex items-center gap-2 mt-2 text-xs font-bold text-hello-black/40">
              <Palette size={14} /> {subject.color}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
