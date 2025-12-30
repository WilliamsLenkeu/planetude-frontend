import { useState, useEffect } from 'react'
import { ShoppingBag, Check, Palette, Sparkles, Star } from 'lucide-react'
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
        
        const themesList = Array.isArray(themesData) ? themesData : (themesData as any).data || []
        setThemes(themesList)
        
        const userData = (profileData as any).data || profileData
        if (userData && userData.preferences) {
          setOwnedThemeKeys(userData.preferences.themes || [])
        }
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

  const ownedThemes = themes.filter(t => ownedThemeKeys.includes(t.key))
  const shopThemes = themes.filter(t => !ownedThemeKeys.includes(t.key))

  return (
    <div className="max-w-6xl mx-auto py-4 md:py-10 px-2 md:px-4 relative">
      {/* Anneaux de classeur décoratifs */}
      <div className="absolute left-[-10px] top-20 bottom-20 flex flex-col justify-around z-20 pointer-events-none hidden md:flex">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="w-5 h-5 rounded-full bg-gradient-to-br from-gray-300 to-gray-100 border border-gray-400/30 shadow-sm" />
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="notebook-page p-4 md:p-12 shadow-2xl relative overflow-hidden"
      >
        <div className="mb-8 md:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6 border-b-2 border-pink-milk pb-6 md:pb-8">
          <div className="space-y-2 md:space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-pink-milk/50 rounded-full text-[10px] font-black uppercase tracking-widest text-pink-deep">
              <Sparkles size={12} /> Personalisation
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-hello-black italic font-serif leading-none">Garde-robe</h2>
            <p className="text-hello-black/50 font-display text-base md:text-lg italic">"Choisis l'ambiance qui te motive le plus !"</p>
          </div>
          
          <div className="flex items-center gap-3 md:gap-4 bg-white/50 backdrop-blur-sm p-3 md:p-4 border border-pink-milk rotate-1 self-start md:self-auto">
            <Palette className="text-pink-deep size-5 md:size-6" />
            <div>
              <p className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-hello-black/40 leading-none">Thème Actuel</p>
              <p className="font-serif italic text-hello-black font-bold text-sm md:text-base">
                {themes.find(t => t.key === activeThemeKey)?.name || 'Défaut'}
              </p>
            </div>
          </div>
        </div>

        {/* Section Mes Thèmes */}
        {ownedThemes.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-4 mb-8">
              <h3 className="text-xl md:text-2xl font-black text-hello-black italic font-serif">Ma Collection</h3>
              <div className="h-[2px] flex-1 bg-pink-milk/50" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 relative z-10">
              {ownedThemes.map((theme, index) => (
                <ThemeCard 
                  key={theme.key}
                  theme={theme}
                  index={index}
                  isOwned={true}
                  isActive={activeThemeKey === theme.key}
                  onApply={() => handleApply(theme)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Section Boutique */}
        {shopThemes.length > 0 && (
          <section>
            <div className="flex items-center gap-4 mb-8">
              <h3 className="text-xl md:text-2xl font-black text-hello-black italic font-serif">Boutique de Styles</h3>
              <div className="h-[2px] flex-1 bg-pink-milk/50" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 relative z-10">
              {shopThemes.map((theme, index) => (
                <ThemeCard 
                  key={theme.key}
                  theme={theme}
                  index={index}
                  isOwned={false}
                  isActive={activeThemeKey === theme.key}
                  onUnlock={() => handleUnlock(theme)}
                />
              ))}
            </div>
          </section>
        )}
      </motion.div>
    </div>
  )
}

function ThemeCard({ theme, index, isOwned, isActive, onApply, onUnlock }: { 
  theme: Theme, 
  index: number, 
  isOwned: boolean, 
  isActive: boolean,
  onApply?: () => void,
  onUnlock?: () => void
}) {
  const primaryColor = theme.config?.primaryColor || theme.colors?.primary || '#FFB6C1'
  const backgroundColor = theme.config?.backgroundColor || theme.colors?.background || '#FFF5F6'
  const secondaryColor = theme.config?.secondaryColor || theme.colors?.secondary || '#FFD1DC'
  const themePrice = theme.priceXP || theme.price || 0

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -8, rotate: index % 2 === 0 ? 1 : -1 }}
      className={`group relative bg-white p-3 md:p-4 shadow-notebook transition-all duration-300 ${
        isActive ? 'ring-4 ring-pink-candy/30' : ''
      }`}
    >
      {/* Papier adhésif décoratif pour les thèmes débloqués */}
      {isOwned && !isActive && (
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-12 md:w-16 h-4 md:h-6 bg-pink-candy/10 border border-pink-candy/5 backdrop-blur-[2px] z-10" />
      )}

      <div 
        className="h-32 md:h-48 relative flex items-center justify-center overflow-hidden border border-gray-100"
        style={{ backgroundColor: backgroundColor }}
      >
        <div className="flex gap-2 md:gap-4 relative z-10">
          <motion.div 
            whileHover={{ scale: 1.2 }}
            className="size-10 md:size-14 rounded-full shadow-lg border-2 md:border-4 border-white" 
            style={{ backgroundColor: primaryColor }} 
          />
          <motion.div 
            whileHover={{ scale: 1.2 }}
            className="size-10 md:size-14 rounded-full shadow-lg border-2 md:border-4 border-white" 
            style={{ backgroundColor: secondaryColor }} 
          />
        </div>
        
        {/* Effet de texture papier sur l'aperçu */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
          style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 0)', backgroundSize: '20px 20px' }} 
        />

        {isActive && (
          <div className="absolute top-2 md:top-4 right-2 md:right-4 bg-hello-black text-white p-1.5 md:p-2 shadow-notebook">
            <Check className="size-3 md:size-4" />
          </div>
        )}
      </div>

      <div className="pt-4 md:pt-6 pb-1 md:pb-2 px-1 md:px-2 space-y-4 md:space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg md:text-xl font-black text-hello-black italic font-serif">{theme.name}</h3>
            <p className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-hello-black/30 mt-0.5 md:mt-1">
              {isOwned ? 'Dans ta collection' : 'Édition Spéciale'}
            </p>
          </div>
          {!isOwned && (
            <div className="bg-pink-milk px-2 md:px-3 py-1 flex items-center gap-1">
              <Star className="size-2.5 md:size-3 text-pink-deep fill-pink-deep" />
              <span className="text-pink-deep font-black text-[8px] md:text-[10px] uppercase tracking-tighter">
                {themePrice} XP
              </span>
            </div>
          )}
        </div>

        {isOwned ? (
          <button
            onClick={onApply}
            disabled={isActive}
            className={`w-full py-3 md:py-4 font-black uppercase tracking-[0.1em] md:tracking-[0.2em] text-[8px] md:text-[10px] transition-all flex items-center justify-center gap-2 ${
              isActive 
                ? 'bg-pink-milk text-pink-deep/40 cursor-default' 
                : 'bg-hello-black text-white hover:translate-y-[-2px] shadow-notebook active:translate-y-0'
            }`}
          >
            {isActive ? 'Style Actuel ✨' : 'Porter ce Look'}
          </button>
        ) : (
          <button
            onClick={onUnlock}
            className="w-full py-3 md:py-4 bg-pink-candy text-white font-black uppercase tracking-[0.1em] md:tracking-[0.2em] text-[8px] md:text-[10px] flex items-center justify-center gap-2 md:gap-3 hover:bg-pink-deep transition-all shadow-notebook"
          >
            <ShoppingBag className="size-3 md:size-4" /> Débloquer le style
          </button>
        )}
      </div>
    </motion.div>
  )
}
