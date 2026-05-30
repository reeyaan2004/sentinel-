import { useState } from 'react'
import type { ScanResult, Tab } from './types'
import TabBar from './components/TabBar'
import HomeTab from './components/HomeTab'
import ResultsTab from './components/ResultsTab'
import MonitorTab from './components/MonitorTab'
import Header from './components/Header'

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('home')
  const [scanResult, setScanResult] = useState<ScanResult | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [actionsFired, setActionsFired] = useState(false)

  function handleResult(r: ScanResult) {
    setScanResult(r)
    setActionsFired(false)
    setActiveTab('results')
  }

  return (
    <div style={{ width: 420, minHeight: 580, position: 'relative', overflow: 'hidden' }}>
      {/* Frutiger Aero layered background */}
      <div className="aero-bg" />
      <div className="aero-overlay" />

      {/* All content sits above the background */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', minHeight: 580 }}>
        <Header />
        <TabBar
          active={activeTab}
          onChange={setActiveTab}
          hasResult={!!scanResult}
        />
        <div style={{ flex: 1, overflowY: 'auto', padding: '10px 12px 16px' }}>
          {activeTab === 'home' && (
            <HomeTab
              onResult={handleResult}
              isScanning={isScanning}
              setIsScanning={setIsScanning}
            />
          )}
          {activeTab === 'results' && scanResult && (
            <ResultsTab
              result={scanResult}
              actionsFired={actionsFired}
              onProtect={() => setActionsFired(true)}
            />
          )}
          {activeTab === 'results' && !scanResult && (
            <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', marginTop: 80, fontSize: 13 }}>
              Run an analysis first
            </div>
          )}
          {activeTab === 'monitor' && <MonitorTab />}
        </div>
      </div>
    </div>
  )
}