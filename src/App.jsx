// src/App.jsx
// Root component — defines all application routes.
//
// Route hierarchy:
//   /              → Login (public)
//   /list          → List (protected)
//   /details/:id   → Details (protected)
//   /photo         → PhotoResult (protected)
//   /graph         → Graph (protected)
//   /map           → MapView (protected)

import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import ProtectedRoute from './components/ProtectedRoute'

// Pages
import Login       from './pages/Login'
import List        from './pages/List'
import Details     from './pages/Details'
import PhotoResult from './pages/PhotoResult'
import Graph       from './pages/Graph'
import MapView     from './pages/MapView'

export default function App() {
  return (
    <Routes>
      {/* Public route */}
      <Route path="/" element={<Login />} />

      {/* Protected routes — wrapped in a single ProtectedRoute outlet */}
      <Route element={<ProtectedRoute />}>
        <Route path="/list"         element={<List />} />
        <Route path="/details/:id"  element={<Details />} />
        <Route path="/photo"        element={<PhotoResult />} />
        <Route path="/graph"        element={<Graph />} />
        <Route path="/map"          element={<MapView />} />
      </Route>

      {/* Catch-all — redirect unknown paths to login */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
