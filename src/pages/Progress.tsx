import React, { useEffect, useState } from 'react';
import api from '../lib/api';
import { BouncyCard, Sparkle } from '../components/AestheticComponents';
import { Trophy, Clock, Star, Award } from 'lucide-react';
import { motion } from 'framer-motion';

const Progress: React.FC = () => {
  const [summary, setSummary] = useState<any>(null);
  const [badges, setBadges] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const s = await api('/api/progress/summary');
        const b = await api('/api/badges');
        setSummary(s);
        setBadges(b);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-8 pb-12">
      <header>
        <h2 className="text-3xl text-primary font-satisfy">Mon Journal de Bord</h2>
        <p className="text-xs text-primary-dark font-extrabold uppercase tracking-widest italic flex items-center gap-1">
          <Star size={12} className="text-accent fill-accent" /> Regarde comme tu brilles !
        </p>
      </header>

      <div className="grid grid-cols-2 gap-6">
        <BouncyCard className="bg-gradient-to-br from-primary-light to-white p-6 relative overflow-hidden">
          <div className="absolute top-[-20px] right-[-20px] w-16 h-16 bg-white/20 rounded-full"></div>
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-primary shadow-sm mb-4">
            <Clock size={20} />
          </div>
          <p className="text-4xl font-bold text-primary font-decorative tracking-tighter">
            {Math.round((summary?.totalTemps || 0) / 60)}h
          </p>
          <p className="text-[10px] text-primary-dark uppercase font-extrabold tracking-widest mt-1">Sagesse accumulée</p>
        </BouncyCard>

        <BouncyCard delay={0.1} className="bg-gradient-to-br from-accent to-white p-6 relative overflow-hidden">
          <div className="absolute bottom-[-20px] left-[-20px] w-16 h-16 bg-white/20 rounded-full"></div>
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-accent shadow-sm mb-4">
            <Trophy size={20} className="fill-accent text-accent-dark" />
          </div>
          <p className="text-4xl font-bold text-text font-decorative tracking-tighter">
            {summary?.count || 0}
          </p>
          <p className="text-[10px] text-gray-500 uppercase font-extrabold tracking-widest mt-1">Missions réussies</p>
        </BouncyCard>
      </div>

      <BouncyCard delay={0.2}>
        <h3 className="text-xl text-primary mb-6 flex items-center gap-2">
          Mes Trophées Adorables <Award size={20} className="text-accent" />
        </h3>
        {badges.length > 0 ? (
          <div className="grid grid-cols-3 gap-6">
            {badges.map((b, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                className="flex flex-col items-center group"
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-br from-white to-bg border-4 ${b.unlocked ? 'border-primary' : 'border-gray-200 grayscale'} shadow-lg mb-2 relative`}>
                  <span className="text-3xl">{b.icon || '⭐'}</span>
                  {b.unlocked && <Sparkle className="absolute -top-1 -right-1 scale-75" />}
                </div>
                <p className={`text-[10px] font-extrabold text-center uppercase tracking-tighter ${b.unlocked ? 'text-text' : 'text-gray-300'}`}>
                  {b.name}
                </p>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-gray-200">
              <Trophy size={32} className="text-gray-200" />
            </div>
            <p className="text-sm text-gray-400 italic">Tes premiers badges t'attendent... ✨</p>
          </div>
        )}
      </BouncyCard>

      <BouncyCard delay={0.3} className="bg-white/40 border-dashed border-primary-light/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs">📈</div>
          <h3 className="text-lg text-primary-dark">Activité Récente</h3>
        </div>
        <div className="h-32 flex items-end justify-between gap-2 px-2">
          {[10, 30, 15, 60, 45, 20, 50].map((h, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${h}%` }}
              transition={{ delay: 0.5 + i * 0.1, type: "spring" }}
              className="flex-1 bg-gradient-to-t from-primary to-primary-light rounded-t-full shadow-inner relative group"
            >
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-primary text-white text-[8px] px-1.5 py-0.5 rounded-full font-bold">
                {h}m
              </div>
            </motion.div>
          ))}
        </div>
        <div className="flex justify-between mt-3 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest px-1">
          <span>Lun</span><span>Mar</span><span>Mer</span><span>Jeu</span><span>Ven</span><span>Sam</span><span>Dim</span>
        </div>
      </BouncyCard>

      <div className="text-center pt-4">
        <Sparkle />
        <p className="text-[10px] text-primary-light font-extrabold uppercase tracking-[0.5em] mt-2">Love Your Progress</p>
      </div>
    </div>
  );
};

export default Progress;
