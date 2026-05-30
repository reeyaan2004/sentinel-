import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ActionCard from './ActionCard'
import type { Action } from '../types'
import { API_BASE } from '../constants'

export default function ActionFeed({ scanId, verdict }: { scanId: string; verdict: string }) {
  const [actions, setActions] = useState<Action[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fireProtect() {
      try {
        // Show running state first for dramatic effect
        const runningActions: Action[] = [
          { sponsor: 'NordVPN', text: 'Checking domain against threat database...', status: 'running' },
          { sponsor: 'NordProtect', text: 'Running identity exposure check...', status: 'running' },
          { sponsor: 'Incogni', text: 'Scanning data broker lists for your email...', status: 'running' },
          { sponsor: 'NordPass', text: 'Checking credential breach status...', status: 'running' },
        ]
        setActions(runningActions)
        setLoading(false)

        // Hit the backend
        const res = await fetch(`${API_BASE}/protect`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ scan_id: scanId, verdict }),
        })
        const data = await res.json()

        // Reveal results with a stagger
        for (let i = 0; i < data.actions.length; i++) {
          await new Promise(r => setTimeout(r, 600))
          setActions(prev => {
            const updated = [...prev]
            updated[i] = { ...data.actions[i], status: 'done' }
            return updated
          })
        }
      } catch {
        setLoading(false)
      }
    }
    fireProtect()
  }, [scanId, verdict])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ marginTop: 4 }}
    >
      <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', fontWeight: 800, letterSpacing: 2, marginBottom: 8 }}>
        SENTINEL IS ACTING
      </div>
      <AnimatePresence>
        {actions.map((action, i) => (
          <ActionCard key={action.sponsor} action={action} index={i} />
        ))}
      </AnimatePresence>
    </motion.div>
  )
}