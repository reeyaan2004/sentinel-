import type { Tab } from '../types'

const TABS: { id: Tab; label: string; emoji: string }[] = [
  { id: 'home',    label: 'Analyze', emoji: '🔍' },
  { id: 'results', label: 'Results', emoji: '📡' },
  { id: 'monitor', label: 'Monitor', emoji: '👁️' },
]

export default function TabBar({ active, onChange, hasResult }: {
  active: Tab
  onChange: (t: Tab) => void
  hasResult: boolean
}) {
  return (
    <div style={{
      display: 'flex',
      gap: 4,
      padding: '10px 12px 0',
      borderBottom: '1px solid rgba(0,200,255,0.08)',
      marginBottom: 2,
    }}>
      {TABS.map((tab) => {
        const isActive = active === tab.id
        const disabled = tab.id === 'results' && !hasResult
        return (
          <button
            key={tab.id}
            onClick={() => !disabled && onChange(tab.id)}
            disabled={disabled}
            style={{
              flex: 1,
              padding: '7px 4px 8px',
              borderRadius: '10px 10px 0 0',
              border: isActive ? '1px solid rgba(0,200,255,0.2)' : '1px solid transparent',
              borderBottom: isActive ? '1px solid #0A1628' : '1px solid transparent',
              background: isActive ? 'rgba(0,200,255,0.09)' : 'transparent',
              color: isActive ? '#00C8FF' : disabled ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.45)',
              fontWeight: 800,
              fontSize: 10,
              letterSpacing: 0.5,
              cursor: disabled ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
            }}
          >
            <span style={{ fontSize: 13 }}>{tab.emoji}</span>
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}