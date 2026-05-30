import { useState } from 'react'
import { motion } from 'framer-motion'
import ThreatRadar from './ThreatRadar'
import ELI5Toggle from './ELI5Toggle'
import ActionFeed from './ActionFeed'
import type { ScanResult } from '../types'

function verdictColor(v: string) {
  if (v === 'DANGEROUS')  return '#FF4D6D'
  if (v === 'SUSPICIOUS') return '#FFB347'
  return '#00E5A0'
}

export default function ResultsTab({ result, actionsFired, onProtect }: {
  result: ScanResult
  actionsFired: boolean
  onProtect: () => void
}) {
  const color = verdictColor(result.verdict)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
    >
      <ThreatRadar vectors={result.vectors} score={result.score} verdict={result.verdict} />

      <ELI5Toggle summary={result.summary} eli5={result.eli5} />

      {/* Red flags */}
      {result.red_flags.length > 0 && (
        <div className="glass" style={{ padding: '10px 14px' }}>
          <div style={{ fontSize: 9, color: '#FF4D6D', fontWeight: 800, letterSpacing: 1.5, marginBottom: 8 }}>
            🚨 RED FLAGS DETECTED
          </div>
          {result.red_flags.map((flag, i) => (
            <div key={i} style={{
              fontSize: 10, color: 'rgba(255,255,255,0.65)',
              padding: '4px 0 4px 10px',
              borderLeft: '2px solid rgba(255,77,109,0.5)',
              marginBottom: 4,
              lineHeight: 1.5,
            }}>
              {flag}
            </div>
          ))}
        </div>
      )}

      {/* Action plan */}
      {result.action_plan.length > 0 && (
        <div className="glass" style={{ padding: '10px 14px' }}>
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', fontWeight: 800, letterSpacing: 1.5, marginBottom: 8 }}>
            WHAT TO DO NOW
          </div>
          {result.action_plan.map((step, i) => (
            <div key={i} style={{
              fontSize: 10, color: 'rgba(255,255,255,0.65)',
              display: 'flex', gap: 8, alignItems: 'flex-start',
              marginBottom: 5, lineHeight: 1.5,
            }}>
              <span style={{ color, fontWeight: 900, flexShrink: 0 }}>{i + 1}.</span>
              {step}
            </div>
          ))}
        </div>
      )}

      {/* Protect me button */}
      {!actionsFired && result.verdict !== 'SAFE' && (
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onProtect}
          style={{
            width: '100%', padding: '12px',
            borderRadius: 12,
            border: `1px solid ${color}`,
            background: `${color}15`,
            color: color,
            fontWeight: 800, fontSize: 13,
            boxShadow: `0 0 24px ${color}35`,
            transition: 'all 0.15s',
          }}
        >
          ⚡ Protect Me — Trigger All Actions
        </motion.button>
      )}

      {/* Action feed appears after protect is clicked */}
      {actionsFired && (
        <ActionFeed scanId={result.scan_id} verdict={result.verdict} />
      )}
    </motion.div>
  )
}