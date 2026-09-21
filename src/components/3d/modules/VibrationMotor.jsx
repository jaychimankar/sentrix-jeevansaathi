import React, { useRef, useEffect } from 'react'
import { useStore } from '../../../store'

export function VibrationMotor({ isSelected, isGhost, onSelect, onHover, onUnhover, isXray }) {
  const ref = useRef()
  const { registerComponentRef } = useStore()

  useEffect(() => {
    if (ref.current) registerComponentRef('VIBRATION_MOTOR', ref)
  }, [registerComponentRef])

  const isTransparent = isGhost || isXray
  const motorOpacity = isGhost ? 0.10 : 1

  return (
    <group
      ref={ref}
      onClick={(e) => { e.stopPropagation(); onSelect('VIBRATION_MOTOR'); }}
      onPointerOver={(e) => { e.stopPropagation(); onHover('VIBRATION_MOTOR'); }}
      onPointerOut={(e) => { e.stopPropagation(); onUnhover(); }}
    >
      {/* 1. Metallic Stainless Disc Body (Ø10.0 × 3.0 mm) */}
      <mesh>
        <cylinderGeometry args={[0.38, 0.38, 0.14, 24]} />
        <meshStandardMaterial 
          color={isGhost ? '#1f2e3e' : '#b5bcc4'} 
          metalness={0.9} 
          roughness={0.22} 
          transparent={isTransparent}
          opacity={motorOpacity}
          depthWrite={!isTransparent}
        />
      </mesh>

      {/* 2. Black Rubber Vibration Cushion Ring */}
      <mesh position={[0, -0.05, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.04, 24]} />
        <meshStandardMaterial 
          color={isGhost ? '#16222f' : '#15171a'} 
          roughness={0.9} 
          transparent={isTransparent}
          opacity={motorOpacity}
          depthWrite={!isTransparent}
        />
      </mesh>

      {/* 3. Small Silicone Lead Wires (Blue and Red) */}
      <mesh position={[0.26, 0.03, -0.16]} rotation={[0, 0, Math.PI / 4]}>
        <cylinderGeometry args={[0.02, 0.02, 0.28, 8]} />
        <meshStandardMaterial color="#0066cc" />
      </mesh>
      <mesh position={[0.31, 0.03, -0.11]} rotation={[0, 0, Math.PI / 4]}>
        <cylinderGeometry args={[0.02, 0.02, 0.28, 8]} />
        <meshStandardMaterial color="#cc2200" />
      </mesh>

      {isSelected && (
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.45, 0.45, 0.24, 24]} />
          <meshBasicMaterial color="#2563eb" wireframe />
        </mesh>
      )}
    </group>
  )
}
