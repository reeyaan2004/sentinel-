import { motion } from 'framer-motion'
import type { Vectors, Verdict } from '../types'
import { VECTOR_LABELS } from '../constants'

const VECTOR_KEYS = [
  'urgency_manipulation',
  'domain_spoofing',
  'credential_harvesting',
  'impersonation',
  'emotional_manipulation',
  'url_anomalies',
  'attack_patterns',
  'linguistic_tells',
] as const

const CX = 105
const CY = 105
const MAX_R = 78

function toCartesian(angleDeg: number, r: number) {
  const rad = (angleDeg - 90) * (Math.PI / 180)
  return {
    x: CX + r * Math.cos(rad),
    y: CY + r * Math.sin(rad),
  }
}

function verdictColor(verdict: Verdict) {
  if (verdict === 'DANGEROUS')  return '#FF4D6D'
  if (verdict === 'SUSPICIOUS') return '#FFB347'
  return '#00E5A0'
}

export default function ThreatRadar({ vectors, score, verdict }: {
  vectors: Vectors
  score: number
  verdict: Verdict
}) {
  const color = verdictColor(verdict)
  const n = VECTOR_KEYS.length
  const step = 360 / n

  // Compute the polygon points from vector scores (0–10)
  const pts = VECTOR_KEYS.map((key, i) => {
    const val = Math.min(10, Math.max(0, vectors[key] ?? 0)) / 10
    return toCartesian(i * step, val * MAX_R)
  })

  const polygonPoints = pts.map(p => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' ')

  // Ring radii at 25%, 50%, 75%, 100%
  const rings = [0.25, 0.5, 0.75, 1.0]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
      <svg
        width={210}
        height={210}
        viewBox="0 0 210 210"
        style={{ overflow: 'visible' }}
      >
        {/* Rings */}
        {rings.map((r) => (
          <circle
            key={r}
            cx={CX} cy={CY}
            r={r * MAX_R}
            fill="none"
            stroke="rgba(0,200,255,0.08)"
            strokeWidth={1}
          />
        ))}

        {/* Spokes */}
        {VECTOR_KEYS.map((_, i) => {
          const outer = toCartesian(i * step, MAX_R)
          return (
            <line
              key={i}
              x1={CX} y1={CY}
              x2={outer.x} y2={outer.y}
              stroke="rgba(0,200,255,0.12)"
              strokeWidth={1}
            />
          )
        })}

        {/* Glow blur layer behind the polygon */}
        <motion.polygon
          points={polygonPoints}
          fill={`${color}18`}
          stroke="none"
          filter={`blur(6px)`}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          style={{ transformOrigin: `${CX}px ${CY}px` }}
        />

        {/* Main filled polygon */}
        <motion.polygon
          points={polygonPoints}
          fill={`${color}22`}
          stroke={color}
          strokeWidth={1.5}
          strokeLinejoin="round"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ transformOrigin: `${CX}px ${CY}px` }}
        />

        {/* Vertex dots */}
        {pts.map((p, i) => (
          <motion.circle
            key={i}
            cx={p.x} cy={p.y}
            r={2.5}
            fill={color}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.85 + i * 0.04, duration: 0.2 }}
            style={{ transformOrigin: `${p.x}px ${p.y}px` }}
          />
        ))}

        {/* Center glow disc */}
        <circle
          cx={CX} cy={CY}
          r={26}
          fill={`${color}12`}
          style={{ filter: `blur(10px)` }}
        />

        {/* Center score number */}
        <motion.text
          x={CX} y={CY - 5}
          textAnchor="middle"
          fill={color}
          fontSize={30}
          fontWeight={900}
          fontFamily="Nunito"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{ filter: `drop-shadow(0 0 10px ${color})` }}
        >
          {score}
        </motion.text>
        <motion.text
          x={CX} y={CY + 13}
          textAnchor="middle"
          fill="rgba(255,255,255,0.35)"
          fontSize={7}
          fontWeight={800}
          fontFamily="Nunito"
          letterSpacing={1.5}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          THREAT SCORE
        </motion.text>

        {/* Spoke labels */}
        {VECTOR_KEYS.map((key, i) => {
          const labelPos = toCartesian(i * step, MAX_R + 16)
          return (
            <text
              key={key}
              x={labelPos.x}
              y={labelPos.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="rgba(255,255,255,0.38)"
              fontSize={6.5}
              fontWeight={700}
              fontFamily="Nunito"
            >
              {VECTOR_LABELS[key]}
            </text>
          )
        })}
      </svg>

      {/* Verdict badge */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.3 }}
        style={{
          padding: '5px 20px',
          borderRadius: 20,
          border: `1px solid ${color}`,
          background: `${color}15`,
          color: color,
          fontWeight: 900,
          fontSize: 11,
          letterSpacing: 3,
          boxShadow: `0 0 18px ${color}40`,
        }}
      >
        {verdict}
      </motion.div>
    </div>
  )
}