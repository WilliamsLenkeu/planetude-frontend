import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <div className="mb-8 animate-bounce">
        <div className="w-32 h-32 bg-primary rounded-full flex items-center justify-center text-white text-6xl shadow-lg ring-8 ring-primary-100">
          ✨
        </div>
      </div>
      <h1 className="text-5xl text-primary mb-4">PlanÉtude</h1>
      <p className="text-xl text-gray-600 mb-8 max-w-sm">
        Organise tes révisions avec style et douceur. PixelCoach est là pour t'aider ! 🌸
      </p>
      <div className="flex flex-col gap-4 w-full max-w-xs">
        <Link to="/auth/register" className="kawaii-button kawaii-button-primary">
          C'est parti ! 🚀
        </Link>
        <Link to="/auth/login" className="kawaii-button kawaii-button-accent">
          Déjà un compte ? 💖
        </Link>
      </div>
      <div className="mt-12 grid grid-cols-2 gap-4">
        <div className="p-4 bg-white rounded-kawaii-lg shadow-soft border border-primary-100">
          <span className="text-2xl">📅</span>
          <p className="font-bold text-sm mt-2">Plannings futés</p>
        </div>
        <div className="p-4 bg-white rounded-kawaii-lg shadow-soft border border-primary-100">
          <span className="text-2xl">🤖</span>
          <p className="font-bold text-sm mt-2">Aide par IA</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
