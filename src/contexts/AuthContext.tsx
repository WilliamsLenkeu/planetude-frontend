import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { User } from '../types'

type AuthContextValue = {
  token: string | null
  user: User | null
  setToken: (t: string | null) => void
  logout: () => void
  isAuthenticated: boolean
  isInitializing: boolean
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setTokenState] = useState<string | null>(localStorage.getItem('token'))
  const [user, setUser] = useState<User | null>(null)
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
        const response = await fetch('https://plan-etude.koyeb.app/api/user/profile', {
          headers: { Authorization: `Bearer ${storedToken}` },
        })
        
        if (response.ok) {
          const data = await response.json()
          setUser(data)
          setTokenState(storedToken)
        } else {
          // Si le token est invalide (401, 404, etc.)
          localStorage.removeItem('token')
          setTokenState(null)
          setUser(null)
        }
      } catch (error) {
        console.error('Erreur initialisation auth:', error)
        // En cas d'erreur réseau, on garde le token mais on arrête l'initialisation
      } finally {
        setIsInitializing(false)
      }
    }

    initAuth()
  }, [])

  const setToken = (t: string | null) => {
    if (t) {
      localStorage.setItem('token', t)
    } else {
      localStorage.removeItem('token')
    }
    setTokenState(t)
  }

  const logout = () => {
    setToken(null)
    setUser(null)
  }

  const isAuthenticated = !!token

  return (
    <AuthContext.Provider value={{ token, user, setToken, logout, isAuthenticated, isInitializing }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
