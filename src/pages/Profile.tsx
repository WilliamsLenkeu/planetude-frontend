import { useState, useEffect } from 'react'
import { User as UserIcon, Mail, Bell, Star, Edit2, Lock, Save, X, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { userService } from '../services/user.service'
import toast from 'react-hot-toast'
import type { User } from '../types/index'

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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-bounce">
          <div className="w-16 h-16 bg-pink-candy rounded-full border-4 border-white shadow-kawaii flex items-center justify-center">
            <Star className="text-white" size={32} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="text-center mb-8 relative">
        <div className="w-32 h-32 bg-pink-milk rounded-full mx-auto border-4 border-pink-candy flex items-center justify-center mb-4 overflow-hidden relative group">
          {user?.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            <UserIcon size={64} className="text-pink-candy" />
          )}
          {!isEditing && (
            <button 
              onClick={() => setIsEditing(true)}
              className="absolute inset-0 bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
            >
              <Edit2 size={24} />
            </button>
          )}
        </div>
        <h2 className="text-3xl font-bold text-hello-black">{user?.name || 'Ton Profil'} 🎀</h2>
        <p className="text-pink-candy font-medium">
          Niveau { (user as any)?.gamification?.level || (user as any)?.level || 1 } • { (user as any)?.gamification?.totalXP || (user as any)?.xp || 0 } XP
        </p>
      </div>

      <div className="space-y-6">
        {isEditing ? (
          <form onSubmit={handleUpdateProfile} className="kawaii-card bg-white space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-hello-black flex items-center gap-2">
                <Edit2 size={18} className="text-pink-candy" /> Modifier mon profil
              </h3>
              <button type="button" onClick={() => setIsEditing(false)}><X size={20} /></button>
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-bold text-hello-black/40 uppercase">Nom de princesse</label>
              <input 
                type="text"
                value={editForm.name}
                onChange={e => setEditForm({...editForm, name: e.target.value})}
                className="w-full p-3 rounded-kawaii border-2 border-pink-milk focus:border-pink-candy outline-none transition-all"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-hello-black/40 uppercase">Genre</label>
              <select 
                value={editForm.gender}
                onChange={e => setEditForm({...editForm, gender: e.target.value})}
                className="w-full p-3 rounded-kawaii border-2 border-pink-milk focus:border-pink-candy outline-none transition-all"
              >
                <option value="F">Féminin 🌸</option>
                <option value="M">Masculin 🐨</option>
                <option value="O">Autre ✨</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-hello-black/40 uppercase">Lien Avatar (URL)</label>
              <input 
                type="text"
                value={editForm.avatar}
                onChange={e => setEditForm({...editForm, avatar: e.target.value})}
                className="w-full p-3 rounded-kawaii border-2 border-pink-milk focus:border-pink-candy outline-none transition-all"
                placeholder="https://..."
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-pink-candy text-white font-bold py-3 rounded-kawaii hover:bg-pink-deep transition-all flex items-center justify-center gap-2 shadow-kawaii"
            >
              <Save size={18} /> Enregistrer les changements
            </button>
          </form>
        ) : isChangingPassword ? (
          <form onSubmit={handleChangePassword} className="kawaii-card bg-white space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-hello-black flex items-center gap-2">
                <Lock size={18} className="text-pink-candy" /> Changer de mot de passe
              </h3>
              <button type="button" onClick={() => setIsChangingPassword(false)}><X size={20} /></button>
            </div>

            <input 
              type="password"
              placeholder="Ancien mot de passe"
              value={passwordForm.oldPassword}
              onChange={e => setPasswordForm({...passwordForm, oldPassword: e.target.value})}
              className="w-full p-3 rounded-kawaii border-2 border-pink-milk focus:border-pink-candy outline-none"
              required
            />
            <input 
              type="password"
              placeholder="Nouveau mot de passe"
              value={passwordForm.newPassword}
              onChange={e => setPasswordForm({...passwordForm, newPassword: e.target.value})}
              className="w-full p-3 rounded-kawaii border-2 border-pink-milk focus:border-pink-candy outline-none"
              required
            />
            <input 
              type="password"
              placeholder="Confirmer le nouveau mot de passe"
              value={passwordForm.confirmPassword}
              onChange={e => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
              className="w-full p-3 rounded-kawaii border-2 border-pink-milk focus:border-pink-candy outline-none"
              required
            />

            <button 
              type="submit"
              className="w-full bg-hello-black text-white font-bold py-3 rounded-kawaii hover:bg-hello-black/80 transition-all flex items-center justify-center gap-2 shadow-kawaii"
            >
              <Save size={18} /> Mettre à jour le mot de passe
            </button>
          </form>
        ) : (
          <>
            <div className="kawaii-card bg-white flex items-center gap-4">
              <Mail className="text-pink-candy" />
              <div className="flex-1">
                <p className="text-xs font-bold text-hello-black/40 uppercase">Email</p>
                <p className="font-bold text-hello-black">{user?.email || 'Chargement...'}</p>
              </div>
            </div>
            
            <div className="kawaii-card bg-white flex items-center gap-4">
              <Bell className="text-pink-candy" />
              <div className="flex-1">
                <p className="text-xs font-bold text-hello-black/40 uppercase">Préférences</p>
                <p className="font-bold text-hello-black">
                  {user?.gender === 'M' ? 'Prince' : user?.gender === 'F' ? 'Princesse' : 'Étudiante'} studieuse ✨
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setIsEditing(true)}
                className="bg-white border-2 border-pink-milk text-pink-candy font-bold py-3 rounded-kawaii hover:border-pink-candy transition-all flex items-center justify-center gap-2"
              >
                <Edit2 size={18} /> Modifier Infos
              </button>
              <button 
                onClick={() => setIsChangingPassword(true)}
                className="bg-white border-2 border-pink-milk text-hello-black/60 font-bold py-3 rounded-kawaii hover:border-hello-black/20 transition-all flex items-center justify-center gap-2"
              >
                <Lock size={18} /> Mot de passe
              </button>
            </div>

            <button 
              onClick={handleLogout}
              className="w-full bg-pink-milk text-pink-deep font-bold py-4 rounded-kawaii hover:bg-pink-candy/20 transition-all flex items-center justify-center gap-2 border-2 border-pink-candy/20"
            >
              <LogOut size={20} /> Se déconnecter
            </button>
          </>
        )}
      </div>
    </div>
  )
}
