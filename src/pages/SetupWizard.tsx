import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card } from '../components/ui/Card'
import { subjectService } from '../services/subject.service'
import { userService } from '../services/user.service'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { Plus, Trash2, LogOut } from 'lucide-react'

export default function SetupWizard() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [matieres, setMatieres] = useState<string[]>([''])
  const [isLoading, setIsLoading] = useState(false)

  const handleAddMatiere = () => setMatieres([...matieres, ''])
  const handleRemoveMatiere = (index: number) => setMatieres(matieres.filter((_, i) => i !== index))
  const handleMatiereChange = (index: number, value: string) => {
    const next = [...matieres]
    next[index] = value
    setMatieres(next)
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const validMatieres = matieres.filter((m) => m.trim() !== '')
      for (const matiere of validMatieres) {
        await subjectService.create({
          name: matiere,
          color: `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`,
        })
      }
      await userService.updateProfile({ preferences: { matieres: validMatieres, hasCompletedSetup: true } })
      localStorage.setItem('setupComplete', 'true')
      toast.success('Configuration terminée')
      navigate('/dashboard')
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la configuration')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSkip = async () => {
    try {
      await userService.updateProfile({ preferences: { matieres: [], hasCompletedSetup: true } })
    } catch {
      // Ignore si l'API échoue
    }
    localStorage.setItem('setupComplete', 'true')
    toast.success('Vous pourrez ajouter des matières plus tard')
    navigate('/dashboard')
  }

  const handleLogout = () => {
    logout()
    navigate('/auth/login')
    toast.success('À bientôt !')
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
            Configuration
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9375rem' }}>
            Ajoutez vos matières pour commencer
          </p>
        </div>

        <Card>
          <div className="space-y-4">
            {matieres.map((matiere, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder="Nom de la matière"
                  value={matiere}
                  onChange={(e) => handleMatiereChange(index, e.target.value)}
                  className="flex-1"
                />
                {matieres.length > 1 && (
                  <Button variant="ghost" onClick={() => handleRemoveMatiere(index)} className="shrink-0">
                    <Trash2 size={18} />
                  </Button>
                )}
              </div>
            ))}

            <Button variant="secondary" onClick={handleAddMatiere} className="w-full">
              <Plus size={18} />
              Ajouter une matière
            </Button>

            <Button onClick={handleSubmit} isLoading={isLoading} className="w-full">
              Terminer
            </Button>

            <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t" style={{ borderColor: 'var(--color-border)' }}>
              <Button variant="ghost" onClick={handleSkip} className="flex-1 text-sm">
                Passer cette étape
              </Button>
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="flex-1 text-sm flex items-center justify-center gap-2"
                style={{ color: 'var(--color-text-muted)' }}
              >
                <LogOut size={16} />
                Se déconnecter
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
