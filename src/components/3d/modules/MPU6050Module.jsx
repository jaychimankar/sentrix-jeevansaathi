import React, { useRef, useEffect } from 'react'
import { useStore } from '../../../store'
import { getLabelTexture } from '../utils/labelTexture'
import { SCALE_MM_TO_UNITS, UNIT_TO_MM } from '../../../constants/scaling'
// SCALE: 1 scene unit = 10 mm.

export function MPU6050Module({ isSelected, isGhost, onSelect, onHover, onUnhover, isXray }) {
  const ref = useRef()
  const { registerComponentRef } = useStore()

  useEffect(() => {
    if (ref.current) registerComponentRef('MPU6050', ref)
  }, [registerComponentRef])

  const isTransparent = isGhost || isXray
  const pcbOpacity = isGhost ? 0.08 : (isXray ? 0.35 : 1)
  const chipOpacity = isGhost ? 0.10 : 1

  return (
    <group
      ref={ref}
      onClick={(e) => { e.stopPropagation(); onSelect('MPU6050'); }}
      onPointerOver={(e) => { e.stopPropagation(); onHover('MPU6050'); }}
      onPointerOut={(e) => { e.stopPropagation(); onUnhover(); }}
    >
      {/* 1. Deep Blue Breakout PCB */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.55, 0.06, 2.0]} />
        <meshStandardMaterial 
          color={isGhost ? '#16222f' : '#083358'} 
          roughness={0.6} 
          transparent={isTransparent} 
          opacity={pcbOpacity}
          depthWrite={!isTransparent} 
        />
      </mesh>

      {/* 2. Actual QFN-24 Sensor Package (4.0 × 4.0 × 0.9 mm) */}
      <mesh position={[0, 0.055, 0.15]}>
        <boxGeometry args={[0.55, 0.065, 0.55]} />
        <meshStandardMaterial 
          color={isGhost ? '#16222f' : '#1a1a1a'} 
          roughness={0.4} 
          transparent={isTransparent}
          opacity={chipOpacity}
          depthWrite={!isTransparent}
        />
      </mesh>

      {/* IC Marking Text */}
      {!isGhost && (
        <mesh position={[0, 0.09, 0.15]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.5, 0.22]} />
          <meshBasicMaterial map={getLabelTexture('MPU-6050', '', '#ffffff', '#1a1a1a')} transparent />
        </mesh>
      )}


      {/* 3. 8-Pin Breakout Header */}
      <group position={[0.58, 0.07, 0]}>
        <mesh>
          <boxGeometry args={[0.18, 0.08, 1.7]} />
          <meshStandardMaterial color="#111111" roughness={0.8} />
        </mesh>
        {[-0.65, -0.45, -0.25, -0.05, 0.15, 0.35, 0.55, 0.75].map((hz, idx) => (
          <mesh key={idx} position={[0, 0.05, hz]}>
            <cylinderGeometry args={[0.02, 0.02, 0.1, 8]} />
            <meshStandardMaterial color="#ffd700" metalness={0.9} roughness={0.2} />
          </mesh>
        ))}
      </group>

      {/* Supporting Passives */}
      <mesh position={[-0.45, 0.045, 0.2]}>
        <boxGeometry args={[0.12, 0.04, 0.08]} />
        <meshStandardMaterial color="#c0a060" metalness={0.7} />
      </mesh>

      {/* 4. Small Tri-Axis Visualization (Shown ONLY when selected) */}
      {isSelected && (
        <group position={[0, 0.16, 0.15]}>
          {/* X Axis (Red) */}
          <mesh position={[0.2, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
            <cylinderGeometry args={[0.015, 0.015, 0.4, 8]} />
            <meshBasicMaterial color="#ff0000" />
          </mesh>
          {/* Y Axis (Green - Up) */}
          <mesh position={[0, 0.2, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 0.4, 8]} />
            <meshBasicMaterial color="#00ff00" />
          </mesh>
          {/* Z Axis (Blue - Forward) */}
          <mesh position={[0, 0, 0.2]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 0.4, 8]} />
            <meshBasicMaterial color="#0088ff" />
          </mesh>
        </group>
      )}

      {/* Selection Border */}
      {isSelected && (
        <mesh position={[0, 0.05, 0]}>
          <boxGeometry args={[1.65, 0.16, 2.1]} />
          <meshBasicMaterial color="#2563eb" wireframe />
        </mesh>
      )}
    </group>
  )
}
