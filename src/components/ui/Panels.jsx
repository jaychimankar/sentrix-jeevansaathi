import React, { useState } from 'react'
import { useStore } from '../../store'
import { COMPONENTS } from '../../data/components'
import {
  Cpu,
  Layers,
  GitMerge,
  Sliders,
  X,
  Info,
  Heart,
  Wind,
  ChevronDown,
  ChevronUp,
  Monitor,
  ArrowLeft
} from 'lucide-react'

export function Panels() {
  const {
    activeTab,
    isAiCoreClicked,
    sensors,
    riskLevel,
    riskScore,
    updateSensor,
    applyScenario,
    selectedComponentId,
    setSelectedComponentId,
    oledScreen,
    setOledScreen,
    isComponentIsolated,
    setIsComponentIsolated,
    backToAssembly
  } = useStore()

  const [expandedSpecs, setExpandedSpecs] = useState(false)
  const selectedComp = selectedComponentId ? COMPONENTS[selectedComponentId] : null

  // Risk styling - light theme
  const riskColor = riskLevel === 'LOW' ? '#16a34a' : riskLevel === 'MEDIUM' ? '#d97706' : '#dc2626'
  const riskTextColor = riskLevel === 'LOW' ? 'text-green-700' : riskLevel === 'MEDIUM' ? 'text-amber-700' : 'text-red-700'
  const riskBgColor = riskLevel === 'LOW' ? 'bg-green-50 border-green-200' : riskLevel === 'MEDIUM' ? 'bg-amber-50 border-amber-200' : 'bg-red-50 border-red-200'
  const riskDotColor = riskLevel === 'LOW' ? 'bg-green-500' : riskLevel === 'MEDIUM' ? 'bg-amber-500' : 'bg-red-500'

  const showPanel = selectedComp !== null || activeTab !== '3D_PRODUCT' || isAiCoreClicked
  if (!showPanel) return null

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      <div
        onClick={() => backToAssembly()}
        className="fixed inset-0 bg-black/40 backdrop-blur-xs z-30 md:hidden pointer-events-auto animate-fadeIn"
      />

      <aside className="fixed inset-x-0 bottom-0 max-h-[85vh] rounded-t-3xl border-t border-gray-200 shadow-2xl z-40 bg-white/98 backdrop-blur-2xl p-4 sm:p-5 overflow-y-auto pointer-events-auto flex flex-col gap-4 text-xs font-medium text-gray-700 transition-all duration-300 md:absolute md:right-5 md:top-20 md:bottom-20 md:inset-x-auto md:w-[380px] md:max-w-none md:rounded-2xl md:border md:shadow-lg md:max-h-none">

        {/* Mobile Drag Handle Indicator */}
        <div className="w-12 h-1.5 rounded-full bg-gray-300 mx-auto my-0.5 mb-2 md:hidden shrink-0" />

        {/* Close button */}
        <button
          onClick={() => backToAssembly()}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100 transition-colors z-10"
          title="Close panel"
        >
          <X className="w-5 h-5 md:w-4 md:h-4" />
        </button>


        {/* ============================================================ */}
        {/* 1. PROGRESSIVE DISCLOSURE COMPONENT INSPECTOR                */}
        {/* ============================================================ */}
        {selectedComp && (
          <div className="border border-gray-200 bg-gray-50/80 rounded-xl p-4 space-y-3 relative shadow-sm">
            {/* Prominent Back to Assembly Button */}
            <button
              onClick={() => backToAssembly()}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl text-xs tracking-wide transition-all shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>← BACK TO ASSEMBLY</span>
            </button>

            {/* View Mode Switcher */}
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-gray-100 rounded-xl border border-gray-200 text-[10px] font-medium">
              <button
                onClick={() => setIsComponentIsolated(true)}
                className={`py-1.5 rounded-lg font-medium transition-all text-center ${isComponentIsolated
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-900'
                  }`}
              >
                ISOLATED 3D
              </button>
              <button
                onClick={() => setIsComponentIsolated(false)}
                className={`py-1.5 rounded-lg font-medium transition-all text-center ${!isComponentIsolated
                    ? 'bg-gray-700 text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-900'
                  }`}
              >
                IN ASSEMBLY
              </button>
            </div>

            {/* Level 1: COMPONENT NAME & CATEGORY */}
            <div className="pr-6">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-blue-600">
                {selectedComp.category}
              </span>
              <h2 className="text-sm font-bold text-gray-900 tracking-tight mt-0.5">
                {selectedComp.name}
              </h2>
              <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">
                {selectedComp.description}
              </p>
            </div>

            {/* Level 2: FUNCTION & LOCATION */}
            <div className="border-t border-gray-100 pt-2.5 space-y-1.5 font-medium text-[11px]">
              <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold block">
                Function & Location
              </span>
              <div className="flex justify-between gap-2">
                <span className="text-gray-400">Function:</span>
                <span className="text-right text-gray-800">{selectedComp.function}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-gray-400">Location:</span>
                <span className="text-right text-blue-600">{selectedComp.location}</span>
              </div>
            </div>

            {/* Level 3: INPUT / OUTPUT */}
            <div className="border-t border-gray-100 pt-2.5 space-y-1.5">
              <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold block">
                Input / Output
              </span>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                <span className="text-green-700 font-semibold">INPUT:</span> {selectedComp.input}
              </p>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                <span className="text-blue-600 font-semibold">OUTPUT:</span> {selectedComp.output}
              </p>
            </div>

            {/* Level 4: ELECTRICAL & DATA CONNECTIONS BOX */}
            <div className="border border-gray-200 bg-white rounded-xl p-3 space-y-2 font-medium text-[11px]">
              <div className="flex items-center justify-between border-b border-gray-100 pb-1.5">
                <span className="text-[10px] uppercase tracking-wider text-blue-600 font-semibold flex items-center gap-1.5">
                  <GitMerge className="w-3.5 h-3.5" /> Electrical & Data Connections
                </span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-200">
                  ACTIVE BUS
                </span>
              </div>

              {/* Interface & Power summary */}
              <div className="space-y-1">
                <div className="flex justify-between gap-2">
                  <span className="text-gray-400">Interface:</span>
                  <span className="text-right text-gray-700 font-medium">{selectedComp.interface}</span>
                </div>
                {selectedComp.power && (
                  <div className="flex justify-between gap-2">
                    <span className="text-gray-400">Power Rating:</span>
                    <span className="text-right text-gray-700">{selectedComp.power}</span>
                  </div>
                )}
              </div>

              {/* Hardware Pinout Table */}
              {selectedComp.pinout && (
                <div className="pt-2 border-t border-gray-100 space-y-1.5">
                  <span className="text-[9px] uppercase tracking-wider text-gray-400 block font-semibold">
                    PIN MAPPINGS & MCU ROUTING
                  </span>
                  <div className="bg-gray-50 rounded-xl p-2 space-y-1.5 border border-gray-100 text-[10px]">
                    {selectedComp.pinout.map((p, pidx) => (
                      <div key={pidx} className="p-2 bg-white rounded-lg border border-gray-100 flex items-start justify-between gap-3">
                        <div className="flex flex-col gap-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="text-blue-600 font-semibold text-[11px]">{p.pin}</span>
                            {p.name && <span className="text-gray-700 font-medium text-[11px]">({p.name})</span>}
                          </div>
                          <span className="text-gray-400 text-[9px] leading-tight">{p.signal}</span>
                        </div>
                        <span className="text-right text-amber-700 font-medium text-[9px] px-2 py-0.5 rounded bg-amber-50 border border-amber-200 whitespace-nowrap">
                          {p.mcuPin}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Signal & Data Pipeline Flow */}
              {selectedComp.pipeline && (
                <div className="pt-1.5 border-t border-gray-100 space-y-1">
                  <span className="text-[9px] uppercase tracking-wider text-gray-400 block font-semibold">
                    SIGNAL & DATA PIPELINE
                  </span>
                  <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-2 text-[10px] text-gray-600 leading-relaxed">
                    {selectedComp.pipeline}
                  </div>
                </div>
              )}
            </div>

            {/* Level 5: SYSTEM ROLE */}
            <div className="border-t border-gray-100 pt-2.5 space-y-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-600 block">
                System Role
              </span>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                {selectedComp.systemRole}
              </p>
            </div>

            {/* Focus Isolation & Ghost Mode Status Banner */}
            <div className="p-2.5 bg-blue-50/50 border border-blue-100 rounded-lg flex items-center justify-between text-[11px] font-medium">
              <div className="flex items-center gap-2">
                <span className="text-base">👻</span>
                <div>
                  <span className="text-blue-600 font-semibold block text-[10px]">GHOST MODE ISOLATION</span>
                  <span className="text-gray-400 text-[9px]">Surrounding parts rendered as translucent blueprint</span>
                </div>
              </div>
              <button
                onClick={() => useStore.getState().toggleGhostMode()}
                className="px-2 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-[10px] font-medium transition-all"
              >
                {useStore.getState().ghostMode ? 'GHOST: ON' : 'GHOST: OFF'}
              </button>
            </div>

            {/* Special Control: OLED Screen Switcher when inspecting OLED */}
            {selectedComp.id === 'OLED' && (
              <div className="border-t border-gray-100 pt-2.5 space-y-1.5">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-600 flex items-center gap-1.5">
                  <Monitor className="w-3.5 h-3.5" /> SWITCH OLED SCREEN
                </span>
                <div className="grid grid-cols-3 gap-1 font-medium text-[10px]">
                  {['HOME', 'HEALTH', 'ENVIRONMENT', 'AI_CORE', 'WARNING', 'DANGER'].map((scr) => (
                    <button
                      key={scr}
                      onClick={() => setOledScreen(scr)}
                      className={`py-1 rounded border transition-all ${oledScreen === scr
                          ? 'bg-blue-600 text-white font-semibold border-blue-500'
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border-gray-200'
                        }`}
                    >
                      {scr}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Level 6: PHYSICAL & ELECTRICAL SPECIFICATIONS (Collapsible) */}
            <div className="border-t border-gray-100 pt-2.5">
              <button
                onClick={() => setExpandedSpecs(!expandedSpecs)}
                className="w-full flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-gray-400 hover:text-gray-700 transition-colors py-0.5"
              >
                <span>Physical & Mechanical Specs</span>
                {expandedSpecs ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {expandedSpecs && (
                <div className="mt-2 space-y-1.5 font-medium text-[10px] bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                  <div className="flex justify-between gap-2">
                    <span className="text-gray-400">Dimensions:</span>
                    <span className="text-gray-600 text-right">{selectedComp.dimensions}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-gray-400">Material:</span>
                    <span className="text-gray-600 text-right">{selectedComp.material}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-gray-400">Mounting:</span>
                    <span className="text-gray-600 text-right">{selectedComp.mountingMethod}</span>
                  </div>
                  {selectedComp.specs && Object.entries(selectedComp.specs).map(([key, val]) => (
                    <div key={key} className="flex justify-between gap-2 pt-1 border-t border-gray-100">
                      <span className="text-gray-400 capitalize">{key}:</span>
                      <span className="text-gray-600 text-right">{val}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}


        {/* ============================================================ */}
        {/* 2. SENSOR FUSION TAB                                          */}
        {/* ============================================================ */}
        {activeTab === 'SENSOR_FUSION' && (
          <div className="space-y-4">
            <div className="border-b border-gray-100 pb-2.5">
              <div className="flex items-center gap-2 text-blue-600">
                <GitMerge className="w-4 h-4" />
                <h2 className="text-sm font-bold tracking-wider uppercase font-medium">
                  Multi-Modal Sensor Fusion
                </h2>
              </div>
              <p className="text-[11px] text-gray-400 mt-1">
                Synchronous temporal alignment of physiological vitals with ambient environmental telemetry.
              </p>
            </div>

            {/* Dual Modality Streams Diagram */}
            <div className="grid grid-cols-2 gap-2 text-center font-medium text-[11px]">
              {/* Health Stream */}
              <div className="bg-gray-50 border border-green-200 rounded-xl p-3 space-y-1">
                <div className="text-green-700 font-semibold flex items-center justify-center gap-1">
                  <Heart className="w-3.5 h-3.5" /> HEALTH STATE
                </div>
                <div className="text-gray-500 text-[10px] pt-1">
                  MAX30102 (PPG / SpO2)<br />
                  TMP117 (Medical Temp)<br />
                  AD8232 (ECG Lead I)
                </div>
                <div className="text-gray-400 text-[9px] pt-1 border-t border-gray-100">
                  HR: {sensors.hr} bpm | SpO2: {sensors.spo2}%<br />
                  Body: {sensors.bodyTemperature.toFixed(1)}°C | ECG: {sensors.ecgStatus}
                </div>
              </div>

              {/* Environmental Stream */}
              <div className="bg-gray-50 border border-amber-200 rounded-xl p-3 space-y-1">
                <div className="text-amber-700 font-semibold flex items-center justify-center gap-1">
                  <Wind className="w-3.5 h-3.5" /> ENVIRONMENT
                </div>
                <div className="text-gray-500 text-[10px] pt-1">
                  BME280 (Climate)<br />
                  ENS160 (Air Quality)<br />
                  NEO-6M (GPS Geofence)
                </div>
                <div className="text-gray-400 text-[9px] pt-1 border-t border-gray-100">
                  Temp: {sensors.temperature.toFixed(1)}°C<br />
                  Air: {sensors.airQuality} ({sensors.tvoc} ppb)
                </div>
              </div>
            </div>

            {/* Fusion Pipeline Steps */}
            <div className="bg-white border border-gray-200 rounded-xl p-3.5 space-y-2 font-medium text-[11px]">
              <div className="flex items-center justify-between text-gray-400">
                <span>Shared Bus:</span>
                <span className="text-blue-600 font-semibold">I2C (0x57, 0x48, 0x76, 0x53, 0x68, 0x3C) • UART • ADC</span>
              </div>
              <div className="flex items-center justify-between text-gray-400">
                <span>Sampling Window:</span>
                <span className="text-gray-700">50 Hz Ring Buffer (2.0s frame)</span>
              </div>
              <div className="flex items-center justify-between text-gray-400">
                <span>Feature Fusion:</span>
                <span className="text-gray-700">Concatenated Feature Vector (12-dim)</span>
              </div>
              <div className="flex items-center justify-between text-gray-400">
                <span>Edge Engine:</span>
                <span className="text-amber-700 font-semibold">ESP32-S3 TinyML INT8 Model</span>
              </div>
            </div>

            {/* Risk Classification Banner */}
            <div className={`p-3.5 border rounded-xl flex items-center justify-between ${riskBgColor}`}>
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 block">
                  FUSED PREDICTION
                </span>
                <span className={`text-base font-bold tracking-wider ${riskTextColor}`}>
                  {riskLevel} RISK LEVEL
                </span>
              </div>
              <div className="text-right font-medium text-[10px] text-gray-400">
                ANOMALY SCORE<br />
                <span className="text-sm font-bold text-gray-800">{(riskScore * 100).toFixed(0)}%</span>
              </div>
            </div>
          </div>
        )}


        {/* ============================================================ */}
        {/* 3. AI CORE TAB                                                */}
        {/* ============================================================ */}
        {(activeTab === 'AI_CORE' || (isAiCoreClicked && activeTab !== 'SENSOR_FUSION' && activeTab !== 'SIMULATOR' && activeTab !== 'ARCHITECTURE')) && (
          <div className="space-y-4">
            <div className="border-b border-gray-100 pb-2.5">
              <div className="flex items-center gap-2 text-blue-600">
                <Cpu className="w-4 h-4" />
                <h2 className="text-sm font-bold tracking-wider uppercase font-medium">
                  Edge-AI Core Architecture
                </h2>
              </div>
              <p className="text-[11px] text-gray-400 mt-1">
                On-device TinyML inference executed locally on the ESP32-S3 dual-core processor.
              </p>
            </div>

            {/* Model Pipeline Flowchart */}
            <div className="bg-white border border-gray-200 rounded-xl p-3 font-medium text-[11px] space-y-2 text-center">
              <div className="text-gray-400">1. SENSOR STREAM ACQUISITION (I2C)</div>
              <div className="text-blue-400">↓</div>
              <div className="text-gray-400">2. PREPROCESSING & ARTIFACT FILTERING</div>
              <div className="text-blue-400">↓</div>
              <div className="text-gray-600 bg-gray-50 py-1 rounded border border-gray-200">
                3. MULTI-MODAL FEATURE VECTOR
              </div>
              <div className="text-blue-400">↓</div>
              <div className="text-blue-700 bg-blue-50 py-1.5 rounded border border-blue-200 font-semibold">
                4. QUANTIZED TinyML MODEL (INT8)
              </div>
              <div className="text-blue-400">↓</div>
              <div className="text-gray-400">5. CLASSIFICATION: LOW / MEDIUM / HIGH</div>
            </div>

            {/* System Response Table */}
            <div className="bg-white border border-gray-200 rounded-xl p-3 space-y-2 text-[11px] font-medium">
              <div className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider border-b border-gray-100 pb-1">
                ACTUATOR SYSTEM RESPONSE
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">0.96" OLED:</span>
                <span className="text-gray-800 font-semibold">{riskLevel === 'LOW' ? 'NORMAL VITALS' : riskLevel === 'MEDIUM' ? 'WARNING BANNER' : 'CRITICAL ALERT'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">RGB Light Pipe:</span>
                <span className="font-semibold flex items-center gap-1.5" style={{ color: riskColor }}>
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: riskColor }} />
                  {riskLevel === 'LOW' ? 'GREEN (SAFE)' : riskLevel === 'MEDIUM' ? 'YELLOW (WARNING)' : 'RED (DANGER)'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Coin Haptic Motor:</span>
                <span className="text-gray-800 font-semibold">{riskLevel === 'LOW' ? 'OFF (IDLE)' : riskLevel === 'MEDIUM' ? 'SHORT PULSE' : 'REPEATED PULSE'}</span>
              </div>
            </div>

            {/* AI Honesty Notice */}
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-[10px] font-medium text-gray-500 space-y-1">
              <div className="text-gray-700 font-semibold flex items-center gap-1.5">
                <Info className="w-3 h-3 text-blue-500" /> AI HONESTY & SPECIFICATION NOTICE
              </div>
              <p>
                Quantized integer TinyML model executed on-device without cloud dependencies. Physiological and environmental inputs are simulated for demonstration. Not clinically validated.
              </p>
            </div>
          </div>
        )}


        {/* ============================================================ */}
        {/* 4. ARCHITECTURE TAB                                           */}
        {/* ============================================================ */}
        {activeTab === 'ARCHITECTURE' && (
          <div className="space-y-4">
            <div className="border-b border-gray-100 pb-2.5">
              <div className="flex items-center gap-2 text-blue-600">
                <Layers className="w-4 h-4" />
                <h2 className="text-sm font-bold tracking-wider uppercase font-medium">
                  System Hardware Architecture
                </h2>
              </div>
              <p className="text-[11px] text-gray-400 mt-1">
                End-to-end electrical topology and separation of Edge Inference vs Cloud Services.
              </p>
            </div>

            {/* Layer Hierarchy */}
            <div className="space-y-2 font-medium text-[11px]">
              {/* Sensor Layer */}
              <div className="border border-gray-200 bg-gray-50 rounded-xl p-3 space-y-1.5">
                <div className="text-blue-600 font-semibold text-[10px] uppercase">1. Multi-Modal Sensor Layer</div>
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div className="bg-white p-2 rounded border border-gray-200">
                    <span className="text-green-700 font-semibold block">MAX30102 + MPU6050</span>
                    <span className="text-gray-500">PPG / SpO2 / Motion</span>
                  </div>
                  <div className="bg-white p-2 rounded border border-gray-200">
                    <span className="text-amber-700 font-semibold block">BME280 + ENS160</span>
                    <span className="text-gray-500">Climate / Air Quality</span>
                  </div>
                  <div className="bg-white p-2 rounded border border-red-200">
                    <span className="text-red-700 font-semibold block">AD8232 ECG</span>
                    <span className="text-gray-500">Single-Lead Cardiac</span>
                  </div>
                  <div className="bg-white p-2 rounded border border-blue-200">
                    <span className="text-blue-700 font-semibold block">TMP117 + NEO-6M</span>
                    <span className="text-gray-500">Medical Temp / GPS</span>
                  </div>
                </div>
              </div>

              {/* Bus Layer */}
              <div className="border border-blue-200 bg-blue-50/40 rounded-xl p-2.5 text-center">
                <span className="text-blue-700 font-semibold block text-[10px]">2. SHARED I2C BUS (400 kHz Fast Mode)</span>
                <span className="text-gray-500 text-[10px]">SDA → ESP32-S3 GPIO 8 | SCL → ESP32-S3 GPIO 9</span>
              </div>

              {/* Compute Layer */}
              <div className="border border-gray-200 bg-gray-50 rounded-xl p-3 space-y-1 text-center">
                <span className="text-amber-700 font-semibold block text-[10px]">3. COMPUTE & LOCAL TINYML CORE</span>
                <span className="text-gray-800 font-semibold">ESP32-S3 Dual-Core Xtensa LX7</span>
                <span className="text-gray-500 text-[10px] block">Sensor Fusion Preprocessor & Inference Engine</span>
              </div>

              {/* Alert Layer */}
              <div className="border border-gray-200 bg-gray-50 rounded-xl p-3 space-y-1 text-center">
                <span className="text-green-700 font-semibold block text-[10px]">4. IMMEDIATE ALERT & OUTPUT LAYER</span>
                <span className="text-gray-600 text-[10px] block">0.96" OLED (I2C) • RGB Light Pipe (GPIO) • 10mm ERM Motor (PWM)</span>
              </div>
            </div>

            {/* Edge vs Cloud Comparison */}
            <div className="border border-gray-200 bg-gray-50 rounded-xl p-3.5 space-y-2 font-medium text-[11px]">
              <div className="text-[10px] uppercase font-semibold text-gray-400">EDGE INFERENCE VS CLOUD</div>
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div className="border border-green-200 bg-green-50 p-2 rounded-lg">
                  <span className="text-green-700 font-semibold block">LOCAL EDGE AI</span>
                  <span className="text-gray-600 block mt-1">Zero Latency Alerting</span>
                  <span className="text-gray-400 text-[9px]">Privacy Preserving & Offline Autonomy</span>
                </div>
                <div className="border border-gray-200 bg-white p-2 rounded-lg">
                  <span className="text-gray-500 font-semibold block">OPTIONAL CLOUD</span>
                  <span className="text-gray-500 block mt-1">Telemetry Sync</span>
                  <span className="text-gray-400 text-[9px]">Wi-Fi / BLE Long-Term Trend Aggregation</span>
                </div>
              </div>
            </div>
          </div>
        )}


        {/* ============================================================ */}
        {/* 5. RISK SIMULATOR TAB                                         */}
        {/* ============================================================ */}
        {activeTab === 'SIMULATOR' && (
          <div className="space-y-4">
            <div className="border-b border-gray-100 pb-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-blue-600">
                  <Sliders className="w-4 h-4" />
                  <h2 className="text-sm font-bold tracking-wider uppercase font-medium">
                    Multi-Modal Risk Simulator
                  </h2>
                </div>
                <span className="px-2 py-0.5 rounded bg-gray-100 text-[9px] font-medium text-gray-400 border border-gray-200">
                  DEMO / SIMULATION
                </span>
              </div>
              <p className="text-[11px] text-gray-400 mt-1">
                Adjust physiological vitals and ambient environment to observe synchronized 3D OLED, RGB, and haptic responses.
              </p>
            </div>

            {/* Preset Quick Scenarios */}
            <div className="space-y-1.5 font-medium text-[10px]">
              <span className="text-gray-400 uppercase tracking-wider block font-semibold">PRESET SCENARIOS</span>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => applyScenario('NORMAL')}
                  className="bg-green-50 hover:bg-green-100 border border-green-200 text-green-800 py-1.5 rounded-lg font-semibold transition-all text-center"
                >
                  1. SAFE
                </button>
                <button
                  onClick={() => applyScenario('WARNING')}
                  className="bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 py-1.5 rounded-lg font-semibold transition-all text-center"
                >
                  2. WARNING
                </button>
                <button
                  onClick={() => applyScenario('DANGER')}
                  className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-800 py-1.5 rounded-lg font-semibold transition-all text-center"
                >
                  3. DANGER
                </button>
              </div>
            </div>

            {/* Interactive Sliders */}
            <div className="space-y-3 font-medium text-[11px] bg-white border border-gray-200 rounded-xl p-3.5">
              {/* Heart Rate */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-gray-600">
                  <span className="flex items-center gap-1.5">Heart Rate (MAX30102)</span>
                  <span className="text-gray-800 font-semibold">{sensors.hr} BPM</span>
                </div>
                <input
                  type="range"
                  min="45"
                  max="170"
                  value={sensors.hr}
                  onChange={(e) => updateSensor('hr', parseInt(e.target.value))}
                  className="w-full accent-blue-500 cursor-pointer"
                />
              </div>

              {/* SpO2 */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-gray-600">
                  <span className="flex items-center gap-1.5">Blood Oxygen SpO2</span>
                  <span className="text-gray-800 font-semibold">{sensors.spo2}%</span>
                </div>
                <input
                  type="range"
                  min="85"
                  max="100"
                  value={sensors.spo2}
                  onChange={(e) => updateSensor('spo2', parseInt(e.target.value))}
                  className="w-full accent-blue-500 cursor-pointer"
                />
              </div>

              {/* Ambient Temperature */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-gray-600">
                  <span className="flex items-center gap-1.5">Ambient Temp (BME280)</span>
                  <span className="text-gray-800 font-semibold">{sensors.temperature.toFixed(1)}°C</span>
                </div>
                <input
                  type="range"
                  min="18"
                  max="44"
                  step="0.5"
                  value={sensors.temperature}
                  onChange={(e) => updateSensor('temperature', parseFloat(e.target.value))}
                  className="w-full accent-blue-500 cursor-pointer"
                />
              </div>

              {/* Body Temperature */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-gray-600">
                  <span className="flex items-center gap-1.5">Body Temp (TMP117)</span>
                  <span className="text-gray-800 font-semibold">{sensors.bodyTemperature.toFixed(1)}°C</span>
                </div>
                <input
                  type="range"
                  min="35"
                  max="41"
                  step="0.1"
                  value={sensors.bodyTemperature}
                  onChange={(e) => updateSensor('bodyTemperature', parseFloat(e.target.value))}
                  className="w-full accent-blue-500 cursor-pointer"
                />
              </div>

              {/* Humidity */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-gray-600">
                  <span className="flex items-center gap-1.5">Humidity (BME280)</span>
                  <span className="text-gray-800 font-semibold">{sensors.humidity}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="90"
                  value={sensors.humidity}
                  onChange={(e) => updateSensor('humidity', parseInt(e.target.value))}
                  className="w-full accent-blue-500 cursor-pointer"
                />
              </div>

              {/* TVOC/eCO2 (ENS160) */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-gray-600">
                  <span className="flex items-center gap-1.5">VOCs (ENS160 TVOC)</span>
                  <span className="text-gray-800 font-semibold">{sensors.tvoc} ppb</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="2000"
                  step="10"
                  value={sensors.tvoc}
                  onChange={(e) => updateSensor('tvoc', parseInt(e.target.value))}
                  className="w-full accent-blue-500 cursor-pointer"
                />
              </div>

              {/* Air Quality */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-gray-600">
                  <span className="flex items-center gap-1.5">Air Quality (ENS160)</span>
                  <select
                    className="bg-gray-50 text-gray-800 rounded px-2 py-1 border border-gray-200 font-medium text-[11px]"
                    value={sensors.airQuality}
                    onChange={(e) => updateSensor('airQuality', e.target.value)}
                  >
                    <option value="Normal">Normal (Clean Air)</option>
                    <option value="Elevated">Elevated (VOC Alert)</option>
                    <option value="Poor">Poor (High Pollution)</option>
                  </select>
                </div>
              </div>

              {/* Activity Level */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-gray-600">
                  <span className="flex items-center gap-1.5">Activity (MPU6050)</span>
                  <select
                    className="bg-gray-50 text-gray-800 rounded px-2 py-1 border border-gray-200 font-medium text-[11px]"
                    value={sensors.activity}
                    onChange={(e) => updateSensor('activity', e.target.value)}
                  >
                    <option value="Resting">Resting (Stationary)</option>
                    <option value="Walking">Walking (Moderate)</option>
                    <option value="Vigorous">Vigorous (Running)</option>
                    <option value="Heat Strain">Heat Strain (Exertion)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Live System Classification */}
            <div className={`p-4 border rounded-xl flex flex-col items-center justify-center transition-all duration-300 shadow-sm ${riskBgColor}`}>
              <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest mb-1">
                TINYML MODEL CLASSIFICATION
              </span>
              <span className={`text-xl font-bold tracking-wider ${riskTextColor}`}>
                {riskLevel} RISK
              </span>
              <span className="text-[10px] text-gray-400 font-medium mt-1">
                OLED Display & RGB Light Pipe Updated in Real-Time
              </span>
            </div>
          </div>
        )}

      </aside>
    </>
  )
}