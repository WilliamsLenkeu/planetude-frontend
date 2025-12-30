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
    <div className="max-w-5xl mx-auto space-y-8 md:space-y-12 pb-10 md:pb-20 px-2 md:px-0">
      <div className="text-center space-y-2 md:space-y-4 pt-4 md:pt-0">
        <h2 className="text-3xl md:text-5xl font-semibold text-hello-black font-display">
          Mes <span className="text-pink-candy">Classeurs</span>
        </h2>
        <p className="text-hello-black/40 italic font-serif text-sm md:text-base">"Organise tes pensées, une couleur à la fois... 🎨"</p>
      </div>

      {/* Formulaire d'Ajout - Style Fiche Index */}
      <div className="relative max-w-2xl mx-auto px-2 md:px-0">
        {/* Paper Clip Decorative */}
        <div className="absolute -top-4 md:-top-6 left-1/2 -translate-x-1/2 w-6 md:w-8 h-10 md:h-12 bg-gray-300/30 rounded-full border-2 border-gray-400/20 rotate-12 backdrop-blur-sm z-10" />
        
        <div className="notebook-page p-5 md:p-8 border-t-4 md:border-t-8 border-pink-candy/30">
          <form onSubmit={handleAdd} className="space-y-4 md:space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
              <div className="space-y-2 md:space-y-3">
                <label className="text-[8px] md:text-[10px] font-black text-pink-deep/40 uppercase tracking-[0.2em] ml-1">Nom de la matière</label>
                <input 
                  type="text"
                  value={newSubject.name}
                  onChange={e => setNewSubject({...newSubject, name: e.target.value})}
                  placeholder="Ex: Alchimie des Couleurs 🧪"
                  className="w-full bg-pink-milk/10 border-b-2 border-pink-milk/30 p-2 md:p-3 focus:outline-none focus:border-pink-candy transition-colors font-display text-base md:text-lg"
                />
              </div>
              <div className="space-y-2 md:space-y-3">
                <label className="text-[8px] md:text-[10px] font-black text-pink-deep/40 uppercase tracking-[0.2em] ml-1">Couleur du Classeur</label>
                <div className="flex items-center gap-3 md:gap-4 bg-pink-milk/5 p-1.5 md:p-2 rounded-xl border border-pink-milk/10">
                  <input 
                    type="color"
                    value={newSubject.color}
                    onChange={e => setNewSubject({...newSubject, color: e.target.value})}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-lg cursor-pointer overflow-hidden border-2 border-white shadow-sm"
                  />
                  <span className="text-xs md:text-sm font-black text-hello-black/40 tracking-widest">{newSubject.color.toUpperCase()}</span>
                </div>
              </div>
            </div>
            <div className="flex justify-end pt-2 md:pt-4">
              <button type="submit" className="w-full md:w-auto bg-hello-black text-white px-6 md:px-8 py-2.5 md:py-3 rounded-full font-black text-[10px] md:text-xs uppercase tracking-[0.2em] hover:bg-pink-candy transition-all shadow-lg hover:scale-105 active:scale-95 flex items-center justify-center gap-2">
                <Plus className="size-4 md:size-[18px]" /> Créer le Classeur
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Liste des Matières - Style intercalaires de classeur */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 px-2 md:px-0">
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
              className="absolute -top-3 md:-top-4 left-6 h-6 md:h-8 w-20 md:w-24 rounded-t-xl transition-transform group-hover:-translate-y-1"
              style={{ backgroundColor: subject.color }}
            />
            
            <div className="notebook-page p-6 md:p-8 min-h-[160px] md:min-h-[200px] flex flex-col justify-between relative z-10 overflow-hidden group">
              {/* Decorative Folder Lines */}
              <div className="absolute right-[-10%] top-[-10%] w-24 md:w-32 h-24 md:h-32 bg-pink-milk/5 rounded-full" />
              
              <div className="flex justify-between items-start relative z-10">
                <div 
                  className="p-2.5 md:p-3 rounded-2xl text-white shadow-lg"
                  style={{ backgroundColor: subject.color }}
                >
                  <BookOpen className="size-5 md:size-6" />
                </div>
                <button 
                  onClick={() => handleDelete(subject._id)}
                  className="p-2 text-hello-black/10 hover:text-red-400 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all hover:scale-110"
                >
                  <Trash2 className="size-4 md:size-5" />
                </button>
              </div>

              <div className="relative z-10 mt-4 md:mt-0">
                <h3 className="text-xl md:text-2xl font-semibold text-hello-black font-display mb-1 md:mb-2">{subject.name}</h3>
                <div className="flex items-center gap-2 text-[8px] md:text-[10px] font-black text-pink-deep/30 uppercase tracking-[0.2em]">
                  <Palette className="size-3 md:size-[14px]" /> 
                  <span className="group-hover:text-pink-candy transition-colors">{subject.color}</span>
                </div>
              </div>

              {/* Progress Indicator Decorative */}
              <div className="absolute bottom-0 left-0 w-full h-1 md:h-1.5 bg-pink-milk/10">
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
