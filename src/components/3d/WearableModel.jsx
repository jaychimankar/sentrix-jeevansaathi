import React from 'react'
import { useCursor } from '@react-three/drei'
import { useStore } from '../../store'
import { Enclosure } from './modules/Enclosure'
import { InternalChassis } from './modules/InternalChassis'
import { ESP32Module } from './modules/ESP32Module'
import { MAX30102Module } from './modules/MAX30102Module'
import { MPU6050Module } from './modules/MPU6050Module'
import { BME280Module } from './modules/BME280Module'
import { ENS160Module } from './modules/ENS160Module'
import { BatteryPack } from './modules/BatteryPack'
import { ChargingBoard } from './modules/ChargingBoard'
import { VibrationMotor } from './modules/VibrationMotor'
import { RGBLightPipe } from './modules/RGBLightPipe'
import { WristStrap } from './modules/WristStrap'
import { OledDisplay } from './OledDisplay'
import { AirflowStreamlines } from './AirflowStreamlines'
import { SkinContactWrist } from './SkinContactWrist'
import { DynamicDataStreams } from './modules/DynamicDataStreams'
import { IsolatedComponentView } from './IsolatedComponentView'
import { TMP117Module } from './modules/TMP117Module'
import { AD8232Module } from './modules/AD8232Module'
import { NEO6MModule } from './modules/NEO6MModule'

export function WearableModel(props) {
  const { 
    viewMode, 
    isAiCoreClicked, 
    activeTab,
    selectedComponentId, 
    setSelectedComponentId, 
    hoveredComponentId, 
    setHoveredComponentId,
    ghostMode,
    isComponentIsolated
  } = useStore()

  const isExploded = viewMode === 'EXPLODED'
  const isXray = viewMode === 'XRAY' || isAiCoreClicked || activeTab === 'AI_CORE' || activeTab === 'SENSOR_FUSION'

  // Focus Isolation: In Ghost Mode, all non-selected modules fade to holographic ghosts
  const isGhost = (id) => Boolean(ghostMode && selectedComponentId !== null && selectedComponentId !== id)

  // Exploded spacing factor along assembly axis
  const explodeY = isExploded ? 1.4 : 0

  // Cursor handling
  useCursor(hoveredComponentId !== null, 'pointer', 'auto')

  const handleSelect = (componentId) => {
    setSelectedComponentId(componentId)
    // setActiveSensor removed: setSelectedComponentId is the single authoritative action
  }

  const handleHover = (componentId) => {
    setHoveredComponentId(componentId)
  }

  const handleUnhover = () => {
    setHoveredComponentId(null)
  }

  // When a component is isolated, render ONLY that component centered in 3D studio inspection view
  if (isComponentIsolated && selectedComponentId) {
    return (
      <group {...props} dispose={null}>
        <IsolatedComponentView
          componentId={selectedComponentId}
          onSelect={handleSelect}
          onHover={handleHover}
          onUnhover={handleUnhover}
        />
      </group>
    )
  }

  return (
    <group {...props} dispose={null}>
      {/* 1. TOP & BOTTOM ENCLOSURE SHELLS (70 × 45 × 20 mm) */}
      <Enclosure
        explodeY={explodeY}
        isXray={isXray}
        isTopGhost={isGhost('TOP_COVER')}
        isBottomGhost={isGhost('BOTTOM_COVER')}
        isGhost={ghostMode && selectedComponentId !== null && selectedComponentId !== 'TOP_COVER' && selectedComponentId !== 'BOTTOM_COVER'}
        selectedComponentId={selectedComponentId}
        onSelect={handleSelect}
        onHover={handleHover}
        onUnhover={handleUnhover}
      />

      {/* 2. 0.96" OLED MODULE (Physically seated inside Top Cover Recess Window) */}
      <group position={[0, 0.84 + explodeY * 1.8, 0]}>
        <OledDisplay
          isSelected={selectedComponentId === 'OLED'}
          isGhost={isGhost('OLED')}
          onSelect={handleSelect}
          onHover={handleHover}
          onUnhover={handleUnhover}
          isXray={isXray}
        />
      </group>

      {/* 3. RGB STATUS LIGHT PIPE (Transmits light to top bezel) */}
      <group position={[1.55, 0.64 + explodeY * 1.8, 2.55]}>
        <RGBLightPipe
          isSelected={selectedComponentId === 'RGB_LED'}
          isGhost={isGhost('RGB_LED')}
          onSelect={handleSelect}
          onHover={handleHover}
          onUnhover={handleUnhover}
          isXray={isXray}
        />
      </group>

      {/* 4. INTERNAL STRUCTURAL CHASSIS (66 × 41 × 16 mm with Thermal Partition) */}
      <group position={[0, 0 + explodeY * 0.6, 0]}>
        <InternalChassis
          isSelected={selectedComponentId === 'CHASSIS'}
          isGhost={isGhost('CHASSIS')}
          onSelect={handleSelect}
          onHover={handleHover}
          onUnhover={handleUnhover}
          isXray={isXray}
        />
      </group>

      {/* 5. ESP32-S3 EDGE-AI CORE (Center Mainboard) */}
      <group position={[0, 0.12 + explodeY * 0.9, -0.8]}>
        <ESP32Module
          isSelected={selectedComponentId === 'ESP32_S3'}
          isGhost={isGhost('ESP32_S3')}
          onSelect={handleSelect}
          onHover={handleHover}
          onUnhover={handleUnhover}
          isXray={isXray}
        />
      </group>

      {/* 6. MPU6050 6-AXIS IMU (Rigidly coupled to chassis) */}
      <group position={[-0.9, 0.12 + explodeY * 0.9, 0.9]}>
        <MPU6050Module
          isSelected={selectedComponentId === 'MPU6050'}
          isGhost={isGhost('MPU6050')}
          onSelect={handleSelect}
          onHover={handleHover}
          onUnhover={handleUnhover}
          isXray={isXray}
        />
      </group>

      {/* 7. ENVIRONMENTAL CHAMBER SENSORS (Isolated from Battery) */}
      {/* BME280 (Temperature, Humidity, Pressure) */}
      <group position={[1.4, 0.12 + explodeY * 0.8, 0.5]}>
        <BME280Module
          isSelected={selectedComponentId === 'BME280'}
          isGhost={isGhost('BME280')}
          onSelect={handleSelect}
          onHover={handleHover}
          onUnhover={handleUnhover}
          isXray={isXray}
        />
      </group>

      {/* ENS160 (Multi-Gas TVOC / eCO2 Air Quality) */}
      <group position={[1.4, 0.12 + explodeY * 0.8, 1.5]}>
        <ENS160Module
          isSelected={selectedComponentId === 'ENS160'}
          isGhost={isGhost('ENS160')}
          onSelect={handleSelect}
          onHover={handleHover}
          onUnhover={handleUnhover}
          isXray={isXray}
        />
      </group>

      {/* 8. 3.7 V 500 mAh Li-Po POUCH BATTERY (Lower Chassis Pocket) */}
      <group position={[-0.3, -0.15 - explodeY * 0.5, 0]}>
        <BatteryPack
          isSelected={selectedComponentId === 'BATTERY'}
          isGhost={isGhost('BATTERY')}
          onSelect={handleSelect}
          onHover={handleHover}
          onUnhover={handleUnhover}
          isXray={isXray}
        />
      </group>

      {/* 9. USB-C CHARGING / POWER PCB (Aligned with Side Cutout) */}
      <group position={[-1.7, -0.08 - explodeY * 0.3, -1.1]}>
        <ChargingBoard
          isSelected={selectedComponentId === 'CHARGING_PCB'}
          isGhost={isGhost('CHARGING_PCB')}
          onSelect={handleSelect}
          onHover={handleHover}
          onUnhover={handleUnhover}
          isXray={isXray}
        />
      </group>

      {/* 10. 10 mm COIN ERM VIBRATION MOTOR (Wrist Haptic Cradle) */}
      <group position={[-1.0, -0.22 - explodeY * 0.6, 2.1]}>
        <VibrationMotor
          isSelected={selectedComponentId === 'VIBRATION_MOTOR'}
          isGhost={isGhost('VIBRATION_MOTOR')}
          onSelect={handleSelect}
          onHover={handleHover}
          onUnhover={handleUnhover}
          isXray={isXray}
        />
      </group>

      {/* 11. MAX30102 OPTICAL SENSOR & GASKET (FACES DOWNWARD TOWARD WRIST) */}
      <group position={[0, -0.52 - explodeY * 1.9, 0]}>
        <MAX30102Module
          isSelected={selectedComponentId === 'MAX30102'}
          isGhost={isGhost('MAX30102')}
          onSelect={handleSelect}
          onHover={handleHover}
          onUnhover={handleUnhover}
          isXray={isXray}
        />
      </group>

      {/* 12. TMP117 HIGH-PRECISION MEDICAL TEMPERATURE SENSOR (Bottom contact plate for skin thermal measurement) */}
      <group position={[0.8, -0.42 - explodeY * 1.7, 0.4]}>
        <TMP117Module
          isSelected={selectedComponentId === 'TMP117'}
          isGhost={isGhost('TMP117')}
          onSelect={handleSelect}
          onHover={handleHover}
          onUnhover={handleUnhover}
          isXray={isXray}
        />
      </group>

      {/* 13. AD8232 SINGLE-LEAD ECG MODULE (Side-mounted with electrode leads extending to wrist contact points) */}
      <group position={[-0.9, 0.08 + explodeY * 0.85, 0.6]} rotation={[0, Math.PI / 2, 0]}>
        <AD8232Module
          isSelected={selectedComponentId === 'AD8232'}
          isGhost={isGhost('AD8232')}
          onSelect={handleSelect}
          onHover={handleHover}
          onUnhover={handleUnhover}
          isXray={isXray}
        />
      </group>

      {/* 14. NEO-6M GPS MODULE WITH CERAMIC PATCH ANTENNA (Positioned in rear internal chamber) */}
      <group position={[-0.7, 0.08 + explodeY * 1.1, -1.8]} scale={[0.85, 0.7, 0.85]}>
        <NEO6MModule
          isSelected={selectedComponentId === 'NEO_6M'}
          isGhost={isGhost('NEO_6M')}
          onSelect={handleSelect}
          onHover={handleHover}
          onUnhover={handleUnhover}
          isXray={isXray}
        />
      </group>

      {/* 15. 22 mm TPU WRIST STRAPS */}
      <WristStrap
        isSelected={selectedComponentId === 'STRAPS'}
        isGhost={isGhost('STRAPS')}
        onSelect={handleSelect}
        onHover={handleHover}
        onUnhover={handleUnhover}
        isXray={isXray}
      />

      {/* 16. DYNAMIC DATA STREAMS (Querying Component getWorldPosition() Live) */}
      <DynamicDataStreams isExploded={isExploded} />

      {/* 17. AMBIENT AIRFLOW STREAMLINES (Through 10 side cut vents) */}
      <AirflowStreamlines />

      {/* 18. ANATOMICAL SKIN CONTACT WRIST (With 660nm/880nm light penetration) */}
      <SkinContactWrist />
    </group>
  )
}
