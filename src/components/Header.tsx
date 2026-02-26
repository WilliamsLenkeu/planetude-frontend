import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Calendar, BookOpen, BarChart3, Music, Palette } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { Avatar } from './ui/Avatar'
import { cn } from '../utils/cn'

const navItems = [
  { to: '/dashboard', label: 'Accueil', icon: LayoutDashboard },
  { to: '/planning', label: 'Planning', icon: Calendar },
  { to: '/subjects', label: 'Matières', icon: BookOpen },
  { to: '/analytics', label: 'Stats', icon: BarChart3 },
  { to: '/lofi', label: 'Lo-Fi', icon: Music },
  { to: '/themes', label: 'Thèmes', icon: Palette },
]

export default function Header() {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  return (
    <header
      className="sticky top-0 z-40 border-b backdrop-blur-xl"
      style={{
        backgroundColor: 'color-mix(in srgb, var(--color-card-bg) 95%, transparent)',
        borderColor: 'var(--color-border)'
      }}
    >
      <div className="flex items-center justify-between h-14 md:h-16 px-4 md:px-6 max-w-7xl mx-auto">
        <NavLink
          to={isAuthenticated ? '/dashboard' : '/'}
          className="flex items-center gap-2 font-bold text-lg tracking-tight hover:opacity-80 transition-opacity"
          style={{ color: 'var(--color-text)' }}
        >
          <span className="text-xl">📚</span>
          PlanÉtude
        </NavLink>

        {isAuthenticated && (
          <>
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-[var(--color-primary)]/10'
                        : 'hover:bg-[var(--color-bg-tertiary)]'
                    )
                  }
                  style={({ isActive }) =>
                    ({ color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)' })
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                      <span>{label}</span>
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            <button
              onClick={() => navigate('/profile')}
              className="flex items-center gap-2 p-1.5 rounded-full hover:bg-[var(--color-bg-tertiary)] transition-colors"
            >
              <Avatar
                initials={user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U'}
                size="sm"
              />
            </button>
          </>
        )}
      </div>
    </header>
  )
}
