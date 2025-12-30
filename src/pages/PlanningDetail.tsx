import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, FileText, Calendar, CheckCircle, Clock, Star, Play, Bookmark } from 'lucide-react'
import { motion } from 'framer-motion'
import { planningService } from '../services/planning.service'
import { progressService } from '../services/progress.service'
import type { Planning, Session } from '../types/index'
import toast from 'react-hot-toast'

export default function PlanningDetail() {
  const { id } = useParams()
  const [data, setData] = useState<{ planning: Planning, sessions: Session[] } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isExporting, setIsExporting] = useState(false)

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

  useEffect(() => {
    fetchData()
  }, [id])

  const handleExport = async (type: 'pdf' | 'ical') => {
    if (!id || !data) return
    setIsExporting(true)
    try {
      const blob = type === 'pdf' 
        ? await planningService.exportPDF(id)
        : await planningService.exportICal(id)
      
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `planning-${data.planning.title || 'export'}.${type === 'pdf' ? 'pdf' : 'ics'}`)
      document.body.appendChild(link)
      link.click()
      link.parentNode?.removeChild(link)
      toast.success(`Export ${type.toUpperCase()} réussi ! ✨`)
    } catch (error) {
      toast.error('Erreur lors de l\'export')
    } finally {
      setIsExporting(false)
    }
  }

  const handleStartSession = async (session: Session) => {
    try {
      const duration = session.duration || 25
      const response = await progressService.recordSession({
        subjectId: session.matiere,
        durationMinutes: duration,
        notes: `Session de planning: ${session.title || 'Sans titre'}`
      })
      
      toast.success(`Session terminée ! +${(response as any).data?.xpGained || 15} XP ✨`)
      await fetchData()
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors du démarrage')
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-bounce">
          <div className="w-16 h-16 bg-pink-candy rounded-full border-4 border-white shadow-notebook flex items-center justify-center">
            <Star className="text-white" size={32} />
          </div>
        </div>
      </div>
    )
  }

  if (!data) return null

  const { planning, sessions } = data

  return (
    <div className="max-w-5xl mx-auto space-y-10 py-6 px-4">
      {/* En-tête avec navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link 
            to="/planning" 
            className="group flex items-center gap-2 text-hello-black/40 hover:text-pink-deep transition-colors"
          >
            <div className="p-2 bg-white shadow-sm group-hover:shadow-md transition-all rounded-full">
              <ArrowLeft size={20} />
            </div>
            <span className="font-black uppercase tracking-widest text-[10px]">Retour à l'agenda</span>
          </Link>
          
          <div className="h-8 w-[2px] bg-pink-milk hidden md:block" />
          
          <div className="hidden md:block">
            <h2 className="text-3xl font-black text-hello-black italic font-serif leading-none">{planning.title}</h2>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-hello-black/30 mt-1">
              Journal créé le {new Date(planning.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={() => handleExport('pdf')}
            disabled={isExporting}
            className="p-3 bg-white shadow-sm border border-gray-100 text-hello-black hover:bg-pink-milk transition-colors disabled:opacity-50"
            title="Exporter en PDF"
          >
            <FileText size={18} />
          </button>
          <button 
            onClick={() => handleExport('ical')}
            disabled={isExporting}
            className="p-3 bg-white shadow-sm border border-gray-100 text-hello-black hover:bg-pink-milk transition-colors disabled:opacity-50"
            title="Exporter en iCal"
          >
            <Calendar size={18} />
          </button>
        </div>
      </div>

      <div className="relative">
        {/* Anneaux de classeur pour l'immersion */}
        <div className="absolute left-[-1rem] top-10 bottom-10 flex flex-col justify-around z-20 pointer-events-none hidden md:flex">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="w-5 h-5 rounded-full bg-gradient-to-br from-gray-300 to-gray-100 border border-gray-400/30 shadow-sm" />
          ))}
        </div>

        <div className="notebook-page p-6 md:p-12 shadow-2xl relative">
          <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden">
            <div className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-pink-candy/10 rotate-45 border-b-2 border-pink-candy/20" />
          </div>

          <div className="flex items-center gap-3 mb-10 md:pl-8">
            <Bookmark className="text-pink-deep fill-pink-deep" size={24} />
            <h3 className="text-2xl font-black text-hello-black uppercase tracking-wider">
              Détails du Programme
            </h3>
          </div>
          
          <div className="space-y-6 md:pl-8 relative z-10">
            {sessions.length === 0 ? (
              <div className="text-center py-16 bg-pink-milk/20 border-2 border-dashed border-pink-milk/50">
                <p className="text-hello-black/40 font-display italic text-lg">Aucune session prévue dans ce planning... 🌸</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {sessions.map((session, index) => (
                  <motion.div
                    key={session._id || index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`group relative p-6 border-l-4 transition-all duration-300 ${
                      session.statut === 'termine' 
                        ? 'bg-green-50/30 border-green-200' 
                        : 'bg-white shadow-sm hover:shadow-md border-pink-candy hover:translate-x-1'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase tracking-widest text-pink-deep bg-pink-milk px-2 py-0.5">
                            {session.matiere}
                          </span>
                          {session.statut === 'termine' && (
                            <span className="text-[10px] font-black uppercase tracking-widest text-green-600 bg-green-100 px-2 py-0.5">
                              Terminé ✨
                            </span>
                          )}
                        </div>
                        <h4 className="text-xl font-black text-hello-black font-display">
                          {session.title || (session.debut ? `Session de ${new Date(session.debut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Prévue')}
                        </h4>
                      </div>
                      
                      <div className="flex items-center gap-8">
                        <div className="flex items-center gap-2 text-hello-black/40 font-black uppercase tracking-widest text-[10px]">
                          <Clock size={14} /> {session.duration || 25} min
                        </div>
                        {session.statut !== 'termine' && (
                          <button 
                            onClick={() => handleStartSession(session)}
                            className="bg-hello-black text-white px-6 py-3 font-black uppercase tracking-widest text-[10px] shadow-sm hover:shadow-md transition-all flex items-center gap-2"
                          >
                            <Play size={12} fill="currentColor" /> Démarrer
                          </button>
                        )}
                        {session.statut === 'termine' && (
                          <div className="p-3 bg-green-100 text-green-600 rounded-full">
                            <CheckCircle size={20} />
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Note style Post-it */}
          <div className="mt-12 md:pl-8">
            <motion.div 
              whileHover={{ rotate: 0 }}
              className="bg-pink-milk/30 p-8 border-l-8 border-pink-candy rotate-1 relative max-w-2xl"
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-pink-candy/10 border border-pink-candy/5 backdrop-blur-[2px]" />
              <p className="text-hello-black/70 font-serif italic text-lg leading-relaxed">
                "N'oublie pas de prendre une petite pause thé entre chaque session ! Ta concentration en sera meilleure. 🌸"
              </p>
              <p className="mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-hello-black/30">
                — Note de PixelCoach
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
