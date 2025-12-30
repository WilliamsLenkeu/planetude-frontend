import { useState, useEffect } from 'react'
import { Plus, Trash2, Download, X, Calendar as CalendarIcon, BookOpen, Clock, Sparkles, Star, Hash } from 'lucide-react'
import { Link } from 'react-router-dom'
import { planningService } from '../services/planning.service'
import { subjectService } from '../services/subject.service'
import type { Planning as PlanningType, Subject } from '../types/index'
import toast from 'react-hot-toast'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { motion, AnimatePresence } from 'framer-motion'

export default function Planning() {
  const [plannings, setPlannings] = useState<PlanningType[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [selectedSubjectIds, setSelectedSubjectIds] = useState<string[]>([])

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    periode: 'semaine',
    nombre: 1, // Nombre de jours, semaines ou mois
    dateDebut: new Date().toISOString().split('T')[0],
    dateFin: '',
    defaultDuration: 90 // durée par défaut en minutes
  })

  // Calcul automatique de la date de fin
  useEffect(() => {
    if (!formData.dateDebut) return;
    
    const start = new Date(formData.dateDebut);
    const end = new Date(start);
    const n = formData.nombre || 1;
    
    if (formData.periode === 'jour') {
      end.setDate(start.getDate() + (n - 1));
    } else if (formData.periode === 'semaine') {
      end.setDate(start.getDate() + (n * 7));
    } else if (formData.periode === 'mois') {
      end.setMonth(start.getMonth() + n);
    }
    
    setFormData(prev => ({
      ...prev,
      dateFin: end.toISOString().split('T')[0]
    }));
  }, [formData.dateDebut, formData.periode, formData.nombre]);

  const [subjectSettings, setSubjectSettings] = useState<Record<string, { duration: number }>>({})

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [planningsData, subjectsData] = await Promise.all([
          planningService.getAll(),
          subjectService.getAll()
        ])
        setPlannings(Array.isArray(planningsData) ? planningsData : [])
        
        const subjectsList = Array.isArray(subjectsData) ? subjectsData : []
        setSubjects(subjectsList)
        
        if (subjectsList.length > 0) {
          const initialIds = subjectsList.map(s => s._id || (s as any).id)
          setSelectedSubjectIds(initialIds)
          
          // Initialiser les réglages par matière
          const initialSettings: Record<string, { duration: number }> = {}
          initialIds.forEach(id => {
            initialSettings[id] = { duration: 90 }
          })
          setSubjectSettings(initialSettings)
        }
      } catch (error) {
        console.error('Erreur chargement:', error)
        toast.error('Impossible de charger les données')
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Veux-tu vraiment supprimer ce planning ? 🥺')) return
    try {
      await planningService.delete(id)
      setPlannings(plannings.filter(p => p._id !== id))
      toast.success('Planning supprimé !')
    } catch (error) {
      toast.error('Erreur lors de la suppression')
    }
  }

  const toggleSubject = (id: string) => {
    setSelectedSubjectIds(prev => {
      const isSelected = prev.includes(id)
      if (isSelected) {
        return prev.filter(i => i !== id)
      } else {
        if (!subjectSettings[id]) {
          setSubjectSettings(s => ({ ...s, [id]: { duration: 90 } }))
        }
        return [...prev, id]
      }
    })
  }

  const toggleAllSubjects = () => {
    if (selectedSubjectIds.length === subjects.length) {
      setSelectedSubjectIds([])
    } else {
      const allIds = subjects.map(s => s._id || (s as any).id)
      setSelectedSubjectIds(allIds)
      const newSettings = { ...subjectSettings }
      allIds.forEach(id => {
        if (!newSettings[id]) newSettings[id] = { duration: 90 }
      })
      setSubjectSettings(newSettings)
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedSubjectIds.length === 0) {
      toast.error('Sélectionne au moins une matière ! 🌸')
      return
    }
    setIsSubmitting(true)
    try {
      // Calcul du nombre de jours pour répartir les sessions
      const start = new Date(formData.dateDebut)
      const end = new Date(formData.dateFin || formData.dateDebut)
      const diffTime = Math.abs(end.getTime() - start.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1

      // Construction des sessions en respectant les exigences de l'API (basé sur l'erreur reçue)
      const sessions = selectedSubjectIds.map((subId, index) => {
        const sessionDate = new Date(start)
        
        // Répartition sur les jours disponibles
        const dayOffset = index % diffDays
        sessionDate.setDate(start.getDate() + dayOffset)
        
        // Heure de début : on commence à 9h
        // Si on a plus de matières que de jours, on commence à décaler les heures
        const sessionsOnSameDay = Math.floor(index / diffDays)
        sessionDate.setHours(9 + (sessionsOnSameDay * 2), 0, 0, 0)
        
        const duration = subjectSettings[subId]?.duration || 90
        const endTime = new Date(sessionDate.getTime() + duration * 60000)

        return {
          matiere: subId,
          debut: sessionDate.toISOString(),
          fin: endTime.toISOString()
        }
      })

      const payload = {
        title: formData.title.trim() || `Planning du ${new Date(formData.dateDebut).toLocaleDateString()}`,
        periode: formData.periode,
        dateDebut: new Date(formData.dateDebut).toISOString(), // Ajouté car requis par le backend
        dateFin: new Date(formData.dateFin).toISOString(),     // Ajouté par précaution
        sessions
      }

      console.log('Sending payload to API:', payload)
      const response = await planningService.create(payload)
      
      const newPlanning = (response as any).data || response
      if (!newPlanning._id && newPlanning.id) newPlanning._id = newPlanning.id

      setPlannings(prev => [newPlanning, ...prev])
      setIsModalOpen(false)
      toast.success('Ton planning magique a été créé ! ✨')
      
      setFormData({
        title: '',
        periode: 'semaine',
        nombre: 1,
        dateDebut: new Date().toISOString().split('T')[0],
        dateFin: '',
        defaultDuration: 90
      })
    } catch (error: any) {
      console.error('Erreur création planning:', error)
      const errorMsg = error.message || (error.data && error.data.message) || 'Erreur lors de la création'
      toast.error(errorMsg)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDownload = async (e: React.MouseEvent, id: string, title?: string) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      toast.loading('Génération du PDF... 🪄', { id: 'download' });
      const blob = await planningService.exportPDF(id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `planning-${title || 'etude'}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      toast.success('Planning exporté ! ✨', { id: 'download' });
    } catch (error) {
      console.error('Erreur export:', error);
      toast.error('Impossible d\'exporter le planning 🌸', { id: 'download' });
    }
  };

  const safePlannings = Array.isArray(plannings) ? plannings : []

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="max-w-6xl mx-auto space-y-6 md:space-y-12 relative px-3 md:px-4 py-4 md:py-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6">
        <div className="pl-3 md:pl-4 border-l-4 border-pink-candy">
          <h2 className="text-xl md:text-4xl font-semibold text-hello-black font-display tracking-tight">Agenda des Révisions</h2>
          <p className="text-xs md:text-base text-hello-black/40 italic font-serif">"L'organisation est la clé de la sérénité."</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="kawaii-button primary !py-2.5 md:!py-3 !px-5 md:!px-8 flex items-center gap-2 shadow-notebook text-sm md:text-base w-full md:w-auto justify-center"
        >
          <Plus className="size-4 md:size-5" /> Nouveau Planning
        </button>
      </div>

      {safePlannings.length === 0 ? (
        <div className="notebook-page p-6 md:p-12 text-center border-l-4 border-pink-200 shadow-lg md:shadow-2xl mx-1">
          <div className="w-14 h-14 md:w-20 md:h-20 bg-pink-milk rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
            <BookOpen className="size-6 md:size-10 text-pink-candy/40" />
          </div>
          <p className="text-hello-black/40 mb-3 md:mb-6 italic font-serif text-sm md:text-lg">Ton agenda est encore vierge. Prête à écrire ton succès ?</p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="text-pink-candy font-semibold hover:underline decoration-2 underline-offset-4 text-xs md:text-base"
          >
            Créer ma première session
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {safePlannings.map((planning, index) => (
            <motion.div
              key={planning._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ rotate: index % 2 === 0 ? -0.5 : 0.5, y: -2 }}
              className="notebook-page p-5 md:p-8 flex flex-col justify-between min-h-[200px] md:min-h-[280px] border-l-4 border-sage-soft group shadow-md md:shadow-2xl"
            >
              <div className="md:pl-4">
                <div className="flex justify-between items-start mb-3 md:mb-6">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-pink-milk text-pink-candy group-hover:scale-110 transition-transform">
                    <CalendarIcon className="size-3.5 md:size-5" />
                  </div>
                  <div className="flex gap-1 md:gap-2">
                    <button 
                      onClick={(e) => handleDownload(e, planning._id!, planning.title)}
                      className="p-1.5 md:p-2 text-hello-black/20 hover:text-pink-candy transition-colors"
                      title="Exporter en PDF"
                    >
                      <Download className="size-4 md:size-[18px]" />
                    </button>
                    <button 
                      onClick={() => handleDelete(planning._id!)}
                      className="p-1.5 md:p-2 text-hello-black/20 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="size-4 md:size-[18px]" />
                    </button>
                  </div>
                </div>

                <Link to={`/planning/${planning._id}`} className="block">
                  <h3 className="text-base md:text-xl font-semibold mb-1.5 md:mb-3 text-hello-black group-hover:text-pink-candy transition-colors font-display line-clamp-2">
                    {planning.title}
                  </h3>
                  <div className="space-y-1 md:space-y-2 mb-3 md:mb-6">
                    <div className="flex items-center gap-2 text-[10px] md:text-sm text-hello-black/40 font-medium italic">
                      <Clock className="size-3 md:size-3.5" />
                      <span>{planning.periode === 'semaine' ? 'Hebdomadaire' : planning.periode}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[9px] md:text-xs text-hello-black/30 font-mono uppercase tracking-widest">
                      <Star className="size-2.5 md:size-3" />
                      <span>{planning.sessions?.length || 0} sessions prévues</span>
                    </div>
                  </div>
                </Link>
              </div>

              <Link 
                to={`/planning/${planning._id}`}
                className="mt-2 md:mt-4 py-2.5 md:py-3 px-4 md:px-6 bg-pink-milk/50 text-pink-candy rounded-xl text-center text-xs md:text-sm font-semibold hover:bg-pink-candy hover:text-white transition-all border border-pink-candy/10"
              >
                Ouvrir l'agenda
              </Link>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal de Création */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-4 bg-hello-black/20 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}>
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-[1.5rem] md:rounded-[2rem] shadow-kawaii w-full max-w-xl max-h-[90vh] overflow-y-auto border-2 md:border-4 border-pink-milk custom-scrollbar"
            >
              {/* Header du Formulaire */}
              <div className="bg-pink-milk/30 p-4 md:p-6 text-center relative border-b-2 border-pink-milk/50">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="absolute right-3 top-3 md:right-4 md:top-4 p-1.5 md:p-2 hover:bg-white rounded-full text-pink-candy transition-colors"
                >
                  <X size={18} className="md:size-5" />
                </button>
                <div className="inline-flex p-2 md:p-3 bg-white rounded-xl md:rounded-2xl shadow-sm mb-2 md:mb-3">
                  <Sparkles className="text-pink-candy size-5 md:size-7" />
                </div>
                <h3 className="text-xl md:text-2xl font-black text-hello-black">Magie du Planning ✨</h3>
                <p className="text-[10px] md:text-sm text-hello-black/50 font-medium uppercase tracking-wider">Prépare ta réussite ! 🎀</p>
              </div>

              <form onSubmit={handleCreate} className="p-5 md:p-8 space-y-4 md:space-y-6">
                {/* Section Titre */}
                <div className="space-y-1.5 md:space-y-2">
                  <label className="text-[10px] md:text-xs font-black text-pink-candy uppercase tracking-wider ml-1 md:ml-2 flex items-center gap-2">
                    <Star size={12} className="md:size-[14px]" /> Nom de l'aventure
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ex: Ma Semaine de Rêve 🌸"
                    className="w-full bg-pink-milk/10 border-2 border-pink-milk/30 rounded-xl md:rounded-2xl p-3 md:p-4 text-sm md:text-base text-hello-black placeholder:text-hello-black/20 focus:outline-none focus:border-pink-candy focus:bg-white transition-all shadow-inner-sm"
                  />
                </div>

                {/* Section Matières */}
                <div className="space-y-2 md:space-y-3">
                  <div className="flex items-center justify-between px-1 md:px-2">
                    <label className="text-[10px] md:text-xs font-black text-pink-candy uppercase tracking-wider flex items-center gap-2">
                      <BookOpen size={12} className="md:size-[14px]" /> Tes Matières
                    </label>
                    {subjects.length > 0 && (
                      <button 
                        type="button"
                        onClick={toggleAllSubjects}
                        className="text-[9px] md:text-[10px] font-bold text-pink-candy/60 hover:text-pink-candy uppercase tracking-tighter"
                      >
                        {selectedSubjectIds.length === subjects.length ? 'Désélectionner' : 'Tout sélectionner'}
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-3 sm:grid-cols-3 gap-2 md:gap-3 max-h-[140px] md:max-h-[180px] overflow-y-auto pr-1 custom-scrollbar">
                    {subjects.length > 0 ? (
                      subjects.map((s) => {
                        const id = s._id || (s as any).id
                        const isSelected = selectedSubjectIds.includes(id)
                        return (
                          <motion.button
                            key={id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="button"
                            onClick={() => toggleSubject(id)}
                            className={`p-2 md:p-3 rounded-xl md:rounded-2xl border-2 transition-all flex flex-col items-center gap-1 text-center ${
                              isSelected 
                                ? 'bg-pink-candy text-white border-pink-candy shadow-kawaii-sm' 
                                : 'bg-white text-hello-black/60 border-pink-milk/30 hover:border-pink-candy/40'
                            }`}
                          >
                            <span className="text-xl md:text-2xl">{s.icon || '📚'}</span>
                            <span className="text-[9px] md:text-[11px] font-bold leading-tight line-clamp-1">{s.name}</span>
                          </motion.button>
                        )
                      })
                    ) : (
                      <div className="col-span-full p-4 md:p-6 bg-pink-milk/5 border-2 border-dashed border-pink-milk/30 rounded-xl md:rounded-2xl text-center">
                        <p className="text-xs md:text-sm text-hello-black/40 mb-2 md:mb-3">Aucune matière trouvée 🥺</p>
                        <Link to="/subjects" className="kawaii-button py-1.5 md:py-2 px-3 md:px-4 text-[10px] md:text-xs inline-flex items-center gap-2">
                          <Plus size={12} className="md:size-[14px]" /> Créer une matière
                        </Link>
                      </div>
                    )}
                  </div>
                </div>

                {/* Section Période et Dates */}
                <div className="grid grid-cols-3 gap-2 md:gap-4">
                  <div className="space-y-1.5 md:space-y-2">
                    <label className="text-[10px] md:text-xs font-black text-pink-candy uppercase tracking-wider ml-1 md:ml-2 flex items-center gap-2">
                      <Clock size={12} className="md:size-[14px]" /> Unité
                    </label>
                    <select
                      value={formData.periode}
                      onChange={(e) => setFormData({ ...formData, periode: e.target.value })}
                      className="w-full bg-pink-milk/10 border-2 border-pink-milk/30 rounded-xl md:rounded-2xl p-2.5 md:p-4 text-xs md:text-base text-hello-black focus:outline-none focus:border-pink-candy focus:bg-white transition-all appearance-none cursor-pointer"
                    >
                      <option value="jour">Jour(s)</option>
                      <option value="semaine">Semaine(s)</option>
                      <option value="mois">Mois</option>
                    </select>
                  </div>
                  <div className="space-y-1.5 md:space-y-2">
                    <label className="text-[10px] md:text-xs font-black text-pink-candy uppercase tracking-wider ml-1 md:ml-2 flex items-center gap-2">
                      <Hash size={12} className="md:size-[14px]" /> Nombre
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="12"
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: parseInt(e.target.value) || 1 })}
                      className="w-full bg-pink-milk/10 border-2 border-pink-milk/30 rounded-xl md:rounded-2xl p-2.5 md:p-4 text-xs md:text-base text-hello-black focus:outline-none focus:border-pink-candy focus:bg-white transition-all"
                    />
                  </div>
                  <div className="space-y-1.5 md:space-y-2">
                    <label className="text-[10px] md:text-xs font-black text-pink-candy uppercase tracking-wider ml-1 md:ml-2 flex items-center gap-2">
                      <CalendarIcon size={12} className="md:size-[14px]" /> Début
                    </label>
                    <div className="relative">
                      <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-candy/50 size-3.5 md:size-[18px]" />
                      <input
                        type="date"
                        value={formData.dateDebut}
                        onChange={(e) => setFormData({ ...formData, dateDebut: e.target.value })}
                        className="w-full bg-pink-milk/10 border-2 border-pink-milk/30 rounded-2xl p-4 pl-12 text-hello-black focus:outline-none focus:border-pink-candy focus:bg-white transition-all cursor-pointer text-sm"
                      />
                    </div>
                  </div>
                </div>

                {formData.periode !== 'jour' && (
                  <div className="bg-pink-milk/5 border-2 border-dashed border-pink-milk/20 rounded-2xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-pink-candy shadow-sm">
                        <CalendarIcon size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-pink-candy/60 uppercase tracking-widest">Fin du planning</p>
                        <p className="text-sm font-bold text-hello-black">
                          {new Date(formData.dateFin).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-pink-candy/60 uppercase tracking-widest">Durée</p>
                      <p className="text-sm font-bold text-pink-candy">
                        {formData.nombre} {formData.periode}{formData.nombre > 1 ? (formData.periode === 'mois' ? '' : 's') : ''}
                      </p>
                    </div>
                  </div>
                )}

                {/* Section Durée par défaut */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-pink-candy uppercase tracking-wider ml-2 flex items-center gap-2">
                    <Clock size={14} /> Durée des sessions (minutes)
                  </label>
                  <input
                    type="range"
                    min="30"
                    max="180"
                    step="15"
                    value={formData.defaultDuration}
                    onChange={(e) => {
                      const val = parseInt(e.target.value)
                      setFormData({ ...formData, defaultDuration: val })
                      // Mettre à jour toutes les matières sélectionnées
                      const newSettings = { ...subjectSettings }
                      selectedSubjectIds.forEach(id => {
                        newSettings[id] = { duration: val }
                      })
                      setSubjectSettings(newSettings)
                    }}
                    className="w-full accent-pink-candy"
                  />
                  <div className="flex justify-between text-[10px] font-bold text-pink-candy/60 uppercase px-1">
                    <span>30m</span>
                    <span className="text-pink-candy text-xs font-black bg-pink-milk/30 px-2 py-0.5 rounded-full">{formData.defaultDuration} min</span>
                    <span>180m</span>
                  </div>
                </div>

                {/* Bouton de validation */}
                <motion.button 
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isSubmitting || subjects.length === 0}
                  type="submit"
                  className="w-full kawaii-button py-5 text-lg shadow-kawaii hover:shadow-kawaii-lg transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Création en cours...</span>
                    </div>
                  ) : (
                    <>
                      <span>Lancer la Magie ! ✨</span>
                      <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}


