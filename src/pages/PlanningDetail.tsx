import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../lib/api';
import Card from '../components/Card';
import { ChevronLeft, Calendar, Clock, BookOpen } from 'lucide-react';

const PlanningDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [planning, setPlanning] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlanning = async () => {
      try {
        const data = await api('/api/planning'); // The list endpoint usually has all details or we can filter
        const found = data.find((p: any) => p._id === id);
        setPlanning(found);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlanning();
  }, [id]);

  if (loading) return <div className="p-6 text-center text-primary italic">Recherche de tes sessions... ✨</div>;
  if (!planning) return <div className="p-6 text-center">Planning non trouvé 😢</div>;

  return (
    <div className="space-y-6">
      <Link to="/planning" className="flex items-center gap-2 text-primary font-bold">
        <ChevronLeft size={20} /> Retour
      </Link>

      <header>
        <h2 className="text-2xl text-primary font-decorative">Détails du Planning</h2>
        <p className="text-gray-500">Du {new Date(planning.dateDebut).toLocaleDateString()}</p>
      </header>

      <div className="space-y-4">
        {planning.sessions?.map((s: any, i: number) => (
          <Card key={i} className="border-l-8 border-primary">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-accent rounded-full text-primary">
                <BookOpen size={20} />
              </div>
              <div>
                <h4 className="font-bold text-lg text-text">{s.matiere}</h4>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>{new Date(s.debut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(s.fin).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>{new Date(s.debut).toLocaleDateString()}</span>
                  </div>
                </div>
                {s.notes && (
                  <p className="mt-3 text-sm italic bg-bg p-2 rounded-lg">"{s.notes}"</p>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PlanningDetail;
