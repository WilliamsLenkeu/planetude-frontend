import { useState, useEffect } from 'react'
import { Plus, Trash2, Download, X, Calendar as CalendarIcon, BookOpen, Clock, Sparkles, Star, Hash } from 'lucide-react'
import { Link } from 'react-router-dom'
import { planningService } from '../services/planning.service'
import { subjectService } from '../services/subject.service'
import type { Planning as PlanningType, Subject } from '../types/index'
import toast from 'react-hot-toast'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { Card } from '../components/ui/Card'
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
    <div className="max-w-5xl mx-auto space-y-6 md:space-y-8 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-hello-black">Mes Plannings 📅</h2>
          <p className="text-sm md:text-base text-hello-black/60">Organise tes révisions avec style.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="kawaii-button !py-2 !px-4 md:!py-3 md:!px-6 text-sm flex items-center gap-2 w-full md:w-auto justify-center"
        >
          <Plus size={18} /> Nouveau Planning
        </button>
      </div>

      {safePlannings.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-hello-black/50 mb-4">Tu n'as pas encore de planning... 🌸</p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="text-pink-candy font-bold hover:underline"
          >
            Créer mon premier planning
          </button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {safePlannings.map((planning) => (
            <PlanningCardItem 
              key={planning._id}
              planning={planning}
              onDelete={() => handleDelete(planning._id)}
              onDownload={(e) => handleDownload(e, planning._id, planning.title)}
            />
          ))}
        </div>
      )}

      {/* Modal de Création */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-hello-black/20 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-[2rem] shadow-kawaii w-full max-w-xl overflow-hidden border-4 border-pink-milk"
            >
              {/* Header du Formulaire */}
              <div className="bg-pink-milk/30 p-6 text-center relative border-b-2 border-pink-milk/50">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="absolute right-4 top-4 p-2 hover:bg-white rounded-full text-pink-candy transition-colors"
                >
                  <X size={20} />
                </button>
                <div className="inline-flex p-3 bg-white rounded-2xl shadow-sm mb-3">
                  <Sparkles className="text-pink-candy" size={28} />
                </div>
                <h3 className="text-2xl font-black text-hello-black">Magie du Planning ✨</h3>
                <p className="text-sm text-hello-black/50 font-medium">Prépare ta réussite avec style ! 🎀</p>
              </div>

              <form onSubmit={handleCreate} className="p-8 space-y-6">
                {/* Section Titre */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-pink-candy uppercase tracking-wider ml-2 flex items-center gap-2">
                    <Star size={14} /> Nom de l'aventure
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ex: Ma Semaine de Rêve 🌸"
                    className="w-full bg-pink-milk/10 border-2 border-pink-milk/30 rounded-2xl p-4 text-hello-black placeholder:text-hello-black/20 focus:outline-none focus:border-pink-candy focus:bg-white transition-all shadow-inner-sm"
                  />
                </div>

                {/* Section Matières */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between px-2">
                    <label className="text-xs font-black text-pink-candy uppercase tracking-wider flex items-center gap-2">
                      <BookOpen size={14} /> Tes Matières Magiques
                    </label>
                    {subjects.length > 0 && (
                      <button 
                        type="button"
                        onClick={toggleAllSubjects}
                        className="text-[10px] font-bold text-pink-candy/60 hover:text-pink-candy uppercase tracking-tighter"
                      >
                        {selectedSubjectIds.length === subjects.length ? 'Tout désélectionner' : 'Tout sélectionner'}
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[180px] overflow-y-auto pr-2 custom-scrollbar">
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
                            className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-1 text-center ${
                              isSelected 
                                ? 'bg-pink-candy text-white border-pink-candy shadow-kawaii-sm' 
                                : 'bg-white text-hello-black/60 border-pink-milk/30 hover:border-pink-candy/40'
                            }`}
                          >
                            <span className="text-2xl">{s.icon || '📚'}</span>
                            <span className="text-[11px] font-bold leading-tight line-clamp-1">{s.name}</span>
                          </motion.button>
                        )
                      })
                    ) : (
                      <div className="col-span-full p-6 bg-pink-milk/5 border-2 border-dashed border-pink-milk/30 rounded-2xl text-center">
                        <p className="text-sm text-hello-black/40 mb-3">Aucune matière trouvée 🥺</p>
                        <Link to="/subjects" className="kawaii-button py-2 px-4 text-xs inline-flex items-center gap-2">
                          <Plus size={14} /> Créer une matière
                        </Link>
                      </div>
                    )}
                  </div>
                </div>

                {/* Section Période et Dates */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-pink-candy uppercase tracking-wider ml-2 flex items-center gap-2">
                      <Clock size={14} /> Unité
                    </label>
                    <select
                      value={formData.periode}
                      onChange={(e) => setFormData({ ...formData, periode: e.target.value })}
                      className="w-full bg-pink-milk/10 border-2 border-pink-milk/30 rounded-2xl p-4 text-hello-black focus:outline-none focus:border-pink-candy focus:bg-white transition-all appearance-none cursor-pointer"
                    >
                      <option value="jour">Jour(s)</option>
                      <option value="semaine">Semaine(s)</option>
                      <option value="mois">Mois</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-pink-candy uppercase tracking-wider ml-2 flex items-center gap-2">
                      <Hash size={14} /> Nombre
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="12"
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: parseInt(e.target.value) || 1 })}
                      className="w-full bg-pink-milk/10 border-2 border-pink-milk/30 rounded-2xl p-4 text-hello-black focus:outline-none focus:border-pink-candy focus:bg-white transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-pink-candy uppercase tracking-wider ml-2 flex items-center gap-2">
                      <CalendarIcon size={14} /> Début
                    </label>
                    <div className="relative">
                      <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-candy/50" size={18} />
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

function PlanningCardItem({ planning, onDelete, onDownload }: { planning: PlanningType, onDelete: () => void, onDownload: (e: React.MouseEvent) => void }) {
  return (
    <Link to={`/planning/${planning._id}`}>
      <Card 
        whileHover={{ y: -5 }}
        className="hover:border-pink-candy transition-colors flex flex-col justify-between h-48"
      >
        <div>
          <div className="flex justify-between items-start mb-2">
            <span className="bg-pink-milk text-pink-candy text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              {planning.periode}
            </span>
            <div className="flex gap-2">
              <button 
                onClick={onDownload}
                className="p-1 text-hello-black/40 hover:text-pink-candy transition-colors"
              >
                <Download size={18} />
              </button>
              <button 
                onClick={(e) => { 
                  e.preventDefault(); 
                  e.stopPropagation();
                  onDelete(); 
                }}
                className="p-1 text-hello-black/40 hover:text-red-400 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
          <h3 className="text-xl font-bold text-hello-black group-hover:text-pink-candy transition-colors">
            {planning.title || `Planning du ${new Date(planning.createdAt).toLocaleDateString()}`}
          </h3>
          <p className="text-hello-black/40 text-sm mt-1">
            Créé le {new Date(planning.createdAt).toLocaleDateString()}
          </p>
        </div>
        
        <div className="flex justify-between items-center pt-4 border-t border-pink-milk/50">
          <span className="text-sm font-bold text-hello-black/60">
            {planning.sessions?.length || 0} sessions
          </span>
          <span className="text-pink-candy font-bold text-sm flex items-center gap-1">
            Voir <Plus size={14} />
          </span>
        </div>
      </Card>
    </Link>
  )
}
