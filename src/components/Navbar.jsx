// src/components/Navbar.jsx
// Top navigation bar shown on all authenticated pages.
// Displays the app brand, active route links, and a logout button.

import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Navigation links shown in the navbar
const NAV_LINKS = [
  { to: '/list',  label: 'Employees' },
  { to: '/graph', label: 'Salary Graph' },
  { to: '/map',   label: 'Map View' },
]

export default function Navbar() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
  }

  return (
    <header className="sticky top-0 z-50 bg-surface-800/95 backdrop-blur-md border-b border-surface-500">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">

        {/* Brand */}
        <NavLink to="/list" className="flex items-center gap-2 shrink-0">
          <span className="text-brand-400 text-lg">◈</span>
          <span className="font-display font-bold text-white text-lg tracking-tight">
            Nexus <span className="text-brand-400">HR</span>
          </span>
        </NavLink>

        {/* Navigation links */}
        <nav className="hidden sm:flex items-center gap-1">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                [
                  'px-3 py-1.5 rounded-lg text-xs font-body transition-colors duration-150',
                  isActive
                    ? 'bg-brand-500/10 text-brand-400 border border-brand-400/20'
                    : 'text-gray-400 hover:text-white hover:bg-surface-700',
                ].join(' ')
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="text-xs text-gray-400 hover:text-red-400 border border-surface-500
                     hover:border-red-400/40 px-3 py-1.5 rounded-lg transition-all duration-150
                     font-body shrink-0"
        >
          Sign Out
        </button>
      </div>
    </header>
  )
}
