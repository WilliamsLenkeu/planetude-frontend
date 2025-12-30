import { Link, useLocation } from 'react-router-dom'
import { Heart, Sparkles, LayoutDashboard, Calendar, Trophy, User, Music, Palette, BookOpen } from 'lucide-react'
import { motion } from 'framer-motion'

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/planning', label: 'Planning', icon: Calendar },
  { path: '/progress', label: 'Progrès', icon: Trophy },
  { path: '/lofi', label: 'LoFi', icon: Music },
  { path: '/subjects', label: 'Matières', icon: BookOpen },
  { path: '/themes', label: 'Thèmes', icon: Palette },
]

export default function Header() {
  const location = useLocation()
  
  return (
    <header className="w-full sticky top-0 z-50 px-2 pt-2 md:px-8 md:pt-6 pointer-events-none shrink-0">
      <div className="max-w-7xl mx-auto h-16 md:h-24 glass-card border-2 border-white/60 shadow-glass px-4 md:px-10 flex items-center justify-between pointer-events-auto">
        <Link to="/" className="flex items-center gap-3 md:gap-4 group">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: -8 }}
            className="bg-gradient-to-br from-pink-candy to-pink-deep p-2 md:p-3 rounded-xl md:rounded-2xl shadow-kawaii border-2 border-white"
          >
            <Heart size={18} fill="white" className="text-white md:hidden" />
            <Heart size={26} fill="white" className="text-white hidden md:block" />
          </motion.div>
          <div className="flex flex-col">
            <h1 className="text-lg md:text-3xl font-bold text-hello-black tracking-tight font-display">
              PlanÉtude
            </h1>
            <div className="flex items-center gap-1 -mt-1 md:gap-1.5">
              <span className="text-[8px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.3em] text-pink-deep font-black">
                Studio
              </span>
              <Sparkles size={8} className="text-pink-candy animate-pulse md:size-[10px]" />
            </div>
          </div>
        </Link>
        
        <nav className="flex items-center gap-4 md:gap-8">
          <div className="hidden lg:flex items-center gap-1 bg-pink-milk/30 p-1.5 rounded-2xl border border-white/40">
            {NAV_ITEMS.map((item) => (
              <Link 
                key={item.path}
                to={item.path} 
                className={`relative px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2.5 font-display ${
                  location.pathname === item.path 
                    ? 'text-pink-deep' 
                    : 'text-hello-black/60 hover:text-pink-candy hover:bg-white/40'
                }`}
              >
                {location.pathname === item.path && (
                  <motion.div 
                    layoutId="nav-active"
                    className="absolute inset-0 bg-white shadow-sm rounded-xl -z-10"
                    transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                  />
                )}
                <item.icon size={18} className={location.pathname === item.path ? "text-pink-deep" : ""} />
                <span className="hidden xl:inline">{item.label}</span>
              </Link>
            ))}
          </div>
          
          <div className="flex items-center gap-2 md:gap-3">
            <Link 
              to="/chat" 
              className="kawaii-button !py-1.5 !px-3 md:!py-2.5 md:!px-5 flex items-center gap-2 group"
            >
              <div className="relative">
                <Sparkles size={16} className="md:size-[18px] group-hover:rotate-12 transition-transform" />
              </div>
              <span className="hidden sm:inline">Coach IA</span>
            </Link>

            <Link 
              to="/profile" 
              className={`hidden md:flex p-3 rounded-2xl border-2 transition-all duration-400 ${
                location.pathname === '/profile' 
                  ? 'bg-gradient-to-br from-pink-candy to-pink-deep border-white text-white shadow-kawaii scale-105' 
                  : 'bg-white/60 border-white/60 text-pink-candy hover:border-pink-candy hover:bg-white shadow-clean'
              }`}
            >
              <User size={22} />
            </Link>

            {/* Mobile Profile Icon */}
            <Link 
              to="/profile" 
              className="md:hidden p-2 rounded-lg bg-pink-milk/50 border border-pink-candy/10 text-pink-deep"
            >
              <User size={18} />
            </Link>
          </div>
        </nav>
      </div>
    </header>
  )
}
