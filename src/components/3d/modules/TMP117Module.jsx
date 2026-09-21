import React, { useRef, useEffect } from 'react'
import { useStore } from '../../../store'

export function TMP117Module({ isSelected, isGhost, onSelect, onHover, onUnhover, isXray }) {
  const meshRef = useRef()

  useEffect(() => {
    if (meshRef.current) {
      useStore.getState().registerComponentRef('TMP117', meshRef)
    }
  }, [])

  const baseOpacity = isGhost ? 0.15 : (isXray ? 0.6 : 1.0)
  const emissive = isSelected ? '#2563eb' : '#000000'
  const emissiveIntensity = isSelected ? 0.3 : 0

  return (
    <group
      ref={meshRef}
      onClick={(e) => {
        e.stopPropagation()
        onSelect('TMP117')
      }}
      onPointerOver={(e) => {
        e.stopPropagation()
        onHover('TMP117')
      }}
      onPointerOut={(e) => {
        e.stopPropagation()
        onUnhover()
      }}
    >
      {/* Main TMP117 WSON-6 Package (2.0 × 2.0 × 0.8 mm) - Silicon Die */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[0.2, 0.08, 0.2]} />
        <meshStandardMaterial
          color="#1a1a1a"
          metalness={0.4}
          roughness={0.3}
          transparent={isGhost || isXray}
          opacity={baseOpacity}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>

      {/* Gold Thermal Contact Pad (Bottom - contacts skin via thermal via) */}
      <mesh position={[0, -0.045, 0]} castShadow>
        <boxGeometry args={[0.15, 0.01, 0.15]} />
        <meshStandardMaterial
          color="#ffd700"
          metalness={0.9}
          roughness={0.1}
          transparent={isGhost || isXray}
          opacity={baseOpacity}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>

      {/* Breakout PCB (12.0 × 10.0 × 1.2 mm) - Medical Blue Substrate */}
      <mesh position={[0, -0.1, 0]} castShadow>
        <boxGeometry args={[1.2, 0.12, 1.0]} />
        <meshStandardMaterial
          color="#2563eb"
          metalness={0.1}
          roughness={0.7}
          transparent={isGhost || isXray}
          opacity={baseOpacity * 0.9}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>

      {/* Pin Headers (6 pins arranged along edge) */}
      {[-0.4, -0.24, -0.08, 0.08, 0.24, 0.4].map((xPos, idx) => (
        <group key={idx} position={[xPos, -0.1, 0.55]}>
          {/* Pin body */}
          <mesh castShadow>
            <boxGeometry args={[0.06, 0.12, 0.08]} />
            <meshStandardMaterial
              color="#c0c0c0"
              metalness={0.8}
              roughness={0.2}
              transparent={isGhost || isXray}
              opacity={baseOpacity}
            />
          </mesh>
          {/* Pin label indicator (white dot) */}
          <mesh position={[0, 0.07, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 0.01, 8]} />
            <meshStandardMaterial
              color={idx === 0 ? '#ff0000' : '#ffffff'}
              transparent={isGhost || isXray}
              opacity={baseOpacity}
            />
          </mesh>
        </group>
      ))}

      {/* Thermal Via Copper Trace Path to Bottom Skin Contact */}
      <mesh position={[0, -0.16, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.12, 0.3, 16]} />
        <meshStandardMaterial
          color="#d4af37"
          metalness={0.85}
          roughness={0.15}
          transparent={isGhost || isXray}
          opacity={baseOpacity * 0.7}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>

      {/* Silkscreen Label */}
      {!isGhost && (
        <mesh position={[0, -0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.8, 0.15]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.9}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* I2C Bus Connection Wire (to ESP32-S3) */}
      {!isGhost && (
        <mesh position={[0.6, -0.05, -0.3]} rotation={[0, 0, Math.PI / 6]}>
          <cylinderGeometry args={[0.015, 0.015, 1.2, 8]} />
          <meshStandardMaterial
            color="#ff6b6b"
            metalness={0.3}
            roughness={0.6}
            transparent={isXray}
            opacity={isXray ? 0.4 : 1.0}
          />
        </mesh>
      )}

      {/* Precision Temp Sensing Indicator (when selected) */}
      {isSelected && !isGhost && (
        <mesh position={[0, 0.15, 0]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshBasicMaterial color="#ff4444" opacity={0.8} transparent />
        </mesh>
      )}
    </group>
  )
}
