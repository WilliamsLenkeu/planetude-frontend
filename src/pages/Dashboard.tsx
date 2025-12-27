import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/api';
import Card from '../components/Card';
import { Calendar, Clock, Trophy, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

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
    <div className="space-y-6">
      <header className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-3xl border-2 border-primary">
          {user?.gender === 'F' ? '👸' : '🤴'}
        </div>
        <div>
          <h2 className="text-2xl text-primary font-decorative">Coucou, {user?.name} ! ✨</h2>
          <p className="text-gray-500 italic">Prête pour une session productive ?</p>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-primary/10 border-none text-center p-4">
          <Clock className="mx-auto text-primary mb-2" size={24} />
          <p className="text-2xl font-bold text-primary">{Math.round((stats?.totalTemps || 0) / 60)}h</p>
          <p className="text-xs text-gray-600">Étudiées</p>
        </Card>
        <Card className="bg-lilac/10 border-none text-center p-4">
          <Trophy className="mx-auto text-lilac mb-2" size={24} />
          <p className="text-2xl font-bold text-lilac">{stats?.count || 0}</p>
          <p className="text-xs text-gray-600">Sessions</p>
        </Card>
      </div>

      <Card title="Prochains Rappels 🔔">
        {reminders.length > 0 ? (
          <div className="space-y-3">
            {reminders.map((r, i) => (
              <div key={i} className="flex items-center gap-3 p-2 bg-bg rounded-lg border-l-4 border-primary">
                <div className="flex-1">
                  <p className="font-bold text-sm">{r.title}</p>
                  <p className="text-xs text-gray-500">{new Date(r.date).toLocaleString('fr-FR')}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400 italic">Pas de rappels prévus... Profite ! 🌸</p>
        )}
      </Card>

      <div className="flex gap-4">
        <Link to="/chat" className="flex-1 bg-accent p-4 rounded-kawaii-lg shadow-soft border-2 border-primary-100 flex flex-col items-center gap-2">
          <MessageCircle className="text-primary" />
          <span className="font-bold text-sm">Parler à PixelCoach</span>
        </Link>
        <Link to="/planning" className="flex-1 bg-white p-4 rounded-kawaii-lg shadow-soft border-2 border-primary-100 flex flex-col items-center gap-2">
          <Calendar className="text-primary" />
          <span className="font-bold text-sm">Mon Planning</span>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
