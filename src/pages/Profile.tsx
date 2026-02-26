import { useAuth } from '../contexts/AuthContext'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Avatar } from '../components/ui/Avatar'
import { PageHeader } from '../components/PageHeader'
import toast from 'react-hot-toast'
import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { userService } from '../services/user.service'
import { LogOut } from 'lucide-react'

export default function Profile() {
  const { user, logout } = useAuth()
  const queryClient = useQueryClient()
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')

  const updateMutation = useMutation({
    mutationFn: (data: { name: string; email: string }) => userService.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] })
      toast.success('Profil mis à jour')
    },
  })

  const handleLogout = () => {
    logout()
    toast.success('Déconnexion réussie')
    window.location.href = '/auth/login'
  }

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email) {
      toast.error('Veuillez remplir tous les champs')
      return
    }
    updateMutation.mutate({ name, email })
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <PageHeader title="Profil" description="Gérez vos informations" />

      <Card>
        <div className="flex items-center gap-4 mb-6">
          <Avatar
            initials={user?.name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || 'U'}
            size="lg"
          />
          <div>
            <h2 className="font-semibold" style={{ color: 'var(--color-text)' }}>
              {user?.name}
            </h2>
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
              {user?.email}
            </p>
          </div>
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <Input label="Nom" value={name} onChange={(e) => setName(e.target.value)} />
          <Input type="email" label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Button type="submit" isLoading={updateMutation.isPending} className="w-full">
            Mettre à jour
          </Button>
        </form>
      </Card>

      <Card>
        <h2 className="font-semibold mb-4" style={{ color: 'var(--color-text)' }}>
          Zone de danger
        </h2>
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="text-red-600 hover:bg-red-50 hover:text-red-700"
        >
          <LogOut size={18} />
          Se déconnecter
        </Button>
      </Card>
    </div>
  )
}
