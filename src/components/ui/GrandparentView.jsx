import React, { useState, useEffect } from 'react'
import { useStore } from '../../store'
import { TRANSLATIONS } from '../../constants/translations'
import {
  Heart,
  Thermometer,
  Activity,
  AlertTriangle,
  Volume2,
  VolumeX,
  PhoneCall,
  CheckCircle2,
  Clock,
  Pill,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  MapPin,
  Flame,
  Radio,
  UserCheck
} from 'lucide-react'

export function GrandparentView() {
  const {
    language,
    toggleLanguage,
    sensors,
    riskLevel,
    medications,
    markMedicationTaken,
    snoozeMedication,
    sosState,
    triggerSOS,
    cancelSOS,
    simulateFall,
    clearFall,
    patientProfile,
    isSpeaking,
    speakVitals,
    toggleFever
  } = useStore()

  const t = TRANSLATIONS[language] || TRANSLATIONS.en

  // Local SOS countdown handler
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    let timer
    if (sosState.active && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1)
      }, 1000)
    } else if (!sosState.active) {
      setCountdown(5)
    }
    return () => clearInterval(timer)
  }, [sosState.active, countdown])

  const isFever = sensors.bodyTemperature > 38.0
  const isHeartHigh = sensors.hr > 100 || sensors.hr < 55
  const isOxygenLow = sensors.spo2 < 95

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-5 p-2 pb-16 text-gray-900 animate-fadeIn">
      {/* 1. TOP HEADER & ACCESSIBILITY BAR */}
      <div className="bg-white/95 backdrop-blur-xl border border-gray-200 rounded-3xl p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#2563eb]">
            <UserCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold tracking-tight text-gray-900">
                {language === 'hi' ? patientProfile.nameHi : patientProfile.nameEn}
              </h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                {patientProfile.age} {language === 'hi' ? 'वर्ष' : 'Yrs'} • {patientProfile.bloodGroup}
              </span>
            </div>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              {t.tagline}
            </p>
          </div>
        </div>

        {/* Quick Accessibility Toggles (Hindi/English & Voice Readout) */}
        <div className="flex items-center gap-2.5">
          {/* Audio Voice Readout */}
          <button
            onClick={speakVitals}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs tracking-wide transition-all border shadow-sm ${
              isSpeaking
                ? 'bg-blue-600 text-white border-blue-600 animate-pulse'
                : 'bg-blue-50 hover:bg-blue-100 text-[#2563eb] border-blue-200'
            }`}
            title="Read vitals aloud"
          >
            <Volume2 className="w-4 h-4" />
            <span>{isSpeaking ? t.speaking : t.speakVitals}</span>
          </button>

          {/* Bilingual Switcher */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl font-bold text-xs tracking-wide bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300 transition-all shadow-sm"
          >
            <span>🌐 {language === 'en' ? 'हिन्दी में देखें' : 'View in English'}</span>
          </button>
        </div>
      </div>

      {/* 2. FALL DETECTION EMERGENCY BANNER IF TRIGGERED */}
      {sensors.fallDetected && (
        <div className="bg-red-50 border-2 border-red-500 rounded-3xl p-5 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4 animate-bounce">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center font-bold text-2xl">
              ⚠️
            </div>
            <div>
              <h3 className="text-lg font-bold text-red-900">
                {t.fallTitle} ({sensors.impactG}G Impact)
              </h3>
              <p className="text-xs text-red-700 font-medium">
                {t.fallSub}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={clearFall}
              className="px-5 py-2.5 rounded-xl bg-white hover:bg-gray-50 border border-gray-300 text-gray-800 font-bold text-xs tracking-wide shadow-sm"
            >
              {t.fallImOk}
            </button>
            <button
              onClick={triggerSOS}
              className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs tracking-wide shadow-sm flex items-center gap-2"
            >
              <PhoneCall className="w-4 h-4" />
              <span>{t.fallHelp}</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. HEALTH STATUS SUMMARY HERO CARD */}
      <div
        className={`rounded-3xl p-6 border shadow-sm transition-all ${
          riskLevel === 'HIGH' || isFever
            ? 'bg-red-50/90 border-red-200'
            : riskLevel === 'MEDIUM'
            ? 'bg-amber-50/90 border-amber-200'
            : 'bg-green-50/90 border-green-200'
        }`}
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-sm ${
                riskLevel === 'HIGH' || isFever
                  ? 'bg-red-600'
                  : riskLevel === 'MEDIUM'
                  ? 'bg-amber-500'
                  : 'bg-green-600'
              }`}
            >
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                {t.liveStatus}
              </span>
              <h3 className="text-xl md:text-2xl font-black tracking-tight text-gray-900 mt-0.5">
                {riskLevel === 'HIGH' || isFever
                  ? t.dangerStatus
                  : riskLevel === 'MEDIUM'
                  ? t.warningStatus
                  : t.allGood}
              </h3>
              <p className="text-xs md:text-sm text-gray-600 mt-1 font-medium leading-relaxed">
                {riskLevel === 'HIGH' || isFever
                  ? t.dangerStatusSub
                  : riskLevel === 'MEDIUM'
                  ? t.warningStatusSub
                  : t.allGoodSub}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end md:self-center">
            <span className="text-[11px] font-semibold text-gray-500">
              {language === 'hi' ? 'सटीकता:' : 'Confidence:'} 98.6%
            </span>
            <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
          </div>
        </div>
      </div>

      {/* 4. LARGE VITALS TILES (High Visibility for Seniors) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Heart Rate */}
        <div className="bg-white/95 backdrop-blur-xl border border-gray-200 rounded-3xl p-5 shadow-sm flex flex-col justify-between hover:border-red-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              {t.heartRate}
            </span>
            <div className="w-9 h-9 rounded-xl bg-red-50 text-red-500 flex items-center justify-center">
              <Heart className="w-5 h-5 fill-red-500" />
            </div>
          </div>
          <div className="my-3">
            <div className="flex items-baseline gap-1.5">
              <span className="text-4xl font-black text-gray-900 tracking-tight">
                {sensors.hr}
              </span>
              <span className="text-sm font-bold text-gray-500">{t.bpm}</span>
            </div>
            <span
              className={`inline-block mt-2 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                isHeartHigh
                  ? 'bg-red-50 text-red-700 border border-red-200'
                  : 'bg-green-50 text-green-700 border border-green-200'
              }`}
            >
              {isHeartHigh ? (language === 'hi' ? '⚠️ बढ़ा हुआ' : '⚠️ Elevated') : (language === 'hi' ? 'सामान्य' : 'Normal')}
            </span>
          </div>
          <p className="text-[11px] text-gray-400 font-medium">{t.heartRateSub}</p>
        </div>

        {/* TMP117 Body Temperature (Medical Grade) */}
        <div
          onClick={toggleFever}
          className="bg-white/95 backdrop-blur-xl border border-gray-200 rounded-3xl p-5 shadow-sm flex flex-col justify-between hover:border-blue-300 transition-all cursor-pointer group"
          title="Click to toggle Fever simulation"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              {t.bodyTemp}
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#2563eb] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Thermometer className="w-5 h-5" />
            </div>
          </div>
          <div className="my-3">
            <div className="flex items-baseline gap-1.5">
              <span className="text-4xl font-black text-gray-900 tracking-tight">
                {sensors.bodyTemperature.toFixed(1)}°
              </span>
              <span className="text-sm font-bold text-gray-500">C</span>
              <span className="text-xs font-semibold text-gray-400 ml-1">
                ({((sensors.bodyTemperature * 9) / 5 + 32).toFixed(1)}°F)
              </span>
            </div>
            <span
              className={`inline-block mt-2 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                isFever
                  ? 'bg-red-50 text-red-700 border border-red-200'
                  : 'bg-blue-50 text-blue-700 border border-blue-200'
              }`}
            >
              {isFever ? `🚨 ${t.fever}` : `✅ ${t.normal}`}
            </span>
          </div>
          <p className="text-[11px] text-blue-600 font-medium flex items-center justify-between">
            <span>{t.bodyTempSub}</span>
            <span className="text-[10px] text-gray-400 underline">Tap to test</span>
          </p>
        </div>

        {/* Blood Oxygen SpO2 */}
        <div className="bg-white/95 backdrop-blur-xl border border-gray-200 rounded-3xl p-5 shadow-sm flex flex-col justify-between hover:border-cyan-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              {t.oxygen}
            </span>
            <div className="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="my-3">
            <div className="flex items-baseline gap-1.5">
              <span className="text-4xl font-black text-gray-900 tracking-tight">
                {sensors.spo2}
              </span>
              <span className="text-sm font-bold text-gray-500">%</span>
            </div>
            <span
              className={`inline-block mt-2 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                isOxygenLow
                  ? 'bg-red-50 text-red-700 border border-red-200'
                  : 'bg-green-50 text-green-700 border border-green-200'
              }`}
            >
              {isOxygenLow ? '⚠️ कम ऑक्सीजन' : '✅ 98% उत्तम (Optimal)'}
            </span>
          </div>
          <p className="text-[11px] text-gray-400 font-medium">{t.oxygenSub}</p>
        </div>

        {/* Blood Pressure & ECG Status */}
        <div className="bg-white/95 backdrop-blur-xl border border-gray-200 rounded-3xl p-5 shadow-sm flex flex-col justify-between hover:border-purple-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              {t.bloodPressure}
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Radio className="w-5 h-5" />
            </div>
          </div>
          <div className="my-3">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-gray-900 tracking-tight">
                {sensors.bloodPressure}
              </span>
              <span className="text-xs font-bold text-gray-400">mmHg</span>
            </div>
            <span className="inline-block mt-2 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
              {sensors.ecgStatus === 'ARRHYTHMIA' ? '⚠️ ' + t.ecgArrhythmia : '✅ ' + t.ecgNormal}
            </span>
          </div>
          <p className="text-[11px] text-gray-400 font-medium">{t.bloodPressureSub}</p>
        </div>
      </div>

      {/* 5. EMERGENCY ONE-TOUCH SOS ACTION BUTTON (Prominent & Clear) */}
      <div className="bg-gradient-to-r from-red-600 to-rose-700 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <button
            onClick={sosState.active ? cancelSOS : triggerSOS}
            className="w-20 h-20 rounded-full bg-white text-red-600 font-black text-2xl flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all border-4 border-red-200"
          >
            {sosState.active ? 'STOP' : 'SOS'}
          </button>
          <div>
            <h3 className="text-2xl font-black tracking-tight">
              {sosState.active ? t.sosTriggered : t.sosTitle}
            </h3>
            <p className="text-sm text-red-100 mt-1 max-w-md font-medium leading-relaxed">
              {sosState.active
                ? `${t.sosCountdown} ${countdown} ${t.sosSeconds}. ${t.sosSent}`
                : t.sosSub}
            </p>
          </div>
        </div>

        {sosState.active ? (
          <button
            onClick={cancelSOS}
            className="px-6 py-3.5 bg-white hover:bg-gray-100 text-red-600 rounded-2xl font-black text-sm tracking-wide shadow-md transition-all"
          >
            {t.sosCancel}
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <button
              onClick={simulateFall}
              className="px-4 py-2.5 bg-red-800/60 hover:bg-red-800 text-xs font-bold rounded-xl border border-red-400/40 text-red-100 transition-all"
              title="Test Fall Detection Sensor"
            >
              {language === 'hi' ? 'गिरने का परीक्षण (Test Fall)' : 'Simulate Fall Impact'}
            </button>
          </div>
        )}
      </div>

      {/* 6. MEDICATION REMINDERS (Large Checkbox & Timings) */}
      <div className="bg-white/95 backdrop-blur-xl border border-gray-200 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563eb] flex items-center justify-center">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 tracking-tight">
                {t.medicationTitle}
              </h3>
              <p className="text-xs text-gray-500 font-medium">
                {t.medicationSub}
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            {medications.filter((m) => m.taken).length} / {medications.length} {language === 'hi' ? 'दवाई ली गई' : 'Completed'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {medications.map((med) => {
            const isTaken = med.taken
            return (
              <div
                key={med.id}
                className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                  isTaken
                    ? 'bg-gray-50/80 border-gray-200 opacity-75'
                    : 'bg-white border-blue-200 shadow-sm hover:border-blue-400'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-sm ${
                      isTaken ? 'bg-green-100 text-green-700' : 'bg-blue-50 text-[#2563eb]'
                    }`}
                  >
                    {isTaken ? '✓' : <Clock className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-gray-900">
                      {language === 'hi' ? med.nameHi : med.nameEn}{' '}
                      <span className="text-xs font-normal text-gray-500">({med.dosage})</span>
                    </h4>
                    <p className="text-xs text-gray-500 font-medium mt-0.5">
                      ⏰ {med.time} • {language === 'hi' ? med.periodHi : med.periodEn}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isTaken ? (
                    <span className="text-xs font-bold text-green-700 bg-green-50 px-3 py-1.5 rounded-xl border border-green-200 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {t.taken}
                    </span>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => snoozeMedication(med.id)}
                        className="px-2.5 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold transition-all"
                        title={t.snooze}
                      >
                        15m
                      </button>
                      <button
                        onClick={() => markMedicationTaken(med.id)}
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold tracking-wide shadow-sm transition-all"
                      >
                        {t.markTaken}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 7. EMERGENCY CONTACTS DIRECT DIAL CARDS */}
      <div className="bg-white/95 backdrop-blur-xl border border-gray-200 rounded-3xl p-6 shadow-sm">
        <h3 className="text-base font-bold text-gray-900 tracking-tight mb-4 flex items-center gap-2">
          <PhoneCall className="w-4 h-4 text-[#2563eb]" />
          <span>{language === 'hi' ? 'आपातकालीन संपर्क (परिवार और डॉक्टर)' : 'Direct Caregiver & Doctor Contacts'}</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {patientProfile.emergencyContacts.map((contact, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col justify-between gap-3"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                  {language === 'hi' ? contact.roleHi : contact.roleEn}
                </span>
                <h4 className="text-sm font-bold text-gray-900 mt-0.5">{contact.name}</h4>
                <p className="text-xs text-gray-500 font-medium">{contact.specialty}</p>
              </div>
              <a
                href={`tel:${contact.phone}`}
                className="flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300 text-[#2563eb] text-xs font-bold transition-all shadow-sm"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>{contact.phone}</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
