// src/components/CameraCapture.jsx
// Self-contained webcam UI.
// Renders a live preview and a "Take Photo" button.
// Calls onCapture(imageSrc) with a base64 PNG when the user snaps a picture.

import React, { useRef, useState, useCallback } from 'react'
import Webcam from 'react-webcam'

// Webcam constraints — prefer front camera on mobile
const VIDEO_CONSTRAINTS = {
  width:       { ideal: 1280 },
  height:      { ideal: 720 },
  facingMode:  'user',
}

export default function CameraCapture({ onCapture, onCancel }) {
  const webcamRef = useRef(null)
  const [ready, setReady] = useState(false)
  const [error, setError] = useState(null)

  /** Called by Webcam component once the stream is active */
  const handleUserMedia = useCallback(() => {
    setReady(true)
    setError(null)
  }, [])

  /** Called when the browser denies camera access */
  const handleUserMediaError = useCallback((err) => {
    setError(
      'Camera access was denied. Please allow camera permissions in your browser settings and try again.'
    )
    console.error('Camera error:', err)
  }, [])

  /** Captures a screenshot and passes it to the parent */
  const handleCapture = useCallback(() => {
    if (!webcamRef.current) return
    const imageSrc = webcamRef.current.getScreenshot()
    if (imageSrc) {
      onCapture(imageSrc)
    }
  }, [onCapture])

  return (
    <div className="card p-4 space-y-4">
      {/* Camera viewport */}
      <div className="relative rounded-xl overflow-hidden bg-surface-700 aspect-video
                      flex items-center justify-center">
        {!error ? (
          <>
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/png"
              videoConstraints={VIDEO_CONSTRAINTS}
              onUserMedia={handleUserMedia}
              onUserMediaError={handleUserMediaError}
              className="w-full h-full object-cover"
            />
            {/* Viewfinder overlay when ready */}
            {ready && (
              <div className="absolute inset-4 border border-brand-400/30 rounded-lg pointer-events-none">
                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-brand-400 rounded-tl" />
                <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-brand-400 rounded-tr" />
                <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-brand-400 rounded-bl" />
                <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-brand-400 rounded-br" />
              </div>
            )}
          </>
        ) : (
          <div className="text-center px-6">
            <p className="text-2xl mb-3">📷</p>
            <p className="text-red-400 text-sm font-body">{error}</p>
          </div>
        )}

        {/* Loading shimmer while camera initialises */}
        {!ready && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-surface-700">
            <div className="w-8 h-8 rounded-full border-2 border-surface-500 border-t-brand-400 animate-spin-slow" />
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleCapture}
          disabled={!ready}
          className="btn-primary flex-1 disabled:opacity-40"
        >
          📸 Take Photo
        </button>
        <button onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
      </div>
    </div>
  )
}
