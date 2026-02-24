// src/pages/Graph.jsx
// Protected route: /graph
// Displays a responsive bar chart of the top 10 employees' salaries using Recharts.

import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, LabelList,
} from 'recharts'

import Navbar from '../components/Navbar'
import Spinner from '../components/Spinner'
import { useEmployees } from '../hooks/useEmployees'

// Bar fill colours — cycles through these for visual variety
const BAR_COLOURS = [
  '#22c55e', '#3b82f6', '#ec4899', '#f59e0b',
  '#8b5cf6', '#06b6d4', '#f97316', '#10b981',
  '#e11d48', '#6366f1',
]

/** Custom tooltip rendered inside the chart */
function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const { name, salary } = payload[0].payload
  return (
    <div className="bg-surface-800 border border-surface-500 rounded-lg px-4 py-3 text-sm font-body shadow-xl">
      <p className="text-white font-medium">{name}</p>
      <p className="text-brand-400 mt-1">${Number(salary).toLocaleString()} / yr</p>
    </div>
  )
}

export default function Graph() {
  const navigate = useNavigate()
  const { employees, loading, error, refetch } = useEmployees()

  // Take first 10 and build chart-ready data
  const chartData = useMemo(() => {
    return employees.slice(0, 10).map((emp) => ({
      // Short first name for X-axis label
      name:       (emp.name ?? emp.emp_name ?? '?').split(' ')[0],
      fullName:   emp.name ?? emp.emp_name ?? '?',
      salary:     Number(emp.salary ?? emp.emp_salary ?? 0),
      department: emp.department ?? emp.dept ?? '',
    }))
  }, [employees])

  const maxSalary  = Math.max(...chartData.map((d) => d.salary), 0)
  const totalPay   = chartData.reduce((sum, d) => sum + d.salary, 0)
  const avgSalary  = chartData.length ? Math.round(totalPay / chartData.length) : 0

  return (
    <>
      <Navbar />

      <main className="page-wrapper">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="font-display font-bold text-2xl text-white">Salary Overview</h1>
            <p className="text-gray-500 text-sm font-body mt-0.5">
              Annual compensation for the first 10 employees
            </p>
          </div>
          <button onClick={() => navigate('/list')} className="btn-secondary text-xs">
            ← Back to List
          </button>
        </div>

        {/* Summary stat cards */}
        {!loading && !error && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
            <StatCard label="Employees shown" value={chartData.length} />
            <StatCard label="Average salary" value={`$${avgSalary.toLocaleString()}`} accent />
            <StatCard label="Highest salary" value={`$${maxSalary.toLocaleString()}`} />
          </div>
        )}

        {loading && <Spinner message="Loading salary data…" />}

        {error && !loading && (
          <div className="card p-6 text-center space-y-3">
            <p className="text-red-400 text-sm font-body">{error}</p>
            <button onClick={refetch} className="btn-primary text-xs">Retry</button>
          </div>
        )}

        {/* Bar chart */}
        {!loading && !error && (
          <div className="card p-6">
            <h2 className="font-display font-semibold text-white mb-6">
              Salary Distribution — Top 10
            </h2>

            <ResponsiveContainer width="100%" height={380}>
              <BarChart data={chartData} margin={{ top: 30, right: 20, left: 10, bottom: 20 }}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.05)"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#6b7280', fontSize: 12, fontFamily: 'DM Mono' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={(v) => `$${v / 1000}k`}
                  tick={{ fill: '#6b7280', fontSize: 11, fontFamily: 'DM Mono' }}
                  axisLine={false}
                  tickLine={false}
                  width={52}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                <Bar dataKey="salary" radius={[6, 6, 0, 0]} maxBarSize={56}>
                  {/* Value label on top of each bar */}
                  <LabelList
                    dataKey="salary"
                    position="top"
                    formatter={(v) => `$${Math.round(v / 1000)}k`}
                    style={{ fill: '#9ca3af', fontSize: 10, fontFamily: 'DM Mono' }}
                  />
                  {chartData.map((_, idx) => (
                    <Cell key={idx} fill={BAR_COLOURS[idx % BAR_COLOURS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </main>
    </>
  )
}

/** Small stat card used above the chart */
function StatCard({ label, value, accent = false }) {
  return (
    <div className="card p-4">
      <p className="text-[10px] uppercase tracking-widest text-gray-500 font-body mb-1">{label}</p>
      <p className={`font-display font-bold text-xl ${accent ? 'text-brand-400' : 'text-white'}`}>
        {value}
      </p>
    </div>
  )
}
