import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Mail, Lock, Sparkles, ArrowRight, Star } from 'lucide-react'
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
    <div className="max-w-xl mx-auto mt-8 mb-12 px-4 relative">
      {/* Anneaux de classeur décoratifs */}
      <div className="absolute left-[-20px] top-10 bottom-10 flex flex-col justify-around z-20 pointer-events-none hidden md:flex">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="w-5 h-5 rounded-full bg-gradient-to-br from-gray-300 to-gray-100 border border-gray-400/30 shadow-sm" />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, rotate: 1 }}
        animate={{ opacity: 1, rotate: 0 }}
        className="notebook-page p-8 md:p-12 shadow-2xl relative"
      >
        {/* Trombone décoratif */}
        <div className="absolute -top-6 right-10 w-8 h-16 bg-gray-300/40 border-2 border-gray-400/20 rounded-full z-20 hidden md:block" />

        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-pink-milk/50 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-pink-deep mb-4">
            <Star size={12} className="fill-pink-deep" />
            Nouveau Carnet
          </div>
          <h2 className="text-4xl font-black text-hello-black italic font-serif">Bienvenue !</h2>
          <p className="text-hello-black/50 mt-2 font-display">Prête à organiser tes études avec style ?</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-6 relative z-10">
          <div className="space-y-2">
            <label className="text-xs font-black text-hello-black/40 uppercase tracking-widest ml-1">Ton Nom</label>
            <div className="relative group">
              <User className="absolute left-0 top-1/2 -translate-y-1/2 text-pink-candy group-focus-within:text-pink-deep transition-colors" size={18} />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-transparent border-b-2 border-pink-milk focus:border-pink-candy outline-none py-3 pl-8 text-hello-black font-display placeholder:text-hello-black/20 transition-all"
                placeholder="Ex: Sakura"
                required
              />
            </div>
          </div>

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
                minLength={6}
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-black text-hello-black/40 uppercase tracking-widest ml-1">Genre</label>
            <div className="grid grid-cols-3 gap-4">
              {[
                { val: 'F', label: 'Féminin 🎀' },
                { val: 'M', label: 'Masculin 🌸' },
                { val: 'O', label: 'Autre ✨' }
              ].map((opt) => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => setGender(opt.val)}
                  className={`py-3 px-1 rounded-none text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
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
            className="w-full bg-hello-black text-white py-5 rounded-none font-black uppercase tracking-[0.2em] text-xs shadow-notebook hover:translate-y-[-2px] hover:shadow-xl transition-all flex items-center justify-center gap-3 mt-4"
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              >
                <Sparkles size={18} />
              </motion.div>
            ) : (
              <>
                S'inscrire <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div className="mt-12 text-center pt-8 border-t border-dashed border-pink-milk">
          <p className="text-hello-black/40 text-sm font-display">
            Déjà un compte ?{' '}
            <Link to="/auth/login" className="text-pink-deep font-black uppercase tracking-widest text-[11px] hover:underline underline-offset-4">
              Connecte-toi ! 🌸
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
