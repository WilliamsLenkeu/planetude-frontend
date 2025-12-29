import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Heart, Lock, Mail, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'
import { authService } from '../services/auth.service'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { setToken } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const data = await authService.login({ email, password })

      setToken(data.token)
      toast.success('Bon retour parmi nous ! 🌸', {
        icon: '🎀',
      })
      navigate('/dashboard')
    } catch (error: any) {
      toast.error(error.message || 'Erreur de connexion')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-12 relative">
      {/* Éléments décoratifs en arrière-plan du formulaire */}
      <div className="absolute -top-10 -right-10 text-pink-candy/20 -z-10 rotate-12">
        <Heart size={120} fill="currentColor" />
      </div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="kawaii-card border-2 border-white/50"
      >
        <div className="text-center mb-8">
          <motion.div 
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block p-4 bg-pink-milk rounded-full mb-4 shadow-inner-soft"
          >
            <Heart size={40} fill="#FFD1DC" className="text-pink-candy" />
          </motion.div>
          <h2 className="text-3xl font-bold text-hello-black sparkle inline-block">Bon retour ! 🎀</h2>
          <p className="text-hello-black/60 mt-2">Prête pour une session tout en douceur ?</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-hello-black mb-2 ml-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-candy" size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full kawaii-input pl-12"
                placeholder="ton@email.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-hello-black mb-2 ml-2">Mot de passe</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-candy" size={20} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full kawaii-input pl-12"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full kawaii-button flex items-center justify-center gap-2"
          >
            {isLoading ? 'Connexion...' : 'Se connecter'}
            {!isLoading && <ArrowRight size={20} />}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-hello-black/60">
            Pas encore de compte ?{' '}
            <Link to="/auth/register" className="text-pink-candy font-bold hover:underline">
              Inscris-toi vite ! ✨
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
