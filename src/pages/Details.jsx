// src/pages/Details.jsx
// Protected route: /details/:id
// Shows full employee profile and provides a "Capture Photo" option.
// The CameraCapture component handles the webcam interaction.

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Navbar from '../components/Navbar'
import CameraCapture from '../components/CameraCapture'

/** Reads the selected employee from sessionStorage */
function loadEmployee() {
  try {
    const raw = sessionStorage.getItem('selected_employee')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export default function Details() {
  const navigate = useNavigate()
  const employee = loadEmployee()

  const [showCamera, setShowCamera] = useState(false)

  // If no employee data (e.g. direct URL navigation), bounce back to list
  if (!employee) {
    return (
      <>
        <Navbar />
        <div className="page-wrapper text-center">
          <p className="text-gray-400 mb-4 font-body">No employee selected.</p>
          <button onClick={() => navigate('/list')} className="btn-primary">
            ← Back to List
          </button>
        </div>
      </>
    )
  }

  /** When a photo is captured, navigate to the photo result page */
  const handleCapture = (imageSrc) => {
    navigate('/photo', { state: { imageSrc, employee } })
  }

  // Normalise field names — the real API may vary
  const name        = employee.name        ?? employee.emp_name   ?? 'Unknown'
  const email       = employee.email       ?? employee.emp_email  ?? '—'
  const phone       = employee.phone       ?? employee.mobile     ?? '—'
  const dept        = employee.department  ?? employee.dept       ?? '—'
  const designation = employee.designation ?? employee.role       ?? '—'
  const city        = employee.city        ?? employee.location   ?? '—'
  const salary      = employee.salary      ?? employee.emp_salary
  const joined      = employee.join_date   ?? employee.joinDate   ?? '—'
  const address     = employee.address     ?? '—'
  const state       = employee.state       ?? '—'
  const country     = employee.country     ?? '—'

  const initials = name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()

  return (
    <>
      <Navbar />

      <main className="page-wrapper max-w-3xl">
        {/* Back button */}
        <button
          onClick={() => navigate('/list')}
          className="btn-secondary text-xs mb-6 inline-flex items-center gap-1"
        >
          ← Back to List
        </button>

        {/* Hero card */}
        <div className="card p-6 mb-6 relative overflow-hidden">
          {/* Background accent */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-brand-500/5 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-start gap-5 relative">
            {/* Large avatar */}
            <div className="w-16 h-16 rounded-2xl bg-brand-500/10 border-2 border-brand-400/30
                            flex items-center justify-center text-brand-400
                            font-display font-bold text-xl shrink-0">
              {initials}
            </div>

            <div className="min-w-0">
              <h1 className="font-display font-bold text-2xl text-white">{name}</h1>
              <p className="text-brand-400 text-sm mt-1">{designation}</p>
              <p className="text-gray-500 text-sm">{dept}</p>
            </div>

            {/* Active badge */}
            <span className="badge ml-auto shrink-0 text-green-400 border-green-400/30 bg-green-400/8">
              ● Active
            </span>
          </div>
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <DetailCard title="Contact">
            <DetailRow label="Email"   value={email} />
            <DetailRow label="Phone"   value={phone} />
          </DetailCard>

          <DetailCard title="Employment">
            <DetailRow label="Department"  value={dept} />
            <DetailRow label="Designation" value={designation} />
            <DetailRow label="Joined"      value={joined} />
            {salary && (
              <DetailRow
                label="Salary"
                value={`$${Number(salary).toLocaleString()} / yr`}
                highlight
              />
            )}
          </DetailCard>

          <DetailCard title="Location" className="sm:col-span-2">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-3">
              <DetailRow label="City"    value={city}    />
              <DetailRow label="State"   value={state}   />
              <DetailRow label="Country" value={country} />
              <DetailRow label="Address" value={address} />
            </div>
          </DetailCard>
        </div>

        {/* Camera section */}
        <div className="card p-5">
          <h2 className="font-display font-bold text-white mb-1">Verification Photo</h2>
          <p className="text-gray-500 text-sm mb-4 font-body">
            Capture a photo for this employee's profile record.
          </p>

          {showCamera ? (
            <CameraCapture
              onCapture={handleCapture}
              onCancel={() => setShowCamera(false)}
            />
          ) : (
            <button onClick={() => setShowCamera(true)} className="btn-primary">
              📷 Open Camera
            </button>
          )}
        </div>
      </main>
    </>
  )
}

/** Grouped info card wrapper */
function DetailCard({ title, children, className = '' }) {
  return (
    <div className={`card p-5 ${className}`}>
      <h3 className="font-display font-semibold text-xs uppercase tracking-widest
                     text-gray-500 mb-4">
        {title}
      </h3>
      <div className="space-y-3">{children}</div>
    </div>
  )
}

/** Single label + value row */
function DetailRow({ label, value, highlight = false }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-widest text-gray-500 font-body">{label}</p>
      <p className={`text-sm mt-0.5 font-body ${highlight ? 'text-brand-400 font-medium' : 'text-white'}`}>
        {value || '—'}
      </p>
    </div>
  )
}
