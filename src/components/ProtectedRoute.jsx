// src/components/ProtectedRoute.jsx
// Wraps any route that requires authentication.
// Unauthenticated users are redirected to the login page.

import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute() {
  const { isAuthenticated } = useAuth()

  // If not logged in, send to login; preserve attempted URL in "from" state
  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  // Render the child route
  return <Outlet />
}
