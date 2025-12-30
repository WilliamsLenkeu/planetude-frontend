import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Mail, Lock, Sparkles, ArrowRight, Heart } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { authService } from '../services/auth.service'
import { useAuth } from '../contexts/AuthContext'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [gender, setGender] = useState('F')
  const [isLoading, setIsLoading] = useState(false)
  const { setAuth } = useAuth()
  const navigate = useNavigate()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const data = await authService.register({ name, email, password, gender })

      setAuth(data.token, data.user)
      toast.success('Compte créé avec succès ! Bienvenue 🌸', {
        icon: '🎀',
      })
      navigate('/dashboard')
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de l\'inscription')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-8 mb-12 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="kawaii-card bg-white border-4 border-pink-milk shadow-kawaii p-6 md:p-8"
      >
        <div className="text-center mb-6">
          <div className="inline-block p-4 bg-pink-milk rounded-full mb-4 relative">
            <Sparkles size={32} className="text-pink-candy" />
            <motion.div 
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute -top-1 -right-1"
            >
              <Heart size={16} fill="#FFD1DC" className="text-pink-candy" />
            </motion.div>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-hello-black">Bienvenue ! ✨</h2>
          <p className="text-hello-black/60 text-sm">Prête à organiser tes études avec style ?</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-black text-hello-black/40 uppercase tracking-widest mb-2 ml-2">Ton Nom</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-candy" size={20} />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full kawaii-input pl-12"
                placeholder="Ex: Sakura"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-hello-black/40 uppercase tracking-widest mb-2 ml-2">Email</label>
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
            <label className="block text-xs font-black text-hello-black/40 uppercase tracking-widest mb-2 ml-2">Mot de passe</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-candy" size={20} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full kawaii-input pl-12"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-hello-black/40 uppercase tracking-widest mb-2 ml-2">Genre (Optionnel)</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { val: 'F', label: 'Féminin 🎀' },
                { val: 'M', label: 'Masculin 🌸' },
                { val: 'O', label: 'Autre ✨' }
              ].map((opt) => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => setGender(opt.val)}
                  className={`py-2 px-1 rounded-kawaii text-[10px] font-bold transition-all border-2 ${
                    gender === opt.val 
                      ? 'bg-pink-candy text-white border-pink-candy shadow-sm' 
                      : 'bg-white text-hello-black/60 border-pink-milk hover:border-pink-candy/30'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full kawaii-button flex items-center justify-center gap-2 mt-6 py-4"
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              >
                <Sparkles size={20} />
              </motion.div>
            ) : (
              <>
                S'inscrire <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-hello-black/60 text-sm">
            Déjà un compte ?{' '}
            <Link to="/auth/login" className="text-pink-candy font-bold hover:underline">
              Connecte-toi ! 🌸
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
