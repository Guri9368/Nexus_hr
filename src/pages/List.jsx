// src/pages/List.jsx
// Protected route: /list
// Loads employee data via the API (with mock fallback).
// Shows a banner if data is coming from mock (API unavailable/CORS).

import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import Navbar from '../components/Navbar'
import EmployeeTable from '../components/EmployeeTable'
import EmployeeCard from '../components/EmployeeCard'
import Spinner from '../components/Spinner'
import { useEmployees } from '../hooks/useEmployees'

const VIEW_TABLE = 'table'
const VIEW_CARDS = 'cards'

export default function List() {
  const navigate = useNavigate()
  const { employees, loading, error, source, refetch } = useEmployees()

  const [search,   setSearch]   = useState('')
  const [viewMode, setViewMode] = useState(VIEW_TABLE)

  // Filter by name, email, department, designation, or city
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return employees
    return employees.filter((emp) => {
      const haystack = [
        emp.name, emp.email, emp.department,
        emp.city, emp.designation, emp.state,
      ].filter(Boolean).join(' ').toLowerCase()
      return haystack.includes(q)
    })
  }, [employees, search])

  return (
    <>
      <Navbar />

      <main className="page-wrapper">
        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
          <div>
            <h1 className="font-display font-bold text-2xl text-white">
              Employee Directory
            </h1>
            <p className="text-gray-500 text-sm font-body mt-0.5">
              {loading
                ? 'Fetching records…'
                : `${filtered.length} of ${employees.length} employees`}
            </p>
          </div>

          {/* Navigation CTA buttons */}
          <div className="flex gap-2 shrink-0 flex-wrap">
            <button
              onClick={() => navigate('/graph')}
              className="btn-secondary text-xs flex items-center gap-1.5"
            >
              📊 Salary Graph
            </button>
            <button
              onClick={() => navigate('/map')}
              className="btn-secondary text-xs flex items-center gap-1.5"
            >
              🗺 View Map
            </button>
          </div>
        </div>

        {/* Data source banner — shown when mock data is active */}
        {source === 'mock' && !loading && (
          <div className="mb-5 px-4 py-3 bg-yellow-500/10 border border-yellow-500/30
                          rounded-lg text-yellow-300 text-xs font-body flex items-start gap-2">
            <span className="shrink-0 mt-0.5">⚠</span>
            <span>
              <strong>Demo data shown.</strong> The live API at{' '}
              <code className="text-yellow-200">backend.jotish.in</code> could not be reached
              (CORS or network). The Vite proxy (<code>/api/*</code>) is configured — make sure
              the dev server is running with <code>npm run dev</code> to enable the proxy.
              Real API data will appear automatically once the proxy resolves the request.
            </span>
          </div>
        )}

        {/* Source confirmed from real API */}
        {source === 'api' && !loading && (
          <div className="mb-5 px-4 py-2 bg-brand-500/10 border border-brand-500/20
                          rounded-lg text-brand-400 text-xs font-body">
            ✓ Live data loaded from API — {employees.length} records
          </div>
        )}

        {/* Search + toggle row */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">🔍</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, department, city…"
              className="input-field pl-9"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2
                           text-gray-500 hover:text-white text-xs transition-colors"
              >
                ✕
              </button>
            )}
          </div>

          {/* View mode toggle */}
          <div className="flex items-center bg-surface-700 border border-surface-500 rounded-lg p-1 gap-1 shrink-0">
            <ToggleBtn
              active={viewMode === VIEW_TABLE}
              onClick={() => setViewMode(VIEW_TABLE)}
              label="⊞ Table"
            />
            <ToggleBtn
              active={viewMode === VIEW_CARDS}
              onClick={() => setViewMode(VIEW_CARDS)}
              label="⊟ Cards"
            />
          </div>
        </div>

        {/* States */}
        {loading && <Spinner message="Loading employees…" />}

        {error && !loading && (
          <div className="card p-6 text-center space-y-3">
            <p className="text-red-400 text-sm font-body">{error}</p>
            <button onClick={refetch} className="btn-primary text-xs">Retry</button>
          </div>
        )}

        {/* Table view */}
        {!loading && !error && viewMode === VIEW_TABLE && (
          <EmployeeTable employees={filtered} />
        )}

        {/* Cards view */}
        {!loading && !error && viewMode === VIEW_CARDS && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.length === 0 ? (
              <p className="col-span-full text-center py-20 text-gray-500 text-sm font-body">
                No employees match your search.
              </p>
            ) : (
              filtered.map((emp, i) => (
                <EmployeeCard key={emp.id ?? i} employee={emp} index={i} />
              ))
            )}
          </div>
        )}
      </main>
    </>
  )
}

function ToggleBtn({ active, onClick, label }) {
  return (
    <button
      onClick={onClick}
      className={[
        'px-3 py-1.5 rounded-md text-xs font-body transition-all duration-150',
        active
          ? 'bg-brand-500/15 text-brand-400 border border-brand-400/30'
          : 'text-gray-400 hover:text-white',
      ].join(' ')}
    >
      {label}
    </button>
  )
}
