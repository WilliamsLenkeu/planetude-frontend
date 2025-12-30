import { BrowserRouter, Routes, Route, useLocation, Navigate, NavLink } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { MusicProvider } from './contexts/MusicContext'
import Header from './components/Header'
import MiniPlayer from './components/MiniPlayer'
import { AnimatePresence, motion } from 'framer-motion'
import { LayoutDashboard, Calendar, Sparkles, Trophy, User, LogOut, Heart } from 'lucide-react'

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Planning from './pages/Planning'
import PlanningDetail from './pages/PlanningDetail'
import Chat from './pages/Chat'
import Progress from './pages/Progress'
import Reminders from './pages/Reminders'
import Profile from './pages/Profile'
import LoFi from './pages/LoFi'
import Subjects from './pages/Subjects'
import Themes from './pages/Themes'

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <MusicProvider>
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </MusicProvider>
      </ThemeProvider>
    </AuthProvider>
  )
}

function AppContent() {
  const { isAuthenticated, isInitializing, logout } = useAuth()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    toast.success('À bientôt ! 🎀')
  }

  // Splash screen pendant l'initialisation
  if (isInitializing) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <motion.div 
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-16 h-16 bg-pink-candy rounded-full flex items-center justify-center shadow-kawaii border-4 border-white"
          >
            <Heart size={32} fill="white" className="text-white" />
          </motion.div>
          <p className="text-pink-deep font-bold animate-pulse">Chargement... ✨</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen w-full font-quicksand text-hello-black relative flex flex-col overflow-hidden bg-clean-beige">
      {/* Background Decor - Ambiance Clean & Sophistiquée */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-[#FDFBF7]">
        {/* Soft Animated Gradients */}
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 45, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-20%] right-[-10%] w-[70%] h-[70%] bg-pink-candy/10 rounded-full blur-[140px] will-change-transform" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, -30, 0],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-cloud/20 rounded-full blur-[120px] will-change-transform" 
        />
        <motion.div 
          animate={{ 
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-[10%] left-[5%] w-[50%] h-[50%] bg-sage-soft/20 rounded-full blur-[110px] will-change-transform" 
        />

        {/* Subtle Texture */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/natural-paper.png")' }} />
      </div>
      
      <Toaster 
        position="top-right" 
        toastOptions={{
          className: 'glass-card border-2 border-pink-candy/30 text-hello-black font-bold',
          style: { borderRadius: '1rem', background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(10px)' }
        }} 
      />
      
      <Header />
      
      <main className="flex-1 w-full relative overflow-hidden flex flex-col">
        <div className="flex-1 container mx-auto px-4 py-6 md:py-8 overflow-y-auto custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="h-full"
            >
              <Routes location={location}>
                {!isAuthenticated ? (
                  // STACK NON-AUTHENTIFIÉ
                  <>
                    <Route path="/" element={<Home />} />
                    <Route path="/auth/login" element={<Login />} />
                    <Route path="/auth/register" element={<Register />} />
                    <Route path="*" element={<Navigate to="/auth/login" replace />} />
                  </>
                ) : (
                  // STACK AUTHENTIFIÉ
                  <>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/planning" element={<Planning />} />
                    <Route path="/planning/:id" element={<PlanningDetail />} />
                    <Route path="/chat" element={<Chat />} />
                    <Route path="/progress" element={<Progress />} />
                    <Route path="/reminders" element={<Reminders />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/lofi" element={<LoFi />} />
                    <Route path="/subjects" element={<Subjects />} />
                    <Route path="/themes" element={<Themes />} />
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                  </>
                )}
              </Routes>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Mini Player global - Uniquement sur PC */}
        {isAuthenticated && <MiniPlayer />}
      </main>

      {/* Logout button (Desktop) */}
      {isAuthenticated && (
        <motion.button 
          whileHover={{ scale: 1.1 }}
          onClick={handleLogout}
          className="fixed bottom-6 left-6 z-50 p-3 bg-white/80 backdrop-blur-md border-2 border-pink-milk text-pink-deep rounded-full shadow-kawaii hidden md:flex items-center gap-2 group"
        >
          <LogOut size={20} />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 font-bold text-sm whitespace-nowrap">
            Déconnexion
          </span>
        </motion.button>
      )}

      {/* Mobile Nav */}
      {isAuthenticated && (
        <nav className="md:hidden h-16 bg-white/80 backdrop-blur-md border-t border-pink-milk flex items-center justify-around px-4 pb-safe">
          <MobileNavItem to="/dashboard" icon={LayoutDashboard} label="Home" />
          <MobileNavItem to="/planning" icon={Calendar} label="Plan" />
          <MobileNavItem to="/chat" icon={Sparkles} label="Coach" highlight />
          <MobileNavItem to="/progress" icon={Trophy} label="Progrès" />
          <MobileNavItem to="/profile" icon={User} label="Moi" />
        </nav>
      )}
    </div>
  )
}

const MobileNavItem = ({ to, icon: Icon, label, highlight }: { to: string, icon: any, label: string, highlight?: boolean }) => (
  <NavLink 
    to={to} 
    className={({ isActive }) => 
      `flex flex-col items-center gap-1 transition-all relative ${
        isActive 
          ? 'text-pink-deep' 
          : 'text-hello-black/30 hover:text-pink-candy'
      }`
    }
  >
    {({ isActive }) => (
      <>
        <div className={`p-2 rounded-xl transition-all ${highlight ? 'bg-pink-candy/10' : ''} ${isActive ? 'scale-110' : ''}`}>
          <Icon size={highlight ? 24 : 20} strokeWidth={isActive ? 2.5 : 2} />
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
        {isActive && (
          <motion.div 
            layoutId="mobileNavActive"
            className="absolute -bottom-1 w-1 h-1 bg-pink-deep rounded-full"
          />
        )}
      </>
    )}
  </NavLink>
)
