import { useState, useEffect } from 'react'
import { User as UserIcon, Mail, Bell, Star } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'
import type { User } from '../types/index'

export default function Profile() {
  const { logout, token } = useAuth()
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return
      try {
        // Supposons qu'on ait un endpoint /auth/me ou similaire
        const response = await fetch('https://plan-etude.koyeb.app/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (response.ok) {
          const data = await response.json()
          setUser(data)
        }
      } catch (error) {
        console.error('Erreur profil:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchUser()
  }, [token])

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
    <div className="max-w-2xl mx-auto py-8">
      <div className="text-center mb-8">
        <div className="w-32 h-32 bg-pink-milk rounded-full mx-auto border-4 border-pink-candy flex items-center justify-center mb-4 overflow-hidden">
          {user?.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            <UserIcon size={64} className="text-pink-candy" />
          )}
        </div>
        <h2 className="text-3xl font-bold text-hello-black">{user?.name || 'Ton Profil'} 🎀</h2>
      </div>

      <div className="space-y-4">
        <div className="kawaii-card bg-white flex items-center gap-4">
          <Mail className="text-pink-candy" />
          <div>
            <p className="text-xs font-bold text-hello-black/40 uppercase">Email</p>
            <p className="font-bold text-hello-black">{user?.email || 'Chargement...'}</p>
          </div>
        </div>
        
        <div className="kawaii-card bg-white flex items-center gap-4">
          <Bell className="text-pink-candy" />
          <div>
            <p className="text-xs font-bold text-hello-black/40 uppercase">Rappels</p>
            <p className="font-bold text-hello-black">Activés 🌸</p>
          </div>
        </div>

        <button 
          onClick={handleLogout}
          className="w-full bg-red-50 text-red-400 font-bold py-4 rounded-kawaii-lg hover:bg-red-100 transition-colors mt-8"
        >
          Se déconnecter
        </button>
      </div>
    </div>
  )
}
