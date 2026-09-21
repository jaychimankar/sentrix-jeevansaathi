import React, { useRef, useEffect, useState } from 'react'
import { useStore } from '../../store'
import {
  Activity,
  Heart,
  Thermometer,
  Send,
  Clock,
  Pill,
  Smartphone,
  Phone,
  FileText,
  AlertTriangle
} from 'lucide-react'

export function CaregiverView() {
  const {
    sensors,
    riskLevel,
    riskScore,
    medications,
    caregiverAlerts,
    patientProfile,
    whatsAppStatus,
    sendWhatsAppReport,
    toggleGeofenceBreach,
    toggleEcgArrhythmia
  } = useStore()

  const ecgCanvasRef = useRef(null)
  const [ecgSpeed] = useState(2)

  // Real-time animated ECG Canvas rendering
  useEffect(() => {
    const canvas = ecgCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId
    let offset = 0

    const renderECG = () => {
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw Medical ECG Grid
      ctx.strokeStyle = '#f0f3f8'
      ctx.lineWidth = 1

      // Small 10px grid
      for (let x = 0; x < canvas.width; x += 10) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }
      for (let y = 0; y < canvas.height; y += 10) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }

      // Major 50px grid
      ctx.strokeStyle = '#e2e8f0'
      ctx.lineWidth = 1.2
      for (let x = 0; x < canvas.width; x += 50) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }
      for (let y = 0; y < canvas.height; y += 50) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }

      // Draw Continuous ECG Waveform
      const isArrhythmia = sensors.ecgStatus === 'ARRHYTHMIA'
      ctx.strokeStyle = isArrhythmia ? '#dc2626' : '#2563eb'
      ctx.lineWidth = 2.2
      ctx.lineJoin = 'round'
      ctx.beginPath()

      const midY = canvas.height / 2
      const period = isArrhythmia ? 120 : 160

      for (let x = 0; x < canvas.width; x++) {
        const phase = (x + offset) % period
        let y = midY

        if (phase >= 20 && phase < 35) {
          // P Wave (Atrial depolarization)
          y -= Math.sin(((phase - 20) / 15) * Math.PI) * 12
        } else if (phase >= 45 && phase < 50) {
          // Q Wave
          y += 8
        } else if (phase >= 50 && phase < 60) {
          // R Peak (Ventricular depolarization)
          y -= 54 * (isArrhythmia ? 1.2 : 1.0)
        } else if (phase >= 60 && phase < 68) {
          // S Wave
          y += 18
        } else if (phase >= 85 && phase < 115) {
          // T Wave (Ventricular repolarization)
          y -= Math.sin(((phase - 85) / 30) * Math.PI) * 18
        } else if (isArrhythmia && phase >= 130 && phase < 145) {
          // Premature Ventricular Contraction (PVC) anomaly
          y -= Math.sin(((phase - 130) / 15) * Math.PI) * 28
        }

        if (x === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()

      offset += ecgSpeed
      animationId = requestAnimationFrame(renderECG)
    }

    renderECG()
    return () => cancelAnimationFrame(animationId)
  }, [sensors.ecgStatus, ecgSpeed])

  const takenMedsCount = medications.filter((m) => m.taken).length
  const adherenceRate = Math.round((takenMedsCount / medications.length) * 100)

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-5 p-2 pb-16 text-gray-900 animate-fadeIn">
      {/* 1. TOP HEADER & TELEMETRY SYNC STATUS */}
      <div className="bg-white/95 backdrop-blur-xl border border-gray-200 rounded-3xl p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#2563eb]">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold tracking-tight text-gray-900">
                Remote Patient Monitoring Telemetry
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-green-50 text-green-700 border border-green-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                BLE + CLOUD SYNCED
              </span>
            </div>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              Target Patient: {patientProfile.nameEn} ({patientProfile.age} Yrs, {patientProfile.bloodGroup})
            </p>
          </div>
        </div>

        {/* Action: Send Instant WhatsApp Report */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={sendWhatsAppReport}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs tracking-wide bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all"
          >
            <Smartphone className="w-4 h-4" />
            <span>Send WhatsApp Alert</span>
          </button>
        </div>
      </div>

      {/* 2. REALISTIC WHATSAPP ALERT PREVIEW POPUP */}
      {whatsAppStatus && (
        <div className="bg-emerald-50 border-2 border-emerald-500 rounded-3xl p-4 shadow-lg flex items-start justify-between gap-4 animate-fadeIn">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-emerald-900">
                WhatsApp Dispatch Successful to {whatsAppStatus.recipient}
              </h4>
              <p className="text-xs text-emerald-800 font-mono mt-1 bg-white/80 p-2.5 rounded-xl border border-emerald-200">
                "📊 [EDGE-AI HEALTH REPORT] {patientProfile.nameEn} (74) Vitals at {whatsAppStatus.time}: SpO2: {sensors.spo2}%, HR: {sensors.hr} BPM, Body Temp: {sensors.bodyTemperature.toFixed(1)}°C (TMP117), ECG: {sensors.ecgStatus}, GPS: {sensors.gps.locationName}. Adherence: {adherenceRate}%."
              </p>
            </div>
          </div>
          <span className="text-[10px] text-emerald-600 font-bold bg-white px-2.5 py-1 rounded-lg border border-emerald-200 whitespace-nowrap">
            SENT {whatsAppStatus.time}
          </span>
        </div>
      )}

      {/* 3. PATIENT VITALS & CLINICAL METRICS MATRIX */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Optical PPG + ECG */}
        <div className="bg-white/95 backdrop-blur-xl border border-gray-200 rounded-3xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Cardiac Telemetry
            </span>
            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
              <Heart className="w-3.5 h-3.5 fill-blue-600" />
              <span>{sensors.hr} BPM</span>
            </div>
          </div>
          <div className="my-3 flex items-baseline justify-between">
            <div>
              <span className="text-3xl font-black text-gray-900 tracking-tight">
                {sensors.spo2}%
              </span>
              <span className="text-xs text-gray-500 font-medium ml-1">SpO2 (MAX30102)</span>
            </div>
            <div className="text-right">
              <span className="text-xl font-bold text-gray-800">{sensors.bloodPressure}</span>
              <span className="block text-[10px] text-gray-400">BP (mmHg)</span>
            </div>
          </div>
          <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs font-medium">
            <span className="text-gray-500">Rhythm Status:</span>
            <span
              className={`font-bold ${
                sensors.ecgStatus === 'ARRHYTHMIA' ? 'text-red-600' : 'text-green-600'
              }`}
            >
              {sensors.ecgStatus === 'ARRHYTHMIA' ? '⚠️ Arrhythmia (Flagged)' : '✅ Normal Sinus'}
            </span>
          </div>
        </div>

        {/* Medical Grade Body Temp (TMP117) */}
        <div className="bg-white/95 backdrop-blur-xl border border-gray-200 rounded-3xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              TMP117 Clinical Thermometry
            </span>
            <span className="text-[10px] font-bold bg-blue-50 text-[#2563eb] px-2 py-0.5 rounded">
              ±0.1°C ASTM E1112
            </span>
          </div>
          <div className="my-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-gray-900 tracking-tight">
              {sensors.bodyTemperature.toFixed(2)}°C
            </span>
            <span className="text-xs text-gray-400 font-semibold">
              ({((sensors.bodyTemperature * 9) / 5 + 32).toFixed(1)}°F)
            </span>
          </div>
          <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs font-medium">
            <span className="text-gray-500">Fever State:</span>
            <span
              className={`font-bold ${
                sensors.bodyTemperature > 38.0 ? 'text-red-600' : 'text-blue-600'
              }`}
            >
              {sensors.bodyTemperature > 38.0 ? '🚨 Pyrexia / Fever Alert' : '✅ Afebrile (Normothermic)'}
            </span>
          </div>
        </div>

        {/* TinyML Risk Prediction Engine */}
        <div className="bg-white/95 backdrop-blur-xl border border-gray-200 rounded-3xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              On-Device TinyML Inference
            </span>
            <span className="text-[10px] font-bold bg-purple-50 text-purple-700 px-2 py-0.5 rounded">
              ESP32-S3 Vector
            </span>
          </div>
          <div className="my-3 flex items-baseline justify-between">
            <div>
              <span
                className={`text-3xl font-black tracking-tight ${
                  riskLevel === 'HIGH'
                    ? 'text-red-600'
                    : riskLevel === 'MEDIUM'
                    ? 'text-amber-600'
                    : 'text-green-600'
                }`}
              >
                {riskLevel}
              </span>
              <span className="text-xs text-gray-400 font-medium ml-1">Risk Classification</span>
            </div>
            <div className="text-right">
              <span className="text-xl font-bold text-gray-800">
                {(riskScore * 100).toFixed(0)}%
              </span>
              <span className="block text-[10px] text-gray-400">Risk Score</span>
            </div>
          </div>
          <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs font-medium">
            <span className="text-gray-500">Latency:</span>
            <span className="font-bold text-purple-600">14.2 ms (INT8 Quantized)</span>
          </div>
        </div>
      </div>

      {/* 4. AD8232 REAL-TIME 1-LEAD ECG WAVEFORM MONITOR */}
      <div className="bg-white/95 backdrop-blur-xl border border-gray-200 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 tracking-tight flex items-center gap-2">
                <span>AD8232 Single-Lead ECG Diagnostic Stream</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-50 text-red-600 border border-red-200">
                  LEAD I (DRY ELECTRODE)
                </span>
              </h3>
              <p className="text-xs text-gray-500 font-medium">
                Bandwidth: 0.5 - 40 Hz • Sampling Rate: 250 Hz • CMRR: 80 dB
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleEcgArrhythmia}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border shadow-sm ${
                sensors.ecgStatus === 'ARRHYTHMIA'
                  ? 'bg-red-600 text-white border-red-600'
                  : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
              }`}
            >
              {sensors.ecgStatus === 'ARRHYTHMIA' ? '⚠️ Arrhythmia Active (Reset)' : '⚡ Simulate Arrhythmia'}
            </button>
          </div>
        </div>

        {/* ECG Grid & Oscilloscope Canvas */}
        <div className="relative w-full h-44 rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-inner">
          <canvas
            ref={ecgCanvasRef}
            width={880}
            height={176}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2.5 right-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-gray-200 text-[11px] font-mono font-bold text-gray-700 shadow-sm flex items-center gap-3">
            <span>HR: {sensors.hr} BPM</span>
            <span className="text-gray-300">|</span>
            <span>QRS: 118 ms</span>
            <span className="text-gray-300">|</span>
            <span>PR: 160 ms</span>
          </div>
        </div>
      </div>

      {/* 5. LIVE NEO-6M GPS GEOFENCING & SAFE ZONE MONITOR */}
      <div className="bg-white/95 backdrop-blur-xl border border-gray-200 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 tracking-tight flex items-center gap-2">
                <span>NEO-6M GPS Geofence & Wandering Prevention</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {sensors.gps.satellites} SATELLITES LOCKED
                </span>
              </h3>
              <p className="text-xs text-gray-500 font-medium">
                Lat: {sensors.gps.lat.toFixed(4)}° N, Lng: {sensors.gps.lng.toFixed(4)}° E • Accuracy: 2.2m CEP
              </p>
            </div>
          </div>

          <button
            onClick={toggleGeofenceBreach}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border shadow-sm ${
              sensors.gps.isOutsideSafeZone
                ? 'bg-amber-500 text-white border-amber-500'
                : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
            }`}
          >
            {sensors.gps.isOutsideSafeZone ? '⚠️ Outside Safe Zone (Return)' : '🚶 Simulate Wandering Breach'}
          </button>
        </div>

        {/* Interactive Map Visualizer */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-xl ${
                sensors.gps.isOutsideSafeZone ? 'bg-amber-500 animate-bounce' : 'bg-emerald-600'
              }`}
            >
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                CURRENT REGISTERED LOCATION
              </span>
              <h4 className="text-sm font-bold text-gray-900 mt-0.5">
                {sensors.gps.locationName}
              </h4>
              <p className="text-xs text-gray-500 font-medium">
                Safe Home Radius: 500 meters • Speed: {sensors.gps.speed} km/h
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                sensors.gps.isOutsideSafeZone
                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                  : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
              }`}
            >
              {sensors.gps.isOutsideSafeZone ? '⚠️ Geofence Breach' : '🛡️ Safe Zone Verified'}
            </span>
          </div>
        </div>
      </div>

      {/* 6. MEDICATION ADHERENCE & INCIDENT EVENT STREAM */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Medication Compliance Log */}
        <div className="bg-white/95 backdrop-blur-xl border border-gray-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Pill className="w-4 h-4 text-[#2563eb]" />
                <span>Medication Compliance</span>
              </h3>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                {adherenceRate}% Adherence
              </span>
            </div>

            <div className="flex flex-col gap-2.5">
              {medications.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`w-2 h-2 rounded-full ${m.taken ? 'bg-green-500' : 'bg-amber-400'}`} />
                    <span className="font-bold text-gray-900">{m.nameEn}</span>
                    <span className="text-gray-400">({m.dosage})</span>
                  </div>
                  <span className={`font-semibold ${m.taken ? 'text-green-600' : 'text-amber-600'}`}>
                    {m.taken ? '✅ Taken' : `⏰ ${m.time}`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Incident Stream & Action Logs */}
        <div className="bg-white/95 backdrop-blur-xl border border-gray-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#2563eb]" />
                <span>Incident Audit Stream</span>
              </h3>
              <span className="text-[10px] font-bold text-gray-400 uppercase">Real-Time</span>
            </div>

            <div className="flex flex-col gap-2.5 max-h-56 overflow-y-auto pr-1">
              {caregiverAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs flex items-start gap-2.5"
                >
                  <span className="text-[10px] font-mono text-gray-400 whitespace-nowrap mt-0.5">
                    {alert.timestamp}
                  </span>
                  <p className="font-medium text-gray-800 leading-snug">
                    {alert.message}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
