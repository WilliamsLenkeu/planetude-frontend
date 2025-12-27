import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../lib/api';
import { BouncyCard, Heart, Sparkle } from '../components/AestheticComponents';
import { ChevronLeft, Calendar, Clock, BookOpen, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const PlanningDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [planning, setPlanning] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlanning = async () => {
      try {
        const data = await api('/api/planning');
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

  if (loading) return (
    <div className="p-20 text-center text-primary italic flex flex-col items-center gap-4">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className="text-4xl">
        🍭
      </motion.div>
      Chargement de tes sessions magiques...
    </div>
  );

  if (!planning) return (
    <div className="p-12 text-center">
      <p className="text-4xl mb-4">😿</p>
      <p className="text-primary-dark font-bold font-decorative text-xl">Planning non trouvé...</p>
      <Link to="/planning" className="text-primary underline mt-4 inline-block font-medium">Retourner aux plannings 🌸</Link>
    </div>
  );

  return (
    <div className="space-y-10">
      <Link to="/planning" className="inline-flex items-center gap-2 text-primary font-bold hover:translate-x-[-4px] transition-transform">
        <ChevronLeft size={24} /> <span className="font-decorative text-lg">Retour</span>
      </Link>

      <header className="relative">
        <h2 className="text-4xl text-primary font-satisfy mb-2">Détails du Planning</h2>
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-primary-light" />
          <p className="text-gray-500 font-medium italic">Du {new Date(planning.dateDebut).toLocaleDateString()}</p>
        </div>
        <Sparkle className="absolute -top-4 -right-4" />
      </header>

      <div className="grid gap-6">
        {planning.sessions?.map((s: any, i: number) => (
          <BouncyCard key={i} delay={i * 0.1} className="group border-l-[12px] border-primary">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="w-16 h-16 bg-accent rounded-full text-primary flex items-center justify-center text-3xl shadow-lg ring-4 ring-white shrink-0">
                <BookOpen size={24} />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-2xl text-text font-decorative">{s.matiere}</h4>
                <div className="flex flex-wrap items-center gap-6 mt-3 text-sm text-gray-500 font-medium">
                  <div className="flex items-center gap-2 bg-bg/50 px-3 py-1 rounded-full border border-white">
                    <Clock size={16} className="text-primary" />
                    <span className="text-primary-dark">
                      {new Date(s.debut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      <span className="mx-2 opacity-50">•</span>
                      {new Date(s.fin).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>{new Date(s.debut).toLocaleDateString()}</span>
                  </div>
                </div>
                {s.notes && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-6 text-sm italic bg-pink-50/50 p-4 rounded-2xl border-l-4 border-primary-light relative"
                  >
                    <Heart className="absolute -right-1 -top-1 opacity-30" size={14} />
                    "{s.notes}"
                  </motion.div>
                )}
              </div>
              <div className="hidden md:block opacity-0 group-hover:opacity-100 transition-opacity">
                <Sparkles className="text-accent" size={24} />
              </div>
            </div>
          </BouncyCard>
        ))}
      </div>
    </div>
  );
};

export default PlanningDetail;
