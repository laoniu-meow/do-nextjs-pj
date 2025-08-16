import { useState, useEffect, useCallback } from 'react'

interface User {
  id: string
  email: string
  name: string
  role: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true
  })

  const checkAuthStatus = useCallback(async () => {
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) {
        setAuthState(prev => ({ ...prev, isLoading: false }))
        return
      }

      // Verify token with backend
      const response = await fetch('/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const userData = await response.json()
        setAuthState({
          user: userData.user,
          token,
          isAuthenticated: true,
          isLoading: false
        })
      } else {
        // Token invalid, clear storage
        localStorage.removeItem('auth_token')
        setAuthState({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false
        })
      }
    } catch {
      setAuthState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false
      })
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      if (response.ok) {
        const data = await response.json()
        const { user, token } = data.data
        
        localStorage.setItem('auth_token', token)
        setAuthState({
          user,
          token,
          isAuthenticated: true,
          isLoading: false
        })
        
        return { success: true }
      } else {
        const errorData = await response.json()
        return { success: false, error: errorData.message }
      }
    } catch {
      return { success: false, error: 'Login failed' }
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('auth_token')
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false
    })
  }, [])

  const register = useCallback(async (userData: { email: string; password: string; name: string }) => {
    try {
      const response = await fetch('/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      })

      if (response.ok) {
        return { success: true }
      } else {
        const errorData = await response.json()
        return { success: false, error: errorData.message }
      }
    } catch {
      return { success: false, error: 'Registration failed' }
    }
  }, [])

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus()
  }, [checkAuthStatus])

  return {
    ...authState,
    login,
    logout,
    register,
    checkAuthStatus
  }
}
