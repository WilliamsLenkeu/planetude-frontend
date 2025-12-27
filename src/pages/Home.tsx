import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkle, Heart, Ribbon } from '../components/AestheticComponents';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center overflow-hidden bg-white/20">
      {/* Decorative Background Icons */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-10%] left-[-10%] text-9xl opacity-10"
      >
        🌸
      </motion.div>
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[-10%] right-[-10%] text-9xl opacity-10"
      >
        ✨
      </motion.div>

      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="mb-8 relative"
      >
        <div className="w-48 h-48 bg-white rounded-full flex items-center justify-center shadow-[0_20px_50px_rgba(255,119,169,0.3)] ring-8 ring-primary-light border-4 border-dashed border-primary">
          <motion.span
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-8xl"
          >
            👸
          </motion.span>
        </div>
        <Ribbon className="absolute -top-4 -right-4 scale-150 rotate-12" />
        <Sparkle className="absolute top-0 right-0" />
        <Sparkle className="absolute bottom-4 left-0" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h1 className="text-6xl text-primary mb-2 font-satisfy">PlanÉtude</h1>
        <div className="flex items-center justify-center gap-2 mb-6">
          <Heart />
          <p className="text-xl text-primary-dark font-decorative uppercase tracking-[0.2em] font-bold">
            Pixel Edition
          </p>
          <Heart />
        </div>

        <p className="text-lg text-gray-600 mb-10 max-w-sm font-medium italic">
          "Rends tes études aussi adorables que toi !" 💮
        </p>
      </motion.div>

      <motion.div
        className="flex flex-col gap-5 w-full max-w-xs relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <Link to="/auth/register" className="kawaii-button kawaii-button-primary text-xl py-4 shadow-xl">
          C'est parti ! 🚀
        </Link>
        <Link to="/auth/login" className="kawaii-button kawaii-button-accent text-lg py-3">
          Déjà un compte ? 💖
        </Link>
      </motion.div>

      <motion.div
        className="mt-16 grid grid-cols-2 gap-6"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <div className="p-5 bg-white rounded-kawaii-md shadow-kawaii border-2 border-primary-light border-dashed">
          <span className="text-3xl">📅</span>
          <p className="font-bold text-xs mt-3 text-primary uppercase tracking-tighter">Plannings futés</p>
        </div>
        <div className="p-5 bg-white rounded-kawaii-md shadow-kawaii border-2 border-primary-light border-dashed">
          <span className="text-3xl">🤖</span>
          <p className="font-bold text-xs mt-3 text-primary uppercase tracking-tighter">PixelCoach IA</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;
