import { useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, FileText, Calendar, CheckCircle, Clock, Star, Play, Bookmark, X, Zap, BookOpen, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { planningService } from '../services/planning.service'
import { subjectService } from '../services/subject.service'
import type { Session } from '../types/index'
import toast from 'react-hot-toast'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import { LoadingSpinner } from '../components/ui/LoadingSpinner'

export default function PlanningDetail() {
  const { id } = useParams()
  const queryClient = useQueryClient()
  const [isExporting, setIsExporting] = useState(false)

  // Focus Mode State
  const [activeSession, setActiveSession] = useState<Session | null>(null)
  const [timeLeft, setTimeLeft] = useState(25 * 60) // 25 minutes default
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [sessionNotes, setSessionNotes] = useState('')

  const { data, isLoading: isPlanningLoading } = useQuery({
    queryKey: ['planning', id],
    queryFn: () => planningService.getById(id!),
    enabled: !!id,
    select: (data) => ({ planning: data, sessions: data.sessions || [] })
  })

  const { data: subjects = [], isLoading: isSubjectsLoading } = useQuery({
    queryKey: ['subjects'],
    queryFn: subjectService.getAll,
    select: (data) => Array.isArray(data) ? data : []
  })

  const updateSessionMutation = useMutation({
    mutationFn: ({ sessionId, updates }: { sessionId: string, updates: any }) => 
      planningService.updateSession(id!, sessionId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['planning', id] })
      setActiveSession(null)
      setSessionNotes('')
      toast.success('Session terminée ! Tu as gagné de l\'XP')
    },
    onError: () => {
      toast.error('Erreur lors de la validation de la session')
    }
  })

  const handleCompleteSession = useCallback(async () => {
    if (!id || !activeSession || !activeSession._id) return
    setIsTimerRunning(false)
    updateSessionMutation.mutate({ 
      sessionId: activeSession._id, 
      updates: { statut: 'termine', notes: sessionNotes } 
    })
  }, [id, activeSession, sessionNotes, updateSessionMutation])

  const isLoading = isPlanningLoading || isSubjectsLoading

  // Timer logic
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
    } else if (timeLeft === 0 && isTimerRunning) {
      // Signal sonore simple
      try {
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3')
        audio.play()
      } catch (e) {
        console.warn('Erreur lecture audio:', e)
      }
      handleCompleteSession()
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isTimerRunning, timeLeft, handleCompleteSession])

  const handleStartFocus = (session: Session) => {
    setActiveSession(session)
    setTimeLeft(25 * 60) // Reset to 25 mins for Pomodoro
    setIsTimerRunning(true)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleExport = async (type: 'pdf' | 'ical') => {
    if (!id || !data?.planning) return
    setIsExporting(true)
    const toastId = toast.loading(`Génération du ${type.toUpperCase()}...`)
    try {
      const blob = type === 'pdf' 
        ? await planningService.exportPDF(id)
        : await planningService.exportICal(id)
      
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `planning-${data.planning.titre || 'etude'}.${type === 'pdf' ? 'pdf' : 'ics'}`)
      document.body.appendChild(link)
      link.click()
      link.parentNode?.removeChild(link)
      toast.success(`${type.toUpperCase()} exporté !`, { id: toastId })
    } catch (error) {
      console.error(`Erreur export ${type}:`, error)
      toast.error(`Impossible d'exporter en ${type.toUpperCase()}`, { id: toastId })
    } finally {
      setIsExporting(false)
    }
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (!data) return null

  const { planning, sessions } = data

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-5 px-4">
      {/* En-tête avec navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-5">
          <Link 
            to="/planning" 
            className="group flex items-center gap-2 text-hello-black/40 hover:text-pink-deep transition-colors"
          >
            <div className="p-1.5 bg-white border-2 border-pink-candy/5 shadow-sm group-hover:shadow-md transition-all rounded-full">
              <ArrowLeft size={16} />
            </div>
            <span className="font-black uppercase tracking-[0.2em] text-[10px]">Retour</span>
          </Link>
          
          <div className="h-6 w-[1.5px] bg-pink-milk hidden md:block" />
          
          <div className="hidden md:block">
            <h2 className="text-2xl font-black text-hello-black italic font-serif leading-none">
              {planning.titre}
            </h2>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-hello-black/30 mt-1">
              Journal créé le {planning.createdAt ? new Date(planning.createdAt).toLocaleDateString() : 'récemment'}
            </p>
          </div>
        </div>

        <div className="flex gap-2.5">
          <button 
            onClick={() => handleExport('pdf')}
            disabled={isExporting}
            className="p-2.5 bg-white border-2 border-pink-candy/5 text-hello-black/60 hover:text-pink-deep hover:border-pink-candy/10 transition-all rounded-lg disabled:opacity-50 shadow-sm"
            title="Exporter en PDF"
          >
            <FileText size={16} />
          </button>
          <button 
            onClick={() => handleExport('ical')}
            disabled={isExporting}
            className="p-2.5 bg-white border-2 border-pink-candy/5 text-hello-black/60 hover:text-pink-deep hover:border-pink-candy/10 transition-all rounded-lg disabled:opacity-50 shadow-sm"
            title="Exporter en iCal"
          >
            <Calendar size={16} />
          </button>
        </div>
      </div>

      <div className="relative">
        <div className="chic-card p-6 md:p-10 relative overflow-hidden group">
          {/* Decorative element */}
          <div className="absolute -top-20 -right-20 w-52 h-52 bg-pink-milk/20 rounded-full blur-3xl transition-transform duration-1000 group-hover:scale-125" />

          <div className="flex items-center gap-4 mb-10 relative z-10">
            <div className="w-10 h-10 bg-pink-milk/50 rounded-xl flex items-center justify-center text-pink-deep border-2 border-pink-candy/5 shadow-sm">
              <Bookmark size={20} strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-hello-black font-display tracking-tight leading-tight">
                Détails du Programme
              </h3>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-pink-deep/40">Organisation & Focus</p>
            </div>
          </div>
          
          <div className="space-y-5 relative z-10">
            {sessions.length === 0 ? (
              <div className="text-center py-16 bg-pink-milk/10 border-2 border-dashed border-pink-candy/20 rounded-[2rem]">
                <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center mx-auto mb-5 shadow-sm border-2 border-pink-candy/5">
                  <Star className="text-pink-deep/30" size={20} />
                </div>
                <p className="text-hello-black/40 font-medium italic text-lg font-display">Aucune session prévue dans ce planning...</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {sessions.map((session, index) => {
                  const subject = subjects.find(s => s.name === session.matiere || s._id === session.matiere)
                  const startTime = session.debut
                  const endTime = session.fin

                  return (
                    <motion.div
                      key={session._id || index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`group relative p-6 rounded-[1.5rem] border-2 transition-all duration-500 ${
                        session.statut === 'termine' 
                          ? 'bg-pink-milk/10 border-pink-candy/5 opacity-60' 
                          : 'bg-white border-pink-candy/5 shadow-sm hover:shadow-xl hover:-translate-y-1'
                      }`}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-5">
                          <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-500 border-2 ${
                            session.statut === 'termine' 
                              ? 'bg-green-50 text-green-500 border-green-100' 
                              : 'bg-pink-milk/50 text-pink-deep border-pink-candy/10'
                          }`}>
                            <BookOpen size={24} strokeWidth={1.5} />
                          </div>
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2.5 flex-wrap">
                              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-pink-deep bg-pink-milk/50 px-2.5 py-1 rounded-full border-2 border-pink-candy/5">
                                {session.matiere || subject?.name || 'Matière'}
                              </span>
                              {session.statut === 'termine' && (
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-green-600 bg-green-50 px-2.5 py-1 rounded-full border-2 border-green-100 flex items-center gap-1.5">
                                  <CheckCircle size={10} /> Terminé
                                </span>
                              )}
                              <span className={`text-[9px] px-2.5 py-1 rounded-full font-black uppercase tracking-[0.2em] border-2 ${
                                session.priority === 'HIGH' ? 'bg-red-50 text-red-400 border-red-100' : 
                                session.priority === 'MEDIUM' ? 'bg-orange-50 text-orange-400 border-orange-100' : 
                                'bg-green-50 text-green-400 border-green-100'
                              }`}>
                                {session.priority || 'MEDIUM'}
                              </span>
                            </div>
                            <h4 className="text-xl font-black text-hello-black font-display tracking-tight leading-tight">
                              {startTime ? new Date(startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Prévue'}
                              {endTime ? ` - ${new Date(endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : ''}
                            </h4>
                            <p className="text-[10px] text-hello-black/30 font-black uppercase tracking-[0.2em]">
                              {startTime ? new Date(startTime).toLocaleDateString() : ''} • {session.method || 'DEEP_WORK'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between md:justify-end gap-5 md:gap-8">
                          <div className="flex items-center gap-2 text-hello-black/30 font-black uppercase tracking-[0.2em] text-[10px]">
                            <Clock size={14} className="text-pink-candy/40" /> 25 min
                          </div>
                          {session.statut !== 'termine' && (
                            <button 
                              onClick={() => handleStartFocus(session)}
                              className="chic-button-primary py-3 px-6 text-[10px] flex items-center gap-2.5 group/btn hover:text-hello-black"
                            >
                              <Play size={12} fill="currentColor" className="group-hover/btn:scale-110 transition-transform" /> Mode Focus
                            </button>
                          )}
                          {session.statut === 'termine' && (
                            <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center border-2 border-green-100">
                              <CheckCircle size={20} />
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Note style Post-it - Version épurée */}
          <div className="mt-10">
            <motion.div 
              whileHover={{ scale: 1.01 }}
              className="bg-[#FDFBF7] p-6 rounded-[1.5rem] border border-pink-candy/10 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-3 opacity-10">
                <Sparkles size={32} />
              </div>
              <p className="text-hello-black/60 font-display italic text-base leading-relaxed relative z-10">
                "N'oublie pas de prendre une petite pause thé entre chaque session ! Ta concentration en sera meilleure."
              </p>
              <p className="mt-3 text-[9px] font-black uppercase tracking-[0.2em] text-pink-deep/40">
                — Conseil de ton Studio
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Focus Mode Modal */}
      <AnimatePresence>
        {activeSession && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-hello-black/20 backdrop-blur-xl">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="chic-card p-8 md:p-10 w-full max-w-lg text-center relative overflow-hidden"
            >
              {/* Decorative background */}
              <div className="absolute -top-20 -right-20 w-52 h-52 bg-pink-milk/20 rounded-full blur-3xl transition-transform duration-1000 group-hover:scale-125" />
              
              <button 
                onClick={() => {
                  setActiveSession(null)
                  setIsTimerRunning(false)
                }}
                className="absolute top-6 right-6 p-2 text-hello-black/20 hover:text-pink-deep transition-all hover:scale-110"
              >
                <X size={24} />
              </button>

              <div className="space-y-8 relative z-10">
                <div className="inline-flex p-6 bg-pink-milk/50 rounded-[2rem] border-2 border-pink-candy/10 shadow-sm">
                  <Clock className="text-pink-deep animate-pulse" size={44} strokeWidth={1.5} />
                </div>
                
                <div className="space-y-2.5">
                  <div className="inline-flex px-4 py-1.5 bg-pink-milk/50 rounded-full border-2 border-pink-candy/10 mb-1.5">
                    <span className="text-[10px] font-black text-pink-deep uppercase tracking-[0.2em]">
                      Focus Mode
                    </span>
                  </div>
                  <h3 className="text-3xl font-black text-hello-black font-display tracking-tight">
                    {subjects.find(s => s._id === (activeSession.subjectId || activeSession.matiere) || s.name === activeSession.matiere)?.name || 'Matière'}
                  </h3>
                  <p className="text-hello-black/40 font-medium italic font-display text-lg">
                    {activeSession.method || 'Pomodoro'} • Reste concentrée ✨
                  </p>
                </div>

                <div className="text-7xl md:text-8xl font-black text-hello-black font-display tracking-tighter leading-none">
                  {formatTime(timeLeft)}
                </div>

                <div className="space-y-3.5 text-left">
                  <label className="text-[10px] font-black text-hello-black/40 uppercase tracking-[0.2em] ml-2">
                    Notes de session
                  </label>
                  <textarea
                    value={sessionNotes}
                    onChange={(e) => setSessionNotes(e.target.value)}
                    placeholder="Qu'as-tu accompli pendant cette session ?"
                    className="chic-input h-28 resize-none py-5"
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                    className={`flex-1 py-4 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] transition-all border-2 ${
                      isTimerRunning 
                        ? 'bg-orange-50 text-orange-400 border-orange-100 hover:bg-orange-100' 
                        : 'bg-green-50 text-green-400 border-green-100 hover:bg-green-100'
                    }`}
                  >
                    {isTimerRunning ? 'Pause' : 'Reprendre'}
                  </button>
                  <button
                    onClick={handleCompleteSession}
                    className="flex-[2] chic-button-primary py-4 text-[10px] hover:text-hello-black"
                  >
                    <Zap size={14} fill="currentColor" className="mr-2" /> Terminer maintenant
                  </button>
                </div>

                <p className="text-[10px] text-hello-black/20 font-black uppercase tracking-[0.2em] italic">
                  Chaque minute compte pour ton succès ✨
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
