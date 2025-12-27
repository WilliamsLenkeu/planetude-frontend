import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/Card';
import { LogOut, User, Settings, Heart } from 'lucide-react';

const Profile: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="space-y-6">
      <header className="text-center">
        <div className="w-24 h-24 rounded-full bg-accent mx-auto border-4 border-white shadow-lg flex items-center justify-center text-5xl mb-4">
          👸
        </div>
        <h2 className="text-2xl text-primary font-decorative">{user?.name}</h2>
        <p className="text-sm text-gray-500">{user?.email}</p>
      </header>

      <Card>
        <div className="space-y-4">
          <button className="w-full flex items-center gap-4 p-3 hover:bg-bg rounded-xl transition-colors text-left group">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <User size={20} />
            </div>
            <span className="font-medium">Éditer mon profil</span>
          </button>

          <button className="w-full flex items-center gap-4 p-3 hover:bg-bg rounded-xl transition-colors text-left group">
            <div className="w-10 h-10 rounded-full bg-lilac/20 flex items-center justify-center text-lilac group-hover:scale-110 transition-transform">
              <Settings size={20} />
            </div>
            <span className="font-medium">Paramètres</span>
          </button>

          <button className="w-full flex items-center gap-4 p-3 hover:bg-bg rounded-xl transition-colors text-left group">
            <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <Heart size={20} />
            </div>
            <span className="font-medium">Mes Favoris</span>
          </button>
        </div>
      </Card>

      <button
        onClick={logout}
        className="w-full kawaii-button border-2 border-primary-100 text-primary flex items-center justify-center gap-2 hover:bg-white"
      >
        <LogOut size={20} /> Déconnexion
      </button>

      <div className="text-center text-[10px] text-gray-400 mt-8">
        PlanÉtude v1.0.0 — Fait avec amour 💖
      </div>
    </div>
  );
};

export default Profile;
