import React, { useRef } from 'react'
import * as THREE from 'three'
import { COMPONENTS } from '../../data/components'
import { getLabelTexture } from './utils/labelTexture'
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
import { TMP117Module } from './modules/TMP117Module'
import { AD8232Module } from './modules/AD8232Module'
import { NEO6MModule } from './modules/NEO6MModule'

/**
 * Isolated Component Studio View
 * Renders ONLY the selected component centered at (0,0,0) in full photorealistic 3D,
 * with high-tech studio inspection pedestal, leader lines, and 3D pinout annotations.
 */
export function IsolatedComponentView({ 
  componentId, 
  onSelect = () => {}, 
  onHover = () => {}, 
  onUnhover = () => {} 
}) {
  const comp = COMPONENTS[componentId] || {}
  const pinouts = comp.pinout || []

  // Scale factor based on component physical dimensions
  let scale = 1.0
  let yOffset = 0
  let rot = [0, 0, 0]

  if (componentId === 'BME280' || componentId === 'ENS160') {
    scale = 2.4
  } else if (componentId === 'MAX30102') {
    scale = 2.2
    rot = [0.25, -0.35, 0] // Gentle tilt to reveal both optical bottom and header pins
  } else if (componentId === 'MPU6050') {
    scale = 2.2
  } else if (componentId === 'CHARGING_PCB') {
    scale = 2.1
  } else if (componentId === 'VIBRATION_MOTOR') {
    scale = 2.2
  } else if (componentId === 'RGB_LED') {
    scale = 2.2
  } else if (componentId === 'ESP32_S3') {
    scale = 1.5
  } else if (componentId === 'OLED') {
    scale = 1.35
  } else if (componentId === 'BATTERY') {
    scale = 1.2
  } else if (componentId === 'TMP117') {
    scale = 3.5
    rot = [0.2, -0.3, 0]
  } else if (componentId === 'AD8232') {
    scale = 1.8
    rot = [0.15, 0.25, 0]
  } else if (componentId === 'NEO_6M') {
    scale = 2.0
    rot = [0.1, 0.2, 0]
  }

  return (
    <group position={[0, 0, 0]}>
      {/* 1. CAD Studio Inspection Pedestal */}
      <group position={[0, -1.2, 0]}>
        {/* Subtle glowing circular grid */}
        <gridHelper args={[8, 16, '#2563eb', '#182430']} />
        
        {/* Inner concentric glowing ring */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
          <ringGeometry args={[1.8, 1.85, 48]} />
          <meshBasicMaterial color="#2563eb" transparent opacity={0.5} />
        </mesh>

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
          <ringGeometry args={[3.2, 3.24, 64]} />
          <meshBasicMaterial color="#2563eb" transparent opacity={0.25} />
        </mesh>

        {/* Studio platform disc */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
          <circleGeometry args={[4.2, 48]} />
          <meshStandardMaterial color="#070c12" roughness={0.8} metalness={0.2} />
        </mesh>
      </group>

      {/* 2. Centered Isolated Component */}
      <group scale={[scale, scale, scale]} rotation={rot} position={[0, yOffset, 0]}>
        {componentId === 'OLED' && (
          <OledDisplay
            isSelected={true}
            isGhost={false}
            isXray={false}
            onSelect={onSelect}
            onHover={onHover}
            onUnhover={onUnhover}
          />
        )}

        {componentId === 'ESP32_S3' && (
          <ESP32Module
            isSelected={true}
            isGhost={false}
            isXray={false}
            onSelect={onSelect}
            onHover={onHover}
            onUnhover={onUnhover}
          />
        )}

        {componentId === 'MAX30102' && (
          <MAX30102Module
            isSelected={true}
            isGhost={false}
            isXray={false}
            onSelect={onSelect}
            onHover={onHover}
            onUnhover={onUnhover}
          />
        )}

        {componentId === 'MPU6050' && (
          <MPU6050Module
            isSelected={true}
            isGhost={false}
            isXray={false}
            onSelect={onSelect}
            onHover={onHover}
            onUnhover={onUnhover}
          />
        )}

        {componentId === 'BME280' && (
          <BME280Module
            isSelected={true}
            isGhost={false}
            isXray={false}
            onSelect={onSelect}
            onHover={onHover}
            onUnhover={onUnhover}
          />
        )}

        {componentId === 'ENS160' && (
          <ENS160Module
            isSelected={true}
            isGhost={false}
            isXray={false}
            onSelect={onSelect}
            onHover={onHover}
            onUnhover={onUnhover}
          />
        )}

        {componentId === 'BATTERY' && (
          <BatteryPack
            isSelected={true}
            isGhost={false}
            isXray={false}
            onSelect={onSelect}
            onHover={onHover}
            onUnhover={onUnhover}
          />
        )}

        {componentId === 'CHARGING_PCB' && (
          <ChargingBoard
            isSelected={true}
            isGhost={false}
            isXray={false}
            onSelect={onSelect}
            onHover={onHover}
            onUnhover={onUnhover}
          />
        )}

        {componentId === 'VIBRATION_MOTOR' && (
          <VibrationMotor
            isSelected={true}
            isGhost={false}
            isXray={false}
            onSelect={onSelect}
            onHover={onHover}
            onUnhover={onUnhover}
          />
        )}

        {componentId === 'RGB_LED' && (
          <RGBLightPipe
            isSelected={true}
            isGhost={false}
            isXray={false}
            onSelect={onSelect}
            onHover={onHover}
            onUnhover={onUnhover}
          />
        )}

        {componentId === 'TMP117' && (
          <TMP117Module
            isSelected={true}
            isGhost={false}
            isXray={false}
            onSelect={onSelect}
            onHover={onHover}
            onUnhover={onUnhover}
          />
        )}

        {componentId === 'AD8232' && (
          <AD8232Module
            isSelected={true}
            isGhost={false}
            isXray={false}
            onSelect={onSelect}
            onHover={onHover}
            onUnhover={onUnhover}
          />
        )}

        {componentId === 'NEO_6M' && (
          <NEO6MModule
            isSelected={true}
            isGhost={false}
            isXray={false}
            onSelect={onSelect}
            onHover={onHover}
            onUnhover={onUnhover}
          />
        )}

        {componentId === 'CHASSIS' && (
          <InternalChassis
            isSelected={true}
            isGhost={false}
            isXray={false}
            onSelect={onSelect}
            onHover={onHover}
            onUnhover={onUnhover}
          />
        )}

        {componentId === 'STRAPS' && (
          <WristStrap
            isSelected={true}
            isGhost={false}
            isXray={false}
            onSelect={onSelect}
            onHover={onHover}
            onUnhover={onUnhover}
          />
        )}

        {(componentId === 'TOP_COVER' || componentId === 'BOTTOM_COVER') && (
          <Enclosure
            explodeY={0}
            isXray={false}
            isTopGhost={componentId === 'BOTTOM_COVER'}
            isBottomGhost={componentId === 'TOP_COVER'}
            isGhost={false}
            selectedComponentId={componentId}
            onSelect={onSelect}
            onHover={onHover}
            onUnhover={onUnhover}
          />
        )}
      </group>

      {/* 3. 3D Floating Pinout / Electrical Connection Annotations */}
      {pinouts.length > 0 && (
        <group position={[0, 0, 0]}>
          {pinouts.slice(0, 5).map((p, idx) => {
            const count = Math.min(pinouts.length, 5)
            // Position annotations with generous spacing towards left and front-diagonal to avoid right-panel occlusion
            const angle = -Math.PI * 0.75 + (idx / Math.max(1, count - 1)) * Math.PI * 0.85
            const radius = 2.8
            const px = Math.cos(angle) * radius
            const pz = Math.sin(angle) * radius
            const py = 0.45 + (idx % 2 === 0 ? 0.35 : -0.2)

            const titleText = `${p.pin}${p.name ? ` • ${p.name}` : ''}`
            const detailText = `${p.mcuPin || p.signal || ''}`

            const labelTex = getLabelTexture(
              titleText,
              detailText,
              '#2563eb',
              'rgba(6, 12, 20, 0.94)'
            )

            return (
              <group key={idx} position={[px, py, pz]}>
                {/* Connection leader line to component center */}
                <line>
                  <bufferGeometry>
                    <bufferAttribute
                      attach="attributes-position"
                      count={2}
                      array={new Float32Array([0, 0, 0, -px * 0.7, -py * 0.75, -pz * 0.7])}
                      itemSize={3}
                    />
                  </bufferGeometry>
                  <lineBasicMaterial color="#2563eb" transparent opacity={0.45} />
                </line>

                {/* Connection Node Golden Pin Sphere */}
                <mesh position={[-px * 0.7, -py * 0.75, -pz * 0.7]}>
                  <sphereGeometry args={[0.045, 12, 12]} />
                  <meshBasicMaterial color="#ffd700" />
                </mesh>

                {/* Floating 3D Pinout Label Card (Wide 2.2 × 0.8 units for complete text) */}
                <mesh>
                  <planeGeometry args={[2.2, 0.8]} />
                  <meshBasicMaterial 
                    map={labelTex} 
                    transparent 
                    opacity={0.96}
                    side={THREE.DoubleSide} 
                  />
                </mesh>

                {/* Outer border glow plate */}
                <mesh position={[0, 0, -0.005]}>
                  <planeGeometry args={[2.24, 0.84]} />
                  <meshBasicMaterial color="#2563eb" transparent opacity={0.25} />
                </mesh>
              </group>
            )
          })}
        </group>
      )}
    </group>
  )
}
