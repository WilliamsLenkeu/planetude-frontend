import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, FileText, Calendar, CheckCircle, Clock, Star } from 'lucide-react'
import { motion } from 'framer-motion'
import { planningService } from '../services/planning.service'
import type { Planning, Session } from '../types/index'
import toast from 'react-hot-toast'

export default function PlanningDetail() {
  const { id } = useParams()
  const [data, setData] = useState<{ planning: Planning, sessions: Session[] } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return
      try {
        const result = await planningService.getById(id)
        setData({ planning: result, sessions: result.sessions || [] })
      } catch (error) {
        console.error('Erreur detail planning:', error)
        toast.error('Impossible de charger les détails du planning')
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [id])

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

  if (!data) return null

  const { planning, sessions } = data

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link to="/planning" className="p-2 bg-pink-milk rounded-full text-pink-candy hover:scale-110 transition-all">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h2 className="text-3xl font-bold text-hello-black">{planning.title} 🎀</h2>
          <p className="text-hello-black/60">Créé le {new Date(planning.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <button className="bg-white border-2 border-pink-candy text-hello-black font-bold py-2 px-6 rounded-kawaii-lg flex items-center gap-2 hover:bg-pink-milk transition-colors">
          <FileText size={18} /> Export PDF
        </button>
        <button className="bg-white border-2 border-pink-candy text-hello-black font-bold py-2 px-6 rounded-kawaii-lg flex items-center gap-2 hover:bg-pink-milk transition-colors">
          <Calendar size={18} /> Export iCal
        </button>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-bold text-hello-black flex items-center gap-2">
          Mes Sessions de Goûter 🧁
        </h3>
        
        <div className="grid gap-4">
          {sessions.length === 0 ? (
            <div className="kawaii-card text-center py-8 border-dashed border-pink-candy/30">
              <p className="text-hello-black/40">Aucune session prévue dans ce planning... 🌸</p>
            </div>
          ) : (
            sessions.map((session, index) => (
              <motion.div
                key={session._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`kawaii-card relative overflow-hidden border-2 ${
                  session.statut === 'termine' ? 'border-green-200 bg-green-50/30' : 'border-pink-candy/20 bg-white'
                }`}
              >
                {/* Aspect "Ticket Rose" */}
                <div className="absolute top-0 right-0 w-12 h-12 bg-pink-candy/10 rounded-bl-full flex items-center justify-center">
                  {session.statut === 'termine' ? (
                    <CheckCircle className="text-green-500" size={20} />
                  ) : (
                    <div className="w-2 h-2 bg-pink-candy rounded-full animate-pulse"></div>
                  )}
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold text-pink-candy uppercase tracking-widest">{session.matiere}</span>
                    <h4 className="text-xl font-bold text-hello-black">
                      {session.title || `Session ${new Date(session.debut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                    </h4>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-hello-black/60 font-semibold">
                      <Clock size={18} /> {session.duration || 0} min
                    </div>
                    {session.statut !== 'termine' && (
                      <button className="kawaii-button py-2 px-4 text-sm">
                        Démarrer ✨
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      <div className="kawaii-card bg-soft-gold/10 border-2 border-soft-gold/30">
        <p className="text-sm italic text-hello-black/80">
          "N'oublie pas de prendre une petite pause thé entre chaque session ! Ta concentration en sera meilleure. 🌸"
        </p>
        <p className="mt-2 font-bold text-hello-black/40">— PixelCoach Advice</p>
      </div>
    </div>
  )
}
