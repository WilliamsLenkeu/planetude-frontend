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
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-hello-black flex items-center gap-2">
          Mes Rappels <Bell className="text-pink-candy" />
        </h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="kawaii-button flex items-center gap-2"
        >
          <Plus size={20} /> Ajouter
        </button>
      </div>

      <div className="space-y-4">
        {reminders.length === 0 ? (
          <div className="kawaii-card text-center py-12">
            <p className="text-hello-black/40">Aucun rappel pour le moment... 🌸</p>
          </div>
        ) : (
          reminders.map((r) => (
            <motion.div 
              key={r._id}
              whileHover={{ x: 5 }}
              className="kawaii-card bg-white flex items-center justify-between border-2 border-pink-milk group"
            >
              <div className="flex items-center gap-4">
                <div className="bg-pink-milk p-2 rounded-full">
                  <Clock className="text-pink-candy" size={20} />
                </div>
                <div>
                  <span className="font-bold text-hello-black block">{r.title}</span>
                  <span className="text-pink-candy text-sm font-bold">
                    {new Date(r.date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => handleDelete(r._id)}
                className="p-2 text-hello-black/20 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={20} />
              </button>
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
              className="absolute inset-0 bg-hello-black/20 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-kawaii-lg shadow-kawaii p-8 border-2 border-pink-milk"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 p-2 text-hello-black/20 hover:text-pink-candy"
              >
                <X size={20} />
              </button>

              <h3 className="text-xl font-bold text-hello-black mb-6">Nouveau Rappel 🔔</h3>

              <form onSubmit={handleAdd} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-hello-black/40 uppercase ml-2">Titre</label>
                  <input
                    required
                    type="text"
                    value={newReminder.title}
                    onChange={e => setNewReminder({ ...newReminder, title: e.target.value })}
                    placeholder="Ex: Réviser la bio 🧬"
                    className="w-full bg-pink-milk/20 border-2 border-pink-milk/50 rounded-kawaii p-3 focus:outline-none focus:border-pink-candy"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-hello-black/40 uppercase ml-2">Date et heure</label>
                  <input
                    required
                    type="datetime-local"
                    value={newReminder.date}
                    onChange={e => setNewReminder({ ...newReminder, date: e.target.value })}
                    className="w-full bg-pink-milk/20 border-2 border-pink-milk/50 rounded-kawaii p-3 focus:outline-none focus:border-pink-candy"
                  />
                </div>
                <button 
                  disabled={isSubmitting}
                  className="w-full kawaii-button py-4 mt-4 disabled:opacity-50"
                >
                  {isSubmitting ? 'Ajout...' : 'Ajouter le rappel ✨'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
