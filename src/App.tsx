import { BrowserRouter, Routes, Route, useLocation, Link, Navigate } from 'react-router-dom'
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
    <div className="h-screen w-full font-quicksand text-hello-black relative flex flex-col overflow-hidden bg-[#FDFBF7]">
      {/* Background Decor - Plus subtil et artistique */}
      <div className="fixed top-[-15%] right-[-5%] w-[50%] h-[50%] bg-pink-candy/10 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-magic-purple/10 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="fixed top-[20%] left-[5%] w-[30%] h-[30%] bg-sky-pastel/10 rounded-full blur-[80px] pointer-events-none -z-10" />
      
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: { borderRadius: '1rem', background: '#FFF0F5', color: '#4A4A4A', border: '2px solid #FFD1DC' }
        }} 
      />
      
      <Header />
      
      <main className="flex-1 w-full relative overflow-hidden flex flex-col">
        <div className="flex-1 container mx-auto px-4 py-4 md:py-6 overflow-y-auto custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
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

function MobileNavItem({ to, icon: Icon, label, highlight = false }: any) {
  const location = useLocation()
  const isActive = location.pathname === to

  return (
    <Link to={to} className="flex flex-col items-center justify-center gap-1">
      <div className={`p-2 rounded-xl transition-all ${
        highlight 
          ? 'bg-gradient-to-br from-pink-candy to-pink-deep text-white shadow-kawaii -mt-8 border-4 border-white' 
          : isActive ? 'text-pink-deep' : 'text-hello-black/40'
      }`}>
        <Icon size={highlight ? 24 : 20} />
      </div>
      {!highlight && (
        <span className={`text-[10px] font-bold ${isActive ? 'text-pink-deep' : 'text-hello-black/40'}`}>
          {label}
        </span>
      )}
    </Link>
  )
}
