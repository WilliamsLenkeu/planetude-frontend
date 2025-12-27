import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../lib/api';
import { BouncyCard, Heart } from '../components/AestheticComponents';
import AffirmationWidget from '../components/AffirmationWidget';
import { Calendar, Clock, Trophy, MessageCircle, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [reminders, setReminders] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsData = await api('/api/progress/summary');
        const remindersData = await api('/api/reminders');
        setStats(statsData);
        setReminders(remindersData.slice(0, 3));
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-8 pb-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-6">
          <motion.div
            whileHover={{ rotate: [0, -10, 10, 0] }}
            className="relative"
          >
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-primary-light to-white p-1 shadow-lg border-2 border-primary-light">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-5xl overflow-hidden">
                {user?.gender === 'F' ? '👸' : '🤴'}
              </div>
            </div>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute -bottom-1 -right-1 bg-white rounded-full p-2 shadow-sm"
            >
              <Heart size={20} />
            </motion.div>
          </motion.div>
          <div>
            <h2 className="text-4xl text-primary font-satisfy">Coucou, {user?.name} !</h2>
            <p className="text-gray-500 font-medium italic">Comment se passe ta journée magique ? ✨</p>
          </div>
        </div>

        <div className="hidden lg:block">
          <AffirmationWidget />
        </div>
      </header>

      <div className="lg:hidden">
        <AffirmationWidget />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <BouncyCard className="bg-gradient-to-br from-primary-light/40 to-white border-primary-light/50 text-center p-8 flex flex-col items-center justify-center min-h-[160px]">
          <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-primary shadow-sm mb-4">
            <Clock size={28} />
          </div>
          <div>
            <p className="text-4xl font-bold text-primary font-decorative tracking-tighter leading-none">
              {Math.round((stats?.totalTemps || 0) / 60)}h
            </p>
            <p className="text-[10px] text-primary-dark uppercase font-extrabold tracking-widest mt-2">Temps Étudié</p>
          </div>
        </BouncyCard>

        <BouncyCard delay={0.1} className="bg-gradient-to-br from-accent/40 to-white border-accent/50 text-center p-8 flex flex-col items-center justify-center min-h-[160px]">
          <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-accent shadow-sm mb-4">
            <Trophy size={28} className="fill-accent text-accent-dark" />
          </div>
          <div>
            <p className="text-4xl font-bold text-text font-decorative tracking-tighter leading-none">
              {stats?.count || 0}
            </p>
            <p className="text-[10px] text-gray-500 uppercase font-extrabold tracking-widest mt-2">Sessions d'Étude</p>
          </div>
        </BouncyCard>

        <div className="md:col-span-2 grid grid-cols-2 gap-6">
          <Link to="/chat" className="group h-full">
            <motion.div
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-accent h-full p-6 rounded-kawaii-lg shadow-kawaii border-3 border-white flex flex-col items-center justify-center gap-3 relative overflow-hidden"
            >
              <div className="w-14 h-14 bg-white/50 rounded-full flex items-center justify-center text-primary shadow-inner">
                <MessageCircle size={28} />
              </div>
              <span className="font-bold text-sm text-text uppercase tracking-tighter text-center">PixelCoach IA</span>
            </motion.div>
          </Link>
          <Link to="/planning" className="group h-full">
            <motion.div
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-primary-light h-full p-6 rounded-kawaii-lg shadow-kawaii border-3 border-white flex flex-col items-center justify-center gap-3 relative overflow-hidden"
            >
              <div className="w-14 h-14 bg-white/50 rounded-full flex items-center justify-center text-primary shadow-inner">
                <Calendar size={28} />
              </div>
              <span className="font-bold text-sm text-primary-dark uppercase tracking-tighter text-center">Gestion Planning</span>
            </motion.div>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <BouncyCard delay={0.2} className="lg:col-span-2 relative overflow-visible">
          <div className="absolute -top-4 -left-2 bg-primary text-white text-[10px] px-4 py-1.5 rounded-full font-bold uppercase tracking-widest shadow-lg z-10">
            Tes prochains rappels 🎀
          </div>
          <div className="mt-4 space-y-4">
            {reminders.length > 0 ? (
              reminders.map((r, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-6 p-5 bg-bg/30 rounded-3xl border-2 border-white hover:bg-white hover:border-primary-light/50 transition-all cursor-pointer group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-primary shadow-sm group-hover:scale-110 transition-transform">
                    <Sparkles size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-lg text-text leading-tight">{r.title}</p>
                    <p className="text-[11px] text-primary-dark font-extrabold uppercase mt-1 opacity-60">
                      {new Date(r.date).toLocaleDateString('fr-FR', { weekday: 'long', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <div className="text-primary-light opacity-0 group-hover:opacity-100 transition-opacity">
                    <Heart size={18} />
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-10 opacity-30">
                <p className="text-4xl">🕊</p>
                <p className="text-sm font-medium italic mt-2">Aucun rappel, repose-toi bien !</p>
              </div>
            )}
          </div>
        </BouncyCard>

        <BouncyCard delay={0.3} className="bg-lilac/20 border-lilac/30 flex flex-col items-center justify-center text-center p-8">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-lilac mb-6">
            <span className="text-4xl">⭐</span>
          </div>
          <h3 className="text-2xl text-lilac-dark font-satisfy mb-2">Objectif Semaine</h3>
          <p className="text-sm text-text font-medium mb-6">Atteins 10h d'étude pour débloquer le badge "Licorne Savante" !</p>
          <div className="w-full h-3 bg-white rounded-full overflow-hidden shadow-inner border border-lilac/20">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '65%' }}
              className="h-full bg-gradient-to-r from-lilac to-primary"
            />
          </div>
          <p className="text-[10px] font-extrabold mt-3 text-lilac-dark uppercase tracking-widest">6.5h / 10h complétées</p>
        </BouncyCard>
      </div>
    </div>
  );
};

export default Dashboard;
