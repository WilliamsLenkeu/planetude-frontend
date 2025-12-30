import { useState, useEffect } from 'react'
import { Bell, Clock, Plus, Star, X, Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { reminderService, type Reminder } from '../services/reminder.service'
import toast from 'react-hot-toast'

export default function Reminders() {
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newReminder, setNewReminder] = useState({ title: '', date: '' })

  const fetchReminders = async () => {
    try {
      const data = await reminderService.getAll()
      setReminders(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Erreur rappels:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchReminders()
  }, [])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newReminder.title || !newReminder.date) return
    setIsSubmitting(true)
    try {
      const created = await reminderService.create(newReminder)
      setReminders(prev => [created, ...prev])
      setNewReminder({ title: '', date: '' })
      setIsModalOpen(false)
      toast.success('Rappel ajouté ! 🔔')
    } catch (error) {
      toast.error('Erreur lors de l\'ajout')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await reminderService.delete(id)
      setReminders(prev => prev.filter(r => r._id !== id))
      toast.success('Rappel supprimé !')
    } catch (error) {
      toast.error('Erreur lors de la suppression')
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-bounce">
          <div className="w-16 h-16 bg-pink-candy rounded-full border-4 border-white shadow-kawaii flex items-center justify-center">
            <Star className="text-white" size={32} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto py-8 md:py-12 space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="space-y-2 text-center md:text-left">
          <h2 className="text-4xl md:text-5xl font-semibold text-hello-black font-display flex items-center justify-center md:justify-start gap-4">
            Notes <span className="text-pink-candy">Rapides</span>
          </h2>
          <p className="text-hello-black/40 italic font-serif">"Ne laisse aucune idée s'envoler... 🕊️"</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-hello-black text-white px-8 py-3 rounded-full font-black text-xs uppercase tracking-[0.2em] hover:bg-pink-candy transition-all shadow-lg hover:scale-105 active:scale-95 flex items-center gap-2"
        >
          <Plus size={18} /> Épingler une note
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {reminders.length === 0 ? (
          <div className="col-span-full py-20 text-center">
            <div className="max-w-xs mx-auto space-y-4">
              <div className="w-20 h-20 bg-pink-milk/20 rounded-full flex items-center justify-center mx-auto border-2 border-dashed border-pink-candy/20">
                <Bell className="text-pink-candy/30" size={32} />
              </div>
              <p className="text-hello-black/40 italic font-serif">
                Ton tableau est vide. Prête à t'organiser ? 🌸
              </p>
            </div>
          </div>
        ) : (
          reminders.map((r, index) => (
            <motion.div 
              key={r._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ rotate: index % 2 === 0 ? -2 : 2, scale: 1.02 }}
              className={`p-8 min-h-[220px] shadow-notebook relative group flex flex-col justify-between ${
                index % 4 === 0 ? 'bg-[#fff9db] rotate-[-1deg]' : 
                index % 4 === 1 ? 'bg-[#ffecf2] rotate-[1deg]' :
                index % 4 === 2 ? 'bg-[#e3faf2] rotate-[-1.5deg]' :
                'bg-[#e7f5ff] rotate-[0.5deg]'
              }`}
            >
              {/* Pin Head Decorative */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full shadow-inner bg-pink-candy/20 border border-white/40" />
              
              <div className="pt-4 space-y-4">
                <div className="flex justify-between items-start">
                  <span className="font-semibold text-xl text-hello-black/80 font-display leading-tight">{r.title}</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black text-hello-black/30 uppercase tracking-widest bg-white/30 px-3 py-1.5 rounded-full w-fit">
                  <Clock size={12} />
                  {new Date(r.date).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <button 
                  onClick={() => handleDelete(r._id)}
                  className="p-2 text-hello-black/10 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-hello-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md"
            >
              <div className="notebook-page p-10 border-t-8 border-pink-candy">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-6 right-6 p-2 text-hello-black/20 hover:text-pink-candy transition-colors"
                >
                  <X size={24} />
                </button>

                <div className="mb-8">
                  <h3 className="text-2xl font-semibold text-hello-black font-display">Nouvelle Note</h3>
                  <p className="text-pink-deep/40 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Épingle un nouveau rappel</p>
                </div>

                <form onSubmit={handleAdd} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-pink-deep/40 uppercase tracking-[0.2em] ml-1">Titre de la note</label>
                    <input
                      required
                      type="text"
                      value={newReminder.title}
                      onChange={e => setNewReminder({ ...newReminder, title: e.target.value })}
                      placeholder="Ex: Réviser la bio 🧬"
                      className="w-full bg-pink-milk/10 border-b-2 border-pink-milk/30 p-3 focus:outline-none focus:border-pink-candy transition-colors font-display text-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-pink-deep/40 uppercase tracking-[0.2em] ml-1">Date et heure</label>
                    <input
                      required
                      type="datetime-local"
                      value={newReminder.date}
                      onChange={e => setNewReminder({ ...newReminder, date: e.target.value })}
                      className="w-full bg-pink-milk/10 border-b-2 border-pink-milk/30 p-3 focus:outline-none focus:border-pink-candy transition-colors font-sans text-sm"
                    />
                  </div>
                  <button 
                    disabled={isSubmitting}
                    className="w-full bg-hello-black text-white py-4 rounded-full font-black text-xs uppercase tracking-[0.2em] hover:bg-pink-candy transition-all shadow-lg hover:scale-[1.02] active:scale-95 disabled:opacity-50 mt-4"
                  >
                    {isSubmitting ? 'Épinglage...' : 'Épingler sur le tableau ✨'}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
