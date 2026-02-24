// src/components/EmployeeCard.jsx
// Renders a single employee as a card.
// Used in the grid/cards view on the List page.

import React from 'react'
import { useNavigate } from 'react-router-dom'

function getInitials(name = '') {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? '')
    .join('')
}

// Accent gradient per department
const DEPT_GRADIENTS = {
  Engineering:      'from-green-500/20  to-transparent',
  Product:          'from-blue-500/20   to-transparent',
  Design:           'from-pink-500/20   to-transparent',
  Analytics:        'from-yellow-500/20 to-transparent',
  Marketing:        'from-violet-500/20 to-transparent',
  'Human Resources':'from-rose-500/20   to-transparent',
  Sales:            'from-cyan-500/20   to-transparent',
  Finance:          'from-orange-500/20 to-transparent',
}

const AVATAR_COLOURS = [
  'bg-green-500/10  text-green-400  border-green-400/20',
  'bg-blue-500/10   text-blue-400   border-blue-400/20',
  'bg-pink-500/10   text-pink-400   border-pink-400/20',
  'bg-yellow-500/10 text-yellow-400 border-yellow-400/20',
  'bg-violet-500/10 text-violet-400 border-violet-400/20',
  'bg-cyan-500/10   text-cyan-400   border-cyan-400/20',
]

export default function EmployeeCard({ employee, index = 0 }) {
  const navigate = useNavigate()
  const avatarClass = AVATAR_COLOURS[index % AVATAR_COLOURS.length]

  const name        = employee.name        ?? employee.emp_name   ?? 'Unknown'
  const email       = employee.email       ?? employee.emp_email  ?? '—'
  const dept        = employee.department  ?? employee.dept       ?? '—'
  const designation = employee.designation ?? employee.role       ?? '—'
  const city        = employee.city        ?? employee.location   ?? '—'
  const salary      = employee.salary      ?? employee.emp_salary ?? 0
  const gradient    = DEPT_GRADIENTS[dept] ?? 'from-gray-500/10 to-transparent'

  const handleClick = () => {
    sessionStorage.setItem('selected_employee', JSON.stringify(employee))
    navigate(`/details/${employee.id ?? employee.emp_id ?? employee.employee_id}`)
  }

  return (
    <div
      onClick={handleClick}
      className="card p-5 cursor-pointer group hover:border-brand-400/30
                 hover:shadow-lg hover:shadow-brand-500/5 transition-all duration-200
                 relative overflow-hidden"
    >
      {/* Subtle department colour wash in top corner */}
      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${gradient} rounded-bl-full pointer-events-none`} />

      {/* Avatar + name */}
      <div className="flex items-start gap-3 mb-4">
        <div className={`w-11 h-11 rounded-xl border flex items-center justify-center
                         text-sm font-display font-bold shrink-0 ${avatarClass}`}>
          {getInitials(name)}
        </div>
        <div className="min-w-0">
          <h3 className="text-white font-medium text-sm leading-tight truncate
                         group-hover:text-brand-400 transition-colors">
            {name}
          </h3>
          <p className="text-gray-500 text-[11px] mt-0.5 truncate">{email}</p>
        </div>
      </div>

      {/* Info rows */}
      <div className="space-y-1.5 text-[12px] font-body">
        <InfoRow icon="💼" label={designation} />
        <InfoRow icon="🏢" label={dept} />
        <InfoRow icon="📍" label={city} />
      </div>

      {/* Salary footer */}
      {salary > 0 && (
        <div className="mt-4 pt-3 border-t border-surface-500 flex justify-between items-center">
          <span className="text-gray-500 text-[11px]">Annual Salary</span>
          <span className="text-brand-400 font-medium text-sm">
            ${Number(salary).toLocaleString()}
          </span>
        </div>
      )}
    </div>
  )
}

/** Small icon + text row used inside the card */
function InfoRow({ icon, label }) {
  return (
    <div className="flex items-center gap-2 text-gray-400">
      <span className="text-[11px] shrink-0">{icon}</span>
      <span className="truncate">{label}</span>
    </div>
  )
}
