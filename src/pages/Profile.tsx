import { useState, useEffect } from 'react'
import { User as UserIcon, Mail, Bell, Star, Edit2, Lock, Save, LogOut, Camera, ShieldCheck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { userService } from '../services/user.service'
import toast from 'react-hot-toast'
import type { User } from '../types/index'
import { motion } from 'framer-motion'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'

export default function Profile() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  
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

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="max-w-4xl mx-auto py-6 md:py-10 px-4 relative">
      {/* Anneaux de classeur décoratifs */}
      <div className="absolute left-[-10px] top-20 bottom-20 flex flex-col justify-around z-20 pointer-events-none hidden md:flex">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="w-5 h-5 rounded-full bg-gradient-to-br from-gray-300 to-gray-100 border border-gray-400/30 shadow-sm" />
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="notebook-page p-6 md:p-12 shadow-2xl relative overflow-hidden"
      >
        {/* En-tête du profil style Polaroid */}
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10 mb-10 md:mb-16">
          <div className="relative group">
            <div className="w-36 h-44 md:w-48 md:h-56 bg-white p-2 md:p-3 shadow-notebook rotate-[-2deg] transition-transform group-hover:rotate-0 duration-500">
              <div className="w-full h-28 md:h-40 bg-pink-milk flex items-center justify-center overflow-hidden border border-gray-100">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="size-10 md:size-16 text-pink-candy/40" />
                )}
              </div>
              <div className="mt-2 md:mt-4 flex flex-col items-center">
                <p className="font-serif italic text-hello-black/60 text-[10px] md:text-sm">Princesse {user?.name}</p>
                <div className="mt-1 md:mt-2 h-1 w-8 md:w-12 bg-pink-candy/20 rounded-full" />
              </div>
              {!isEditing && (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="absolute inset-0 bg-hello-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                >
                  <Camera className="size-5 md:size-6" />
                </button>
              )}
            </div>
            {/* Ruban adhésif pour le Polaroid */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-4 md:w-20 md:h-6 bg-pink-candy/10 border border-pink-candy/5 backdrop-blur-[2px] rotate-[-5deg]" />
          </div>

          <div className="flex-1 space-y-3 md:space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-2 md:px-3 py-1 bg-pink-milk/50 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest text-pink-deep">
              <Star className="size-2.5 md:size-3 fill-pink-deep" />
              Étudiante de Niveau { (user as any)?.gamification?.level || (user as any)?.level || 1 }
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-hello-black italic font-serif leading-none">{user?.name}</h2>
            <p className="text-hello-black/50 font-display text-base md:text-lg">
              Progression totale : <span className="text-pink-deep font-black">{ (user as any)?.gamification?.totalXP || (user as any)?.xp || 0 } XP</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 relative z-10">
          <div className="space-y-6 md:space-y-8">
            <div className="flex items-center gap-3 border-b-2 border-pink-milk pb-2">
              <ShieldCheck className="size-4 md:size-5 text-pink-deep" />
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-hello-black">Informations</h3>
            </div>

            {isEditing ? (
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-hello-black/40 uppercase tracking-widest ml-1">Nom d'étudiante</label>
                  <input 
                    type="text"
                    value={editForm.name}
                    onChange={e => setEditForm({...editForm, name: e.target.value})}
                    className="w-full bg-transparent border-b-2 border-pink-milk focus:border-pink-candy outline-none py-2 text-hello-black font-display transition-all"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-hello-black/40 uppercase tracking-widest ml-1">Genre</label>
                  <select 
                    value={editForm.gender}
                    onChange={e => setEditForm({...editForm, gender: e.target.value})}
                    className="w-full bg-transparent border-b-2 border-pink-milk focus:border-pink-candy outline-none py-2 text-hello-black font-display transition-all"
                  >
                    <option value="F">Féminin 🌸</option>
                    <option value="M">Masculin 🐨</option>
                    <option value="O">Autre ✨</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-hello-black/40 uppercase tracking-widest ml-1">Avatar (URL)</label>
                  <input 
                    type="text"
                    value={editForm.avatar}
                    onChange={e => setEditForm({...editForm, avatar: e.target.value})}
                    className="w-full bg-transparent border-b-2 border-pink-milk focus:border-pink-candy outline-none py-2 text-hello-black font-display transition-all"
                    placeholder="https://..."
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="submit"
                    className="flex-1 bg-hello-black text-white py-4 font-black uppercase tracking-widest text-[10px] shadow-notebook hover:translate-y-[-2px] transition-all flex items-center justify-center gap-2"
                  >
                    <Save size={14} /> Enregistrer
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setIsEditing(false)}
                    className="px-6 border-2 border-hello-black text-hello-black py-4 font-black uppercase tracking-widest text-[10px]"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="group">
                  <p className="text-[10px] font-black text-hello-black/40 uppercase tracking-widest ml-1">Email académique</p>
                  <div className="flex items-center gap-3 py-2 border-b-2 border-transparent group-hover:border-pink-milk transition-all">
                    <Mail size={16} className="text-pink-candy" />
                    <p className="font-display text-hello-black">{user?.email}</p>
                  </div>
                </div>
                
                <div className="group">
                  <p className="text-[10px] font-black text-hello-black/40 uppercase tracking-widest ml-1">Préférences</p>
                  <div className="flex items-center gap-3 py-2 border-b-2 border-transparent group-hover:border-pink-milk transition-all">
                    <Bell size={16} className="text-pink-candy" />
                    <p className="font-display text-hello-black">
                      {user?.gender === 'M' ? 'Prince' : user?.gender === 'F' ? 'Princesse' : 'Étudiante'} studieuse ✨
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="border-2 border-hello-black text-hello-black py-4 font-black uppercase tracking-widest text-[10px] hover:bg-pink-milk transition-all flex items-center justify-center gap-2"
                  >
                    <Edit2 size={14} /> Éditer Profil
                  </button>
                  <button 
                    onClick={() => setIsChangingPassword(true)}
                    className="bg-white border-2 border-pink-milk text-pink-deep py-4 font-black uppercase tracking-widest text-[10px] hover:border-pink-candy transition-all flex items-center justify-center gap-2"
                  >
                    <Lock size={14} /> Sécurité
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6 md:space-y-8">
            <div className="flex items-center gap-3 border-b-2 border-pink-milk pb-2">
              <Lock className="size-4 md:size-5 text-pink-deep" />
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-hello-black">Sécurité</h3>
            </div>

            {isChangingPassword ? (
              <form onSubmit={handleChangePassword} className="space-y-5 md:space-y-6">
                <div className="space-y-1">
                  <label className="text-[9px] md:text-[10px] font-black text-hello-black/40 uppercase tracking-widest ml-1">Ancien mot de passe</label>
                  <input 
                    type="password"
                    value={passwordForm.oldPassword}
                    onChange={e => setPasswordForm({...passwordForm, oldPassword: e.target.value})}
                    className="w-full bg-transparent border-b-2 border-pink-milk focus:border-pink-candy outline-none py-1.5 md:py-2 text-hello-black font-display transition-all"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] md:text-[10px] font-black text-hello-black/40 uppercase tracking-widest ml-1">Nouveau mot de passe</label>
                  <input 
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={e => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                    className="w-full bg-transparent border-b-2 border-pink-milk focus:border-pink-candy outline-none py-1.5 md:py-2 text-hello-black font-display transition-all"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] md:text-[10px] font-black text-hello-black/40 uppercase tracking-widest ml-1">Confirmer</label>
                  <input 
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={e => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                    className="w-full bg-transparent border-b-2 border-pink-milk focus:border-pink-candy outline-none py-1.5 md:py-2 text-hello-black font-display transition-all"
                    required
                  />
                </div>
                <div className="flex gap-3 md:gap-4 pt-2 md:pt-4">
                  <button 
                    type="submit"
                    className="flex-1 bg-hello-black text-white py-3 md:py-4 font-black uppercase tracking-widest text-[9px] md:text-[10px] shadow-notebook hover:translate-y-[-2px] transition-all flex items-center justify-center gap-2"
                  >
                    <Save size={14} /> Mettre à jour
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setIsChangingPassword(false)}
                    className="px-4 md:px-6 border-2 border-hello-black text-hello-black py-3 md:py-4 font-black uppercase tracking-widest text-[9px] md:text-[10px]"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            ) : (
              <div className="bg-pink-milk/20 p-6 md:p-8 border-l-4 md:border-l-8 border-pink-candy rotate-1 relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-14 md:w-16 h-4 md:h-6 bg-pink-candy/10 border border-pink-candy/5 backdrop-blur-[2px]" />
                <p className="text-hello-black/70 font-serif italic text-xs md:text-sm leading-relaxed">
                  "Ta sécurité est importante pour moi ! N'hésite pas à changer ton mot de passe régulièrement pour garder ton journal en sécurité. 🌸"
                </p>
                <p className="mt-3 md:mt-4 text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] text-hello-black/30">
                  — Conseil de PixelCoach
                </p>
              </div>
            )}

            <div className="pt-6 md:pt-10">
              <button 
                onClick={handleLogout}
                className="w-full bg-pink-milk text-pink-deep font-black uppercase tracking-[0.2em] text-[9px] md:text-[10px] py-4 md:py-5 hover:bg-pink-candy/20 transition-all flex items-center justify-center gap-2 border-2 border-pink-candy/10"
              >
                <LogOut className="size-3.5 md:size-4" /> Fermer mon carnet
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
