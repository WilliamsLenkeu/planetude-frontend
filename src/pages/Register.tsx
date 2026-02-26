import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { authService } from '../services/auth.service'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

export default function Register() {
  const navigate = useNavigate()
  const { setAuth } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !password) {
      toast.error('Veuillez remplir tous les champs')
      return
    }
    setIsLoading(true)
    try {
      const response = await authService.register({ name, email, password })
      setAuth(response.token, response.user, response.refreshToken)
      toast.success('Compte créé !')
      navigate('/setup')
    } catch (error: any) {
      toast.error(error.message || 'Erreur d\'inscription')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
            Inscription
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9375rem' }}>
            Créez votre compte PlanÉtude
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Nom" placeholder="Votre nom" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input
            type="email"
            label="Email"
            placeholder="vous@exemple.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            label="Mot de passe"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" isLoading={isLoading} className="w-full">
            S'inscrire
          </Button>
        </form>

        <p className="text-center mt-6 text-sm" style={{ color: 'var(--color-text-muted)' }}>
          Déjà un compte ?{' '}
          <Link to="/auth/login" className="font-medium hover:underline" style={{ color: 'var(--color-primary)' }}>
            Se connecter
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
