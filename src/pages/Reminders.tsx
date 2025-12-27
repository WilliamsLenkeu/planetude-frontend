import React, { useEffect, useState } from 'react';
import api from '../lib/api';
import Card from '../components/Card';
import FormInput from '../components/FormInput';
import { Bell, Trash2, Plus, Clock } from 'lucide-react';

const Reminders: React.FC = () => {
  const [reminders, setReminders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    try {
      const data = await api('/api/reminders');
      setReminders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api('/api/reminders', {
        method: 'POST',
        body: JSON.stringify({ title, date })
      });
      setShowForm(false);
      setTitle('');
      setDate('');
      fetchReminders();
    } catch (err) {
      alert('Erreur 🌸');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api(`/api/reminders/${id}`, { method: 'DELETE' });
      fetchReminders();
    } catch (err) {
      alert('Erreur');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl text-primary font-decorative">Rappels 🔔</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="w-10 h-10 rounded-full bg-accent text-primary transition-transform active:rotate-90 flex items-center justify-center shadow-md"
        >
          <Plus size={24} />
        </button>
      </div>

      {showForm && (
        <Card title="Nouveau Rappel ✨" className="bg-accent/10 border-accent">
          <form onSubmit={handleCreate}>
            <FormInput
              label="Quoi ?"
              placeholder="Réviser les maths"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <FormInput
              label="Quand ?"
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
            <button type="submit" className="kawaii-button kawaii-button-accent w-full">
              Ajouter le rappel 🎀
            </button>
          </form>
        </Card>
      )}

      {loading ? (
        <p className="text-center text-primary italic">Chargement de tes clochettes... 🔔</p>
      ) : reminders.length > 0 ? (
        <div className="space-y-3">
          {reminders.map((r) => (
            <div key={r._id} className="bg-white p-4 rounded-kawaii-lg shadow-soft border border-primary-100 flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary">
                  <Clock size={20} />
                </div>
                <div>
                  <p className="font-bold text-sm">{r.title}</p>
                  <p className="text-xs text-gray-500">{new Date(r.date).toLocaleString('fr-FR')}</p>
                </div>
              </div>
              <button
                onClick={() => handleDelete(r._id)}
                className="p-2 text-gray-200 hover:text-red-400 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Bell className="mx-auto text-gray-200 mb-2" size={48} />
          <p className="text-gray-400 italic text-sm">Tranquille... Aucun rappel pour le moment ! 🌸</p>
        </div>
      )}
    </div>
  );
};

export default Reminders;
