// src/pages/MapView.jsx
// Protected route: /map
// Plots employee cities on an interactive Leaflet map.
// Each marker shows a popup with the employee's name, role, and salary.

import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet'
import L from 'leaflet'

import Navbar from '../components/Navbar'
import Spinner from '../components/Spinner'
import { useEmployees } from '../hooks/useEmployees'

// Fix Leaflet's missing default marker icon paths (Vite/Webpack asset issue)
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

// A tiny set of approximate lat/lng for common US cities.
// In production this would come from a geocoding API.
const CITY_COORDS = {
  'New York':    [40.7128,  -74.0060],
  'San Francisco': [37.7749, -122.4194],
  'Austin':      [30.2672,  -97.7431],
  'Seattle':     [47.6062,  -122.3321],
  'Chicago':     [41.8781,  -87.6298],
  'Boston':      [42.3601,  -71.0589],
  'Denver':      [39.7392,  -104.9903],
  'Portland':    [45.5231,  -122.6765],
  'Miami':       [25.7617,  -80.1918],
  'Phoenix':     [33.4484,  -112.0740],
  'Dallas':      [32.7767,  -96.7970],
  'Atlanta':     [33.7490,  -84.3880],
  'Los Angeles': [34.0522,  -118.2437],
  'Houston':     [29.7604,  -95.3698],
  'Philadelphia':[39.9526,  -75.1652],
  'Nashville':   [36.1627,  -86.7816],
  'Las Vegas':   [36.1699,  -115.1398],
  'Minneapolis': [44.9778,  -93.2650],
}

const DEFAULT_CENTER = [39.5, -98.35]
const DEFAULT_ZOOM   = 4

export default function MapView() {
  const navigate = useNavigate()
  const { employees, loading, error, refetch } = useEmployees()

  // Build a list of employees with known coordinates
  const markers = useMemo(() => {
    return employees.reduce((acc, emp) => {
      const city   = emp.city ?? emp.location ?? ''
      const coords = CITY_COORDS[city]
      if (coords) {
        acc.push({
          ...emp,
          lat:  coords[0],
          lng:  coords[1],
          name: emp.name        ?? emp.emp_name  ?? 'Unknown',
          role: emp.designation ?? emp.role      ?? '—',
          city,
          salary: emp.salary    ?? emp.emp_salary ?? 0,
        })
      }
      return acc
    }, [])
  }, [employees])

  // Count unique mapped cities
  const mappedCities = useMemo(() => {
    const unique = new Set(markers.map((m) => m.city))
    return unique.size
  }, [markers])

  return (
    <>
      <Navbar />

      <main className="page-wrapper">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="font-display font-bold text-2xl text-white">Employee Map</h1>
            <p className="text-gray-500 text-sm font-body mt-0.5">
              {loading
                ? 'Fetching locations…'
                : `${markers.length} employees across ${mappedCities} cities`}
            </p>
          </div>
          <button onClick={() => navigate('/list')} className="btn-secondary text-xs">
            ← Back to List
          </button>
        </div>

        {loading && <Spinner message="Loading map data…" />}

        {error && !loading && (
          <div className="card p-6 text-center space-y-3">
            <p className="text-red-400 text-sm font-body">{error}</p>
            <button onClick={refetch} className="btn-primary text-xs">Retry</button>
          </div>
        )}

        {/* Map */}
        {!loading && !error && (
          <div className="card overflow-hidden" style={{ height: '520px' }}>
            <MapContainer
              center={DEFAULT_CENTER}
              zoom={DEFAULT_ZOOM}
              style={{ width: '100%', height: '100%' }}
              scrollWheelZoom
            >
              {/* Dark-ish tile layer (CartoDB Positron) */}
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://carto.com/">CARTO</a>'
              />

              {markers.map((emp, idx) => (
                <CircleMarker
                  key={idx}
                  center={[emp.lat, emp.lng]}
                  radius={8}
                  pathOptions={{
                    fillColor:   '#22c55e',
                    fillOpacity: 0.85,
                    color:       '#16a34a',
                    weight:      2,
                  }}
                >
                  <Popup>
                    <div className="font-body text-sm min-w-[160px]">
                      <p className="font-bold text-gray-900">{emp.name}</p>
                      <p className="text-gray-500 text-xs mt-0.5">{emp.role}</p>
                      <hr className="my-2 border-gray-200" />
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">📍 {emp.city}</span>
                        {emp.salary > 0 && (
                          <span className="text-green-600 font-medium">
                            ${Number(emp.salary).toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}
            </MapContainer>
          </div>
        )}

        {/* Legend */}
        {!loading && !error && markers.length === 0 && (
          <p className="text-center text-gray-500 text-sm font-body mt-6">
            No employee cities could be mapped. The API may not include location data.
          </p>
        )}
      </main>
    </>
  )
}
