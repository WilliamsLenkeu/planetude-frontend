import React, { useEffect, useState } from 'react';
import api from '../lib/api';
import Card from '../components/Card';
import { BarChart, Target, Star } from 'lucide-react';

const Progress: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [badges, setBadges] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsData = await api('/api/progress/summary');
        const badgesData = await api('/api/badges');
        setStats(statsData);
        setBadges(badgesData);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl text-primary font-decorative">Mes Progrès 📈</h2>
        <p className="text-gray-500 italic">Regarde tout ce que tu as accompli !</p>
      </header>

      <div className="grid grid-cols-1 gap-4">
        <Card className="flex items-center gap-4 bg-white">
          <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-primary">
            <Target size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Temps total d'étude</p>
            <p className="text-xl font-bold font-decorative">{Math.round((stats?.totalTemps || 0) / 60)} heures ✨</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4 bg-white">
          <div className="w-12 h-12 bg-lilac/30 rounded-full flex items-center justify-center text-lilac">
            <BarChart size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Sessions complétées</p>
            <p className="text-xl font-bold font-decorative">{stats?.count || 0} sessions 📚</p>
          </div>
        </Card>
      </div>

      <Card title="Mes Badges 🏅">
        {badges.length > 0 ? (
          <div className="grid grid-cols-3 gap-4">
            {badges.map((b, i) => (
              <div key={i} className="flex flex-col items-center text-center gap-2 group">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center text-3xl shadow-sm border-2 border-primary-100 group-hover:scale-110 transition-transform">
                  🥇
                </div>
                <p className="text-[10px] font-bold leading-tight">{b.name}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Star className="mx-auto text-gray-200 mb-2" size={32} />
            <p className="text-sm text-gray-400 italic">Continue tes efforts pour débloquer ton premier badge ! 🌸</p>
          </div>
        )}
      </Card>

      <Card title="Activité Récente">
        <div className="h-32 flex items-end justify-between px-2 gap-1">
          {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
            <div key={i} className="w-full bg-primary-100 rounded-t-lg transition-all hover:bg-primary" style={{ height: `${h}%` }}></div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-[10px] text-gray-400 px-1">
          <span>L</span><span>M</span><span>M</span><span>J</span><span>V</span><span>S</span><span>D</span>
        </div>
      </Card>
    </div>
  );
};

export default Progress;
