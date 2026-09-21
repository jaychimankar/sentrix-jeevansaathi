import React, { useState } from 'react'
import { useStore } from '../../store'
import { COMPONENTS } from '../../data/components'
import {
  Box,
  PlaySquare,
  XSquare,
  RotateCw,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ChevronDown,
  Ghost,
  ArrowLeft,
  Download,
  Globe,
  PhoneCall
} from 'lucide-react'

const PRIMARY_TABS = [
  { id: '3D_PRODUCT', label: '3D Product' },
  { id: 'GRANDPARENT', label: '👴 Senior Care (दादा-दादी)' },
  { id: 'CAREGIVER', label: '🩺 Caregiver / Doctor' },
  { id: 'SENSOR_FUSION', label: 'Sensor Fusion' },
  { id: 'AI_CORE', label: 'AI Core' },
  { id: 'ARCHITECTURE', label: 'Architecture' },
  { id: 'SIMULATOR', label: 'Risk Simulator' },
]

const VIEW_MODES = [
  { id: 'DEFAULT', label: 'Hero' },
  { id: 'SKIN_CONTACT', label: 'Skin' },
  { id: 'AIRFLOW', label: 'Airflow' },
  { id: 'XRAY', label: 'X-Ray' },
  { id: 'EXPLODED', label: 'Exploded' },
]

const CAMERA_PRESETS = [
  { id: 'HERO_45', label: '45°' },
  { id: 'TOP', label: 'Top' },
  { id: 'BOTTOM', label: 'Bottom' },
  { id: 'LEFT_USB', label: 'USB' },
  { id: 'RIGHT_VENTS', label: 'Vents' },
]

export function Dashboard() {
  const {
    language,
    toggleLanguage,
    activeTab,
    setActiveTab,
    viewMode,
    setViewMode,
    isAiCoreClicked,
    setAiCoreClicked,
    presentationMode,
    setPresentationMode,
    riskLevel,
    selectedComponentId,
    setSelectedComponentId,
    ghostMode,
    toggleGhostMode,
    cameraPreset,
    setCameraPreset,
    autoRotate,
    toggleAutoRotate,
    triggerZoom,
    resetView,
    isComponentIsolated,
    setIsComponentIsolated,
    backToAssembly,
    sosState,
    triggerSOS,
    cancelSOS
  } = useStore()

  const [isComponentMenuOpen, setIsComponentMenuOpen] = useState(false)

  const riskColor = riskLevel === 'LOW' ? '#16a34a' : riskLevel === 'MEDIUM' ? '#d97706' : '#dc2626'

  // Presentation Mode View
  if (presentationMode) {
    return (
      <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-between p-6 bg-gradient-to-b from-black/40 via-transparent to-black/60">
        <header className="flex justify-between items-start w-full">
          <div className="pointer-events-auto bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-gray-200 shadow-lg max-w-sm">
            <h1 className="text-lg font-bold tracking-tight flex items-center gap-3">
              <span className="text-[#2563eb]">EDGE</span><span className="text-gray-900">•</span><span className="text-gray-900">AI WEARABLE</span>
            </h1>
            <p className="text-[11px] text-[#2563eb] mt-1 font-medium tracking-wide">
              Multi-Modal Sensor Fusion & Environmental Risk Prediction
            </p>
            <div className="mt-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: riskColor }} />
              <span className="text-xs font-semibold" style={{ color: riskColor }}>
                TINYML INFERENCE: {riskLevel} RISK
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              setPresentationMode(false)
              setViewMode('DEFAULT')
              setActiveTab('3D_PRODUCT')
              setAiCoreClicked(false)
              setSelectedComponentId(null)
            }}
            className="pointer-events-auto flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-4 py-2.5 rounded-xl text-xs font-medium tracking-wide transition-all shadow-sm"
          >
            <XSquare className="w-4 h-4" /> EXIT PRESENTATION
          </button>
        </header>

        <footer className="pointer-events-auto flex justify-center w-full pb-4">
          <div className="flex flex-wrap items-center justify-center gap-2 bg-white/95 backdrop-blur-xl p-2.5 rounded-2xl border border-gray-200 shadow-lg">
            {[
              { label: '1. Hero Product', action: () => { setViewMode('DEFAULT'); setActiveTab('3D_PRODUCT'); setAiCoreClicked(false); setSelectedComponentId(null); } },
              { label: '2. Grandparent Care (Bilingual/SOS)', action: () => { setActiveTab('GRANDPARENT'); } },
              { label: '3. Caregiver & Doctor (ECG/GPS)', action: () => { setActiveTab('CAREGIVER'); } },
              { label: '4. Skin Contact & TMP117', action: () => { setViewMode('SKIN_CONTACT'); setActiveTab('3D_PRODUCT'); setSelectedComponentId('MAX30102'); } },
              { label: '5. Airflow Path', action: () => { setViewMode('AIRFLOW'); setActiveTab('3D_PRODUCT'); setSelectedComponentId('BME280'); } },
              { label: '6. Sensor Fusion', action: () => { setViewMode('XRAY'); setActiveTab('SENSOR_FUSION'); setAiCoreClicked(true); setSelectedComponentId(null); } },
              { label: '7. AI Core', action: () => { setViewMode('XRAY'); setActiveTab('AI_CORE'); setAiCoreClicked(true); setSelectedComponentId('ESP32_S3'); } },
              { label: '8. Exploded View', action: () => { setViewMode('EXPLODED'); setActiveTab('3D_PRODUCT'); setSelectedComponentId(null); } },
              { label: '9. Risk Simulator', action: () => { setViewMode('DEFAULT'); setActiveTab('SIMULATOR'); setAiCoreClicked(true); setSelectedComponentId('OLED'); } },
            ].map((step, idx) => (
              <button
                key={idx}
                onClick={step.action}
                className="bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-blue-300 hover:text-[#2563eb] text-gray-600 px-4 py-2.5 rounded-xl text-xs font-medium tracking-wide transition-all"
              >
                {step.label}
              </button>
            ))}
          </div>
        </footer>
      </div>
    )
  }

  // Standard Engineering UI
  return (
    <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between p-2.5 sm:p-5 overflow-hidden">

      {/* HEADER BAR */}
      <header className="flex flex-col md:flex-row justify-between items-stretch md:items-start gap-2 sm:gap-3 w-full max-w-full">
        {/* Top Row on Mobile: Brand & Quick Action Icons */}
        <div className="flex items-center justify-between gap-2 w-full md:w-auto">
          {/* Brand & Project Identity */}
          <div className="pointer-events-auto bg-white/95 backdrop-blur-md px-3 py-2 sm:p-3.5 rounded-2xl border border-gray-200 shadow-sm flex-1 md:flex-initial max-w-full md:max-w-sm">
            <div className="flex items-center justify-between gap-2">
              <h1 className="text-xs sm:text-base font-bold tracking-tight flex items-center gap-1.5 sm:gap-2.5">
                <span className="text-[#2563eb] font-bold">EDGE</span><span className="text-gray-900">•</span><span className="text-gray-900">AI WEARABLE</span>
              </h1>
              <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold" style={{ color: riskColor }}>
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: riskColor }} />
                <span>{riskLevel} RISK</span>
              </div>
            </div>
            <p className="text-[10px] sm:text-[11px] text-gray-500 mt-0.5 leading-tight hidden sm:block">
              Multi-Modal Sensor Fusion & Environmental Risk Prediction
            </p>
          </div>

          {/* Quick SOS & Language Buttons on Mobile Top Right */}
          <div className="flex items-center gap-1.5 pointer-events-auto md:hidden shrink-0">
            <button
              onClick={toggleLanguage}
              className="flex items-center justify-center w-8 h-8 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-all shadow-sm"
              title="Switch language"
            >
              <Globe className="w-3.5 h-3.5 text-[#2563eb]" />
            </button>
            <button
              onClick={sosState.active ? cancelSOS : triggerSOS}
              className={`flex items-center justify-center px-2 h-8 rounded-xl text-xs font-bold transition-all shadow-sm ${sosState.active
                  ? 'bg-red-600 text-white animate-pulse'
                  : 'bg-red-50 text-red-600 border border-red-200'
                }`}
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span className="ml-1 text-[10px]">{sosState.active ? 'SOS' : 'SOS'}</span>
            </button>
          </div>
        </div>

        {/* ISOLATION MODE NOTIFICATION & BACK TO ASSEMBLY BUTTON */}
        {selectedComponentId && (
          <div className="pointer-events-auto flex items-center justify-between gap-2 bg-white/95 backdrop-blur-xl px-2.5 py-1.5 rounded-2xl border border-gray-200 shadow-sm w-full md:w-auto">
            <button
              onClick={() => backToAssembly()}
              className="flex items-center gap-1 px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl text-[11px] tracking-wide transition-all shadow-sm shrink-0"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>BACK</span>
            </button>
            <div className="px-2 py-0.5 flex flex-col justify-center border-l border-gray-100 text-xs overflow-hidden">
              <span className="text-[8px] uppercase tracking-widest text-gray-400 font-semibold truncate">
                {isComponentIsolated ? 'ISOLATED' : 'IN ASSEMBLY'}
              </span>
              <span className="text-gray-700 font-semibold text-[10px] truncate">
                {COMPONENTS[selectedComponentId]?.name}
              </span>
            </div>
            <button
              onClick={() => setIsComponentIsolated(!isComponentIsolated)}
              className="px-2 py-1 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-200 text-[9px] font-medium transition-all shrink-0"
            >
              {isComponentIsolated ? 'ASSEMBLY' : 'ISOLATE'}
            </button>
          </div>
        )}

        {/* Primary Tabs, Component Explorer & Action Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-1.5 pointer-events-auto w-full md:w-auto overflow-hidden">
          {/* Component Explorer Quick Dropdown */}
          <div className="relative w-full sm:w-auto shrink-0">
            <button
              onClick={() => setIsComponentMenuOpen(!isComponentMenuOpen)}
              className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-2 px-3 py-1.5 bg-white hover:bg-gray-50 text-gray-700 rounded-xl border border-gray-200 text-[11px] sm:text-xs font-medium tracking-wide transition-all shadow-sm"
            >
              <div className="flex items-center gap-1.5 overflow-hidden">
                <Box className="w-3.5 h-3.5 text-[#2563eb] shrink-0" />
                <span className="font-medium truncate">
                  {selectedComponentId ? COMPONENTS[selectedComponentId]?.name : 'EXPLORE COMPONENTS'}
                </span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform shrink-0 ${isComponentMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {isComponentMenuOpen && (
              <div className="fixed sm:absolute left-2 right-2 sm:left-0 sm:right-auto mt-2 w-auto sm:w-[400px] max-h-[60vh] sm:max-h-[340px] overflow-y-auto bg-white/98 backdrop-blur-2xl border border-gray-200 rounded-2xl p-2.5 shadow-2xl z-50 flex flex-col gap-1 text-xs font-medium text-gray-700">
                <div className="px-3 py-1.5 text-[10px] text-gray-400 font-semibold uppercase tracking-wider border-b border-gray-100 flex justify-between items-center">
                  <span>SELECT COMPONENT FOR 3D VIEW</span>
                  <button onClick={() => setIsComponentMenuOpen(false)} className="text-gray-400 hover:text-gray-700 p-0.5 sm:hidden">✕</button>
                </div>

                {selectedComponentId && (
                  <button
                    onClick={() => {
                      backToAssembly()
                      setIsComponentMenuOpen(false)
                    }}
                    className="flex items-center gap-2 text-left px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-[#2563eb] font-medium my-0.5 transition-all text-xs"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>← RETURN TO FULL ASSEMBLY</span>
                  </button>
                )}

                {Object.values(COMPONENTS).map((comp) => {
                  const isSel = selectedComponentId === comp.id
                  return (
                    <button
                      key={comp.id}
                      onClick={() => {
                        setSelectedComponentId(comp.id)
                        setIsComponentMenuOpen(false)
                      }}
                      className={`flex flex-col text-left px-3 py-2 rounded-xl transition-all cursor-pointer ${isSel
                          ? 'bg-blue-50 text-[#2563eb] border border-blue-200 font-semibold'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent'
                        }`}
                    >
                      <span className="font-semibold text-xs text-gray-900">{comp.name}</span>
                      <span className="text-[9px] text-blue-500 font-medium mt-0.5 flex items-center gap-1.5">
                        <span>{comp.category}</span>
                        <span className="text-gray-300">•</span>
                        <span className="text-gray-400">{comp.interface}</span>
                      </span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Primary Navigation Tabs - Horizontal Touch Scrollable Pill Bar */}
          <nav className="flex items-center gap-1 bg-white/95 backdrop-blur-xl p-1 rounded-xl border border-gray-200 shadow-sm w-full md:w-auto overflow-x-auto no-scrollbar scroll-smooth whitespace-nowrap shrink">
            {PRIMARY_TABS.map((tab) => {
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id)
                    if (tab.id === '3D_PRODUCT') {
                      setSelectedComponentId(null)
                    }
                  }}
                  className={`flex items-center gap-1 px-2.5 py-1.5 text-[11px] sm:text-xs font-medium tracking-wide rounded-lg transition-all shrink-0 ${isActive
                      ? 'bg-blue-50 text-[#2563eb] border border-blue-200 font-semibold'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-transparent'
                    }`}
                >
                  {tab.label}
                </button>
              )
            })}
          </nav>

          {/* Action Buttons Bar on Desktop / Tablet */}
          <div className="hidden md:flex items-center gap-1.5 shrink-0">
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 rounded-xl text-xs font-bold tracking-wide transition-all shadow-sm"
              title="Switch language (English / हिन्दी)"
            >
              <Globe className="w-3.5 h-3.5 text-[#2563eb]" />
              <span>{language === 'en' ? 'हिन्दी' : 'English'}</span>
            </button>

            {/* Quick SOS Trigger Button */}
            <button
              onClick={sosState.active ? cancelSOS : triggerSOS}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold tracking-wide transition-all shadow-sm ${sosState.active
                  ? 'bg-red-600 text-white animate-pulse'
                  : 'bg-red-50 hover:bg-red-100 text-red-600 border border-red-200'
                }`}
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>{sosState.active ? 'SOS ACTIVE' : 'SOS'}</span>
            </button>

            <button
              onClick={() => setPresentationMode(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 rounded-xl text-xs font-medium tracking-wide transition-all shadow-sm"
            >
              <PlaySquare className="w-3.5 h-3.5 text-[#2563eb]" /> PRESENT
            </button>

            {/* Direct Download ZIP Button */}
            <a
              href="/edge-ai-wearable-prototype.zip"
              download="edge-ai-wearable-prototype.zip"
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 rounded-xl text-xs font-medium tracking-wide transition-all shadow-sm"
              title="Download Complete Project ZIP"
            >
              <Download className="w-3.5 h-3.5 text-green-600" />
              <span>ZIP</span>
            </a>
          </div>
        </div>
      </header>

      {/* BOTTOM CONTROLS BAR */}
      <footer className="pointer-events-auto flex flex-col md:flex-row justify-between items-stretch md:items-end gap-2 w-full max-w-full overflow-hidden pb-1 md:pb-0">
        {/* Physical View Perspective Modes & 360 Controls Container */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-2 max-w-full overflow-hidden">
          {/* Inspection Modes */}
          <div className="flex flex-col gap-1 max-w-full">
            <span className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-widest text-gray-400 pl-1">
              Inspection Modes
            </span>
            <div className="flex items-center gap-1 bg-white/95 backdrop-blur-xl p-1 rounded-xl border border-gray-200 shadow-sm max-w-full overflow-x-auto no-scrollbar scroll-smooth whitespace-nowrap">
              {VIEW_MODES.map(mode => {
                const isActive = viewMode === mode.id
                return (
                  <button
                    key={mode.id}
                    onClick={() => {
                      setViewMode(mode.id)
                      if (mode.id === 'SKIN_CONTACT') setSelectedComponentId('MAX30102')
                      else if (mode.id === 'AIRFLOW') setSelectedComponentId('BME280')
                      else setSelectedComponentId(null)
                    }}
                    className={`px-2.5 py-1.5 text-[11px] font-medium tracking-wide rounded-lg transition-all shrink-0 ${isActive
                        ? 'bg-blue-600 text-white font-semibold shadow-sm'
                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                  >
                    {mode.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* FLOATING 360° CAMERA & ZOOM NAVIGATION BAR */}
          <div className="flex flex-col gap-1 max-w-full">
            <span className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-widest text-gray-400 pl-1">
              360° Orbit & Zoom
            </span>
            <div className="flex items-center gap-1 bg-white/95 backdrop-blur-xl p-1 rounded-xl border border-gray-200 shadow-sm max-w-full overflow-x-auto no-scrollbar scroll-smooth whitespace-nowrap">
              {/* Camera Angle Presets */}
              {CAMERA_PRESETS.map((preset) => {
                const isActive = cameraPreset === preset.id
                return (
                  <button
                    key={preset.id}
                    onClick={() => setCameraPreset(preset.id)}
                    className={`px-2 py-1 text-[10px] sm:text-[11px] font-medium tracking-wide rounded-lg transition-all shrink-0 ${isActive
                        ? 'bg-blue-600 text-white font-semibold shadow-sm'
                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                  >
                    {preset.label}
                  </button>
                )
              })}

              <div className="w-[1px] h-4 bg-gray-200 mx-0.5 shrink-0" />

              {/* Smooth Zoom Controls */}
              <button
                onClick={() => triggerZoom(1)}
                title="Zoom In"
                className="p-1 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all shrink-0"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => triggerZoom(-1)}
                title="Zoom Out"
                className="p-1 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all shrink-0"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => resetView()}
                title="Reset 45° View"
                className="p-1 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <div className="w-[1px] h-4 bg-gray-200 mx-0.5 shrink-0" />

              {/* 360 Turntable Auto-Spin Toggle */}
              <button
                onClick={() => toggleAutoRotate()}
                className={`flex items-center gap-1 px-2 py-1 text-[10px] font-bold rounded-lg border transition-all shrink-0 ${autoRotate
                    ? 'bg-blue-50 text-[#2563eb] border-blue-300'
                    : 'text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-900'
                  }`}
              >
                <RotateCw className={`w-3 h-3 ${autoRotate ? 'animate-spin' : ''}`} />
                <span>SPIN</span>
              </button>

              {/* Ghost Mode Toggle */}
              <button
                onClick={() => toggleGhostMode()}
                className={`flex items-center gap-1 px-2 py-1 text-[10px] font-bold rounded-lg border transition-all shrink-0 ${ghostMode
                    ? 'bg-purple-50 text-purple-700 border-purple-300'
                    : 'text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-900'
                  }`}
              >
                <Ghost className="w-3 h-3" />
                <span>GHOST: {ghostMode ? 'ON' : 'OFF'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* AI Core Stream Activation Button */}
        <button
          onClick={() => {
            const next = !isAiCoreClicked
            setAiCoreClicked(next)
            if (next) setActiveTab('AI_CORE')
          }}
          className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl border text-xs font-semibold tracking-wider transition-all duration-300 shrink-0 ${isAiCoreClicked || activeTab === 'AI_CORE' || activeTab === 'SENSOR_FUSION'
              ? 'bg-blue-600 text-white border-blue-600 shadow-md'
              : 'bg-white/95 backdrop-blur-xl border-gray-200 text-gray-700 hover:border-blue-300 hover:text-blue-600 shadow-sm'
            }`}
        >
          <span className={`w-2 h-2 rounded-full ${(isAiCoreClicked || activeTab === 'AI_CORE') ? 'animate-pulse bg-white' : 'bg-blue-600'}`} />
          <span>{(isAiCoreClicked || activeTab === 'AI_CORE') ? 'AI ACTIVE' : 'ACTIVATE AI'}</span>
        </button>
      </footer>

    </div>
  )
}