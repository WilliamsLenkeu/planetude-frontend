import { useState } from 'react'
import { Plus, Trash2, Calendar as CalendarIcon, Clock, Star, ChevronRight, X, Wand2, BookOpen } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { planningService } from '../services/planning.service'
import { subjectService } from '../services/subject.service'
import type { Planning as PlanningType, Subject } from '../types/index'
import toast from 'react-hot-toast'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { motion, AnimatePresence } from 'framer-motion'

export default function Planning() {
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [formData, setFormData] = useState({
    titre: '',
    periode: 'semaine',
    dateDebut: new Date().toISOString().split('T')[0],
    nombre: 5,
    matiereIds: [] as string[]
  })

  // Fetch plannings
  const { data: plannings = [], isLoading } = useQuery<PlanningType[]>({
    queryKey: ['plannings'],
    queryFn: () => planningService.getAll()
  })

  // Fetch subjects for selection
  const { data: subjects = [] } = useQuery<Subject[]>({
    queryKey: ['subjects'],
    queryFn: () => subjectService.getAll()
  })

  const toggleSubject = (id: string) => {
    setFormData(prev => ({
      ...prev,
      matiereIds: prev.matiereIds.includes(id)
        ? prev.matiereIds.filter(item => item !== id)
        : [...prev.matiereIds, id]
    }))
  }

  const selectAllSubjects = () => {
    if (formData.matiereIds.length === subjects.length) {
      setFormData(prev => ({ ...prev, matiereIds: [] }))
    } else {
      setFormData(prev => ({ ...prev, matiereIds: subjects.map(s => s._id) }))
    }
  }

  const createMutation = useMutation({
    mutationFn: (data: any) => planningService.generate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plannings'] })
      setIsModalOpen(false)
      toast.success('Planning généré avec succès ! ✨')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erreur lors de la création')
    },
    onSettled: () => setIsGenerating(false)
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => planningService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plannings'] })
      toast.success('Planning supprimé')
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsGenerating(true)
    
    // Convert date to ISO string as expected by API
    const fullDate = new Date(formData.dateDebut)
    fullDate.setHours(8, 0, 0, 0) // Default to 8am
    
    createMutation.mutate({
      ...formData,
      dateDebut: fullDate.toISOString()
    })
  }

  if (isLoading) return <LoadingSpinner fullScreen />

  return (
    <div className="max-w-7xl mx-auto px-6 pt-12 pb-24 space-y-16">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-pink-deep/5 rounded-full blur-[140px]" />
      </div>

      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-black/5 pb-12">
        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center border border-black/5">
              <CalendarIcon size={24} className="text-pink-deep" strokeWidth={1.5} />
            </div>
            <div className="h-[1px] w-12 bg-black/10" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-hello-black/30">Temporalité</span>
          </motion.div>
          
          <div className="space-y-2">
            <h1 className="text-5xl md:text-7xl font-black text-hello-black tracking-tight">
              Plannings
            </h1>
            <p className="text-xl text-hello-black/40 font-display italic">
              Organise ton futur, une session à la fois.
            </p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-3 px-8 py-4 bg-hello-black text-white rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-xl shadow-hello-black/10 hover:bg-pink-deep hover:text-hello-black transition-all group"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform duration-500" />
          Nouveau Planning
        </motion.button>
      </header>

      {/* Grid des Plannings */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {plannings.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full py-20 text-center space-y-4"
            >
              <div className="w-20 h-20 bg-white rounded-full mx-auto flex items-center justify-center border border-black/5 shadow-sm">
                <Star className="text-hello-black/10" size={32} />
              </div>
              <p className="text-hello-black/30 font-display italic text-lg">Aucun planning pour le moment. Commence ton aventure !</p>
            </motion.div>
          ) : (
            plannings.map((planning: PlanningType, index: number) => (
              <motion.div
                key={planning._id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group relative"
              >
                <Link to={`/planning/${planning._id}`}>
                  <div className="h-full bg-white/40 backdrop-blur-sm rounded-[3rem] p-8 border border-white hover:bg-white/60 transition-all duration-500 hover:shadow-2xl hover:shadow-black/[0.02]">
                    <div className="flex justify-between items-start mb-12">
                      <div className="w-16 h-16 rounded-[2rem] bg-white shadow-sm flex items-center justify-center border border-black/5 group-hover:rotate-3 transition-transform duration-500">
                        <CalendarIcon size={28} className="text-pink-deep" strokeWidth={1.5} />
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2 bg-white/50 rounded-full border border-black/5">
                        <Clock size={14} className="text-hello-black/40" />
                        <span className="text-[10px] font-black text-hello-black/40 uppercase tracking-widest">
                          {planning.sessions?.length || 0} Sessions
                        </span>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <h3 className="text-2xl font-black text-hello-black tracking-tight group-hover:text-pink-deep transition-colors duration-300">
                          {planning.titre}
                        </h3>
                        <p className="text-[10px] font-bold text-hello-black/20 uppercase tracking-[0.2em]">
                          {new Date(planning.dateDebut).toLocaleDateString()} — {planning.periode}
                        </p>
                      </div>

                      <div className="pt-6 border-t border-black/5 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-pink-deep font-black text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
                          Voir les détails <ChevronRight size={14} />
                        </div>
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            if(confirm('Supprimer ce planning ?')) deleteMutation.mutate(planning._id);
                          }}
                          className="w-10 h-10 flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-50 text-red-400 rounded-2xl transition-all duration-300"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Modal de Création */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-hello-black/20 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-xl bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-white"
            >
              <div className="p-10 space-y-8">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <h2 className="text-3xl font-black text-hello-black tracking-tight">Nouveau Planning</h2>
                    <p className="text-hello-black/40 font-display italic">Laisse l'IA organiser ton succès ✨</p>
                  </div>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="w-12 h-12 flex items-center justify-center rounded-2xl bg-black/5 text-hello-black/40 hover:bg-black/10 transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-hello-black/40 px-2">Titre du Planning</label>
                    <input 
                      required
                      type="text"
                      placeholder="Ex: Préparation Examens"
                      value={formData.titre}
                      onChange={e => setFormData({...formData, titre: e.target.value})}
                      className="w-full bg-black/5 border-2 border-transparent focus:border-pink-deep/20 rounded-2xl h-14 px-6 text-sm font-bold transition-all outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-hello-black/40 px-2">Date de début</label>
                      <input 
                        required
                        type="date"
                        value={formData.dateDebut}
                        onChange={e => setFormData({...formData, dateDebut: e.target.value})}
                        className="w-full bg-black/5 border-2 border-transparent focus:border-pink-deep/20 rounded-2xl h-14 px-6 text-sm font-bold transition-all outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-hello-black/40 px-2">Durée</label>
                      <div className="grid grid-cols-2 gap-2">
                        <select 
                          value={formData.nombre}
                          onChange={e => setFormData({...formData, nombre: parseInt(e.target.value)})}
                          className="w-full bg-black/5 border-2 border-transparent focus:border-pink-deep/20 rounded-2xl h-14 px-6 text-sm font-bold transition-all outline-none appearance-none"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                            <option key={n} value={n}>{n}</option>
                          ))}
                        </select>
                        <select 
                           value={formData.periode}
                           onChange={e => setFormData({...formData, periode: e.target.value})}
                           className="w-full bg-black/5 border-2 border-transparent focus:border-pink-deep/20 rounded-2xl h-14 px-6 text-sm font-bold transition-all outline-none appearance-none"
                         >
                           <option value="jour">{formData.nombre > 1 ? 'Jours' : 'Jour'}</option>
                           <option value="semaine">{formData.nombre > 1 ? 'Semaines' : 'Semaine'}</option>
                           <option value="mois">{formData.nombre > 1 ? 'Mois' : 'Mois'}</option>
                           <option value="semestre">{formData.nombre > 1 ? 'Semestres' : 'Semestre'}</option>
                         </select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-hello-black/40 flex items-center gap-2">
                        <BookOpen size={12} />
                        Matières à inclure
                      </label>
                      <button 
                        type="button"
                        onClick={selectAllSubjects}
                        className="text-[10px] font-bold text-pink-deep hover:underline"
                      >
                        {formData.matiereIds.length === subjects.length ? 'Tout désélectionner' : 'Tout sélectionner'}
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                      {subjects.map((subject) => (
                        <button
                          key={subject._id}
                          type="button"
                          onClick={() => toggleSubject(subject._id)}
                          className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                            formData.matiereIds.includes(subject._id)
                              ? 'border-pink-deep bg-pink-deep/5 text-pink-deep'
                              : 'border-black/5 bg-black/5 text-hello-black/40 hover:border-black/10'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded flex items-center justify-center border ${
                            formData.matiereIds.includes(subject._id)
                              ? 'bg-pink-deep border-pink-deep text-white'
                              : 'border-black/20'
                          }`}>
                            {formData.matiereIds.includes(subject._id) && <Star size={10} fill="currentColor" />}
                          </div>
                          <span className="text-xs font-bold truncate">{subject.name}</span>
                        </button>
                      ))}
                    </div>
                    {formData.matiereIds.length === 0 && (
                      <p className="text-[10px] text-pink-deep/60 italic px-2">
                        * Aucune matière sélectionnée : l'IA piochera dans toutes tes matières.
                      </p>
                    )}
                  </div>

                  <div className="pt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={isGenerating}
                      type="submit"
                      className="w-full py-5 bg-hello-black text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-hello-black/10 hover:bg-pink-deep hover:text-hello-black transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                      {isGenerating ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Génération en cours...
                        </>
                      ) : (
                        <>
                          <Wand2 size={20} />
                          Générer avec l'IA
                        </>
                      )}
                    </motion.button>
                  </div>
                </form>
              </div>

              {/* Decorative background in modal */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-pink-deep via-pink-candy to-pink-deep opacity-20" />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}


