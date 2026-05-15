'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

interface AdminUser {
  email: string
  name: string
  role: string
}

interface AuthContextType {
  user: AdminUser | null
  isLoading: boolean
  login: (email: string, password: string, dob: string) => Promise<{ success: boolean; message?: string }>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock admin credentials (in production, this would be an API call)
const MOCK_ADMIN = {
  email: 'admin@odisharide.com',
  password: 'admin123',
  name: 'Super Admin',
  role: 'super-admin',
  dob: '1990-01-01' // Expected format: YYYY-MM-DD
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('adminUser')
    const token = localStorage.getItem('adminToken')
    
    if (storedUser && token) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string, dob: string): Promise<{ success: boolean; message?: string }> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Validate credentials
    if (email === MOCK_ADMIN.email && 
        password === MOCK_ADMIN.password && 
        dob === MOCK_ADMIN.dob) {
      
      const adminUser = {
        email: MOCK_ADMIN.email,
        name: MOCK_ADMIN.name,
        role: MOCK_ADMIN.role
      }
      
      // Store in localStorage (in production, use httpOnly cookies)
      localStorage.setItem('adminUser', JSON.stringify(adminUser))
      localStorage.setItem('adminToken', 'mock-jwt-token-' + Date.now())
      
      setUser(adminUser)
      return { success: true }
    }
    
    return { success: false, message: 'Invalid email, password, or date of birth' }
  }

  const logout = () => {
    localStorage.removeItem('adminUser')
    localStorage.removeItem('adminToken')
    setUser(null)
    router.push('/login')
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}