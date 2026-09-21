import React, { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { useStore } from '../../store'

function drawOledScreen(canvas, { sensors, riskLevel, oledScreen }) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // Deep emissive OLED true black background
  ctx.fillStyle = '#020406'
  ctx.fillRect(0, 0, 512, 256)

  // Top Status Bar (Emissive dark cyan-navy)
  ctx.fillStyle = '#08141e'
  ctx.fillRect(0, 0, 512, 42)

  // Top Border Line
  ctx.strokeStyle = '#2563eb'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(0, 42)
  ctx.lineTo(512, 42)
  ctx.stroke()

  // Header Title
  ctx.font = 'bold 18px monospace, sans-serif'
  ctx.fillStyle = '#2563eb'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'
  ctx.fillText('● EDGE-AI  [BLE]', 16, 21)

  // Active Screen Indicator
  ctx.font = 'bold 14px monospace, sans-serif'
  ctx.fillStyle = '#78a2b5'
  ctx.textAlign = 'center'
  ctx.fillText(`SCR: ${oledScreen}`, 260, 21)

  // Battery Icon
  ctx.strokeStyle = '#2563eb'
  ctx.lineWidth = 2
  ctx.strokeRect(440, 11, 46, 20)
  ctx.fillStyle = '#2563eb'
  ctx.fillRect(487, 16, 5, 10)
  ctx.fillStyle = '#00ff88'
  ctx.fillRect(444, 14, 34, 14)

  // Risk Color
  const riskColor = riskLevel === 'LOW' ? '#00ff88' : riskLevel === 'MEDIUM' ? '#ffcc00' : '#ff0044'

  // ==========================================
  // SCREEN 1: HOME (Multi-Modal Dashboard)
  // ==========================================
  if (oledScreen === 'HOME') {
    // Row 1: Health Metrics
    ctx.font = 'bold 28px monospace, sans-serif'
    ctx.fillStyle = '#ffffff'
    ctx.textAlign = 'left'
    ctx.fillText(`HR ${sensors.hr} BPM`, 20, 80)
    ctx.fillStyle = '#2563eb'
    ctx.fillText(`SpO2 ${sensors.spo2}%`, 280, 80)

    // Row 2: Environmental Telemetry
    ctx.font = 'bold 20px monospace, sans-serif'
    ctx.fillStyle = '#a0d8ef'
    ctx.fillText(`${sensors.temperature.toFixed(1)}°C  ${sensors.humidity}% RH`, 20, 122)
    ctx.fillStyle = '#ffcf40'
    ctx.fillText(`AIR: ${sensors.airQuality.toUpperCase()}`, 310, 122)

    // Row 3: PPG Waveform
    ctx.strokeStyle = '#00ffaa'
    ctx.lineWidth = 3
    ctx.beginPath()
    const py = 160
    ctx.moveTo(20, py)
    ctx.lineTo(80, py)
    ctx.lineTo(95, py - 22)
    ctx.lineTo(108, py + 14)
    ctx.lineTo(120, py - 32)
    ctx.lineTo(132, py + 22)
    ctx.lineTo(145, py)
    ctx.lineTo(260, py)
    ctx.lineTo(275, py - 22)
    ctx.lineTo(288, py + 14)
    ctx.lineTo(300, py - 32)
    ctx.lineTo(312, py + 22)
    ctx.lineTo(325, py)
    ctx.lineTo(490, py)
    ctx.stroke()

    // Footer AI Risk Banner
    ctx.fillStyle = '#07121a'
    ctx.fillRect(0, 196, 512, 60)
    ctx.strokeStyle = riskColor
    ctx.lineWidth = 1
    ctx.strokeRect(0, 196, 512, 60)

    ctx.font = 'bold 22px monospace, sans-serif'
    ctx.fillStyle = riskColor
    ctx.fillText(`AI RISK: ${riskLevel}`, 20, 226)

    ctx.font = '12px monospace, sans-serif'
    ctx.fillStyle = '#6a8a9a'
    ctx.fillText('TAP TO SWITCH SCREEN >', 315, 226)
  }
  // ==========================================
  // SCREEN 2: HEALTH (MAX30102 PPG Focus)
  // ==========================================
  else if (oledScreen === 'HEALTH') {
    ctx.font = 'bold 20px monospace, sans-serif'
    ctx.fillStyle = '#ff3366'
    ctx.textAlign = 'left'
    ctx.fillText('PULSE OXIMETER [MAX30102]', 20, 72)

    ctx.font = 'bold 36px monospace, sans-serif'
    ctx.fillStyle = '#ffffff'
    ctx.fillText(`${sensors.hr}`, 20, 120)
    ctx.font = 'bold 18px monospace, sans-serif'
    ctx.fillStyle = '#88a0b0'
    ctx.fillText('BPM', 95, 120)

    ctx.font = 'bold 36px monospace, sans-serif'
    ctx.fillStyle = '#2563eb'
    ctx.fillText(`${sensors.spo2}%`, 260, 120)
    ctx.font = 'bold 18px monospace, sans-serif'
    ctx.fillStyle = '#88a0b0'
    ctx.fillText('SpO2', 365, 120)

    ctx.font = '16px monospace, sans-serif'
    ctx.fillStyle = '#ffaa33'
    ctx.fillText(`MOTION: ${sensors.activity.toUpperCase()}`, 20, 160)

    // Detailed Pulse Waveform
    ctx.strokeStyle = '#ff0055'
    ctx.lineWidth = 3
    ctx.beginPath()
    const py = 205
    ctx.moveTo(20, py)
    ctx.lineTo(120, py)
    ctx.lineTo(140, py - 36)
    ctx.lineTo(155, py + 22)
    ctx.lineTo(170, py - 48)
    ctx.lineTo(185, py + 30)
    ctx.lineTo(205, py)
    ctx.lineTo(340, py)
    ctx.lineTo(360, py - 36)
    ctx.lineTo(375, py + 22)
    ctx.lineTo(390, py - 48)
    ctx.lineTo(405, py + 30)
    ctx.lineTo(425, py)
    ctx.lineTo(490, py)
    ctx.stroke()
  }
  // ==========================================
  // SCREEN 3: ENVIRONMENT (BME280 + ENS160)
  // ==========================================
  else if (oledScreen === 'ENVIRONMENT') {
    ctx.font = 'bold 20px monospace, sans-serif'
    ctx.fillStyle = '#00d4ff'
    ctx.textAlign = 'left'
    ctx.fillText('ENV AIRFLOW CHAMBER', 20, 72)

    ctx.font = 'bold 24px monospace, sans-serif'
    ctx.fillStyle = '#ffffff'
    ctx.fillText(`TEMP: ${sensors.temperature.toFixed(1)}°C`, 20, 114)
    ctx.fillText(`HUM:  ${sensors.humidity}% RH`, 20, 148)

    ctx.fillStyle = '#ffcc00'
    ctx.fillText(`PRESS: ${sensors.pressure} hPa`, 260, 114)
    ctx.fillText(`AQI:   ${sensors.airQuality.toUpperCase()}`, 260, 148)

    ctx.font = '18px monospace, sans-serif'
    ctx.fillStyle = '#70c090'
    ctx.fillText('10 VENT ISOLATED CHAMBER ACTIVE', 20, 200)
    ctx.font = '14px monospace, sans-serif'
    ctx.fillStyle = '#4a7080'
    ctx.fillText('BME280 LGA + ENS160 MOX SENSORS', 20, 230)
  }
  // ==========================================
  // SCREEN 4: AI_CORE (ESP32-S3 TinyML Fusion)
  // ==========================================
  else if (oledScreen === 'AI_CORE') {
    ctx.font = 'bold 20px monospace, sans-serif'
    ctx.fillStyle = '#a060ff'
    ctx.textAlign = 'left'
    ctx.fillText('ESP32-S3 TinyML NEURAL FUSION', 20, 72)

    ctx.font = 'bold 22px monospace, sans-serif'
    ctx.fillStyle = '#ffffff'
    ctx.fillText('INFERENCE: 14.2 ms', 20, 112)
    ctx.fillText('QUANTIZATION: INT8', 20, 146)

    ctx.fillStyle = '#00ffaa'
    ctx.fillText('CONFIDENCE: 98.4%', 260, 112)
    ctx.fillStyle = riskColor
    ctx.fillText(`OUTPUT: ${riskLevel}`, 260, 146)

    ctx.font = '16px monospace, sans-serif'
    ctx.fillStyle = '#7a8fa0'
    ctx.fillText('INPUTS: PPG + IMU + T/H/P + TVOC', 20, 195)
    ctx.fillText('MODEL: 1D-CNN + RANDOM FOREST', 20, 226)
  }
  // ==========================================
  // SCREEN 5: GRANDPARENT SENIOR MODE
  // ==========================================
  else if (oledScreen === 'GRANDPARENT') {
    ctx.font = 'bold 22px monospace, sans-serif'
    ctx.fillStyle = '#00ffaa'
    ctx.textAlign = 'left'
    ctx.fillText('ALL VITALS HEALTHY', 20, 75)

    ctx.font = 'bold 32px monospace, sans-serif'
    ctx.fillStyle = '#ffffff'
    ctx.fillText(`❤️ ${sensors.hr} BPM`, 20, 125)
    ctx.fillStyle = '#2563eb'
    ctx.fillText(`🫁 ${sensors.spo2}%`, 270, 125)

    ctx.font = 'bold 24px monospace, sans-serif'
    ctx.fillStyle = '#ffcc00'
    ctx.fillText(`🌡️ ${sensors.bodyTemperature.toFixed(1)}°C`, 20, 175)
    ctx.fillStyle = '#a0d8ef'
    ctx.fillText(`🩺 ${sensors.bloodPressure}`, 270, 175)

    ctx.fillStyle = '#07121a'
    ctx.fillRect(0, 205, 512, 51)
    ctx.font = 'bold 16px monospace, sans-serif'
    ctx.fillStyle = '#00ff88'
    ctx.fillText('NEXT MED: 02:00 PM (Amlodipine 5mg)', 20, 236)
  }
  // ==========================================
  // SCREEN 6: AD8232 ECG RHYTHM
  // ==========================================
  else if (oledScreen === 'ECG') {
    ctx.font = 'bold 20px monospace, sans-serif'
    ctx.fillStyle = '#ff3366'
    ctx.textAlign = 'left'
    ctx.fillText('AD8232 ECG LEAD I [250 Hz]', 20, 72)

    ctx.font = 'bold 26px monospace, sans-serif'
    ctx.fillStyle = '#ffffff'
    ctx.fillText(`HR: ${sensors.hr} BPM`, 20, 114)
    ctx.fillStyle = sensors.ecgStatus === 'ARRHYTHMIA' ? '#ff0033' : '#00ff88'
    ctx.fillText(`RHYTHM: ${sensors.ecgStatus}`, 220, 114)

    // Dynamic ECG Waveform
    ctx.strokeStyle = sensors.ecgStatus === 'ARRHYTHMIA' ? '#ff0044' : '#00ffaa'
    ctx.lineWidth = 3
    ctx.beginPath()
    const py = 180
    ctx.moveTo(20, py)
    ctx.lineTo(80, py)
    ctx.lineTo(95, py - 35)
    ctx.lineTo(108, py + 18)
    ctx.lineTo(120, py - 55)
    ctx.lineTo(132, py + 26)
    ctx.lineTo(150, py)
    ctx.lineTo(240, py)
    ctx.lineTo(255, py - 35)
    ctx.lineTo(268, py + 18)
    ctx.lineTo(280, py - 55)
    ctx.lineTo(292, py + 26)
    ctx.lineTo(310, py)
    ctx.lineTo(490, py)
    ctx.stroke()

    ctx.font = '14px monospace, sans-serif'
    ctx.fillStyle = '#7a8fa0'
    ctx.fillText('QRS: 118ms • PR: 160ms • NOISE: LOW', 20, 235)
  }
  // ==========================================
  // SCREEN 7: TMP117 BODY TEMP
  // ==========================================
  else if (oledScreen === 'TEMP_BODY') {
    ctx.font = 'bold 20px monospace, sans-serif'
    ctx.fillStyle = '#2563eb'
    ctx.textAlign = 'left'
    ctx.fillText('TMP117 CLINICAL THERMOMETRY', 20, 72)

    ctx.font = 'bold 44px monospace, sans-serif'
    ctx.fillStyle = sensors.bodyTemperature > 38.0 ? '#ff0033' : '#ffffff'
    ctx.fillText(`${sensors.bodyTemperature.toFixed(2)}°C`, 20, 135)

    ctx.font = 'bold 20px monospace, sans-serif'
    ctx.fillStyle = '#88a0b0'
    ctx.fillText(`(${((sensors.bodyTemperature * 9) / 5 + 32).toFixed(1)}°F)`, 250, 135)

    ctx.font = '18px monospace, sans-serif'
    ctx.fillStyle = sensors.bodyTemperature > 38.0 ? '#ff3366' : '#00ff88'
    ctx.fillText(sensors.bodyTemperature > 38.0 ? '🚨 PYREXIA / FEVER ALERT' : '✅ NORMOTHERMIC (NORMAL)', 20, 185)

    ctx.font = '14px monospace, sans-serif'
    ctx.fillStyle = '#7a8fa0'
    ctx.fillText('±0.1°C ACCURACY (ASTM E1112 / ISO 80601-2-56)', 20, 230)
  }
  // ==========================================
  // SCREEN 8: EMERGENCY SOS BEACON
  // ==========================================
  else if (oledScreen === 'SOS') {
    ctx.fillStyle = '#ff0000'
    ctx.fillRect(0, 42, 512, 50)
    ctx.font = 'bold 28px monospace, sans-serif'
    ctx.fillStyle = '#ffffff'
    ctx.textAlign = 'center'
    ctx.fillText('🚨 EMERGENCY SOS ACTIVE', 256, 75)

    ctx.textAlign = 'left'
    ctx.font = 'bold 20px monospace, sans-serif'
    ctx.fillStyle = '#ffffff'
    ctx.fillText(`• LAT: ${sensors.gps.lat.toFixed(4)}° N, LNG: ${sensors.gps.lng.toFixed(4)}° E`, 20, 130)
    ctx.fillText(`• DADAR WEST, MUMBAI [LOCATED]`, 20, 165)
    ctx.fillStyle = '#00ffaa'
    ctx.fillText('• DISPATCHING AMBULANCE (108) & CAREGIVERS', 20, 205)
    ctx.fillStyle = '#ffaa00'
    ctx.fillText('HAPTIC MOTOR: HIGH VIBRATION PULSE', 20, 238)
  }
  // ==========================================
  // SCREEN 9: WARNING ALERT
  // ==========================================
  else if (oledScreen === 'WARNING') {
    ctx.fillStyle = '#ffaa00'
    ctx.fillRect(0, 42, 512, 45)
    ctx.font = 'bold 24px monospace, sans-serif'
    ctx.fillStyle = '#000000'
    ctx.textAlign = 'center'
    ctx.fillText('⚠️ ELEVATED RISK DETECTED', 256, 68)

    ctx.textAlign = 'left'
    ctx.font = 'bold 22px monospace, sans-serif'
    ctx.fillStyle = '#ffffff'
    ctx.fillText('• HIGH CARDIOVASCULAR LOAD', 30, 125)
    ctx.fillText('• ELEVATED AMBIENT VOC', 30, 165)
    ctx.fillStyle = '#ffcc00'
    ctx.fillText('HAPTIC VIBRATION: PULSING (100ms)', 30, 215)
  }
  // ==========================================
  // SCREEN 10: DANGER / CRITICAL ALERT
  // ==========================================
  else {
    ctx.fillStyle = '#ff0033'
    ctx.fillRect(0, 42, 512, 50)
    ctx.font = 'bold 26px monospace, sans-serif'
    ctx.fillStyle = '#ffffff'
    ctx.textAlign = 'center'
    ctx.fillText('🚨 CRITICAL MULTI-MODAL RISK', 256, 72)

    ctx.textAlign = 'left'
    ctx.font = 'bold 22px monospace, sans-serif'
    ctx.fillStyle = '#ffffff'
    ctx.fillText('• TACHYCARDIA + LOW SpO2', 30, 130)
    ctx.fillText('• HAZARDOUS GAS THRESHOLD', 30, 170)
    ctx.fillStyle = '#ff3366'
    ctx.fillText('HAPTIC MOTOR: CONTINUOUS BUZZ', 30, 220)
  }
}

export function OledDisplay({ isSelected, isGhost, onSelect, onHover, onUnhover, isXray }) {
  const { sensors, riskLevel, oledScreen, setOledScreen, registerComponentRef } = useStore()
  const groupRef = useRef()
  const canvasRef = useRef(null)
  const textureRef = useRef(null)

  useEffect(() => {
    if (groupRef.current) {
      registerComponentRef('OLED', groupRef)
    }
  }, [registerComponentRef])

  // Initialize Canvas and CanvasTexture with immediate pixels
  if (!canvasRef.current) {
    const cvs = document.createElement('canvas')
    cvs.width = 512
    cvs.height = 256
    drawOledScreen(cvs, { sensors, riskLevel, oledScreen })
    canvasRef.current = cvs
    const tex = new THREE.CanvasTexture(cvs)
    tex.minFilter = THREE.LinearFilter
    tex.magFilter = THREE.LinearFilter
    tex.needsUpdate = true
    textureRef.current = tex
  }

  // Draw real-time dynamic OLED interface whenever inputs change
  useEffect(() => {
    if (canvasRef.current && textureRef.current) {
      drawOledScreen(canvasRef.current, { sensors, riskLevel, oledScreen })
      textureRef.current.needsUpdate = true
    }
  }, [sensors, riskLevel, oledScreen])


  // Click to cycle screens when inspecting OLED
  const handleOledClick = (e) => {
    e.stopPropagation()
    onSelect('OLED')
    const screens = ['HOME', 'HEALTH', 'ENVIRONMENT', 'AI_CORE', 'WARNING', 'DANGER']
    const nextIdx = (screens.indexOf(oledScreen) + 1) % screens.length
    setOledScreen(screens[nextIdx])
  }

  const isTransparent = isGhost || isXray
  const pcbOpacity = isGhost ? 0.08 : (isXray ? 0.35 : 1)
  const glassOpacity = isGhost ? 0.10 : (isXray ? 0.25 : 0.98)
  const screenOpacity = isGhost ? 0.15 : 1

  return (
    <group 
      ref={groupRef}
      onClick={handleOledClick}
      onPointerOver={(e) => { e.stopPropagation(); onHover('OLED'); }}
      onPointerOut={(e) => { e.stopPropagation(); onUnhover(); }}
    >
      {/* ============================================================ */}
      {/* A. OLED PCB MODULE (27 × 27 mm Substrate with Mount Holes)    */}
      {/* Sits underneath the glass in top cover recess                */}
      {/* ============================================================ */}
      <mesh position={[0, -0.015, 0]}>
        <boxGeometry args={[2.7, 0.05, 2.7]} />
        <meshStandardMaterial 
          color={isGhost ? '#16222f' : '#0b2447'} 
          roughness={0.7} 
          metalness={0.2}
          transparent={isTransparent}
          opacity={pcbOpacity}
          depthWrite={!isTransparent}
        />
      </mesh>

      {/* 4 Corner Mounting Holes */}
      {!isGhost && [
        [-1.15, -1.15],
        [1.15, -1.15],
        [-1.15, 1.15],
        [1.15, 1.15]
      ].map(([hx, hz], idx) => (
        <mesh key={idx} position={[hx, 0.015, hz]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.05, 0.11, 16]} />
          <meshStandardMaterial color="#c0a060" metalness={0.8} roughness={0.3} />
        </mesh>
      ))}

      {/* 4-Pin I2C Header (GND, VCC, SCL, SDA - Mounted Underneath) */}
      <group position={[0, -0.06, -1.15]}>
        <mesh>
          <boxGeometry args={[0.9, 0.08, 0.18]} />
          <meshStandardMaterial 
            color="#111111" 
            roughness={0.8} 
            transparent={isTransparent}
            opacity={isGhost ? 0.1 : 1}
          />
        </mesh>
        {!isGhost && [-0.32, -0.11, 0.11, 0.32].map((px, i) => (
          <mesh key={i} position={[px, -0.05, 0]}>
            <cylinderGeometry args={[0.025, 0.025, 0.1, 8]} />
            <meshStandardMaterial color="#ffd700" metalness={0.9} roughness={0.2} />
          </mesh>
        ))}
      </group>

      {/* ============================================================ */}
      {/* B. DISPLAY BEZEL / PROTECTIVE GLASS SUBSTRATE                 */}
      {/* Precision polished dark glass border                          */}
      {/* ============================================================ */}
      <mesh position={[0, 0.02, 0]}>
        <boxGeometry args={[2.5, 0.025, 1.45]} />
        <meshStandardMaterial 
          color={isGhost ? '#16222f' : '#05070a'} 
          roughness={0.1} 
          metalness={0.85} 
          transparent={isTransparent}
          opacity={glassOpacity}
          depthWrite={!isTransparent}
        />
      </mesh>

      {/* ============================================================ */}
      {/* C. ACTIVE DISPLAY SURFACE (EXACT 2:1 ASPECT RATIO: 2.2 × 1.1) */}
      {/* High-Contrast Dynamic Texture with Emissive Glow             */}
      {/* ============================================================ */}
      <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.2, 1.1]} />
        <meshBasicMaterial 
          map={textureRef.current} 
          toneMapped={false}
          side={THREE.DoubleSide}
          transparent={isTransparent}
          opacity={screenOpacity}
        />
      </mesh>

      {/* Selection Border */}
      {isSelected && (
        <mesh position={[0, 0.045, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2.26, 1.16]} />
          <meshBasicMaterial color="#2563eb" wireframe side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  )
}
