import { motion } from 'framer-motion'
import type { Action } from '../types'
import { SPONSOR_COLORS } from '../constants'

export default function ActionCard({ action, index }: { action: Action; index: number }) {
  const color = SPONSOR_COLORS[action.sponsor] || '#00C8FF'
  const isDone = action.status === 'done'
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.15, duration: 0.3 }}
      style={{
        display: 'flex', alignItems: 'flex-start', gap: 10,
        padding: '9px 11px',
        borderRadius: 10,
        background: `${color}08`,
        border: `1px solid ${color}20`,
        marginBottom: 6,
      }}
    >
      <div style={{
        width: 22, height: 22, borderRadius: '50%',
        border: `2px solid ${color}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, marginTop: 1,
        boxShadow: isDone ? `0 0 10px ${color}50` : 'none',
      }}>
        {isDone
          ? <span style={{ fontSize: 10, color }}>✓</span>
          : <span style={{ fontSize: 10, color, display: 'inline-block', animation: 'spin 1s linear infinite' }}>⟳</span>
        }
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 9, fontWeight: 900, color, letterSpacing: 0.8, marginBottom: 3 }}>
          {action.sponsor}
        </div>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.65)', lineHeight: 1.5 }}>
          {action.text}
        </div>
      </div>
    </motion.div>
  )
}