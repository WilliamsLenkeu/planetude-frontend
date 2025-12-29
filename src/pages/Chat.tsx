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
    <div className="max-w-4xl mx-auto flex flex-col h-full relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -z-10 opacity-20 rotate-12">
        <Sparkles size={120} className="text-pink-candy" />
      </div>

      {/* Header du Chat */}
      <div className="flex items-center gap-4 mb-4 bg-white/40 backdrop-blur-md p-4 rounded-kawaii border-2 border-white/60 shadow-kawaii shrink-0">
        <div className="bg-gradient-to-br from-pink-candy to-pink-deep p-3 rounded-full shadow-lg floating-animation">
          <Cat size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-hello-black flex items-center gap-2">
            PixelCoach
            <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse" />
          </h1>
          <p className="text-xs text-hello-black/60 font-medium">Toujours là pour t'encourager ✨</p>
        </div>
      </div>

      {/* Zone des messages */}
      <div className="flex-1 overflow-y-auto px-2 custom-scrollbar space-y-4 mb-4">
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] md:max-w-[75%] p-4 rounded-2xl shadow-sm ${
                  message.sender === 'user'
                    ? 'bg-pink-candy text-hello-black rounded-tr-none border-2 border-white'
                    : 'bg-white/80 text-hello-black rounded-tl-none border-2 border-pink-milk'
                }`}
              >
                <div className="prose prose-pink prose-sm max-w-none">
                  <ReactMarkdown>{message.text}</ReactMarkdown>
                </div>
                <div className={`text-[10px] mt-2 opacity-50 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-white/80 p-4 rounded-2xl rounded-tl-none border-2 border-pink-milk">
                <Loader2 className="animate-spin text-pink-candy" size={20} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white/60 backdrop-blur-md rounded-kawaii border-2 border-white shadow-kawaii shrink-0 mb-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Écris-moi quelque chose de doux... ✨"
            className="flex-1 bg-white/50 border-2 border-pink-milk/50 rounded-full px-6 py-3 focus:outline-none focus:border-pink-candy transition-colors text-sm"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="kawaii-button !p-3 rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}
