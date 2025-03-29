import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'
import { User } from '@/types/api'
import {
  login as apiLogin,
  LoginData,
  register as apiRegister,
  RegisterData,
  logout as apiLogout,
  getProfile,
  safeLocalStorage,
} from '@/lib/api'
import { useRouter } from 'next/navigation'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (data: LoginData) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  // Handle client-side only code
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    // Only run auth check when component is mounted on client
    if (mounted) {
      // Check if user is logged in on mount
      const checkAuth = async () => {
        const token = safeLocalStorage.getItem('token')

        if (token) {
          try {
            const userData = await getProfile()
            setUser(userData)
          } catch (error) {
            // Token might be invalid or expired
            safeLocalStorage.removeItem('token')
            safeLocalStorage.removeItem('user_id')
          }
        }

        setIsLoading(false)
      }

      checkAuth()
    }
  }, [mounted])

  const login = async (data: LoginData) => {
    setIsLoading(true)
    try {
      await apiLogin(data)
      const userData = await getProfile()
      setUser(userData)
      router.push('/dashboard')
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (data: RegisterData) => {
    setIsLoading(true)
    try {
      await apiRegister(data)
      const userData = await getProfile()
      setUser(userData)
      router.push('/dashboard')
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    apiLogout()
    setUser(null)
    router.push('/login')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading: isLoading || !mounted,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
