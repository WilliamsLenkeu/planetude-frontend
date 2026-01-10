import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Mail, Lock, Sparkles, ArrowRight, Star } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { authService } from '../services/auth.service'
import { useAuth } from '../contexts/AuthContext'
import { useMutation } from '@tanstack/react-query'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [gender, setGender] = useState('F')
  const { setAuth } = useAuth()
  const navigate = useNavigate()

  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      setAuth(data.token, data.user, data.refreshToken)
      toast.success('Compte créé avec succès ! Bienvenue 🌸', { icon: '🎀' })
      navigate('/dashboard')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erreur lors de l\'inscription')
    }
  })

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    registerMutation.mutate({ name, email, password, gender })
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 relative overflow-hidden">
      {/* Background Decorative Elements - Design 2.0 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-pink-milk/30 rounded-full blur-[140px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, -8, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-cloud/20 rounded-full blur-[140px]" 
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg w-full bg-white/40 backdrop-blur-2xl rounded-[4rem] p-10 md:p-14 border border-white relative overflow-hidden shadow-2xl group"
      >
        {/* Decorative background circle */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-pink-milk/20 rounded-full blur-3xl transition-transform duration-1000 group-hover:scale-125" />
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-pink-candy/5 rounded-full blur-2xl" />

        <div className="text-center mb-10 relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-white/60 backdrop-blur-md border border-white rounded-full shadow-sm mb-8"
          >
            <Star size={12} className="text-pink-deep fill-pink-deep animate-pulse" />
            <span className="text-[10px] font-black text-pink-deep uppercase tracking-[0.2em]">Nouveau Carnet</span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-black text-hello-black tracking-tight leading-tight mb-4">
            Bien<span className="text-pink-deep italic font-serif font-normal">venue</span>
          </h2>
          <p className="text-lg text-hello-black/40 font-medium italic leading-relaxed">
            "Prête à organiser tes études avec style ?" ✨
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-6 relative z-10">
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-hello-black/30 uppercase tracking-[0.2em] ml-6">Ton Nom</label>
            <div className="relative group/input">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-2xl flex items-center justify-center border border-pink-milk/10 shadow-sm z-10 group-focus-within/input:scale-110 transition-transform">
                <User className="text-pink-deep" size={18} />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/50 backdrop-blur-md border border-white rounded-[2rem] pl-20 pr-8 py-5 text-hello-black placeholder:text-hello-black/20 focus:outline-none focus:ring-2 focus:ring-pink-milk transition-all font-medium"
                placeholder="Ex: Sakura"
                required
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-bold text-hello-black/30 uppercase tracking-[0.2em] ml-6">Email</label>
            <div className="relative group/input">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-2xl flex items-center justify-center border border-pink-milk/10 shadow-sm z-10 group-focus-within/input:scale-110 transition-transform">
                <Mail className="text-pink-deep" size={18} />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/50 backdrop-blur-md border border-white rounded-[2rem] pl-20 pr-8 py-5 text-hello-black placeholder:text-hello-black/20 focus:outline-none focus:ring-2 focus:ring-pink-milk transition-all font-medium"
                placeholder="ton@email.com"
                required
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-bold text-hello-black/30 uppercase tracking-[0.2em] ml-6">Mot de passe</label>
            <div className="relative group/input">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-2xl flex items-center justify-center border border-pink-milk/10 shadow-sm z-10 group-focus-within/input:scale-110 transition-transform">
                <Lock className="text-pink-deep" size={18} />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/50 backdrop-blur-md border border-white rounded-[2rem] pl-20 pr-8 py-5 text-hello-black placeholder:text-hello-black/20 focus:outline-none focus:ring-2 focus:ring-pink-milk transition-all font-medium"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-bold text-hello-black/30 uppercase tracking-[0.2em] ml-6">Genre</label>
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
                  className={`py-5 px-2 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all border-2 ${
                    gender === opt.val 
                      ? 'bg-hello-black text-white border-hello-black shadow-lg scale-[1.03]' 
                      : 'bg-white/60 backdrop-blur-md text-hello-black/40 border-white hover:border-pink-milk/30'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 space-y-6">
            <button
              type="submit"
              disabled={registerMutation.isPending}
              className="w-full bg-hello-black text-white py-6 rounded-[2.5rem] font-black text-[12px] uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-pink-deep hover:text-hello-black transition-all duration-500 shadow-xl disabled:opacity-50 group"
            >
              {registerMutation.isPending ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                >
                  <Sparkles size={18} className="text-soft-gold" />
                </motion.div>
              ) : (
                <>
                  Créer mon carnet 
                  <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                </>
              )}
            </button>

            <div className="flex items-center gap-6 py-1">
              <div className="h-[1px] flex-1 bg-pink-milk/20" />
              <span className="text-[9px] font-black text-hello-black/20 uppercase tracking-[0.3em]">OU</span>
              <div className="h-[1px] flex-1 bg-pink-milk/20" />
            </div>

            <button
              type="button"
              onClick={() => toast.error('Google Auth sera bientôt disponible ! 🌸')}
              className="w-full bg-white/60 backdrop-blur-md border border-white text-hello-black/60 py-5 rounded-[2.5rem] font-black uppercase tracking-[0.2em] text-[10px] hover:bg-white transition-all flex items-center justify-center gap-4 shadow-sm hover:scale-[1.02] active:scale-95"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              S'inscrire avec Google
            </button>
          </div>
        </form>

        <div className="mt-12 text-center pt-8 border-t border-pink-milk/10">
          <p className="text-hello-black/40 text-sm font-medium italic">
            Déjà un compte ?{' '}
            <Link to="/auth/login" className="text-pink-deep font-black uppercase tracking-[0.2em] text-[10px] ml-2 hover:text-pink-candy transition-colors relative group/link">
              Connecte-toi ! 🌸
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-pink-candy transition-all group-hover/link:w-full" />
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
