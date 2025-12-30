import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Lock, Mail, ArrowRight, Star } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'
import { authService } from '../services/auth.service'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { setAuth } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const data = await authService.login({ email, password })

      setAuth(data.token, data.user)
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
    <div className="max-w-xl mx-auto mt-12 px-4 relative">
      {/* Anneaux de classeur décoratifs */}
      <div className="absolute left-[-20px] top-10 bottom-10 flex flex-col justify-around z-20 pointer-events-none hidden md:flex">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="w-5 h-5 rounded-full bg-gradient-to-br from-gray-300 to-gray-100 border border-gray-400/30 shadow-sm" />
        ))}
      </div>
      
      <motion.div
        initial={{ opacity: 0, rotate: -2 }}
        animate={{ opacity: 1, rotate: 0 }}
        className="notebook-page p-8 md:p-12 shadow-2xl relative"
      >
        {/* Ruban adhésif décoratif */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-32 h-8 bg-pink-candy/10 border border-pink-candy/5 backdrop-blur-[2px] rotate-[-2deg] z-20" />

        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-pink-milk/50 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-pink-deep mb-4">
            <Star size={12} className="fill-pink-deep" />
            Accès Membre
          </div>
          <h2 className="text-4xl font-black text-hello-black italic font-serif">Bon retour !</h2>
          <p className="text-hello-black/50 mt-2 font-display">Prête pour une session productive ?</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-8 relative z-10">
          <div className="space-y-2">
            <label className="text-xs font-black text-hello-black/40 uppercase tracking-widest ml-1">Email</label>
            <div className="relative group">
              <Mail className="absolute left-0 top-1/2 -translate-y-1/2 text-pink-candy group-focus-within:text-pink-deep transition-colors" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border-b-2 border-pink-milk focus:border-pink-candy outline-none py-3 pl-8 text-hello-black font-display placeholder:text-hello-black/20 transition-all"
                placeholder="ton@email.com"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-hello-black/40 uppercase tracking-widest ml-1">Mot de passe</label>
            <div className="relative group">
              <Lock className="absolute left-0 top-1/2 -translate-y-1/2 text-pink-candy group-focus-within:text-pink-deep transition-colors" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent border-b-2 border-pink-milk focus:border-pink-candy outline-none py-3 pl-8 text-hello-black font-display placeholder:text-hello-black/20 transition-all"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-hello-black text-white py-5 rounded-none font-black uppercase tracking-[0.2em] text-xs shadow-notebook hover:translate-y-[-2px] hover:shadow-xl transition-all flex items-center justify-center gap-3"
          >
            {isLoading ? 'Identification...' : 'Ouvrir mon journal'}
            {!isLoading && <ArrowRight size={16} />}
          </button>
        </form>

        <div className="mt-12 text-center pt-8 border-t border-dashed border-pink-milk">
          <p className="text-hello-black/40 text-sm font-display">
            Pas encore de compte ?{' '}
            <Link to="/auth/register" className="text-pink-deep font-black uppercase tracking-widest text-[11px] hover:underline underline-offset-4">
              Créer un carnet ✨
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
