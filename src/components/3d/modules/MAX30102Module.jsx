import React, { useRef, useEffect } from 'react'
import { useStore } from '../../../store'
import { SCALE_MM_TO_UNITS, UNIT_TO_MM } from '../../../constants/scaling'
// SCALE: 1 scene unit = 10 mm.

export function MAX30102Module({ isSelected, isGhost, onSelect, onHover, onUnhover, isXray }) {
  const ref = useRef()
  const { registerComponentRef } = useStore()

  useEffect(() => {
    if (ref.current) registerComponentRef('MAX30102', ref)
  }, [registerComponentRef])

  const isTransparent = isGhost || isXray
  const pcbOpacity = isGhost ? 0.08 : (isXray ? 0.25 : 1)
  const sensorOpacity = isGhost ? 0.10 : (isXray ? 0.35 : 1)

  return (
    <group
      ref={ref}
      onClick={(e) => { e.stopPropagation(); onSelect('MAX30102'); }}
      onPointerOver={(e) => { e.stopPropagation(); onHover('MAX30102'); }}
      onPointerOut={(e) => { e.stopPropagation(); onUnhover(); }}
    >
      {/* 1. Breakout PCB (Dark Purple FR4, Sits on Inner Chassis Base) */}
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[1.4, 0.06, 1.3]} />
        <meshStandardMaterial 
          color={isGhost ? '#16222f' : '#2a1038'} 
          roughness={0.7} 
          transparent={isTransparent}
          opacity={pcbOpacity}
          depthWrite={!isTransparent}
        />
      </mesh>

      {/* 5-Pin Header on Inner Surface */}
      {!isGhost && (
        <group position={[0, 0.09, -0.48]}>
          {[-0.36, -0.18, 0, 0.18, 0.36].map((px, i) => (
            <mesh key={i} position={[px, 0, 0]}>
              <cylinderGeometry args={[0.02, 0.02, 0.08, 8]} />
              <meshStandardMaterial color="#ffd700" metalness={0.9} roughness={0.2} />
            </mesh>
          ))}
        </group>
      )}

      {/* 2. Actual MAX30102 Optical Sensor Package (5.6 × 3.3 × 1.55 mm) */}
      {/* FACING DOWNWARD TOWARD WRIST (Negative Y) */}
      <group position={[0, -0.02, 0]}>
        {/* Molded Dark Optical Body */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.56, 0.08, 0.33]} />
          <meshStandardMaterial 
            color={isGhost ? '#16222f' : '#040609'} 
            roughness={0.12} 
            metalness={0.8} 
            transparent={isTransparent}
            opacity={sensorOpacity}
            depthWrite={!isTransparent}
          />
        </mesh>

        {/* Dual Optical Cavities on Downward Face */}
        {/* Cavity A: Dual 660 nm Red & 880 nm Infrared Emitters */}
        <mesh position={[-0.14, -0.045, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 0.02, 12]} />
          <meshStandardMaterial 
            color="#ff0033" 
            emissive="#ff0022" 
            emissiveIntensity={isGhost ? 0.2 : 2.2} 
            transparent={isTransparent}
            opacity={isGhost ? 0.15 : 1}
            toneMapped={false} 
          />
        </mesh>

        {/* Cavity B: High-Sensitivity Optical Photodetector Window */}
        <mesh position={[0.14, -0.045, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.02, 12]} />
          <meshStandardMaterial 
            color="#00ff66" 
            emissive="#00ff66" 
            emissiveIntensity={isGhost ? 0.1 : 0.6} 
            transparent={isTransparent}
            opacity={isGhost ? 0.15 : 1}
            toneMapped={false} 
          />
        </mesh>
      </group>

      {/* 3. SEPARATE OPTICAL GASKET (Dark Soft Elastomeric Silicone Ring) */}
      {/* Seals optical path to the bottom enclosure aperture */}
      <group position={[0, -0.06, 0]}>
        <mesh>
          <cylinderGeometry args={[0.38, 0.42, 0.06, 24, 1, true]} />
          <meshStandardMaterial 
            color={isGhost ? '#16222f' : '#08080a'} 
            roughness={0.95} 
            metalness={0.05} 
            transparent={isTransparent}
            opacity={isGhost ? 0.08 : 1}
            depthWrite={!isTransparent}
          />
        </mesh>
        <mesh position={[0, -0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.36, 0.48, 24]} />
          <meshStandardMaterial 
            color={isGhost ? '#16222f' : '#08080a'} 
            roughness={0.95} 
            transparent={isTransparent}
            opacity={isGhost ? 0.08 : 1}
            depthWrite={!isTransparent}
          />
        </mesh>
      </group>

      {/* Selection Highlight */}
      {isSelected && (
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.5, 0.22, 1.4]} />
          <meshBasicMaterial color="#2563eb" wireframe />
        </mesh>
      )}
    </group>
  )
}
