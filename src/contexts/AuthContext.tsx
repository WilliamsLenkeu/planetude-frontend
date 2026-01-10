import { createContext, useContext, useState, useEffect, useMemo, type ReactNode } from 'react'
import type { User } from '../types'

type AuthContextValue = {
  token: string | null
  user: User | null
  setAuth: (token: string | null, user: User | null, refreshToken?: string | null) => void
  logout: () => void
  isAuthenticated: boolean
  isInitializing: boolean
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setTokenState] = useState<string | null>(localStorage.getItem('token'))
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user')
    try {
      return savedUser ? JSON.parse(savedUser) : null
    } catch {
      return null
    }
  })
  const [isInitializing, setIsInitializing] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token')
      
      if (!storedToken) {
        setTokenState(null)
        setUser(null)
        setIsInitializing(false)
        return
      }

      try {
        const response = await fetch('https://plan-etude.koyeb.app/api/users/profile', {
          headers: { Authorization: `Bearer ${storedToken}` },
        })
        
        if (response.ok) {
          const result = await response.json()
          const userData = result.data || result
          setUser(userData)
          localStorage.setItem('user', JSON.stringify(userData))
          setTokenState(storedToken)
        } else if (response.status === 401) {
          // Token expiré, on tente un refresh ? 
          // Pour l'instant on vide tout pour forcer le login si le refresh échoue
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          localStorage.removeItem('refreshToken')
          setTokenState(null)
          setUser(null)
        }
      } catch (error) {
        console.error('Erreur initialisation auth:', error)
      } finally {
        setIsInitializing(false)
      }
    }

    initAuth()
  }, [])

  const setAuth = (t: string | null, u: User | null, rt?: string | null) => {
    if (t) {
      localStorage.setItem('token', t)
    } else {
      localStorage.removeItem('token')
    }

    if (u) {
      localStorage.setItem('user', JSON.stringify(u))
    } else {
      localStorage.removeItem('user')
    }

    if (rt) {
      localStorage.setItem('refreshToken', rt)
    } else if (rt === null) {
      localStorage.removeItem('refreshToken')
    }

    setTokenState(t)
    setUser(u)
  }

  const logout = () => {
    setAuth(null, null, null)
  }

  const isAuthenticated = !!token

  const value = useMemo(() => ({
    token,
    user,
    setAuth,
    logout,
    isAuthenticated,
    isInitializing
  }), [token, user, isInitializing])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
