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
    <div className="max-w-5xl mx-auto space-y-12 pb-20">
      <div className="text-center space-y-4">
        <h2 className="text-4xl md:text-5xl font-semibold text-hello-black font-display">
          Mes <span className="text-pink-candy">Classeurs</span>
        </h2>
        <p className="text-hello-black/40 italic font-serif">"Organise tes pensées, une couleur à la fois... 🎨"</p>
      </div>

      {/* Formulaire d'Ajout - Style Fiche Index */}
      <div className="relative max-w-2xl mx-auto">
        {/* Paper Clip Decorative */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-8 h-12 bg-gray-300/30 rounded-full border-2 border-gray-400/20 rotate-12 backdrop-blur-sm z-10" />
        
        <div className="notebook-page p-8 border-t-8 border-pink-candy/30">
          <form onSubmit={handleAdd} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-pink-deep/40 uppercase tracking-[0.2em] ml-1">Nom de la matière</label>
                <input 
                  type="text"
                  value={newSubject.name}
                  onChange={e => setNewSubject({...newSubject, name: e.target.value})}
                  placeholder="Ex: Alchimie des Couleurs 🧪"
                  className="w-full bg-pink-milk/10 border-b-2 border-pink-milk/30 p-3 focus:outline-none focus:border-pink-candy transition-colors font-display text-lg"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-pink-deep/40 uppercase tracking-[0.2em] ml-1">Couleur du Classeur</label>
                <div className="flex items-center gap-4 bg-pink-milk/5 p-2 rounded-xl border border-pink-milk/10">
                  <input 
                    type="color"
                    value={newSubject.color}
                    onChange={e => setNewSubject({...newSubject, color: e.target.value})}
                    className="w-12 h-12 rounded-lg cursor-pointer overflow-hidden border-2 border-white shadow-sm"
                  />
                  <span className="text-sm font-black text-hello-black/40 tracking-widest">{newSubject.color.toUpperCase()}</span>
                </div>
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <button type="submit" className="bg-hello-black text-white px-8 py-3 rounded-full font-black text-xs uppercase tracking-[0.2em] hover:bg-pink-candy transition-all shadow-lg hover:scale-105 active:scale-95 flex items-center gap-2">
                <Plus size={18} /> Créer le Classeur
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Liste des Matières - Style intercalaires de classeur */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {subjects.map((subject, index) => (
          <motion.div
            key={subject._id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -8, rotate: index % 2 === 0 ? -1 : 1 }}
            className="relative group cursor-pointer"
          >
            {/* Folder Tab Effect */}
            <div 
              className="absolute -top-4 left-6 h-8 w-24 rounded-t-xl transition-transform group-hover:-translate-y-1"
              style={{ backgroundColor: subject.color }}
            />
            
            <div className="notebook-page p-8 min-h-[200px] flex flex-col justify-between relative z-10 overflow-hidden group">
              {/* Decorative Folder Lines */}
              <div className="absolute right-[-10%] top-[-10%] w-32 h-32 bg-pink-milk/5 rounded-full" />
              
              <div className="flex justify-between items-start relative z-10">
                <div 
                  className="p-3 rounded-2xl text-white shadow-lg"
                  style={{ backgroundColor: subject.color }}
                >
                  <BookOpen size={24} />
                </div>
                <button 
                  onClick={() => handleDelete(subject._id)}
                  className="p-2 text-hello-black/10 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                >
                  <Trash2 size={20} />
                </button>
              </div>

              <div className="relative z-10">
                <h3 className="text-2xl font-semibold text-hello-black font-display mb-2">{subject.name}</h3>
                <div className="flex items-center gap-2 text-[10px] font-black text-pink-deep/30 uppercase tracking-[0.2em]">
                  <Palette size={14} /> 
                  <span className="group-hover:text-pink-candy transition-colors">{subject.color}</span>
                </div>
              </div>

              {/* Progress Indicator Decorative */}
              <div className="absolute bottom-0 left-0 w-full h-1.5 bg-pink-milk/10">
                <div 
                  className="h-full opacity-40"
                  style={{ backgroundColor: subject.color, width: '40%' }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
