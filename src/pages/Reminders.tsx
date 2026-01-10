import { useState, useRef, useEffect } from 'react'
import { Bell, Plus, Star, X, Trash2, Calendar, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { reminderService, type Reminder } from '../services/reminder.service'
import toast from 'react-hot-toast'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export default function Reminders() {
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newReminder, setNewReminder] = useState({ title: '', date: '' })
  const modalRef = useRef<HTMLDivElement>(null)

  const { data: reminders = [], isLoading } = useQuery({
    queryKey: ['reminders'],
    queryFn: reminderService.getAll,
    select: (data) => Array.isArray(data) ? data : []
  })

  const addMutation = useMutation({
    mutationFn: (reminder: { title: string; date: string }) => reminderService.create(reminder),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders'] })
      setNewReminder({ title: '', date: '' })
      setIsModalOpen(false)
      toast.success('Rappel ajouté ! 🔔')
    },
    onError: () => {
      toast.error('Erreur lors de l\'ajout')
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => reminderService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders'] })
      toast.success('Rappel supprimé !')
    },
    onError: () => {
      toast.error('Erreur lors de la suppression')
    }
  })

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsModalOpen(false)
      }
    }
    if (isModalOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isModalOpen])

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newReminder.title || !newReminder.date) return
    addMutation.mutate(newReminder)
  }

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="min-h-screen relative overflow-hidden pb-20">
      {/* Background Decorative Elements - Design 2.0 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-pink-milk/30 rounded-full blur-[140px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, -8, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-cloud/20 rounded-full blur-[140px]" 
        />
      </div>

      <div className="max-w-7xl mx-auto pt-8 px-4 md:px-8 relative z-10 space-y-12">
        {/* Header Section - Design Immersif */}
        <section>
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/40 backdrop-blur-2xl rounded-[3.5rem] p-10 border border-white relative overflow-hidden group shadow-2xl shadow-black/[0.02]"
          >
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-pink-milk/20 rounded-full blur-3xl transition-transform duration-1000 group-hover:scale-125" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-4 text-center md:text-left">
                <div className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-white/60 backdrop-blur-md rounded-full border border-white shadow-sm">
                  <Bell size={14} className="text-pink-deep animate-pulse" />
                  <span className="text-[10px] font-bold text-pink-deep uppercase tracking-[0.2em]">Organisation & Focus</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-hello-black tracking-tight leading-tight">
                  Tes Notes <span className="text-pink-deep italic font-serif font-normal">Précieuses</span>
                </h1>
                <p className="text-lg text-hello-black/40 font-medium italic">
                  Capture tes idées avant qu'elles ne s'envolent... ✨
                </p>
              </div>

              <motion.button 
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsModalOpen(true)}
                className="bg-hello-black text-white px-8 py-5 rounded-[2.5rem] font-bold text-[12px] uppercase tracking-[0.2em] flex items-center gap-4 shadow-2xl shadow-black/10 hover:bg-pink-deep transition-all duration-500 group"
              >
                <div className="p-2 bg-white/10 rounded-xl group-hover:rotate-90 transition-transform duration-500">
                  <Plus size={18} />
                </div>
                Ajouter une note
              </motion.button>
            </div>
          </motion.div>
        </section>

        {/* Reminders Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <AnimatePresence mode="popLayout">
            {reminders.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="col-span-full py-32 text-center bg-white/30 backdrop-blur-xl border border-white rounded-[4rem] flex flex-col items-center gap-8 shadow-xl shadow-black/[0.01]"
              >
                <div className="w-32 h-32 bg-white rounded-[3rem] shadow-xl border border-pink-milk flex items-center justify-center relative group">
                  <div className="absolute inset-0 bg-pink-milk/20 rounded-[3rem] animate-ping opacity-30" />
                  <Bell className="text-pink-deep group-hover:rotate-12 transition-transform duration-500" size={48} strokeWidth={1.5} />
                </div>
                <div className="space-y-3">
                  <p className="text-2xl font-black text-hello-black tracking-tight">Ton tableau est encore vierge</p>
                  <p className="text-lg text-hello-black/30 italic font-medium">Prête à t'organiser pour réussir ? ✨</p>
                </div>
              </motion.div>
            ) : (
              reminders.map((r: Reminder, index: number) => (
                <motion.div 
                  key={r._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -10 }}
                  className="bg-white/40 backdrop-blur-xl p-8 rounded-[3.5rem] border border-white flex flex-col justify-between group relative overflow-hidden shadow-lg shadow-black/[0.01] min-h-[280px]"
                >
                  <div className="absolute -top-20 -right-20 w-48 h-48 bg-pink-milk/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                  
                  <div className="space-y-6 relative z-10">
                    <div className="flex justify-between items-start">
                      <div className="p-3 bg-white rounded-2xl border border-pink-candy/10 shadow-sm group-hover:rotate-6 transition-transform">
                        <Star className="text-pink-deep size-5" fill="currentColor" />
                      </div>
                    </div>
                    
                    <h3 className="font-black text-2xl text-hello-black leading-[1.2] tracking-tight group-hover:text-pink-deep transition-colors duration-500">
                      {r.title}
                    </h3>
                  </div>

                  <div className="space-y-6 relative z-10 mt-8">
                    <div className="flex items-center gap-3 px-4 py-2.5 bg-white/60 backdrop-blur-md rounded-2xl border border-white shadow-sm w-fit">
                      <Calendar size={14} className="text-pink-deep" />
                      <span className="text-[10px] font-bold text-pink-deep uppercase tracking-[0.2em]">
                        {new Date(r.date).toLocaleString('fr-FR', { 
                          day: 'numeric', 
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>

                    <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-3 group-hover:translate-y-0">
                      <motion.button 
                        whileHover={{ scale: 1.1, rotate: 12 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => deleteMutation.mutate(r._id)}
                        className="p-4 bg-white text-red-400 rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all duration-300 shadow-sm border border-red-100"
                      >
                        <Trash2 size={20} />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Modal - Design 2.0 */}
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-hello-black/10 backdrop-blur-xl"
              />
              <motion.div
                ref={modalRef}
                initial={{ opacity: 0, scale: 0.95, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 40 }}
                className="bg-white/60 backdrop-blur-2xl rounded-[4rem] border border-white p-10 md:p-14 w-full max-w-xl relative overflow-hidden shadow-2xl"
              >
                <div className="absolute -top-32 -right-32 w-96 h-96 bg-pink-milk/20 rounded-full blur-3xl" />
                
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-10 right-10 p-4 bg-white rounded-2xl text-hello-black/20 hover:text-pink-deep transition-all z-20 hover:scale-110 shadow-sm border border-pink-milk/10"
                >
                  <X size={20} />
                </button>

                <div className="mb-12 relative z-10 space-y-4">
                  <div className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-white/80 backdrop-blur-md rounded-full border border-white shadow-sm">
                    <Sparkles size={14} className="text-pink-deep" />
                    <span className="text-[10px] font-bold text-pink-deep uppercase tracking-[0.2em]">Nouveau Rappel</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black text-hello-black tracking-tight">
                    Fixe ton <span className="text-pink-deep italic font-serif font-normal">Objectif</span>
                  </h2>
                  <p className="text-lg text-hello-black/40 font-medium italic">Qu'as-tu besoin de ne pas oublier ? ✨</p>
                </div>

                <form onSubmit={handleAdd} className="space-y-8 relative z-10">
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-hello-black/30 uppercase tracking-[0.3em] ml-6">
                      Objet du rappel
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Réviser la biochimie..."
                      value={newReminder.title}
                      onChange={(e) => setNewReminder({...newReminder, title: e.target.value})}
                      className="w-full bg-white/50 backdrop-blur-md border border-white rounded-[2rem] px-8 py-5 text-hello-black placeholder:text-hello-black/20 focus:outline-none focus:ring-2 focus:ring-pink-milk transition-all font-medium"
                      required
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-hello-black/30 uppercase tracking-[0.3em] ml-6">
                      Date & Heure limite
                    </label>
                    <input
                      type="datetime-local"
                      value={newReminder.date}
                      onChange={(e) => setNewReminder({...newReminder, date: e.target.value})}
                      className="w-full bg-white/50 backdrop-blur-md border border-white rounded-[2rem] px-8 py-5 text-hello-black focus:outline-none focus:ring-2 focus:ring-pink-milk transition-all font-medium"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={addMutation.isPending}
                    className="w-full bg-hello-black text-white py-6 rounded-[2.5rem] font-black text-[12px] uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-pink-deep hover:text-hello-black transition-all duration-500 shadow-xl disabled:opacity-50"
                  >
                    {addMutation.isPending ? (
                      <div className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Star size={16} fill="currentColor" />
                        Épingler sur mon tableau
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
