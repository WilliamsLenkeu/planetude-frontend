import React, { useEffect, useState } from 'react';
import api from '../lib/api';
import Card from '../components/Card';
import FormInput from '../components/FormInput';
import { Plus, Trash2, Calendar, FileText, Download } from 'lucide-react';

const Planning: React.FC = () => {
  const [plannings, setPlannings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // New Planning Form State
  const [periode, setPeriode] = useState('semaine');
  const [dateDebut, setDateDebut] = useState('');
  const [matiere, setMatiere] = useState('');

  useEffect(() => {
    fetchPlannings();
  }, []);

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

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api('/api/planning', {
        method: 'POST',
        body: JSON.stringify({
          periode,
          dateDebut,
          sessions: [{ matiere, debut: `${dateDebut}T09:00:00`, fin: `${dateDebut}T10:30:00` }]
        })
      });
      setShowForm(false);
      fetchPlannings();
    } catch (err) {
      alert('Erreur lors de la création 🌸');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Veux-tu vraiment supprimer ce planning ? 😢')) return;
    try {
      await api(`/api/planning/${id}`, { method: 'DELETE' });
      fetchPlannings();
    } catch (err) {
      alert('Erreur lors de la suppression');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl text-primary font-decorative font-bold">Mes Plannings</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-md animate-pulse"
        >
          <Plus size={24} />
        </button>
      </div>

      {showForm && (
        <Card title="Nouveau Planning ✨" className="animate-in slide-in-from-top duration-300">
          <form onSubmit={handleCreate}>
            <FormInput
              label="Date de début"
              type="date"
              value={dateDebut}
              onChange={(e) => setDateDebut(e.target.value)}
              required
            />
            <FormInput
              label="Matière principale"
              placeholder="Ex: Mathématiques"
              value={matiere}
              onChange={(e) => setMatiere(e.target.value)}
              required
            />
            <div className="mb-4">
              <label className="block text-sm font-medium text-text mb-1 ml-2">Période</label>
              <select
                className="kawaii-input"
                value={periode}
                onChange={(e) => setPeriode(e.target.value)}
              >
                <option value="semaine">Semaine</option>
                <option value="mois">Mois</option>
              </select>
            </div>
            <button type="submit" className="kawaii-button kawaii-button-primary w-full">
              Créer mon planning 🎀
            </button>
          </form>
        </Card>
      )}

      {loading ? (
        <p className="text-center text-primary italic">Recherche de tes trésors... ✨</p>
      ) : plannings.length > 0 ? (
        <div className="grid gap-4">
          {plannings.map((p) => (
            <Card key={p._id} className="relative group">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary-100 rounded-kawaii-sm text-primary">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-lg">{p.periode === 'semaine' ? '📅 Semaine du ' : '📅 Mois du '} {new Date(p.dateDebut).toLocaleDateString()}</p>
                    <p className="text-sm text-gray-500">{p.sessions?.length || 0} sessions prévues</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleDelete(p._id)} className="p-2 text-gray-300 hover:text-red-400 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <a
                  href={`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/planning/${p._id}/export.ical?token=${localStorage.getItem('token')}`}
                  className="flex-1 kawaii-button kawaii-button-accent py-2 text-sm flex items-center justify-center gap-2"
                >
                  <Download size={16} /> iCal
                </a>
                <a
                  href={`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/planning/${p._id}/export.pdf?token=${localStorage.getItem('token')}`}
                  className="flex-1 border-2 border-primary-100 text-primary py-2 rounded-full text-sm font-bold flex items-center justify-center gap-2 hover:bg-primary-100"
                >
                  <FileText size={16} /> PDF
                </a>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-400 mb-4">Tu n'as pas encore de planning... 🌸</p>
          <button onClick={() => setShowForm(true)} className="text-primary font-bold underline decoration-accent decoration-4">
            Crée ton premier planning maintenant !
          </button>
        </div>
      )}
    </div>
  );
};

export default Planning;
