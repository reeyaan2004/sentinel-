import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { API_BASE } from '../constants'
declare const chrome: any

type Breach = {
  breach_name: string
  date: string
  description: string
  action: string
}

export default function MonitorTab() {
  const [email, setEmail] = useState('')
  const [savedEmail, setSavedEmail] = useState('')
  const [breaches, setBreaches] = useState<Breach[]>([])
  const [loading, setLoading] = useState(false)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    chrome.storage.local.get(['monitorEmail'], (data) => {
      if (data.monitorEmail) {
        setSavedEmail(data.monitorEmail)
        setEmail(data.monitorEmail)
        checkBreaches(data.monitorEmail)
      }
    })
  }, [])

  async function checkBreaches(emailToCheck: string) {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/monitor?email=${encodeURIComponent(emailToCheck)}`)
      const data = await res.json()
      setBreaches(data.breaches || [])
      setChecked(true)
    } catch {
      setBreaches([])
      setChecked(true)
    } finally {
      setLoading(false)
    }
  }

  function saveAndCheck() {
    if (!email.trim()) return
    chrome.storage.local.set({ monitorEmail: email.trim() })
    setSavedEmail(email.trim())
    checkBreaches(email.trim())
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
    >
      {/* Monitor status bar */}
      <div className="glass" style={{ padding: '10px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: savedEmail ? 8 : 0 }}>
          <div>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', fontWeight: 800, letterSpacing: 1.5, marginBottom: 2 }}>
              EMAIL MONITOR
            </div>
            <div style={{ fontSize: 11, color: savedEmail ? '#00E5A0' : 'rgba(255,255,255,0.4)' }}>
              {savedEmail ? `Watching: ${savedEmail}` : 'No email configured'}
            </div>
          </div>
          {savedEmail && (
            <div className="pulse" style={{
              width: 8, height: 8, borderRadius: '50%',
              background: '#00E5A0', boxShadow: '0 0 8px #00E5A0',
            }} />
          )}
        </div>
      </div>

      {/* Email input */}
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && saveAndCheck()}
          placeholder="your@email.com"
          style={{
            flex: 1, padding: '9px 12px',
            borderRadius: 10,
            border: '1px solid rgba(0,200,255,0.15)',
            background: 'rgba(6,13,26,0.8)',
            color: 'white', fontSize: 11,
            outline: 'none',
            transition: 'border-color 0.15s',
          }}
          onFocus={e => (e.target.style.borderColor = 'rgba(0,200,255,0.4)')}
          onBlur={e => (e.target.style.borderColor = 'rgba(0,200,255,0.15)')}
        />
        <button
          onClick={saveAndCheck}
          disabled={loading || !email.trim()}
          style={{
            padding: '9px 14px', borderRadius: 10,
            border: '1px solid rgba(0,200,255,0.3)',
            background: 'rgba(0,200,255,0.1)',
            color: '#00C8FF', fontSize: 11, fontWeight: 800,
            opacity: loading || !email.trim() ? 0.5 : 1,
          }}
        >
          {loading ? '...' : 'Check'}
        </button>
      </div>

      {/* Breach results */}
      {checked && breaches.length === 0 && (
        <div className="glass" style={{ padding: '16px 14px', textAlign: 'center' }}>
          <div style={{ fontSize: 24, marginBottom: 8 }}>✅</div>
          <div style={{ fontSize: 12, color: '#00E5A0', fontWeight: 800 }}>No breaches found</div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>
            {savedEmail} does not appear in any known data breaches
          </div>
        </div>
      )}

      {breaches.map((breach, i) => (
        <motion.div
          key={i}
          className="glass"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          style={{ padding: '12px 14px', borderColor: 'rgba(255,179,71,0.2)' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
            <div style={{ fontSize: 12, color: '#FFB347', fontWeight: 800 }}>
              {breach.breach_name}
            </div>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', fontWeight: 700 }}>
              {breach.date}
            </div>
          </div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', lineHeight: 1.55, marginBottom: 8 }}>
            {breach.description}
          </div>
          <div style={{
            fontSize: 10, color: '#FFB347', padding: '6px 10px',
            background: 'rgba(255,179,71,0.08)',
            border: '1px solid rgba(255,179,71,0.2)',
            borderRadius: 8, lineHeight: 1.5,
          }}>
            → {breach.action}
          </div>
        </motion.div>
      ))}

      {/* What Sentinel monitors */}
      <div className="glass" style={{ padding: '10px 14px' }}>
        <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.25)', fontWeight: 800, letterSpacing: 1.5, marginBottom: 8 }}>
          SENTINEL MONITORS FOR
        </div>
        {[
          '🔐 Known data breaches',
          '📧 Email exposure on dark web',
          '🔑 Credential compromise',
          '🌐 Suspicious activity patterns',
        ].map((item, i) => (
          <div key={i} style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', marginBottom: 5 }}>{item}</div>
        ))}
      </div>
    </motion.div>
  )
}