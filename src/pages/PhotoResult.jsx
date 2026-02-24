// src/pages/PhotoResult.jsx
// Protected route: /photo
// Displays the captured webcam image along with the employee's name.
// Provides "Retake" (back to Details) and "Back to List" actions.

import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'

export default function PhotoResult() {
  const navigate  = useNavigate()
  const location  = useLocation()

  // Photo data and employee info are passed via router state from Details.jsx
  const imageSrc = location.state?.imageSrc
  const employee = location.state?.employee

  const name = employee?.name ?? employee?.emp_name ?? 'Employee'
  const id   = employee?.id   ?? employee?.emp_id   ?? '—'
  const dept = employee?.department ?? employee?.dept ?? '—'
  const timestamp = new Date().toLocaleString()

  // If navigated here directly without a photo, redirect to list
  if (!imageSrc) {
    return (
      <>
        <Navbar />
        <div className="page-wrapper text-center">
          <p className="text-gray-400 mb-4 font-body">No photo found.</p>
          <button onClick={() => navigate('/list')} className="btn-primary">
            ← Back to List
          </button>
        </div>
      </>
    )
  }

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = imageSrc
    link.download = `${name.replace(/\s+/g, '_')}_photo.png`
    link.click()
  }

  const handleRetake = () => {
    navigate(-1)
  }

  return (
    <>
      <Navbar />

      <main className="page-wrapper max-w-xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="font-display font-bold text-2xl text-white">Photo Captured</h1>
          <p className="text-gray-500 text-sm font-body mt-0.5">
            Verification snapshot for {name}
          </p>
        </div>

        {/* Photo frame */}
        <div className="card overflow-hidden mb-5">
          {/* Status bar inside card */}
          <div className="flex items-center gap-2 px-4 py-2.5 bg-surface-700 border-b border-surface-500">
            <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
            <span className="text-xs font-body text-gray-400">Captured at {timestamp}</span>
          </div>

          {/* The actual image */}
          <img
            src={imageSrc}
            alt={`Photo of ${name}`}
            className="w-full block"
          />
        </div>

        {/* Employee metadata */}
        <div className="card p-4 mb-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-400/20
                          flex items-center justify-center text-brand-400 font-display font-bold text-sm shrink-0">
            {name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-white text-sm font-medium">{name}</p>
            <p className="text-gray-500 text-xs font-body mt-0.5">{dept} · ID #{id}</p>
          </div>
          <span className="badge text-green-400 border-green-400/30 bg-green-400/8 shrink-0">
            ✓ Verified
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-3">
          <button onClick={handleRetake} className="btn-secondary flex-1">
            ↩ Retake Photo
          </button>
          <button onClick={handleDownload} className="btn-secondary flex-1">
            ⬇ Download
          </button>
          <button onClick={() => navigate('/list')} className="btn-primary flex-1">
            Back to List
          </button>
        </div>
      </main>
    </>
  )
}
