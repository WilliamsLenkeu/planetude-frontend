import { memo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Heart, LayoutDashboard, Calendar, Trophy, User, Music, BookOpen } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Accueil', icon: LayoutDashboard },
  { path: '/planning', label: 'Planning', icon: Calendar },
  { path: '/progress', label: 'Stats', icon: Trophy },
  { path: '/lofi', label: 'Lofi', icon: Music },
  { path: '/subjects', label: 'Cours', icon: BookOpen },
]

const Header = () => {
  const location = useLocation()
  const { isAuthenticated } = useAuth()
  
  return (
    <header className="w-full sticky top-0 z-50 px-3 pt-2 md:px-6 md:pt-3 pointer-events-none shrink-0">
      <div 
        className="max-w-7xl mx-auto h-11 md:h-12 backdrop-blur-xl rounded-xl px-3 md:px-5 flex items-center justify-between pointer-events-auto border-2 shadow-sm transition-colors duration-500"
        style={{ 
          backgroundColor: 'var(--color-card-bg)',
          borderColor: 'var(--color-border)'
        }}
      >
        <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-1.5 group">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="p-1 rounded-lg shadow-sm border-2 transition-colors duration-500"
            style={{ 
              backgroundColor: 'var(--color-card-bg)',
              borderColor: 'var(--color-border)'
            }}
          >
            <Heart size={14} style={{ color: 'var(--color-primary)', fill: 'var(--color-primary)' }} />
          </motion.div>
          <div className="flex flex-col">
            <h1 className="text-xs md:text-base font-bold tracking-tight font-display transition-colors duration-500" style={{ color: 'var(--color-text)' }}>
              PlanÉtude
            </h1>
            <span className="text-[7px] uppercase tracking-[0.3em] font-black -mt-1 opacity-40 transition-colors duration-500" style={{ color: 'var(--color-primary)' }}>
              Studio
            </span>
          </div>
        </Link>
        
        <nav className="flex items-center gap-1.5 md:gap-2">
          {isAuthenticated && (
            <div className="hidden lg:flex items-center gap-0.5 p-0.5 rounded-xl border-2 transition-colors duration-500" style={{ backgroundColor: 'rgba(var(--color-primary-rgb), 0.05)', borderColor: 'var(--color-border)' }}>
              {NAV_ITEMS.map((item) => (
                <Link 
                  key={item.path}
                  to={item.path} 
                  className={`relative px-2 py-0.5 rounded-lg text-[12px] font-semibold transition-all duration-300 flex items-center gap-1 font-display ${
                    location.pathname === item.path 
                      ? '' 
                      : 'opacity-30 hover:opacity-60'
                  }`}
                  style={{ color: 'var(--color-text)' }}
                >
                  {location.pathname === item.path && (
                    <motion.div 
                      layoutId="nav-active"
                      className="absolute inset-0 shadow-sm rounded-lg -z-10 border-2"
                      style={{ 
                        backgroundColor: 'var(--color-card-bg)',
                        borderColor: 'var(--color-border)'
                      }}
                      transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                    />
                  )}
                  <item.icon size={12} strokeWidth={2.5} />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          )}
          
          <div className="flex items-center gap-1.5">
            {isAuthenticated ? (
              <Link 
                to="/profile" 
                className="p-1 rounded-lg border-2 transition-all duration-300"
                style={{ 
                  backgroundColor: location.pathname === '/profile' ? 'var(--color-card-bg)' : 'transparent',
                  borderColor: location.pathname === '/profile' ? 'var(--color-border)' : 'transparent',
                  color: location.pathname === '/profile' ? 'var(--color-primary)' : 'var(--color-text)'
                }}
              >
                <User size={14} strokeWidth={2.5} />
              </Link>
            ) : (
              <Link 
                to="/auth/login" 
                className="chic-button-primary px-3 py-1 text-[9px]"
              >
                Connexion
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}

export default memo(Header)
