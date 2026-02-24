// src/pages/Login.jsx
// Public login page — route: "/"
// Validates inputs locally, then calls AuthContext.login().
// Redirects to /list on success.

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ username: '', password: '' })
  const [errors, setErrors] = useState({})
  const [authError, setAuthError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // If already logged in, skip the login page
  if (isAuthenticated) {
    navigate('/list', { replace: true })
    return null
  }

  /** Updates a single field in the form state */
  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    // Clear inline error for this field as the user types
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
    if (authError) setAuthError('')
  }

  /** Client-side validation before hitting the auth logic */
  const validate = () => {
    const next = {}
    if (!form.username.trim()) next.username = 'Username is required.'
    if (!form.password)        next.password = 'Password is required.'
    else if (form.password.length < 4)
      next.password = 'Password must be at least 4 characters.'
    return next
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors)
      return
    }

    setLoading(true)
    // Small artificial delay to show the loading state
    await new Promise((r) => setTimeout(r, 600))

    const result = login(form.username.trim(), form.password)
    setLoading(false)

    if (result.success) {
      navigate('/list', { replace: true })
    } else {
      setAuthError(result.error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4
                    bg-surface-900 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-brand-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-sm animate-fade-up relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <span className="text-brand-400 text-4xl block mb-3">◈</span>
          <h1 className="font-display font-bold text-3xl text-white tracking-tight">
            Nexus <span className="text-brand-400">HR</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1 font-body">
            Employee Management Platform
          </p>
        </div>

        {/* Card */}
        <div className="card p-7 shadow-2xl shadow-black/50">
          <h2 className="font-display font-bold text-white text-lg mb-6">
            Sign in to your account
          </h2>

          {/* Auth error banner */}
          {authError && (
            <div className="mb-5 px-4 py-3 bg-red-500/10 border border-red-500/30
                            rounded-lg text-red-400 text-sm font-body">
              ⚠ {authError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Username */}
            <div>
              <label className="block text-[11px] uppercase tracking-widest
                                text-gray-400 font-body mb-2">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="testuser"
                autoComplete="username"
                className={`input-field ${errors.username ? 'border-red-400' : ''}`}
              />
              {errors.username && (
                <p className="text-red-400 text-xs mt-1 font-body">{errors.username}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-[11px] uppercase tracking-widest
                                text-gray-400 font-body mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className={`input-field pr-12 ${errors.password ? 'border-red-400' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2
                             text-gray-500 hover:text-gray-300 text-xs transition-colors"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-xs mt-1 font-body">{errors.password}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white
                                   rounded-full animate-spin-slow inline-block" />
                  Signing in…
                </span>
              ) : (
                'Sign In →'
              )}
            </button>
          </form>

          {/* Hint */}
          <p className="text-center text-xs text-gray-600 mt-5 font-body">
            Hint: <span className="text-gray-400">testuser</span> /{' '}
            <span className="text-gray-400">Test123</span>
          </p>
        </div>
      </div>
    </div>
  )
}
