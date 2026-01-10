import { useState, useEffect } from 'react'
import { User as UserIcon, Mail, Star, Edit2, Lock, Save, LogOut, Camera, ShieldCheck, Palette, Check, Terminal } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { THEMES } from '../constants/themes'
import { userService } from '../services/user.service'
import toast from 'react-hot-toast'
import type { User } from '../types/index'
import { motion } from 'framer-motion'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { devConsole } from '../utils/devConsole'

export default function Profile() {
  const { logout } = useAuth()
  const { applyThemeById, currentThemeId } = useTheme()
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [isDevMode, setIsDevMode] = useState(localStorage.getItem('dev_mode') === 'true')
  
  const [editForm, setEditForm] = useState({
    name: '',
    gender: '',
    avatar: ''
  })
  
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const data = await userService.getProfile()
      const userData = (data as any).data || data
      setUser(userData)
      
      setEditForm({
        name: userData.name || '',
        gender: userData.gender || 'F',
        avatar: userData.avatar || ''
      })
    } catch (error) {
      console.error('Erreur profil:', error)
      toast.error('Impossible de charger ton profil 🌸')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await userService.updateProfile(editForm)
      await fetchProfile()
      setIsEditing(false)
      toast.success('Profil mis à jour ! ✨')
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la mise à jour')
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return toast.error('Les mots de passe ne correspondent pas ❌')
    }
    try {
      await userService.changePassword({
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword
      })
      setIsChangingPassword(false)
      setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' })
      toast.success('Mot de passe modifié ! 🍭')
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors du changement')
    }
  }

  const handleLogout = () => {
    logout()
    toast.success('À bientôt ! 🎀')
    navigate('/')
  }

  const handleThemeChange = (themeId: string) => {
    applyThemeById(themeId)
    toast.success('Ambiance mise à jour ! ✨', {
      icon: THEMES.find(t => t.id === themeId)?.emoji
    })
  }

  const toggleDevMode = () => {
    const newValue = !isDevMode
    setIsDevMode(newValue)
    devConsole.toggle(newValue)
    if (newValue) {
      toast.success('Console Dev activée ! 🛠️')
    } else {
      toast.success('Console Dev désactivée ! 🌸')
    }
  }

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="max-w-4xl mx-auto py-3 md:py-6 px-4 relative">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="chic-card p-5 md:p-8 relative overflow-hidden"
      >
        {/* Decorative background circle */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-pink-milk/20 rounded-full blur-3xl" />
        
        {/* En-tête du profil */}
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 mb-6 md:mb-8 relative z-10">
          <div className="relative group">
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-[1.25rem] bg-pink-milk/30 p-1 overflow-hidden shadow-xl shadow-pink-candy/5 transition-transform duration-500 group-hover:scale-[1.02] border-2 border-white">
              <div className="w-full h-full rounded-[1.1rem] bg-white flex items-center justify-center overflow-hidden">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="size-8 md:size-10 text-pink-candy/30" strokeWidth={1.5} />
                )}
              </div>
              {!isEditing && (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="absolute inset-0 bg-hello-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white backdrop-blur-[2px] rounded-[1.25rem]"
                >
                  <Camera className="size-5" />
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-pink-milk/50 rounded-full border-2 border-pink-candy/10">
              <Star className="size-3 fill-pink-deep" />
              <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-pink-deep">
                Étudiante de Niveau { (user as any)?.gamification?.level || (user as any)?.level || 1 }
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-hello-black tracking-tight leading-none font-display">{user?.name}</h2>
            <p className="text-hello-black/40 font-medium italic font-display text-base">
              Progression totale : <span className="text-pink-deep font-black">{(user as any)?.gamification?.totalXP || (user as any)?.xp || 0} XP</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 relative z-10">
          <div className="space-y-8">
            {/* Theme Selection Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-4 border-b-2 border-pink-milk pb-3">
                <div className="p-2 bg-pink-milk/50 rounded-xl text-pink-deep border-2 border-pink-candy/5">
                  <Palette className="size-4" />
                </div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-hello-black">Ambiance & Style</h3>
              </div>

              {/* Color Themes */}
              <div className="space-y-3">
                <p className="text-[9px] font-black text-hello-black/30 uppercase tracking-[0.3em] ml-1">Palette de couleurs</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {THEMES.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => handleThemeChange(theme.id)}
                      className={`relative p-3 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-2 group ${
                        currentThemeId === theme.id 
                          ? 'border-pink-candy bg-pink-milk/10 shadow-sm' 
                          : 'border-transparent bg-white/50 hover:bg-white hover:border-pink-candy/20'
                      }`}
                    >
                      <div 
                        className="w-8 h-8 rounded-full shadow-inner flex items-center justify-center text-sm"
                        style={{ backgroundColor: theme.colors.primary }}
                      >
                        {theme.emoji}
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-wider text-hello-black/60 group-hover:text-hello-black">
                        {theme.name}
                      </span>
                      {currentThemeId === theme.id && (
                        <div className="absolute -top-1 -right-1 bg-pink-candy text-white p-0.5 rounded-full shadow-sm">
                          <Check size={10} strokeWidth={4} />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4 border-b-2 border-pink-milk pb-3">
                <div className="p-2 bg-pink-milk/50 rounded-xl text-pink-deep border-2 border-pink-candy/5">
                  <ShieldCheck className="size-4" />
                </div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-hello-black">Informations</h3>
              </div>

              {isEditing ? (
                <form onSubmit={handleUpdateProfile} className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-hello-black/30 uppercase tracking-[0.3em] ml-1">Nom d'étudiante</label>
                    <input 
                      type="text"
                      value={editForm.name}
                      onChange={e => setEditForm({...editForm, name: e.target.value})}
                      className="chic-input"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-hello-black/30 uppercase tracking-[0.3em] ml-1">Genre</label>
                    <div className="relative">
                      <select 
                        value={editForm.gender}
                        onChange={e => setEditForm({...editForm, gender: e.target.value})}
                        className="chic-select"
                      >
                        <option value="F">Féminin 🌸</option>
                        <option value="M">Masculin 🐨</option>
                        <option value="O">Autre ✨</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-hello-black/30 uppercase tracking-[0.3em] ml-1">Avatar (URL)</label>
                    <input 
                      type="text"
                      value={editForm.avatar}
                      onChange={e => setEditForm({...editForm, avatar: e.target.value})}
                      className="chic-input"
                      placeholder="https://..."
                    />
                  </div>

                  <div className="flex gap-4 pt-1">
                    <button 
                      type="submit"
                      className="chic-button-primary flex-1 py-3"
                    >
                      <Save size={14} /> Sauvegarder
                    </button>
                    <button 
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="flex-1 bg-pink-milk/50 text-pink-deep px-4 py-3 rounded-xl font-black text-[9px] uppercase tracking-[0.3em] hover:bg-pink-candy/20 transition-all border-2 border-pink-candy/10"
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-5">
                    <div className="space-y-1.5 group">
                      <p className="text-[10px] font-black text-hello-black/30 uppercase tracking-[0.3em] flex items-center gap-2">
                        <UserIcon size={11} className="text-pink-deep" /> Nom d'utilisateur
                      </p>
                      <p className="text-lg font-black font-display text-hello-black pl-3 border-l-4 border-pink-milk group-hover:border-pink-candy transition-all duration-300">{user?.name}</p>
                    </div>
                    <div className="space-y-1.5 group">
                      <p className="text-[10px] font-black text-hello-black/30 uppercase tracking-[0.3em] flex items-center gap-2">
                        <Mail size={11} className="text-pink-deep" /> Email
                      </p>
                      <p className="text-lg font-black font-display text-hello-black pl-3 border-l-4 border-pink-milk group-hover:border-pink-candy transition-all duration-300 truncate">{user?.email}</p>
                    </div>
                  </div>

                  <div className="pt-1">
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="chic-button-primary w-full md:w-auto px-6 py-3"
                    >
                      <Edit2 size={12} /> Modifier le profil
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4 border-b-2 border-pink-milk pb-3">
              <div className="p-2 bg-pink-milk/50 rounded-xl text-pink-deep border-2 border-pink-candy/5">
                <Lock className="size-4" />
              </div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-hello-black">Sécurité</h3>
            </div>

            {isChangingPassword ? (
              <form onSubmit={handleChangePassword} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-hello-black/30 uppercase tracking-[0.3em] ml-1">Ancien mot de passe</label>
                  <input 
                    type="password"
                    value={passwordForm.oldPassword}
                    onChange={e => setPasswordForm({...passwordForm, oldPassword: e.target.value})}
                    className="chic-input"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-hello-black/30 uppercase tracking-[0.3em] ml-1">Nouveau mot de passe</label>
                  <input 
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={e => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                    className="chic-input"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-hello-black/30 uppercase tracking-[0.3em] ml-1">Confirmer</label>
                  <input 
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={e => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                    className="chic-input"
                    required
                  />
                </div>

                <div className="flex gap-4 pt-1">
                  <button 
                    type="submit"
                    className="chic-button-primary flex-1 py-3 hover:text-hello-black"
                  >
                    Mettre à jour
                  </button>
                  <button 
                    type="button"
                    onClick={() => setIsChangingPassword(false)}
                    className="flex-1 bg-pink-milk/50 text-pink-deep px-4 py-3 rounded-xl font-black text-[9px] uppercase tracking-[0.3em] hover:bg-pink-candy/20 transition-all border-2 border-pink-candy/10"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-5">
                <p className="text-hello-black/40 font-medium italic font-display text-base leading-relaxed">
                  Garde ton compte en sécurité en changeant régulièrement ton mot de passe. ✨
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-1">
                  <button 
                    onClick={() => setIsChangingPassword(true)}
                    className="chic-card px-6 py-3 font-black text-[9px] uppercase tracking-[0.3em] hover:bg-pink-milk/30 transition-all flex items-center justify-center gap-3 border-2 border-pink-candy/10"
                  >
                    <Lock size={12} /> Changer le mot de passe
                  </button>
                </div>
              </div>
            )}

            {/* Dev Mode Section */}
            <div className="pt-6 border-t-2 border-pink-milk/20">
              <div className="flex items-center justify-between p-5 bg-pink-milk/10 rounded-[1.25rem] border-2 border-pink-candy/10">
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-xl bg-hello-black/5 flex items-center justify-center text-hello-black/40 border-2 border-white">
                    <Terminal size={16} />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-hello-black">Mode Développeur</h4>
                    <p className="text-[9px] text-hello-black/40 mt-1 font-medium italic">Pour les fonctionnalités avancées</p>
                  </div>
                </div>
                <button 
                  onClick={toggleDevMode}
                  className={`w-12 h-7 rounded-full transition-all duration-500 relative border-2 ${isDevMode ? 'bg-pink-deep border-pink-deep' : 'bg-gray-200 border-gray-200'}`}
                >
                  <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-500 ${isDevMode ? 'left-6' : 'left-0.5'}`} />
                </button>
              </div>
            </div>

            {/* Logout Section */}
            <div className="pt-3">
              <button 
                onClick={handleLogout}
                className="w-full bg-red-50 text-red-500 px-6 py-3 rounded-[1.25rem] font-black text-[9px] uppercase tracking-[0.3em] hover:bg-red-100 transition-all flex items-center justify-center gap-3 border-2 border-red-100/50 shadow-sm"
              >
                <LogOut size={14} /> Se déconnecter
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
