// src/components/EmployeeTable.jsx
// Renders employee data as a scrollable table.
// Clicking a row navigates to the Details page for that employee.

import React from 'react'
import { useNavigate } from 'react-router-dom'

// Helper: derive initials from a full name
function getInitials(name = '') {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? '')
    .join('')
}

// Soft colour map for department badges
const DEPT_COLOURS = {
  Engineering:      'text-green-400  border-green-400/30  bg-green-400/8',
  Product:          'text-blue-400   border-blue-400/30   bg-blue-400/8',
  Design:           'text-pink-400   border-pink-400/30   bg-pink-400/8',
  Analytics:        'text-yellow-400 border-yellow-400/30 bg-yellow-400/8',
  Marketing:        'text-violet-400 border-violet-400/30 bg-violet-400/8',
  'Human Resources':'text-rose-400   border-rose-400/30   bg-rose-400/8',
  Sales:            'text-cyan-400   border-cyan-400/30   bg-cyan-400/8',
  Finance:          'text-orange-400 border-orange-400/30 bg-orange-400/8',
}

const defaultBadge = 'text-gray-400 border-gray-400/30 bg-gray-400/8'

export default function EmployeeTable({ employees }) {
  const navigate = useNavigate()

  const handleRowClick = (employee) => {
    // Store selected employee in sessionStorage so the details page can read it
    sessionStorage.setItem('selected_employee', JSON.stringify(employee))
    navigate(`/details/${employee.id ?? employee.emp_id ?? employee.employee_id}`)
  }

  if (!employees.length) {
    return (
      <div className="text-center py-20 text-gray-500 text-sm font-body">
        No employees match your search.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-surface-500">
      <table className="w-full text-sm font-body min-w-[700px]">
        {/* Column headers */}
        <thead>
          <tr className="border-b border-surface-500 bg-surface-700/50">
            {['Employee', 'Department', 'Designation', 'Location', 'Salary', 'Joined'].map((h) => (
              <th
                key={h}
                className="text-left px-4 py-3 text-[10px] font-body uppercase tracking-widest text-gray-500"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {employees.map((emp, idx) => {
            const name       = emp.name       ?? emp.emp_name  ?? 'Unknown'
            const email      = emp.email      ?? emp.emp_email ?? '—'
            const dept       = emp.department ?? emp.dept      ?? '—'
            const designation = emp.designation ?? emp.role   ?? '—'
            const city       = emp.city       ?? emp.location  ?? '—'
            const salary     = emp.salary     ?? emp.emp_salary ?? 0
            const joined     = emp.join_date  ?? emp.joinDate  ?? '—'
            const deptClass  = DEPT_COLOURS[dept] ?? defaultBadge

            return (
              <tr
                key={idx}
                className="table-row-hover"
                onClick={() => handleRowClick(emp)}
              >
                {/* Avatar + name + email */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-brand-500/10 border border-brand-400/20
                                    flex items-center justify-center text-brand-400 text-xs font-display font-bold shrink-0">
                      {getInitials(name)}
                    </div>
                    <div>
                      <p className="text-white font-medium leading-tight">{name}</p>
                      <p className="text-gray-500 text-[11px] mt-0.5">{email}</p>
                    </div>
                  </div>
                </td>

                <td className="px-4 py-3">
                  <span className={`badge ${deptClass}`}>{dept}</span>
                </td>

                <td className="px-4 py-3 text-gray-300">{designation}</td>

                <td className="px-4 py-3 text-gray-400">{city}</td>

                <td className="px-4 py-3 text-brand-400 font-medium">
                  {salary ? `$${Number(salary).toLocaleString()}` : '—'}
                </td>

                <td className="px-4 py-3 text-gray-500 text-xs">{joined}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
