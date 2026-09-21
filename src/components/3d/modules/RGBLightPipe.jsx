import React, { useRef, useEffect } from 'react'
import { useStore } from '../../../store'

export function RGBLightPipe({ isSelected, isGhost, onSelect, onHover, onUnhover, isXray }) {
  const ref = useRef()
  const { registerComponentRef, riskLevel } = useStore()

  useEffect(() => {
    if (ref.current) registerComponentRef('RGB_LED', ref)
  }, [registerComponentRef])

  const riskColor = riskLevel === 'LOW' ? '#00ff88' : riskLevel === 'MEDIUM' ? '#ffcc00' : '#ff0044'
  const isTransparent = isGhost || isXray

  return (
    <group
      ref={ref}
      onClick={(e) => { e.stopPropagation(); onSelect('RGB_LED'); }}
      onPointerOver={(e) => { e.stopPropagation(); onHover('RGB_LED'); }}
      onPointerOut={(e) => { e.stopPropagation(); onUnhover(); }}
    >
      {/* 1. Small SMD 5050 RGB LED Package on Mainboard */}
      <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={[0.2, 0.06, 0.2]} />
        <meshStandardMaterial 
          color={isGhost ? '#16222f' : '#f0f0f0'} 
          roughness={0.4} 
          transparent={isTransparent}
          opacity={isGhost ? 0.1 : 1}
        />
      </mesh>

      {/* 2. Cylindrical PMMA Optical Light Pipe Conduit (Translucent) */}
      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.3, 16]} />
        <meshPhysicalMaterial 
          color={riskColor} 
          emissive={riskColor}
          emissiveIntensity={isGhost ? 0.2 : 1.2}
          transmission={0.65}
          opacity={isGhost ? 0.12 : 0.92}
          transparent
          roughness={0.15}
          toneMapped={false}
        />
      </mesh>

      {/* 3. Top Diffused Window Lens */}
      <mesh position={[0, 0.23, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.02, 16]} />
        <meshBasicMaterial 
          color={riskColor} 
          toneMapped={false} 
          transparent={isTransparent}
          opacity={isGhost ? 0.15 : 1}
        />
      </mesh>

      {isSelected && (
        <mesh position={[0, 0.08, 0]}>
          <cylinderGeometry args={[0.16, 0.16, 0.38, 16]} />
          <meshBasicMaterial color="#2563eb" wireframe />
        </mesh>
      )}
    </group>
  )
}
