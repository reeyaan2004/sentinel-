import { useState } from 'react'
import { motion } from 'framer-motion'
import type { ScanResult } from '../types'
import { API_BASE, EXAMPLE_INPUTS } from '../constants'

export default function HomeTab({ onResult, isScanning, setIsScanning }: {
  onResult: (r: ScanResult) => void
  isScanning: boolean
  setIsScanning: (v: boolean) => void
}) {
  const [input, setInput] = useState('')
  const [error, setError] = useState('')

  async function handleAnalyze() {
    if (!input.trim() || isScanning) return
    setIsScanning(true)
    setError('')
    try {
      const res = await fetch(`${API_BASE}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input.trim() }),
      })
      if (!res.ok) throw new Error(`Server error: ${res.status}`)
      const data: ScanResult = await res.json()
      // If verdict is dangerous, update the extension badge
      if (data.verdict === 'DANGEROUS') {
        chrome.runtime.sendMessage({ type: 'SET_BADGE_THREAT' })
      }
      onResult(data)
    } catch (e: any) {
      setError(e.message || 'Could not reach Sentinel backend.')
    } finally {
      setIsScanning(false)
    }
  }

  async function handleScanPage() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
      if (!tab.id) return
      const results = await chrome.tabs.sendMessage(tab.id, { type: 'SCAN_PAGE' })
      if (results) {
        const text = `PAGE SCAN
URL: ${results.url}
Title: ${results.title}
Has login form: ${results.hasLoginForm}
Has password field: ${results.hasPasswordField}
Links on page:
${results.links.join('\n')}
Page content snippet:
${results.pageText}`
        setInput(text)
      }
    } catch {
      setError('Could not scan page. Try refreshing the tab first.')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
    >
      {/* Label */}
      <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', fontWeight: 800, letterSpacing: 2 }}>
        PASTE ANYTHING SUSPICIOUS
      </div>

      {/* Textarea */}
      <div style={{ position: 'relative' }}>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={"Paste an email, URL, text message, or job offer.\n\nSentinel will analyze it across 8 threat vectors using Gemini AI and explain exactly what's happening."}
          style={{
            width: '100%',
            height: 160,
            background: 'rgba(6, 13, 26, 0.8)',
            border: '1px solid rgba(0,200,255,0.12)',
            borderRadius: 12,
            color: 'rgba(255,255,255,0.85)',
            fontSize: 11,
            padding: '10px 12px',
            lineHeight: 1.65,
            transition: 'border-color 0.15s',
          }}
          onFocus={e => (e.target.style.borderColor = 'rgba(0,200,255,0.4)')}
          onBlur={e => (e.target.style.borderColor = 'rgba(0,200,255,0.12)')}
        />
        {input && (
          <button
            onClick={() => setInput('')}
            style={{
              position: 'absolute', top: 8, right: 8,
              width: 18, height: 18, borderRadius: '50%',
              background: 'rgba(255,255,255,0.08)',
              color: 'rgba(255,255,255,0.4)',
              fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >✕</button>
        )}
      </div>

      {/* Error */}
      {error && (
        <div style={{ fontSize: 10, color: '#FF4D6D', padding: '6px 10px', background: 'rgba(255,77,109,0.08)', borderRadius: 8, border: '1px solid rgba(255,77,109,0.2)' }}>
          ⚠ {error}
        </div>
      )}

      {/* Analyze button */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={handleAnalyze}
        disabled={isScanning || !input.trim()}
        style={{
          width: '100%',
          padding: '12px',
          borderRadius: 12,
          border: `1px solid ${isScanning || !input.trim() ? 'rgba(0,200,255,0.15)' : 'rgba(0,200,255,0.4)'}`,
          background: isScanning ? 'rgba(0,200,255,0.04)' : 'rgba(0,200,255,0.12)',
          color: isScanning || !input.trim() ? 'rgba(0,200,255,0.4)' : '#00C8FF',
          fontWeight: 800,
          fontSize: 13,
          transition: 'all 0.15s',
          boxShadow: !isScanning && input.trim() ? '0 0 24px rgba(0,200,255,0.18)' : 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}
      >
        {isScanning ? (
          <>
            <span style={{ display: 'inline-block', animation: 'spin 0.8s linear infinite' }}>⟳</span>
            Gemini is analyzing...
          </>
        ) : '🛡️  Analyze with Sentinel'}
      </motion.button>

      {/* Example inputs */}
      <div style={{ display: 'flex', gap: 6 }}>
        {(Object.keys(EXAMPLE_INPUTS) as (keyof typeof EXAMPLE_INPUTS)[]).map((key) => (
          <button
            key={key}
            onClick={() => setInput(EXAMPLE_INPUTS[key])}
            style={{
              flex: 1, padding: '6px 4px',
              borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'transparent',
              color: 'rgba(255,255,255,0.35)',
              fontSize: 9, fontWeight: 700,
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => {
              (e.currentTarget.style.borderColor = 'rgba(0,200,255,0.3)')
              ;(e.currentTarget.style.color = '#00C8FF')
            }}
            onMouseLeave={e => {
              (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')
              ;(e.currentTarget.style.color = 'rgba(255,255,255,0.35)')
            }}
          >
            {key === 'phishing' ? '🎣 Phishing' : key === 'job_scam' ? '💼 Job Scam' : '✅ Safe'}
          </button>
        ))}
      </div>

      {/* Scan current page */}
      <div className="glass" style={{ padding: '10px 12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', fontWeight: 800, letterSpacing: 1.5, marginBottom: 3 }}>
              SCAN CURRENT PAGE
            </div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>
              Automatically extract and analyze the active tab
            </div>
          </div>
          <button
            onClick={handleScanPage}
            style={{
              padding: '6px 12px', borderRadius: 8,
              border: '1px solid rgba(0,200,255,0.25)',
              background: 'rgba(0,200,255,0.08)',
              color: '#00C8FF', fontSize: 10, fontWeight: 800,
              flexShrink: 0, marginLeft: 8,
            }}
          >
            Scan
          </button>
        </div>
      </div>
    </motion.div>
  )
}