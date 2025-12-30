import { Link, useLocation } from 'react-router-dom'
import { Heart, Sparkles, LayoutDashboard, Calendar, Trophy, User, Music, Palette, BookOpen } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Header() {
  const location = useLocation()
  
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/planning', label: 'Planning', icon: Calendar },
    { path: '/progress', label: 'Progrès', icon: Trophy },
    { path: '/lofi', label: 'LoFi', icon: Music },
    { path: '/subjects', label: 'Matières', icon: BookOpen },
    { path: '/themes', label: 'Thèmes', icon: Palette },
  ]

  return (
    <header className="w-full sticky top-0 z-50 bg-white/40 backdrop-blur-xl border-b border-white/40 shrink-0">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 md:h-24 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: -10 }}
            className="bg-white p-2.5 rounded-2xl shadow-glass border border-pink-milk"
          >
            <Heart size={24} fill="#FFD1DC" className="text-pink-candy" />
          </motion.div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-hello-black tracking-tight font-display">
              PlanÉtude
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-pink-deep font-bold -mt-1">
              Studio ✨
            </span>
          </div>
        </Link>
        
        <nav className="flex items-center gap-3 md:gap-6">
          <div className="hidden lg:flex items-center gap-2 bg-white/50 p-1.5 rounded-full border border-white/60 shadow-inner-soft">
            {navItems.map((item) => (
              <Link 
                key={item.path}
                to={item.path} 
                className={`relative px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 font-display ${
                  location.pathname === item.path 
                    ? 'text-pink-deep' 
                    : 'text-hello-black/50 hover:text-pink-candy'
                }`}
              >
                {location.pathname === item.path && (
                  <motion.div 
                    layoutId="nav-active"
                    className="absolute inset-0 bg-white rounded-full shadow-sm -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <item.icon size={18} />
                <span className="hidden xl:inline">{item.label}</span>
              </Link>
            ))}
          </div>
          
          <div className="h-10 w-[1px] bg-pink-candy/20 hidden lg:block" />
          
          <Link 
            to="/chat" 
            className="kawaii-button py-2.5 px-6 flex items-center gap-2"
          >
            <Sparkles size={18} />
            <span className="hidden sm:inline">Coach IA</span>
          </Link>

          {/* Bouton profil desktop */}
          <Link 
            to="/profile" 
            className={`hidden md:flex p-3 rounded-2xl border-2 transition-all duration-300 ${
              location.pathname === '/profile' 
                ? 'bg-pink-candy border-white text-white shadow-kawaii scale-110' 
                : 'bg-white/80 border-white text-pink-candy hover:border-pink-candy hover:scale-105 shadow-sm'
            }`}
          >
            <User size={22} />
          </Link>

          {/* Bouton de profil simplifié sur mobile */}
          <Link 
            to="/profile" 
            className="md:hidden p-2 rounded-xl bg-pink-milk/50 text-pink-deep"
          >
            <User size={20} />
          </Link>
        </nav>
      </div>
    </header>
  )
}
