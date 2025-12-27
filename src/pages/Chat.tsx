import React, { useState, useRef, useEffect } from 'react';
import api from '../lib/api';
import { BouncyCard, Heart, Sparkle } from '../components/AestheticComponents';
import { Send, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  role: 'user' | 'ai';
  content: string;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: 'Coucou mon chat ! Je suis PixelCoach, ton assistant d\'étude. Dis-moi tout, de quoi as-tu besoin aujourd\'hui ? ✨🎀' }
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
      setMessages(prev => [...prev, { role: 'ai', content: 'Oups ! Mon petit cœur a eu un raté... On réessaie ? 🌸' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-14rem)]">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-3xl text-primary font-satisfy flex items-center gap-2">
            PixelCoach
          </h2>
          <p className="text-xs text-primary-dark font-extrabold uppercase tracking-widest italic flex items-center gap-1">
            <Sparkles size={12} className="text-accent" /> Assistant Magique
          </p>
        </div>
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-kawaii border-2 border-primary-light animate-float">
          <span className="text-2xl">🧚‍♀️</span>
        </div>
      </header>

      <BouncyCard className="flex-1 overflow-y-auto mb-6 p-6 flex flex-col gap-6 bg-white/60 backdrop-blur-md border-primary-light/30">
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] p-4 rounded-3xl shadow-sm relative group ${m.role === 'user'
                  ? 'bg-gradient-to-br from-primary to-primary-dark text-white rounded-tr-none'
                  : 'bg-white text-text border-2 border-primary-light/50 rounded-tl-none'
                }`}>
                {m.role === 'ai' && (
                  <div className="absolute -left-3 -top-3 w-8 h-8 rounded-full bg-accent flex items-center justify-center border-2 border-white shadow-sm overflow-hidden text-xs">
                    🤖
                  </div>
                )}
                <p className="text-sm leading-relaxed font-medium">
                  {m.content}
                </p>
                {m.role === 'user' && (
                  <div className="absolute -right-1 -bottom-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Heart size={12} className="text-white" />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-white/80 border-2 border-dashed border-primary-light p-3 rounded-2xl rounded-tl-none italic text-primary-dark text-xs flex items-center gap-2">
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>✨</motion.div>
              PixelCoach prépare une surprise...
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </BouncyCard>

      <form onSubmit={handleSend} className="flex gap-3 relative">
        <div className="absolute -top-12 left-0 right-0 pointer-events-none flex justify-center">
          <Sparkle className="opacity-50" />
        </div>
        <input
          className="flex-1 kawaii-input py-4 pr-14 shadow-xl border-dashed"
          placeholder="Raconte-moi tes révisions... 🌸"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />
        <motion.button
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          type="submit"
          className="absolute right-2 top-2 w-11 h-11 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg disabled:opacity-50"
          disabled={loading}
        >
          <Send size={20} />
        </motion.button>
      </form>
    </div>
  );
};

export default Chat;
