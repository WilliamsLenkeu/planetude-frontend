import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card } from '../components/ui/Card'
import { subjectService } from '../services/subject.service'
import { userService } from '../services/user.service'
import toast from 'react-hot-toast'

export default function SetupWizard() {
  const navigate = useNavigate()
  const [matieres, setMatieres] = useState<string[]>([''])
  const [isLoading, setIsLoading] = useState(false)

  const handleAddMatiere = () => {
    setMatieres([...matieres, ''])
  }

  const handleRemoveMatiere = (index: number) => {
    const newMatieres = matieres.filter((_, i) => i !== index)
    setMatieres(newMatieres)
  }

  const handleMatiereChange = (index: number, value: string) => {
    const newMatieres = [...matieres]
    newMatieres[index] = value
    setMatieres(newMatieres)
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const validMatieres = matieres.filter(m => m.trim() !== '')
      
      for (const matiere of validMatieres) {
        await subjectService.create({
          name: matiere,
          color: `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`
        })
      }

      await userService.updateProfile({
        preferences: { matieres: validMatieres }
      })

      localStorage.setItem('setupComplete', 'true')
      toast.success('Configuration terminée')
      navigate('/dashboard')
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la configuration')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--color-bg-secondary)]">
      <div className="w-full max-w-lg animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">
            Configuration
          </h1>
          <p className="text-[var(--color-text-secondary)]">
            Ajoutez vos matières
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
                  <Button
                    variant="ghost"
                    onClick={() => handleRemoveMatiere(index)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </Button>
                )}
              </div>
            ))}

            <Button
              variant="secondary"
              onClick={handleAddMatiere}
              className="w-full"
            >
              + Ajouter une matière
            </Button>

            <Button
              onClick={handleSubmit}
              isLoading={isLoading}
              className="w-full"
            >
              Terminer
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
