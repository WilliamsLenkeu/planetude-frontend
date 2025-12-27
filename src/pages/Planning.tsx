import React, { useEffect, useState } from 'react';
import api from '../lib/api';
import { BouncyCard, Heart } from '../components/AestheticComponents';
import { Calendar, Plus, Trash2, FileText, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Planning: React.FC = () => {
  const [plannings, setPlannings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newPlan, setNewPlan] = useState({
    dateDebut: new Date().toISOString().split('T')[0],
    heuresParJour: 2,
    matieres: ''
  });

  const fetchPlannings = async () => {
    try {
      const data = await api('/api/planning');
      setPlannings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlannings();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api('/api/planning/generate', {
        method: 'POST',
        body: JSON.stringify({
          ...newPlan,
          matieres: newPlan.matieres.split(',').map(m => m.trim())
        })
      });
      setShowForm(false);
      fetchPlannings();
    } catch (err) {
      alert('Erreur lors de la création du planning 🌸');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Voulez-tu vraiment supprimer ce petit planning ? 🎀')) return;
    try {
      await api(`/api/planning/${id}`, { method: 'DELETE' });
      fetchPlannings();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl text-primary font-satisfy">Mes Plannings</h2>
          <p className="text-xs text-primary-dark font-extrabold uppercase tracking-widest italic">Organise tes rêves ✨</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowForm(!showForm)}
          className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center shadow-kawaii border-2 border-white"
        >
          {showForm ? <Trash2 size={24} className="rotate-45" /> : <Plus size={28} />}
        </motion.button>
      </header>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0, scale: 0.9 }}
            animate={{ opacity: 1, height: 'auto', scale: 1 }}
            exit={{ opacity: 0, height: 0, scale: 0.9 }}
            className="overflow-hidden"
          >
            <BouncyCard className="bg-gradient-to-br from-primary-light/20 to-white border-dashed">
              <h3 className="text-xl text-primary mb-6 flex items-center gap-2">
                Nouveau Planning <Heart />
              </h3>
              <form onSubmit={handleCreate} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-primary-dark uppercase tracking-wider mb-2">Date de début</label>
                  <input
                    type="date"
                    className="kawaii-input"
                    value={newPlan.dateDebut}
                    onChange={(e) => setNewPlan({ ...newPlan, dateDebut: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-primary-dark uppercase tracking-wider mb-2">Heures par jour</label>
                  <input
                    type="number"
                    className="kawaii-input"
                    value={newPlan.heuresParJour}
                    onChange={(e) => setNewPlan({ ...newPlan, heuresParJour: parseInt(e.target.value) })}
                    min="1" max="12"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-primary-dark uppercase tracking-wider mb-2">Matières (séparées par des virgules)</label>
                  <textarea
                    className="kawaii-input min-h-[100px]"
                    placeholder="Maths, Anglais, Code... 🌸"
                    value={newPlan.matieres}
                    onChange={(e) => setNewPlan({ ...newPlan, matieres: e.target.value })}
                    required
                  ></textarea>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full kawaii-button kawaii-button-primary py-4 text-lg"
                >
                  Générer ma Magie 🪄
                </motion.button>
              </form>
            </BouncyCard>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-6">
        {loading ? (
          <div className="p-12 text-center text-primary-dark font-medium animate-pulse italic">
            Chargement de tes secrets... 🍭
          </div>
        ) : plannings.length > 0 ? (
          plannings.map((p, i) => (
            <BouncyCard key={p._id} delay={i * 0.1} className="group hover:border-primary transition-colors">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-accent/30 rounded-full flex items-center justify-center text-2xl shadow-inner border-2 border-white">
                    📅
                  </div>
                  <div>
                    <h4 className="text-lg text-text">Planning du {new Date(p.dateDebut).toLocaleDateString()}</h4>
                    <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest">
                      {p.sessions?.length || 0} Sessions • {p.matieres?.join(', ')}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(p._id)}
                  className="text-gray-300 hover:text-red-400 transition-colors p-2"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="mt-8 flex gap-3 flex-wrap">
                <Link to={`/planning/${p._id}`} className="kawaii-button kawaii-button-accent text-xs py-2 px-4 flex-1">
                  Détails <Sparkles size={12} />
                </Link>
                <a
                  href={`https://plan-etude.koyeb.app/api/planning/${p._id}/export/ical`}
                  className="kawaii-button bg-lilac/30 text-lilac-dark text-xs py-2 px-4 hover:bg-lilac/50 transition-colors"
                  target="_blank"
                  rel="noreferrer"
                >
                  iCal <Calendar size={12} />
                </a>
                <a
                  href={`https://plan-etude.koyeb.app/api/planning/${p._id}/export/pdf`}
                  className="kawaii-button bg-gray-100 text-gray-500 text-xs py-2 px-4 hover:bg-gray-200"
                  target="_blank"
                  rel="noreferrer"
                >
                  PDF <FileText size={12} />
                </a>
              </div>
            </BouncyCard>
          ))
        ) : (
          <div className="text-center py-20 bg-white/30 rounded-3xl border-3 border-dashed border-primary-light">
            <motion.span
              animate={{ scale: [1, 1.5, 1], rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="text-6xl block mb-4"
            >
              🍥
            </motion.span>
            <p className="text-primary-dark font-medium italic">Aucun planning pour le moment...</p>
            <button onClick={() => setShowForm(true)} className="text-primary font-bold underline mt-2 text-sm">
              Crée ton premier planning ici ! 🌸
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Planning;
