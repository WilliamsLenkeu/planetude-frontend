import { useState, useEffect } from 'react'
import { Bell, Clock, Plus, Star } from 'lucide-react'
import { motion } from 'framer-motion'
import { reminderService, type Reminder } from '../services/reminder.service'

export default function Reminders() {
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const data = await reminderService.getAll()
        setReminders(data)
      } catch (error) {
        console.error('Erreur rappels:', error)
        // On ne met pas de toast ici car le service peut ne pas exister encore sur le backend
      } finally {
        setIsLoading(false)
      }
    }
    fetchReminders()
  }, [])

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
        <button className="kawaii-button flex items-center gap-2">
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
              key={r.id}
              whileHover={{ x: 5 }}
              className="kawaii-card bg-white flex items-center justify-between border-2 border-pink-milk"
            >
              <div className="flex items-center gap-4">
                <div className="bg-pink-milk p-2 rounded-full">
                  <Clock className="text-pink-candy" size={20} />
                </div>
                <span className="font-bold text-hello-black">{r.title}</span>
              </div>
              <span className="text-pink-candy font-bold">{r.time}</span>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
