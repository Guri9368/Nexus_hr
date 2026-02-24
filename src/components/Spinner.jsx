// src/components/Spinner.jsx
// Reusable animated loading indicator.

import React from 'react'

export default function Spinner({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-gray-400">
      {/* Rotating ring */}
      <div className="w-10 h-10 rounded-full border-2 border-surface-500 border-t-brand-400 animate-spin-slow" />
      <p className="text-sm font-body">{message}</p>
    </div>
  )
}
