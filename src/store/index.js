import { create } from 'zustand'
import { COMPONENTS } from '../data/components'

export const useStore = create((set, get) => ({
  // Language Support ('en' for English, 'hi' for Hindi)
  language: 'en',
  setLanguage: (lang) => set({ language: lang }),
  toggleLanguage: () => set((state) => ({ language: state.language === 'en' ? 'hi' : 'en' })),

  // Active Tab/Mode
  // Modes: '3D_PRODUCT', 'SENSOR_FUSION', 'AI_CORE', 'ARCHITECTURE', 'SIMULATOR', 'GRANDPARENT', 'CAREGIVER'
  activeTab: '3D_PRODUCT',
  setActiveTab: (tab) => {
    set({ activeTab: tab })
    if (tab === 'AI_CORE' || tab === 'SENSOR_FUSION') {
      set({ isAiCoreClicked: true, oledScreen: 'AI_CORE' })
    } else if (tab === '3D_PRODUCT') {
      set({ isAiCoreClicked: false, oledScreen: 'HOME' })
    } else if (tab === 'SIMULATOR') {
      const risk = get().riskLevel
      set({ oledScreen: risk === 'HIGH' ? 'DANGER' : risk === 'MEDIUM' ? 'WARNING' : 'HOME' })
    } else if (tab === 'GRANDPARENT') {
      set({ oledScreen: 'GRANDPARENT', isAiCoreClicked: true })
    } else if (tab === 'CAREGIVER') {
      set({ oledScreen: 'HOME' })
    }
  },

  // View Mode for 3D
  viewMode: 'DEFAULT', // 'DEFAULT', 'SKIN_CONTACT', 'AIRFLOW', 'XRAY', 'EXPLODED'
  setViewMode: (mode) => {
    set({ viewMode: mode })
    if (mode === 'SKIN_CONTACT') {
      set({ selectedComponentId: 'MAX30102', oledScreen: 'HEALTH' })
    } else if (mode === 'AIRFLOW') {
      set({ selectedComponentId: 'BME280', oledScreen: 'ENVIRONMENT' })
    }
  },

  // OLED Multi-Screen State
  // 'HOME', 'HEALTH', 'ENVIRONMENT', 'AI_CORE', 'WARNING', 'DANGER', 'GRANDPARENT', 'ECG', 'TEMP_BODY', 'SOS'
  oledScreen: 'HOME',
  setOledScreen: (screen) => set({ oledScreen: screen }),

  // 3D Component Object Reference Registry
  componentRefs: {},
  registerComponentRef: (id, ref) => {
    const current = get().componentRefs
    if (current[id] === ref) return
    set({ componentRefs: { ...current, [id]: ref } })
  },

  // Ghost Mode Focus Isolation
  ghostMode: false,
  toggleGhostMode: () => set((state) => ({ ghostMode: !state.ghostMode })),
  setGhostMode: (val) => set({ ghostMode: val }),

  // Component Studio Isolation Mode
  isComponentIsolated: false,
  setIsComponentIsolated: (val) => set({ isComponentIsolated: val }),
  backToAssembly: () => set({
    selectedComponentId: null,
    isComponentIsolated: false,
    cameraPreset: 'HERO_45',
    isCameraAnimating: true,
    viewMode: 'DEFAULT',
    activeTab: '3D_PRODUCT'
  }),

  // 360° Camera Preset & Animation State
  cameraPreset: 'HERO_45', // 'HERO_45', 'TOP', 'BOTTOM', 'LEFT_USB', 'RIGHT_VENTS', 'FRONT'
  isCameraAnimating: false,
  setIsCameraAnimating: (animating) => set({ isCameraAnimating: animating }),
  setCameraPreset: (preset) => {
    set({ cameraPreset: preset, isCameraAnimating: true, selectedComponentId: null, isComponentIsolated: false })
  },

  // 360° Turntable Auto-Rotation
  autoRotate: false,
  toggleAutoRotate: () => set((state) => ({ autoRotate: !state.autoRotate })),
  setAutoRotate: (val) => set({ autoRotate: val }),

  // Smooth Zoom Triggers
  zoomAction: 0,
  triggerZoom: (delta) => set((state) => ({ zoomAction: state.zoomAction + delta })),
  resetView: () => set({
    cameraPreset: 'HERO_45',
    isCameraAnimating: true,
    selectedComponentId: null,
    isComponentIsolated: false,
    viewMode: 'DEFAULT',
    activeTab: '3D_PRODUCT',
    isAiCoreClicked: false,
    oledScreen: 'HOME'
  }),

  // Component Selection & Inspection
  selectedComponentId: null,
  setSelectedComponentId: (id) => {
    if (id) {
      // Select component in assembly (do NOT force isolation - user can opt into isolation via ISOLATE button)
      set({
        selectedComponentId: id,
        isComponentIsolated: false,
        cameraPreset: null,
        isCameraAnimating: true
      })
      if (id === 'OLED') {
        set({ oledScreen: 'HOME' })
      } else if (id === 'MAX30102') {
        set({ oledScreen: 'HEALTH' })
      } else if (id === 'BME280' || id === 'ENS160') {
        set({ oledScreen: 'ENVIRONMENT' })
      } else if (id === 'ESP32_S3') {
        set({ oledScreen: 'AI_CORE' })
      } else if (id === 'TMP117') {
        set({ oledScreen: 'TEMP_BODY' })
      } else if (id === 'AD8232') {
        set({ oledScreen: 'ECG' })
      } else if (id === 'NEO_6M') {
        set({ oledScreen: 'HOME' })
      }
    } else {
      set({
        selectedComponentId: null,
        isComponentIsolated: false,
        cameraPreset: 'HERO_45',
        isCameraAnimating: true
      })
    }
  },

  hoveredComponentId: null,
  setHoveredComponentId: (id) => set({ hoveredComponentId: id }),

  // AI Core quick toggle
  isAiCoreClicked: false,
  setAiCoreClicked: (clicked) => {
    set({ isAiCoreClicked: clicked })
    if (clicked) set({ oledScreen: 'AI_CORE' })
  },

  activeSensor: null,
  setActiveSensor: (sensor) => {
    set({ activeSensor: sensor, selectedComponentId: sensor })
  },

  presentationMode: false,
  setPresentationMode: (active) => set({ presentationMode: active }),

  // ========================================================
  // COMPREHENSIVE SENSOR & TELEMETRY MODEL (Medical & Env)
  // ========================================================
  sensors: {
    // Optical & Cardiac (MAX30102 & AD8232)
    hr: 76,
    spo2: 98,
    activity: 'Resting', // 'Resting', 'Walking', 'Vigorous', 'Heat Strain'
    ecgStatus: 'NORMAL_SINUS', // 'NORMAL_SINUS', 'ARRHYTHMIA', 'TACHYCARDIA', 'LEAD_OFF'
    bloodPressure: '120/80',

    // Medical Grade Body Temperature (TMP117 ±0.1°C)
    bodyTemperature: 36.8, // Celsius (Normal 36.5 - 37.2°C, Fever > 38.0°C)

    // Ambient Environmental Sensors (BME280 & ENS160)
    temperature: 24.3, // Ambient °C
    humidity: 61, // % RH
    pressure: 1013, // hPa
    airQuality: 'Normal', // 'Normal', 'Elevated', 'Poor'
    tvoc: 65, // ppb
    eco2: 420, // ppm

    // MPU6050 Fall Detection & Motion
    fallDetected: false,
    impactG: 1.02,
    lastFallTimestamp: null,

    // NEO-6M GPS & Geofencing
    gps: {
      lat: 19.0760,
      lng: 72.8777,
      locationName: 'Dadar West, Mumbai (Home Perimeter)',
      safeZoneRadius: 500, // meters
      isOutsideSafeZone: false,
      speed: 0.5,
      satellites: 9
    },

    // Power
    batteryLevel: 88, // %
    batteryCharging: false
  },

  // AI Inference State
  riskLevel: 'LOW', // 'LOW', 'MEDIUM', 'HIGH'
  riskScore: 0.12, // 0.00 to 1.00

  // ========================================================
  // EMERGENCY SOS & FALL DETECTION STATE
  // ========================================================
  sosState: {
    active: false,
    countdown: 5,
    sent: false,
    timestamp: null
  },

  triggerSOS: () => {
    set({
      sosState: { active: true, countdown: 5, sent: false, timestamp: new Date().toLocaleTimeString() },
      oledScreen: 'SOS',
      riskLevel: 'HIGH',
      riskScore: 0.98
    })

    // Simulate Caregiver Alert Log
    const newAlert = {
      id: `sos-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      type: 'SOS',
      message: '🚨 EMERGENCY SOS TRIGGERED by Rameshwar Sharma at Dadar West (19.0760° N, 72.8777° E)',
      severity: 'CRITICAL'
    }
    set((state) => ({
      caregiverAlerts: [newAlert, ...state.caregiverAlerts]
    }))
  },

  cancelSOS: () => {
    set({
      sosState: { active: false, countdown: 5, sent: false, timestamp: null },
      oledScreen: 'HOME',
      riskLevel: 'LOW',
      riskScore: 0.12
    })
  },

  simulateFall: () => {
    const timestamp = new Date().toLocaleTimeString()
    set((state) => ({
      sensors: {
        ...state.sensors,
        fallDetected: true,
        impactG: 3.84,
        lastFallTimestamp: timestamp,
        hr: 112
      },
      riskLevel: 'HIGH',
      riskScore: 0.96,
      oledScreen: 'DANGER',
      caregiverAlerts: [
        {
          id: `fall-${Date.now()}`,
          timestamp,
          type: 'FALL',
          message: '⚠️ FALL DETECTED (3.84G peak impact)! Auto-triggering check with user.',
          severity: 'CRITICAL'
        },
        ...state.caregiverAlerts
      ]
    }))
  },

  clearFall: () => {
    set((state) => ({
      sensors: {
        ...state.sensors,
        fallDetected: false,
        impactG: 1.02,
        hr: 76
      },
      riskLevel: 'LOW',
      riskScore: 0.12,
      oledScreen: 'HOME'
    }))
  },

  // ========================================================
  // MEDICATION REMINDER SCHEDULE & ADHERENCE
  // ========================================================
  medications: [
    {
      id: 'med-1',
      nameEn: 'Metformin',
      nameHi: 'मेटफॉर्मिन',
      dosage: '500 mg',
      time: '08:00 AM',
      periodEn: 'Morning (After Breakfast)',
      periodHi: 'सुबह (नाश्ते के बाद)',
      taken: true,
      icon: 'pill',
      color: '#2563eb'
    },
    {
      id: 'med-2',
      nameEn: 'Amlodipine',
      nameHi: 'एम्लोडिपिन',
      dosage: '5 mg',
      time: '02:00 PM',
      periodEn: 'Afternoon (After Lunch)',
      periodHi: 'दोपहर (दोपहर के खाने के बाद)',
      taken: false,
      icon: 'tablet',
      color: '#16a34a'
    },
    {
      id: 'med-3',
      nameEn: 'Telmisartan',
      nameHi: 'टेल्मीसार्टन',
      dosage: '40 mg',
      time: '08:00 PM',
      periodEn: 'Night (After Dinner)',
      periodHi: 'रात (रात के खाने के बाद)',
      taken: false,
      icon: 'capsule',
      color: '#9333ea'
    },
    {
      id: 'med-4',
      nameEn: 'Vitamin D3 & Calcium',
      nameHi: 'विटामिन डी3 और कैल्शियम',
      dosage: '1 Tablet',
      time: '09:00 PM',
      periodEn: 'Bedtime',
      periodHi: 'सोने से पहले',
      taken: false,
      icon: 'pill',
      color: '#d97706'
    }
  ],

  markMedicationTaken: (medId) => {
    set((state) => {
      const updated = state.medications.map((m) =>
        m.id === medId ? { ...m, taken: true } : m
      )
      const targetMed = state.medications.find((m) => m.id === medId)
      const alert = {
        id: `med-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        type: 'MEDICATION',
        message: `✅ Medication marked TAKEN: ${targetMed?.nameEn} (${targetMed?.dosage})`,
        severity: 'SUCCESS'
      }
      return {
        medications: updated,
        caregiverAlerts: [alert, ...state.caregiverAlerts]
      }
    })
  },

  snoozeMedication: (medId) => {
    set((state) => {
      const targetMed = state.medications.find((m) => m.id === medId)
      const alert = {
        id: `snooze-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        type: 'MEDICATION',
        message: `⏰ Medication snoozed for 15 mins: ${targetMed?.nameEn}`,
        severity: 'INFO'
      }
      return {
        caregiverAlerts: [alert, ...state.caregiverAlerts]
      }
    })
  },

  // ========================================================
  // PATIENT PROFILE & CAREGIVER INCIDENT LOG
  // ========================================================
  patientProfile: {
    nameEn: 'Rameshwar Sharma',
    nameHi: 'रामेश्वर शर्मा',
    age: 74,
    genderEn: 'Male',
    genderHi: 'पुरुष',
    bloodGroup: 'B+ Positive',
    conditionsEn: ['Hypertension (Stage 1)', 'Type 2 Diabetes', 'Mild Nocturnal Arrhythmia'],
    conditionsHi: ['उच्च रक्तचाप (ब्लड प्रेशर)', 'टाइप 2 मधुमेह (शुगर)', 'हल्की अनियमित धड़कन'],
    emergencyContacts: [
      {
        name: 'Dr. Ananya Sharma',
        roleEn: 'Daughter & Primary Caregiver',
        roleHi: 'सुपुत्री और प्राथमिक देखभालकर्ता',
        phone: '+91 98201 45678',
        specialty: 'Cardiologist (KEM Hospital)'
      },
      {
        name: 'Dr. Vivek Mehta',
        roleEn: 'Family Physician',
        roleHi: 'पारिवारिक चिकित्सक',
        phone: '+91 98211 98765',
        specialty: 'General Medicine (Dadar Clinic)'
      },
      {
        name: '108 National Emergency',
        roleEn: 'Ambulance & Paramedic Response',
        roleHi: 'एम्बुलेंस और आपातकालीन सेवा',
        phone: '108',
        specialty: 'Govt. of India 24/7 Dispatch'
      }
    ]
  },

  caregiverAlerts: [
    {
      id: 'init-1',
      timestamp: '08:05 AM',
      type: 'MEDICATION',
      message: '✅ Morning dose Metformin 500mg verified and taken.',
      severity: 'SUCCESS'
    },
    {
      id: 'init-2',
      timestamp: '11:30 AM',
      type: 'VITALS',
      message: '🩺 TMP117 Body Temp 36.8°C (Normal), SpO2 98%, HR 76 BPM.',
      severity: 'INFO'
    },
    {
      id: 'init-3',
      timestamp: '01:15 PM',
      type: 'GEOFENCE',
      message: '📍 GPS Check: Inside Dadar Safe Home Perimeter (Accuracy: 2.2m).',
      severity: 'INFO'
    }
  ],

  // Trigger Instant WhatsApp Preview Simulator
  whatsAppStatus: null,
  sendWhatsAppReport: () => {
    const time = new Date().toLocaleTimeString()
    set({
      whatsAppStatus: {
        sent: true,
        time,
        recipient: 'Dr. Ananya Sharma (+91 98201 45678)'
      }
    })
    setTimeout(() => {
      set({ whatsAppStatus: null })
    }, 6000)
  },

  // Toggle Geofence Boundary for Wandering Simulation
  toggleGeofenceBreach: () => {
    set((state) => {
      const isBreached = !state.sensors.gps.isOutsideSafeZone
      const newGps = {
        ...state.sensors.gps,
        isOutsideSafeZone: isBreached,
        locationName: isBreached
          ? 'Shivaji Park, Mumbai (Outside 500m Safe Zone - WANDERING ALERT)'
          : 'Dadar West, Mumbai (Home Perimeter)'
      }
      const newAlert = isBreached
        ? {
            id: `geo-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString(),
            type: 'GEOFENCE',
            message: '⚠️ WANDERING ALERT: Patient has moved 780m away from Home Perimeter (Shivaji Park area).',
            severity: 'WARNING'
          }
        : {
            id: `geo-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString(),
            type: 'GEOFENCE',
            message: '✅ Patient returned to Safe Home Perimeter.',
            severity: 'SUCCESS'
          }

      return {
        sensors: {
          ...state.sensors,
          gps: newGps
        },
        riskLevel: isBreached ? 'MEDIUM' : 'LOW',
        caregiverAlerts: [newAlert, ...state.caregiverAlerts]
      }
    })
  },

  // Toggle Arrhythmia in ECG Simulation
  toggleEcgArrhythmia: () => {
    set((state) => {
      const isArrhythmia = state.sensors.ecgStatus === 'ARRHYTHMIA'
      const nextStatus = isArrhythmia ? 'NORMAL_SINUS' : 'ARRHYTHMIA'
      const nextHr = isArrhythmia ? 76 : 108
      return {
        sensors: {
          ...state.sensors,
          ecgStatus: nextStatus,
          hr: nextHr
        },
        riskLevel: isArrhythmia ? 'LOW' : 'MEDIUM',
        riskScore: isArrhythmia ? 0.12 : 0.62,
        caregiverAlerts: [
          {
            id: `ecg-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString(),
            type: 'ECG',
            message: isArrhythmia
              ? '✅ ECG rhythm returned to Normal Sinus.'
              : '⚠️ AD8232 ECG: Irregular cardiac rhythm (PVCs / Tachycardia) flagged by TinyML.',
            severity: isArrhythmia ? 'SUCCESS' : 'WARNING'
          },
          ...state.caregiverAlerts
        ]
      }
    })
  },

  // Toggle Body Fever in TMP117 Simulation
  toggleFever: () => {
    set((state) => {
      const isFever = state.sensors.bodyTemperature > 38.0
      const nextTemp = isFever ? 36.8 : 38.6
      const nextRisk = isFever ? 'LOW' : 'MEDIUM'
      return {
        sensors: {
          ...state.sensors,
          bodyTemperature: nextTemp,
          hr: isFever ? 76 : 96
        },
        riskLevel: nextRisk,
        riskScore: isFever ? 0.12 : 0.58,
        caregiverAlerts: [
          {
            id: `temp-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString(),
            type: 'TEMPERATURE',
            message: isFever
              ? '✅ TMP117 Body temperature normal at 36.8°C.'
              : '🌡️ TMP117 FEVER ALERT: Body temperature 38.6°C (101.5°F) detected.',
            severity: isFever ? 'INFO' : 'WARNING'
          },
          ...state.caregiverAlerts
        ]
      }
    })
  },

  // Text-To-Speech Vitals Readout for Elderly Grandparents
  isSpeaking: false,
  speakVitals: () => {
    const { language, sensors } = get()
    if (typeof window === 'undefined' || !window.speechSynthesis) return

    window.speechSynthesis.cancel()

    let text = ''
    if (language === 'hi') {
      text = `नमस्ते! आपके दिल की धड़कन ${sensors.hr} प्रति मिनट है। ऑक्सीजन ${sensors.spo2} प्रतिशत है और शरीर का तापमान ${sensors.bodyTemperature} डिग्री है। आपकी सेहत सामान्य और अच्छी है।`
    } else {
      text = `Hello! Your heart rate is ${sensors.hr} beats per minute. Blood oxygen is ${sensors.spo2} percent. Body temperature is ${sensors.bodyTemperature} degrees Celsius. All vitals are in normal range.`
    }

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = language === 'hi' ? 'hi-IN' : 'en-US'
    utterance.rate = 0.9

    set({ isSpeaking: true })
    utterance.onend = () => set({ isSpeaking: false })
    utterance.onerror = () => set({ isSpeaking: false })

    window.speechSynthesis.speak(utterance)
  },

  // Actions to update simulator
  updateSensor: (sensorId, value) => set((state) => {
    const newSensors = { ...state.sensors, [sensorId]: value }

    // Multi-modal sensor fusion rule-based TinyML simulation
    let newRisk = 'LOW'
    let score = 0.12

    const isAirPoor = newSensors.airQuality === 'Poor' || newSensors.tvoc > 500 || newSensors.eco2 > 1500
    const isAirElevated = newSensors.airQuality === 'Elevated' || newSensors.tvoc > 220 || newSensors.eco2 > 1000
    const isHighBodyTemp = newSensors.bodyTemperature > 38.0
    const isHighAmbientTemp = newSensors.temperature > 37.0
    const isElevatedTemp = newSensors.temperature > 30.5
    const isHighHr = newSensors.hr > 110
    const isElevatedHr = newSensors.hr > 90
    const isLowSpO2 = newSensors.spo2 < 93
    const isDepressedSpO2 = newSensors.spo2 < 96
    const isArrhythmia = newSensors.ecgStatus === 'ARRHYTHMIA'

    if (isAirPoor || isLowSpO2 || (isHighAmbientTemp && isHighHr) || (isAirElevated && isDepressedSpO2) || (isHighBodyTemp && isHighHr)) {
      newRisk = 'HIGH'
      score = 0.92
    } else if (isAirElevated || isElevatedTemp || isElevatedHr || isDepressedSpO2 || isHighBodyTemp || isArrhythmia) {
      newRisk = 'MEDIUM'
      score = 0.56
    } else {
      newRisk = 'LOW'
      score = 0.12
    }

    // Auto update OLED screen to match risk if in warning or danger state
    let targetScreen = state.oledScreen
    if (newRisk === 'HIGH') {
      targetScreen = 'DANGER'
    } else if (newRisk === 'MEDIUM' && targetScreen === 'HOME') {
      targetScreen = 'WARNING'
    } else if (newRisk === 'LOW' && (targetScreen === 'DANGER' || targetScreen === 'WARNING')) {
      targetScreen = 'HOME'
    }

    return {
      sensors: newSensors,
      riskLevel: newRisk,
      riskScore: score,
      oledScreen: targetScreen
    }
  }),

  // Preset Scenario Loader
  applyScenario: (scenario) => {
    if (scenario === 'NORMAL') {
      set({
        sensors: {
          hr: 76,
          spo2: 98,
          activity: 'Resting',
          ecgStatus: 'NORMAL_SINUS',
          bloodPressure: '120/80',
          bodyTemperature: 36.8,
          temperature: 24.3,
          humidity: 61,
          pressure: 1013,
          airQuality: 'Normal',
          tvoc: 65,
          eco2: 420,
          fallDetected: false,
          impactG: 1.02,
          lastFallTimestamp: null,
          gps: {
            lat: 19.0760,
            lng: 72.8777,
            locationName: 'Dadar West, Mumbai (Home Perimeter)',
            safeZoneRadius: 500,
            isOutsideSafeZone: false,
            speed: 0.5,
            satellites: 9
          },
          batteryLevel: 88,
          batteryCharging: false
        },
        riskLevel: 'LOW',
        riskScore: 0.12,
        oledScreen: 'HOME'
      })
    } else if (scenario === 'WARNING') {
      set({
        sensors: {
          hr: 94,
          spo2: 96,
          activity: 'Heat Strain',
          ecgStatus: 'ARRHYTHMIA',
          bloodPressure: '138/88',
          bodyTemperature: 38.2,
          temperature: 31.8,
          humidity: 68,
          pressure: 1010,
          airQuality: 'Elevated',
          tvoc: 280,
          eco2: 1050,
          fallDetected: false,
          impactG: 1.15,
          lastFallTimestamp: null,
          gps: {
            lat: 19.0760,
            lng: 72.8777,
            locationName: 'Dadar West, Mumbai (Home Perimeter)',
            safeZoneRadius: 500,
            isOutsideSafeZone: false,
            speed: 1.2,
            satellites: 8
          },
          batteryLevel: 65,
          batteryCharging: false
        },
        riskLevel: 'MEDIUM',
        riskScore: 0.58,
        oledScreen: 'WARNING'
      })
    } else if (scenario === 'DANGER') {
      set({
        sensors: {
          hr: 118,
          spo2: 91,
          activity: 'Vigorous',
          ecgStatus: 'TACHYCARDIA',
          bloodPressure: '158/98',
          bodyTemperature: 39.1,
          temperature: 38.2,
          humidity: 82,
          pressure: 1004,
          airQuality: 'Poor',
          tvoc: 620,
          eco2: 2100,
          fallDetected: true,
          impactG: 3.84,
          lastFallTimestamp: new Date().toLocaleTimeString(),
          gps: {
            lat: 19.0825,
            lng: 72.8812,
            locationName: 'Shivaji Park, Mumbai (Outside Safe Zone)',
            safeZoneRadius: 500,
            isOutsideSafeZone: true,
            speed: 0.0,
            satellites: 7
          },
          batteryLevel: 32,
          batteryCharging: false
        },
        riskLevel: 'HIGH',
        riskScore: 0.94,
        oledScreen: 'DANGER'
      })
    }
  },

  // Helper to fetch component metadata
  getComponent: (id) => COMPONENTS[id] || null
}))

if (typeof window !== 'undefined') {
  window.useStore = useStore
}

