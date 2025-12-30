import { useState, useRef, useEffect } from 'react'
import { Send, Cat, Sparkles, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import ReactMarkdown from 'react-markdown'
import { chatService } from '../services/chat.service'
import { useAuth } from '../contexts/AuthContext'

interface Message {
  id: string
  text: string
  sender: 'user' | 'coach'
  timestamp: Date
}

export default function Chat() {
  const { user } = useAuth()
  const firstName = user?.name?.split(' ')[0] || 'ma belle'
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      text: `Coucou ${firstName} ! Je suis PixelCoach, ton assistant personnel. Comment puis-je t'aider aujourd'hui ? 🐾✨`,
      sender: 'coach',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const history = await chatService.getHistory()
        if (history && history.length > 0) {
          setMessages(history.map(m => ({
            ...m,
            timestamp: new Date(m.timestamp)
          })))
        } else {
          // Welcome message if no history
          setMessages([{
            id: 'welcome',
            text: `Coucou ${firstName} ! ✨ Je suis PixelCoach, ton petit assistant personnel. Je suis tellement content de te voir ! Comment puis-je t'aider à briller aujourd'hui ? 🎀`,
            sender: 'coach',
            timestamp: new Date()
          }])
        }
      } catch (error) {
        // Fallback welcome message on error
        setMessages([{
          id: 'welcome',
          text: `Coucou ${firstName} ! ✨ Je suis PixelCoach, ton petit assistant personnel. Je suis tellement content de te voir ! Comment puis-je t'aider à briller aujourd'hui ? 🎀`,
          sender: 'coach',
          timestamp: new Date()
        }])
      }
    }
    fetchHistory()
  }, [firstName])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    const currentInput = input
    setInput('')
    setIsLoading(true)

    try {
      const data = await chatService.sendMessage(currentInput)
      
      const coachMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response || "Désolée, j'ai eu un petit bug... Peux-tu répéter ? 🌸",
        sender: 'coach',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, coachMessage])
    } catch (error) {
      toast.error("Oups ! PixelCoach fait dodo... Réessaie plus tard. 🎀")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto h-full flex flex-col relative overflow-hidden pb-4">
      {/* Diary Header Style */}
      <div className="flex items-center justify-between mb-6 shrink-0 px-4 md:px-0">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-pink-candy rounded-full flex items-center justify-center shadow-lg border-2 border-white floating-animation">
            <Cat size={28} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-hello-black font-display flex items-center gap-3">
              PixelCoach
              <span className="h-2 w-2 rounded-full bg-sage-soft animate-pulse shadow-[0_0_8px_rgba(183,228,199,0.8)]" />
            </h1>
            <p className="text-[10px] font-black text-pink-deep/40 uppercase tracking-[0.2em]">Confidences & Conseils</p>
          </div>
        </div>
        <div className="hidden md:block h-[1px] flex-1 mx-8 bg-gradient-to-r from-pink-candy/20 to-transparent" />
      </div>

      {/* Diary Page Container */}
      <div className="flex-1 relative flex flex-col min-h-0">
        {/* Binder Rings Simulation for the diary page */}
        <div className="absolute left-[-1.5rem] top-10 bottom-10 flex flex-col justify-around z-20 pointer-events-none hidden md:flex">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="w-5 h-5 rounded-full bg-gradient-to-br from-gray-300 to-gray-100 border border-gray-400/30 shadow-sm" />
          ))}
        </div>

        <div className="flex-1 notebook-page p-6 md:p-10 flex flex-col min-h-0 shadow-2xl">
          {/* Zone des messages - with paper line texture already in notebook-page */}
          <div className="flex-1 overflow-y-auto px-4 custom-scrollbar space-y-8 mb-6 relative z-10">
            <AnimatePresence initial={false}>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] md:max-w-[70%] relative group ${
                      message.sender === 'user'
                        ? 'bg-white p-6 shadow-notebook rotate-[0.5deg] border-l-4 border-pink-candy'
                        : 'bg-pink-milk/20 p-6 shadow-sm border border-pink-milk/30 italic font-serif text-lg'
                    }`}
                  >
                    {/* Message Content */}
                    <div className={`prose prose-sm max-w-none font-display ${message.sender === 'coach' ? 'text-pink-deep/80' : 'text-hello-black/80'}`}>
                      <ReactMarkdown>{message.text}</ReactMarkdown>
                    </div>

                    {/* Timestamp as a subtle handwritten note */}
                    <div className={`text-[9px] mt-4 font-black uppercase tracking-widest opacity-30 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>

                    {/* Tape Decorative for user messages */}
                    {message.sender === 'user' && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-6 bg-pink-candy/10 border border-pink-candy/5 backdrop-blur-[2px] rotate-[-2deg]" />
                    )}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-pink-milk/10 p-4 rounded-full border border-pink-milk/20">
                    <Loader2 className="animate-spin text-pink-candy" size={20} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* Handwritten Style Input Area */}
          <div className="relative z-10 pt-6 border-t border-pink-milk/20">
            <div className="flex gap-4 items-center bg-white/50 p-2 rounded-full border border-pink-milk/30 shadow-inner">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Confie-toi à PixelCoach... ✨"
                className="flex-1 bg-transparent px-6 py-3 focus:outline-none font-display text-lg text-hello-black placeholder:text-pink-deep/20"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="w-12 h-12 bg-hello-black text-white rounded-full flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-pink-candy transition-all shadow-lg hover:scale-105 active:scale-95"
              >
                <Send size={20} />
              </button>
            </div>
            <div className="mt-2 px-6 flex justify-between items-center">
              <span className="text-[9px] font-black text-pink-deep/20 uppercase tracking-[0.3em]">Écrit avec amour par PixelCoach</span>
              <Sparkles size={14} className="text-pink-candy opacity-20" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
