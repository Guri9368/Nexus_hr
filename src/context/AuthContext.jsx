// src/context/AuthContext.jsx
// Global authentication context.
// Stores login state in sessionStorage so it persists through page refresh
// but clears when the browser tab is closed.

import React, { createContext, useContext, useState } from 'react'

// Shape of the context value
const AuthContext = createContext(null)

// Valid credentials (as per assignment spec)
const VALID_USERNAME = 'testuser'
const VALID_PASSWORD = 'Test123'

export function AuthProvider({ children }) {
  // Initialise from sessionStorage so refresh doesn't log user out
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => sessionStorage.getItem('nexus_auth') === 'true'
  )

  /**
   * Validates credentials and sets auth state.
   * Returns { success, error } so the login form can react.
   */
  const login = (username, password) => {
    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
      sessionStorage.setItem('nexus_auth', 'true')
      setIsAuthenticated(true)
      return { success: true }
    }
    return { success: false, error: 'Invalid username or password.' }
  }

  /** Clears auth state and removes from sessionStorage */
  const logout = () => {
    sessionStorage.removeItem('nexus_auth')
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

/** Custom hook — throws if used outside AuthProvider */
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
