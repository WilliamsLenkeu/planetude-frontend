import { useState, useEffect } from 'react'
import { ShoppingBag, Check } from 'lucide-react'
import { motion } from 'framer-motion'
import { themeService } from '../services/theme.service'
import { userService } from '../services/user.service'
import { useTheme } from '../contexts/ThemeContext'
import type { Theme } from '../types'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import toast from 'react-hot-toast'

export default function Themes() {
  const { updateThemeConfig } = useTheme()
  const [themes, setThemes] = useState<Theme[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeThemeKey, setActiveThemeKey] = useState<string | null>(null)
  const [ownedThemeKeys, setOwnedThemeKeys] = useState<string[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [themesData, profileData] = await Promise.all([
          themeService.getAll(),
          userService.getProfile()
        ])
        
        // On normalise les thèmes car le backend peut renvoyer { success: true, data: [] }
        const themesList = Array.isArray(themesData) ? themesData : (themesData as any).data || []
        setThemes(themesList)
        
        const userData = (profileData as any).data || profileData
        if (userData && userData.preferences) {
          setOwnedThemeKeys(userData.preferences.themes || [])
        }
        // Le thème actuel peut être dans le profil ou ailleurs
        setActiveThemeKey(userData.preferences?.currentTheme || 'default-pink')
      } catch (error) {
        console.error('Erreur thèmes:', error)
        toast.error('Impossible de charger les thèmes')
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleApply = async (theme: Theme) => {
    try {
      const response = await themeService.set(theme.key)
      const themeData = (response as any).data || response
      
      setActiveThemeKey(theme.key)
      
      // Mettre à jour les variables CSS immédiatement
      if (themeData.themeConfig) {
        updateThemeConfig(themeData.themeConfig)
      } else if (theme.config) {
        updateThemeConfig(theme.config)
      }
      
      toast.success('Nouveau look appliqué ! ✨')
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de l\'application')
    }
  }

  const handleUnlock = async (theme: Theme) => {
    try {
      await themeService.unlock(theme.key)
      setOwnedThemeKeys([...ownedThemeKeys, theme.key])
      toast.success(`${theme.name} débloqué ! 🎀`)
    } catch (error: any) {
      toast.error(error.message || 'Pas assez d\'XP ? ✨')
    }
  }

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-hello-black flex items-center justify-center gap-3">
          Customise ton Espace 🌈
        </h2>
        <p className="text-hello-black/60">"Choisis l'ambiance qui te motive le plus !"</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {themes.map((theme) => {
          const isOwned = ownedThemeKeys.includes(theme.key)
          const isActive = activeThemeKey === theme.key
          const themePrice = theme.priceXP || theme.price || 0
          
          // Récupération des couleurs avec fallback
          const primaryColor = theme.config?.primaryColor || theme.colors?.primary || '#FFB6C1'
          const backgroundColor = theme.config?.backgroundColor || theme.colors?.background || '#FFF5F6'
          const secondaryColor = theme.config?.secondaryColor || theme.colors?.secondary || '#FFD1DC'

          return (
            <motion.div
              key={theme.key}
              whileHover={{ y: -10 }}
              className={`kawaii-card overflow-hidden border-4 transition-all ${
                isActive ? 'border-pink-candy ring-4 ring-pink-candy/20' : 'border-white'
              }`}
            >
              <div 
                className="h-40 relative flex items-center justify-center"
                style={{ backgroundColor: backgroundColor }}
              >
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full shadow-lg border-2 border-white" style={{ backgroundColor: primaryColor }} />
                  <div className="w-12 h-12 rounded-full shadow-lg border-2 border-white" style={{ backgroundColor: secondaryColor }} />
                  <div className="w-12 h-12 rounded-full shadow-lg border-2 border-white" style={{ backgroundColor: backgroundColor }} />
                </div>
                {isActive && (
                  <div className="absolute top-4 right-4 bg-pink-candy text-white p-2 rounded-full">
                    <Check size={16} />
                  </div>
                )}
              </div>

              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-hello-black">{theme.name}</h3>
                  {!isOwned && (
                    <span className="flex items-center gap-1 text-pink-candy font-bold">
                      {themePrice} XP ✨
                    </span>
                  )}
                </div>

                {isOwned ? (
                  <button
                    onClick={() => handleApply(theme)}
                    disabled={isActive}
                    className={`w-full py-3 rounded-kawaii font-bold transition-all ${
                      isActive 
                        ? 'bg-pink-milk/30 text-pink-candy cursor-default' 
                        : 'bg-pink-candy text-white hover:bg-pink-deep shadow-kawaii'
                    }`}
                  >
                    {isActive ? 'Activé 🌸' : 'Appliquer'}
                  </button>
                ) : (
                  <button
                    onClick={() => handleUnlock(theme)}
                    className="w-full py-3 bg-hello-black text-white rounded-kawaii font-bold flex items-center justify-center gap-2 hover:bg-hello-black/80 transition-all shadow-kawaii"
                  >
                    <ShoppingBag size={18} /> Débloquer
                  </button>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
