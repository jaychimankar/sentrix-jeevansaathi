import React, { useRef, useEffect } from 'react'
import { useStore } from '../../../store'
import { getLabelTexture } from '../utils/labelTexture'
import { SCALE_MM_TO_UNITS, UNIT_TO_MM } from '../../../constants/scaling'
// SCALE: 1 scene unit = 10 mm.

export function ENS160Module({ isSelected, isGhost, onSelect, onHover, onUnhover, isXray }) {
  const ref = useRef()
  const { registerComponentRef } = useStore()

  useEffect(() => {
    if (ref.current) registerComponentRef('ENS160', ref)
  }, [registerComponentRef])

  const isTransparent = isGhost || isXray
  const pcbOpacity = isGhost ? 0.08 : (isXray ? 0.35 : 1)
  const pkgOpacity = isGhost ? 0.12 : 1

  return (
    <group
      ref={ref}
      onClick={(e) => { e.stopPropagation(); onSelect('ENS160'); }}
      onPointerOver={(e) => { e.stopPropagation(); onHover('ENS160'); }}
      onPointerOut={(e) => { e.stopPropagation(); onUnhover(); }}
    >
      {/* Black Environmental Breakout PCB */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.9, 0.05, 1.1]} />
        <meshStandardMaterial 
          color={isGhost ? '#16222f' : '#161c1a'} 
          roughness={0.6} 
          transparent={isTransparent} 
          opacity={pcbOpacity}
          depthWrite={!isTransparent} 
        />
      </mesh>

      {/* Actual ENS160 Gas Sensor Package (3.0 × 3.0 × 0.9 mm) */}
      <mesh position={[-0.08, 0.045, 0]}>
        <boxGeometry args={[0.42, 0.045, 0.42]} />
        <meshStandardMaterial 
          color={isGhost ? '#1f2e3e' : '#2d3339'} 
          metalness={0.7} 
          roughness={0.4} 
          transparent={isTransparent}
          opacity={pkgOpacity}
          depthWrite={!isTransparent}
        />
      </mesh>

      {/* Micro-Machined MOX Hotplate Membrane Active Window */}
      {!isGhost && (
        <mesh position={[-0.08, 0.07, 0]}>
          <boxGeometry args={[0.2, 0.012, 0.2]} />
          <meshStandardMaterial color="#a06020" metalness={0.6} roughness={0.5} />
        </mesh>
      )}

      {/* Breakout Header Pins */}
      <group position={[0.32, 0.05, 0]}>
        {[-0.35, -0.12, 0.12, 0.35].map((hz, i) => (
          <mesh key={i} position={[0, 0.03, hz]}>
            <cylinderGeometry args={[0.018, 0.018, 0.08, 8]} />
            <meshStandardMaterial color="#ffd700" metalness={0.9} roughness={0.2} />
          </mesh>
        ))}
      </group>

      <mesh position={[0, 0.04, -0.35]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.6, 0.25]} />
        <meshBasicMaterial map={getLabelTexture('ENS160', '', '#ffffff', '#161c1a')} transparent />
      </mesh>


      {isSelected && (
        <mesh position={[0, 0.04, 0]}>
          <boxGeometry args={[1.0, 0.14, 1.2]} />
          <meshBasicMaterial color="#2563eb" wireframe />
        </mesh>
      )}
    </group>
  )
}
