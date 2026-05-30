import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ELI5Toggle({ summary, eli5 }: { summary: string; eli5: string }) {
  const [showELI5, setShowELI5] = useState(false)
  return (
    <div className="glass" style={{ padding: '12px 14px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', fontWeight: 800, letterSpacing: 1.5 }}>
          {showELI5 ? 'PLAIN ENGLISH' : 'ANALYSIS'}
        </span>
        <button
          onClick={() => setShowELI5(!showELI5)}
          style={{
            padding: '3px 10px', borderRadius: 20,
            border: `1px solid ${showELI5 ? 'rgba(0,200,255,0.4)' : 'rgba(255,255,255,0.1)'}`,
            background: showELI5 ? 'rgba(0,200,255,0.12)' : 'transparent',
            color: showELI5 ? '#00C8FF' : 'rgba(255,255,255,0.35)',
            fontSize: 8, fontWeight: 800, letterSpacing: 1,
          }}
        >
          ELI5
        </button>
      </div>
      <AnimatePresence mode="wait">
        <motion.p
          key={showELI5 ? 'eli5' : 'summary'}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.15 }}
          style={{
            fontSize: 11,
            lineHeight: 1.65,
            color: showELI5 ? '#00C8FF' : 'rgba(255,255,255,0.7)',
            fontStyle: showELI5 ? 'italic' : 'normal',
          }}
        >
          {showELI5 ? `"${eli5}"` : summary}
        </motion.p>
      </AnimatePresence>
    </div>
  )
}