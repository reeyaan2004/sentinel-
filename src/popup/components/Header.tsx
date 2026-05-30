export default function Header() {
  return (
    <div style={{
      padding: '14px 16px 0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          width: 28, height: 28,
          background: 'rgba(0,200,255,0.12)',
          border: '1px solid rgba(0,200,255,0.3)',
          borderRadius: 8,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14,
          boxShadow: '0 0 12px rgba(0,200,255,0.2)',
        }}>
          🛡️
        </div>
        <div>
          <div style={{ fontWeight: 900, fontSize: 16, color: '#00C8FF', letterSpacing: '-0.3px', lineHeight: 1 }}>
            Sentinel
          </div>
          <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.3)', fontWeight: 700, letterSpacing: 1.5 }}>
            AI SECURITY AGENT
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div className="pulse" style={{
          width: 6, height: 6, borderRadius: '50%',
          background: '#00E5A0',
          boxShadow: '0 0 6px #00E5A0',
        }} />
        <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', fontWeight: 700 }}>WATCHING</span>
      </div>
    </div>
  )
}