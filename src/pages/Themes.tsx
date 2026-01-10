import { useState, useEffect } from 'react'
import { Check, Palette, Sparkles, Star } from 'lucide-react'
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
        
        // Utiliser preferences.unlockedThemes selon la structure du document
        if (userData && userData.preferences) {
          setOwnedThemeKeys(userData.preferences.unlockedThemes || [])
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
      // Appliquer via API
      await themeService.set(theme.key);
      
      // Mettre à jour localement
      if (theme.config) {
        updateThemeConfig(theme.config);
      } else if (theme.colors) {
        updateThemeConfig({
          primaryColor: theme.colors.primary,
          backgroundColor: theme.colors.background,
          secondaryColor: theme.colors.secondary,
          fontFamily: 'Quicksand'
        });
      }
      
      setActiveThemeKey(theme.key);
      toast.success(`${theme.name} activé ! ✨`);
    } catch (error) {
      console.error('Erreur application thème:', error);
      toast.error('Erreur lors de l\'application du thème');
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
    <div className="max-w-6xl mx-auto py-8 md:py-12 px-4 relative">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="chic-card p-6 md:p-10 relative overflow-hidden"
      >
        {/* Decorative background circle */}
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-pink-milk/20 rounded-full blur-3xl" />
        
        <div className="mb-10 md:mb-14 flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b-2 border-pink-milk pb-10 relative z-10">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-pink-milk/50 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-pink-deep">
              <Sparkles size={12} strokeWidth={2.5} /> Personnalisation
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-hello-black tracking-tighter leading-none">Garde-robe</h2>
            <p className="text-hello-black/40 font-display text-base md:text-lg italic">"Choisis l'ambiance qui te motive le plus !"</p>
          </div>
          
          <div className="flex items-center gap-4 bg-white/50 backdrop-blur-xl p-4 rounded-[1.5rem] border-2 border-pink-candy/10 shadow-xl shadow-pink-candy/5 self-start lg:self-auto">
            <div className="w-10 h-10 rounded-xl bg-pink-milk flex items-center justify-center text-pink-deep border-2 border-pink-candy/10">
              <Palette size={20} strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-hello-black/30 leading-none mb-1">Thème Actuel</p>
              <p className="font-bold text-hello-black text-base">
                {themes.find(t => t.key === activeThemeKey)?.name || 'Défaut'}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-16 relative z-10">
          {/* Section Mes Thèmes */}
          {ownedThemes.length > 0 && (
            <section>
              <div className="flex items-center gap-5 mb-8">
                <h3 className="text-xl md:text-2xl font-black text-hello-black tracking-tight">Ma Collection</h3>
                <div className="h-0.5 flex-1 bg-pink-milk" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
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
              <div className="flex items-center gap-5 mb-8">
                <h3 className="text-xl md:text-2xl font-black text-hello-black tracking-tight">Boutique de Styles</h3>
                <div className="h-0.5 flex-1 bg-pink-milk" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
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
        </div>
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`group relative chic-card p-5 border-2 transition-all duration-500 overflow-hidden flex flex-col ${
        isActive 
        ? 'border-pink-candy shadow-2xl shadow-pink-candy/10' 
        : 'border-transparent hover:border-pink-candy/20 shadow-sm hover:shadow-xl hover:shadow-pink-candy/5'
      }`}
    >
      <div 
        className="h-36 md:h-44 rounded-[1.5rem] relative flex items-center justify-center overflow-hidden mb-5 border-2 border-pink-candy/5"
        style={{ backgroundColor: backgroundColor }}
      >
        {/* Abstract decorative shapes */}
        <div className="absolute inset-0 opacity-20" style={{ 
          backgroundImage: `radial-gradient(circle at 20% 20%, ${primaryColor} 0%, transparent 40%), 
                            radial-gradient(circle at 80% 80%, ${secondaryColor} 0%, transparent 40%)` 
        }} />
        
        <div className="flex gap-3 relative z-10">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 10 }}
            className="size-12 md:size-16 rounded-[1rem] shadow-2xl border-2 border-white" 
            style={{ backgroundColor: primaryColor }} 
          />
          <motion.div 
            whileHover={{ scale: 1.1, rotate: -10 }}
            className="size-12 md:size-16 rounded-[1rem] shadow-2xl border-2 border-white mt-6" 
            style={{ backgroundColor: secondaryColor }} 
          />
        </div>

        {isActive && (
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-pink-deep flex items-center gap-1.5 border-2 border-pink-candy/10">
            <Check size={10} strokeWidth={3} /> Actif
          </div>
        )}
      </div>

      <div className="space-y-4 flex-1 flex flex-col">
        <div className="space-y-1">
          <h4 className="text-xl font-black text-hello-black group-hover:text-pink-deep transition-colors">{theme.name}</h4>
          <p className="text-hello-black/40 font-display text-xs leading-relaxed line-clamp-2">{theme.description}</p>
        </div>

        <div className="pt-2 mt-auto">
          {isOwned ? (
            <button 
              disabled={isActive}
              onClick={onApply}
              className={`w-full py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2.5 ${
                isActive 
                ? 'bg-pink-milk/30 text-pink-deep/40 cursor-default border-2 border-transparent' 
                : 'chic-button-primary'
              }`}
            >
              {isActive ? 'Style Appliqué' : 'Appliquer ce look'}
            </button>
          ) : (
            <button 
              onClick={onUnlock}
              className="w-full bg-white border-2 border-pink-milk text-hello-black py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-pink-milk/30 transition-all flex items-center justify-center gap-2.5 shadow-sm hover:scale-[1.02] active:scale-95"
            >
              <Star className="text-pink-deep size-3.5 fill-pink-deep" />
              Débloquer pour {themePrice} XP
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}
