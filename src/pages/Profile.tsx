import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { BouncyCard, Heart, Ribbon, Sparkle } from '../components/AestheticComponents';
import { LogOut, User, Settings, Heart as HeartIcon, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Profile: React.FC = () => {
  const { user, logout } = useAuth();

  const menuItems = [
    { icon: User, label: 'Éditer mon profil', color: 'bg-primary-light/20 text-primary' },
    { icon: Settings, label: 'Préférences magiques', color: 'bg-lilac/20 text-lilac-dark' },
    { icon: HeartIcon, label: 'Mes Sessions Favorites', color: 'bg-accent/40 text-primary-dark' },
  ];

  return (
    <div className="space-y-10 pb-12 overflow-visible">
      <header className="text-center relative py-6">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative inline-block"
        >
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-light to-white p-1 shadow-2xl ring-4 ring-white border-2 border-primary-light mx-auto overflow-hidden">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-7xl">
              {user?.gender === 'F' ? '👸' : '🤴'}
            </div>
          </div>
          <Ribbon className="absolute -bottom-2 -left-4 scale-125 -rotate-12" />
          <Sparkle className="absolute -top-4 -right-4" />
        </motion.div>
        <h2 className="text-4xl text-primary font-satisfy mt-8">{user?.name}</h2>
        <p className="text-sm text-primary-dark font-extrabold uppercase tracking-widest opacity-60 flex items-center justify-center gap-2 mt-2">
          <Heart size={14} /> {user?.email} <Heart size={12} />
        </p>
      </header>

      <BouncyCard className="p-4">
        <div className="space-y-3">
          {menuItems.map((item, i) => (
            <motion.button
              key={i}
              whileHover={{ x: 5 }}
              className="w-full flex items-center justify-between p-4 hover:bg-bg/40 rounded-3xl transition-all group border-2 border-transparent hover:border-white"
            >
              <div className="flex items-center gap-5">
                <div className={`w-12 h-12 rounded-2xl ${item.color} flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform`}>
                  <item.icon size={22} />
                </div>
                <span className="font-bold text-lg font-decorative text-text">{item.label}</span>
              </div>
              <ChevronRight size={20} className="text-gray-300 group-hover:text-primary transition-colors" />
            </motion.button>
          ))}
        </div>
      </BouncyCard>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={logout}
        className="w-full kawaii-button border-4 border-dashed border-primary-light/50 text-primary bg-white/50 flex items-center justify-center gap-3 py-4 text-xl shadow-xl"
      >
        <LogOut size={24} /> <span className="font-decorative">Déconnexion</span>
      </motion.button>

      <footer className="text-center space-y-4 pt-10">
        <p className="text-[10px] text-primary-light font-extrabold uppercase tracking-[0.5em]">
          PlanÉtude v2.0 • Pixel Edition
        </p>
        <p className="text-[10px] text-gray-400 italic">
          "Fait avec tout plein d'amour et de magie pour toi" 💖🧚‍♀️
        </p>
      </footer>
    </div>
  );
};

export default Profile;
