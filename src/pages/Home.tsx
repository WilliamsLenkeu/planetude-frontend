import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BookOpen, ArrowRight } from 'lucide-react'
import { Button } from '../components/ui/Button'

export default function Home() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-xl text-center"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 surface">
          <BookOpen size={32} style={{ color: 'var(--color-primary)' }} />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight" style={{ color: 'var(--color-text)' }}>
          PlanÉtude
        </h1>
        <p className="text-lg mb-10" style={{ color: 'var(--color-text-muted)' }}>
          Organisez vos études, suivez votre progression et restez motivé.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/auth/login">
            <Button className="w-full sm:w-auto min-w-[140px]">
              Connexion
              <ArrowRight size={18} />
            </Button>
          </Link>
          <Link to="/auth/register">
            <Button variant="secondary" className="w-full sm:w-auto min-w-[140px]">
              Créer un compte
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
