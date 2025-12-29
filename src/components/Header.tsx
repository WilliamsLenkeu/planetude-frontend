import { Link, useLocation } from 'react-router-dom'
import { Heart, Sparkles, LayoutDashboard, Calendar, Trophy, User } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Header() {
  const location = useLocation()
  
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/planning', label: 'Planning', icon: Calendar },
    { path: '/progress', label: 'Progrès', icon: Trophy },
    { path: '/profile', label: 'Moi', icon: User },
  ]

  return (
    <header className="w-full sticky top-0 z-50 bg-white/60 backdrop-blur-lg border-b-2 border-pink-milk/50 shadow-sm shrink-0">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group relative">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 15 }}
            className="bg-gradient-to-br from-pink-candy to-pink-deep p-2 rounded-xl shadow-kawaii"
          >
            <Heart size={20} fill="white" className="text-white md:w-6 md:h-6" />
          </motion.div>
          <span className="text-xl md:text-2xl font-bold text-hello-black tracking-tight">
            PlanÉtude <span className="text-pink-candy hidden sm:inline">✨</span>
          </span>
        </Link>
        
        <nav className="flex items-center gap-2 md:gap-4">
          <div className="hidden md:flex items-center gap-1 bg-pink-milk/30 p-1 rounded-full border border-pink-candy/10">
            {navItems.map((item) => (
              <Link 
                key={item.path}
                to={item.path} 
                className={`relative px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
                  location.pathname === item.path 
                    ? 'text-pink-deep' 
                    : 'text-hello-black/60 hover:text-pink-candy hover:bg-white/50'
                }`}
              >
                {location.pathname === item.path && (
                  <motion.div 
                    layoutId="nav-active"
                    className="absolute inset-0 bg-white rounded-full shadow-sm -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <item.icon size={16} />
                {item.label}
              </Link>
            ))}
          </div>
          
          <div className="h-8 w-[1px] bg-pink-candy/20 hidden md:block mx-2" />
          
          <Link 
            to="/chat" 
            className="kawaii-button py-2 px-4 md:px-6 text-xs md:text-sm flex items-center gap-2 shadow-pink-candy/20 hidden md:flex"
          >
            <Sparkles size={16} />
            <span>Coach 🌸</span>
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
