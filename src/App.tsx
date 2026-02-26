import { BrowserRouter, Routes, Route, useLocation, Navigate, NavLink, useNavigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { MusicProvider } from './contexts/MusicContext'
import Header from './components/Header'
import { AnimatePresence, motion } from 'framer-motion'
import { LogOut, LayoutDashboard, Calendar, User } from 'lucide-react'
import { LoadingSpinner } from './components/ui/LoadingSpinner'
import EnvDebug from './components/EnvDebug'

const Home = lazy(() => import('./pages/Home'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const SetupWizard = lazy(() => import('./pages/SetupWizard'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Planning = lazy(() => import('./pages/Planning'))
const PlanningDetail = lazy(() => import('./pages/PlanningDetail'))
const Reminders = lazy(() => import('./pages/Reminders'))
const Profile = lazy(() => import('./pages/Profile'))
const LoFi = lazy(() => import('./pages/LoFi'))
const Subjects = lazy(() => import('./pages/Subjects'))
const Analytics = lazy(() => import('./pages/Analytics'))
const Themes = lazy(() => import('./pages/Themes'))
const MiniPlayer = lazy(() => import('./components/MiniPlayer'))

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
  const { isAuthenticated, isInitializing, logout, user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/auth/login')
    toast.success('À bientôt !')
  }

  const isSetupComplete = () => {
    if (user?.preferences?.hasCompletedSetup) return true
    return localStorage.getItem('setupComplete') !== null
  }

  if (isInitializing) {
    return <LoadingSpinner fullScreen />
  }

  const mobileNavItems = [
    { to: '/dashboard', label: 'Accueil', icon: LayoutDashboard },
    { to: '/planning', label: 'Planning', icon: Calendar },
    { to: '/profile', label: 'Profil', icon: User },
  ]

  return (
    <div
      className="flex flex-col min-h-screen font-sans transition-colors duration-300"
      style={{ backgroundColor: 'var(--color-background)', color: 'var(--color-text)' }}
    >
      {/* Fond subtil */}
      <div
        className="fixed inset-0 overflow-hidden pointer-events-none -z-10"
        style={{ backgroundColor: 'var(--color-background)' }}
      >
        <div
          className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 rounded-full blur-[120px] opacity-[0.06]"
          style={{ backgroundColor: 'var(--color-primary)' }}
        />
        <div
          className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 rounded-full blur-[100px] opacity-[0.08]"
          style={{ backgroundColor: 'var(--color-secondary)' }}
        />
      </div>

      <EnvDebug />
      <Toaster
        position="bottom-center"
        toastOptions={{
          className: 'surface shadow-lg',
          style: {
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem 1rem',
            fontSize: '0.875rem',
          },
        }}
      />

      <Header />

      <main className="flex-1 flex flex-col">
        <div className={`flex-1 container mx-auto px-4 py-6 md:px-6 md:py-8 max-w-5xl overflow-y-auto ${isAuthenticated ? 'md:pb-24' : ''}`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <Suspense fallback={<LoadingSpinner fullScreen />}>
                <Routes location={location}>
                  {!isAuthenticated ? (
                    <>
                      <Route path="/" element={<Home />} />
                      <Route path="/auth/login" element={<Login />} />
                      <Route path="/auth/register" element={<Register />} />
                      <Route path="*" element={<Navigate to="/auth/login" replace />} />
                    </>
                  ) : !isSetupComplete() ? (
                    <>
                      <Route path="/setup" element={<SetupWizard />} />
                      <Route path="*" element={<Navigate to="/setup" replace />} />
                    </>
                  ) : (
                    <>
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/planning" element={<Planning />} />
                      <Route path="/planning/:id" element={<PlanningDetail />} />
                      <Route path="/reminders" element={<Reminders />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/lofi" element={<LoFi />} />
                      <Route path="/subjects" element={<Subjects />} />
                      <Route path="/analytics" element={<Analytics />} />
                      <Route path="/themes" element={<Themes />} />
                      <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </>
                  )}
                </Routes>
              </Suspense>
            </motion.div>
          </AnimatePresence>
        </div>

        {isAuthenticated && (
          <Suspense fallback={null}>
            <MiniPlayer />
          </Suspense>
        )}
      </main>

      {isAuthenticated && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="fixed bottom-20 left-4 z-50 p-2.5 rounded-full shadow-lg hidden md:flex items-center gap-2 group"
          style={{
            backgroundColor: 'var(--color-card-bg)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-text-muted)',
          }}
        >
          <LogOut size={18} />
          <span className="max-w-0 overflow-hidden group-hover:max-w-[80px] transition-all duration-300 text-xs font-medium whitespace-nowrap">
            Déconnexion
          </span>
        </motion.button>
      )}

      {isAuthenticated && (
        <nav
          className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around h-14 border-t pb-safe"
          style={{
            backgroundColor: 'color-mix(in srgb, var(--color-card-bg) 98%, transparent)',
            backdropFilter: 'blur(12px)',
            borderColor: 'var(--color-border)',
          }}
        >
          {mobileNavItems.map(({ to, label, icon: Icon }) => (
            <MobileNavItem key={to} to={to} label={label} icon={Icon} />
          ))}
        </nav>
      )}

      {/* Padding bottom pour mobile nav */}
      {isAuthenticated && <div className="md:hidden h-14" />}
    </div>
  )
}

function MobileNavItem({
  to,
  label,
  icon: Icon,
}: {
  to: string
  label: string
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>
}) {
  return (
    <NavLink
      to={to}
      className="relative flex flex-col items-center justify-center gap-0.5 py-2 px-4 rounded-lg transition-colors min-w-[64px]"
      style={({ isActive }) => ({
        color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
      })}
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <motion.div
              layoutId="mobile-nav-indicator"
              className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full"
              style={{ backgroundColor: 'var(--color-primary)' }}
            />
          )}
          <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
          <span className="text-[10px] font-medium">{label}</span>
        </>
      )}
    </NavLink>
  )
}
