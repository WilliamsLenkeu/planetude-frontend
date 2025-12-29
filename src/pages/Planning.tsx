import { useState, useEffect } from 'react'
import { Plus, Trash2, Download, X, Calendar as CalendarIcon, BookOpen, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'
import { planningService } from '../services/planning.service'
import type { Planning as PlanningType } from '../types/index'
import toast from 'react-hot-toast'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { Card } from '../components/ui/Card'
import { motion, AnimatePresence } from 'framer-motion'

export default function Planning() {
  const [plannings, setPlannings] = useState<PlanningType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    periode: 'semaine',
    dateDebut: new Date().toISOString().split('T')[0]
  })

  useEffect(() => {
    const fetchPlannings = async () => {
      try {
        const data = await planningService.getAll()
        setPlannings(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('Erreur plannings:', error)
        toast.error('Impossible de charger les plannings')
        setPlannings([])
      } finally {
        setIsLoading(false)
      }
    }
    fetchPlannings()
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

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const newPlanning = await planningService.create({
        ...formData,
        sessions: [] // On commence avec un planning vide
      })
      setPlannings([newPlanning, ...plannings])
      setIsModalOpen(false)
      toast.success('Nouveau planning créé ! ✨')
      setFormData({
        title: '',
        periode: 'semaine',
        dateDebut: new Date().toISOString().split('T')[0]
      })
    } catch (error) {
      toast.error('Erreur lors de la création')
    } finally {
      setIsSubmitting(false)
    }
  }

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
            />
          ))}
        </div>
      )}

      {/* Modal de Création */}
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
              className="relative w-full max-w-md bg-white rounded-kawaii-lg shadow-kawaii p-6 md:p-8 border-2 border-pink-milk"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 p-2 text-hello-black/20 hover:text-pink-candy transition-colors"
              >
                <X size={20} />
              </button>

              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-pink-milk rounded-full flex items-center justify-center mx-auto mb-4">
                  <CalendarIcon className="text-pink-candy" size={32} />
                </div>
                <h3 className="text-xl font-bold text-hello-black">Nouveau Planning 🎀</h3>
                <p className="text-sm text-hello-black/60 italic">"Planifier, c'est déjà réussir !"</p>
              </div>

              <form onSubmit={handleCreate} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-hello-black/40 uppercase ml-2 flex items-center gap-2">
                    <BookOpen size={12} /> Titre du planning
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ex: Révisions Partiels 🌸"
                    className="w-full bg-pink-milk/20 border-2 border-pink-milk/50 rounded-kawaii p-3 text-hello-black placeholder:text-hello-black/20 focus:outline-none focus:border-pink-candy transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-hello-black/40 uppercase ml-2 flex items-center gap-2">
                      <Clock size={12} /> Période
                    </label>
                    <select
                      value={formData.periode}
                      onChange={(e) => setFormData({ ...formData, periode: e.target.value })}
                      className="w-full bg-pink-milk/20 border-2 border-pink-milk/50 rounded-kawaii p-3 text-hello-black focus:outline-none focus:border-pink-candy transition-colors appearance-none cursor-pointer"
                    >
                      <option value="jour">Jour</option>
                      <option value="semaine">Semaine</option>
                      <option value="mois">Mois</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-hello-black/40 uppercase ml-2 flex items-center gap-2">
                      <CalendarIcon size={12} /> Début
                    </label>
                    <input
                      type="date"
                      value={formData.dateDebut}
                      onChange={(e) => setFormData({ ...formData, dateDebut: e.target.value })}
                      className="w-full bg-pink-milk/20 border-2 border-pink-milk/50 rounded-kawaii p-3 text-hello-black focus:outline-none focus:border-pink-candy transition-colors cursor-pointer"
                    />
                  </div>
                </div>

                <button 
                  disabled={isSubmitting}
                  type="submit"
                  className="w-full kawaii-button py-4 mt-4 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? 'Création...' : 'Créer mon planning ✨'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

function PlanningCardItem({ planning, onDelete }: { planning: PlanningType, onDelete: () => void }) {
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
              <button className="p-1 text-hello-black/40 hover:text-pink-candy transition-colors">
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
