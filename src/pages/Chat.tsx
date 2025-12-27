import React, { useState, useRef, useEffect } from 'react';
import api from '../lib/api';
import Card from '../components/Card';
import { Send, Sparkles } from 'lucide-react';

interface Message {
  role: 'user' | 'ai';
  content: string;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: 'Coucou ! Je suis PixelCoach, ton assistant d\'étude. Comment puis-je t\'aider aujourd\'hui ? ✨' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const data = await api('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ message: userMessage })
      });

      setMessages(prev => [...prev, { role: 'ai', content: data.response }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', content: 'Oups ! J\'ai eu un petit bug... Peux-tu réessayer ? 🌸' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)]">
      <header className="mb-4">
        <h2 className="text-2xl text-primary font-decorative flex items-center gap-2">
          <Sparkles className="text-accent" /> PixelCoach
        </h2>
        <p className="text-xs text-gray-500 italic">Ton coach IA adorable</p>
      </header>

      <Card className="flex-1 overflow-y-auto mb-4 p-4 flex flex-col gap-4 bg-white/50">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl shadow-sm flex gap-2 ${m.role === 'user'
              ? 'bg-primary text-white rounded-tr-none'
              : 'bg-white border border-primary-100 rounded-tl-none'
              }`}>
              {m.role === 'ai' && <div className="w-6 h-6 rounded-full bg-accent flex-shrink-0 flex items-center justify-center text-[10px]">🤖</div>}
              <div>
                <p className="text-sm">{m.content}</p>
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-primary-100 p-3 rounded-2xl rounded-tl-none shadow-sm italic text-gray-400 text-sm animate-pulse">
              PixelCoach réfléchit... ✨
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </Card>

      <form onSubmit={handleSend} className="flex gap-2">
        <input
          className="flex-1 kawaii-input py-2"
          placeholder="Pose-moi une question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />
        <button
          type="submit"
          className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center shadow-md disabled:opacity-50"
          disabled={loading}
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default Chat;
