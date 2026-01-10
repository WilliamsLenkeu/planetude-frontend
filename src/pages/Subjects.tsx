import { useState, useEffect, useRef } from 'react'
import { BookOpen, Plus, Trash2, Palette } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { HexColorPicker } from 'react-colorful'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { subjectService } from '../services/subject.service'
import type { Subject } from '../types'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import toast from 'react-hot-toast'

export default function Subjects() {
  const queryClient = useQueryClient()
  const [newSubject, setNewSubject] = useState({ name: '', color: '#D2B48C' })
  const [showPicker, setShowPicker] = useState(false)
  const pickerRef = useRef<HTMLDivElement>(null)

  // Fetch subjects with React Query
  const { data: subjects = [], isLoading } = useQuery({
    queryKey: ['subjects'],
    queryFn: subjectService.getAll
  })

  // Mutation for adding a subject
  const addMutation = useMutation({
    mutationFn: (subject: Partial<Subject>) => subjectService.create(subject),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] })
      setNewSubject({ name: '', color: '#D2B48C' })
      toast.success('Matière ajoutée ! ✨')
    },
    onError: () => toast.error('Oups, petit souci... 🎀')
  })

  // Mutation for deleting a subject
  const deleteMutation = useMutation({
    mutationFn: (id: string) => subjectService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] })
      toast.success('Matière supprimée !')
    },
    onError: () => toast.error('Erreur lors de la suppression')
  })

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setShowPicker(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSubject.name.trim()) return
    addMutation.mutate(newSubject)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Supprimer cette matière ?')) {
      deleteMutation.mutate(id)
    }
  }

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="max-w-7xl mx-auto px-6 pt-12 pb-24 space-y-16">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-pink-milk/30 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-pink-candy/10 rounded-full blur-[120px]" />
      </div>

      {/* Header Sophistiqué */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-black/5 pb-12">
        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center border border-black/5">
              <BookOpen size={24} className="text-pink-deep" strokeWidth={1.5} />
            </div>
            <div className="h-[1px] w-12 bg-black/10" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-hello-black/30">Curriculum</span>
          </motion.div>
          
          <div className="space-y-2">
            <h1 className="text-5xl md:text-7xl font-black text-hello-black tracking-tight">
              Matières
            </h1>
            <p className="text-xl text-hello-black/40 font-display italic">
              Personnalise ton univers d'apprentissage.
            </p>
          </div>
        </div>

        {/* Formulaire d'Ajout - Design Sophistiqué */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full md:max-w-xl"
        >
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-white/90 backdrop-blur-2xl rounded-[3rem] border border-white shadow-2xl shadow-black/[0.05] focus-within:shadow-pink-deep/5 transition-all duration-500">
              <div className="relative" ref={pickerRef}>
                <button
                  type="button"
                  onClick={() => setShowPicker(!showPicker)}
                  className="w-16 h-16 rounded-[2rem] border-4 border-white shadow-lg transition-all hover:scale-110 active:scale-95 flex items-center justify-center group/btn overflow-hidden relative"
                  style={{ backgroundColor: newSubject.color }}
                >
                  <Palette size={24} className="text-white mix-blend-difference" />
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                </button>

                <AnimatePresence>
                  {showPicker && (
                    <motion.div 
                      initial={{ opacity: 0, y: 15, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 15, scale: 0.9 }}
                      className="absolute top-full mt-6 left-0 z-[100] p-8 bg-white rounded-[3.5rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] border border-black/5"
                    >
                      <HexColorPicker 
                        color={newSubject.color} 
                        onChange={color => setNewSubject({...newSubject, color})} 
                      />
                      <div className="mt-8 flex items-center justify-between gap-6 px-2">
                        <div className="space-y-1">
                          <span className="text-[10px] font-black text-hello-black/20 uppercase tracking-[0.2em]">Couleur</span>
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: newSubject.color }} />
                            <span className="text-sm font-mono font-black text-hello-black uppercase tracking-wider">{newSubject.color}</span>
                          </div>
                        </div>
                        <button 
                          type="button"
                          onClick={() => setShowPicker(false)}
                          className="px-6 py-3 bg-hello-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-pink-deep hover:text-hello-black transition-colors"
                        >
                          OK
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex-1 relative group">
                <input 
                  type="text"
                  value={newSubject.name}
                  onChange={e => setNewSubject({...newSubject, name: e.target.value})}
                  placeholder="Nom de la matière..."
                  className="w-full bg-transparent border-none focus:ring-0 rounded-2xl h-14 px-2 text-lg font-bold placeholder:text-hello-black/10 outline-none text-hello-black"
                />
              </div>

              <button 
                type="submit" 
                disabled={addMutation.isPending || !newSubject.name.trim()}
                className="px-10 h-16 bg-hello-black text-white rounded-[2rem] flex items-center justify-center gap-3 hover:bg-pink-deep hover:text-hello-black transition-all active:scale-95 shadow-xl shadow-hello-black/10 disabled:opacity-20 disabled:grayscale disabled:cursor-not-allowed group"
              >
                {addMutation.isPending ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span className="hidden sm:inline text-[10px] font-black uppercase tracking-[0.3em]">Ajouter</span>
                    <Plus size={22} className="group-hover:rotate-90 transition-transform duration-500" />
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </header>

      {/* Liste des Matières */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {subjects.map((subject, index) => (
            <motion.div
              key={subject._id}
              layout
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
              transition={{ 
                delay: index * 0.05,
                type: "spring",
                stiffness: 260,
                damping: 20
              }}
              className="group relative"
            >
              <div className="h-full bg-white/40 backdrop-blur-sm rounded-[3rem] p-8 border border-white hover:bg-white/60 transition-all duration-500 hover:shadow-2xl hover:shadow-black/[0.02]">
                <div className="flex justify-between items-start mb-12">
                  <div 
                    className="w-16 h-16 rounded-[2rem] relative overflow-hidden flex items-center justify-center transition-transform duration-700 group-hover:rotate-6"
                    style={{ backgroundColor: `${subject.color}10` }}
                  >
                    <div 
                      className="absolute inset-0 opacity-20 blur-xl group-hover:opacity-40 transition-opacity"
                      style={{ backgroundColor: subject.color }}
                    />
                    <BookOpen size={28} style={{ color: subject.color }} strokeWidth={1.5} />
                  </div>
                  
                  <button 
                    onClick={() => handleDelete(subject._id)}
                    className="w-10 h-10 flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-50 text-red-400 rounded-2xl transition-all duration-300"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: subject.color }} />
                      <span className="text-[10px] font-black text-hello-black/20 uppercase tracking-[0.2em] font-mono">
                        {subject.color}
                      </span>
                    </div>
                    <h3 className="text-2xl font-black text-hello-black tracking-tight group-hover:text-pink-deep transition-colors duration-300">
                      {subject.name}
                    </h3>
                  </div>

                  <div className="pt-6 border-t border-black/5 flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-black/5" />
                      ))}
                    </div>
                    <span className="text-[10px] font-bold text-hello-black/30 uppercase tracking-widest">
                      0 Sessions
                    </span>
                  </div>
                </div>

                {/* Hover Effect Layer */}
                <div 
                  className="absolute inset-0 rounded-[3rem] opacity-0 group-hover:opacity-[0.02] pointer-events-none transition-opacity duration-500"
                  style={{ backgroundColor: subject.color }}
                />

                {/* Decorative Gradient Line */}
                <div 
                  className="absolute bottom-10 right-10 w-12 h-1 rounded-full opacity-20 group-hover:w-20 transition-all duration-500"
                  style={{ backgroundColor: subject.color }}
                />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

