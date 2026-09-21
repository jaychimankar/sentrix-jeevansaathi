import React from 'react'
import { Scene } from './components/3d/Scene'
import { Dashboard } from './components/ui/Dashboard'
import { Panels } from './components/ui/Panels'
import { GrandparentView } from './components/ui/GrandparentView'
import { CaregiverView } from './components/ui/CaregiverView'
import { useStore } from './store'

function App() {
  const { activeTab } = useStore()

  const isGrandparentMode = activeTab === 'GRANDPARENT'
  const isCaregiverMode = activeTab === 'CAREGIVER'

  return (
    <div className="w-screen h-screen overflow-hidden bg-[#f5f5f7] text-[#1a1a2e] selection:bg-blue-200 font-sans relative">
      {/* 3D WebGL Canvas Scene */}
      <Scene />

      {/* Primary Dashboard Navigation & Controls */}
      <Dashboard />

      {/* Floating 3D Engineering & Diagnostics Panel */}
      {!isGrandparentMode && !isCaregiverMode && <Panels />}

      {/* Dedicated Grandparent Care Senior View */}
      {isGrandparentMode && (
        <div className="absolute inset-0 top-20 bottom-16 z-15 overflow-y-auto px-4 py-2 pointer-events-auto bg-[#f5f5f7]/85 backdrop-blur-md">
          <GrandparentView />
        </div>
      )}

      {/* Dedicated Caregiver & Doctor Telemetry View */}
      {isCaregiverMode && (
        <div className="absolute inset-0 top-20 bottom-16 z-15 overflow-y-auto px-4 py-2 pointer-events-auto bg-[#f5f5f7]/85 backdrop-blur-md">
          <CaregiverView />
        </div>
      )}
    </div>
  )
}

export default App
