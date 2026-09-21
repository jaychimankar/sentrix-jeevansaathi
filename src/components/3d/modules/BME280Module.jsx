import React, { useRef, useEffect } from 'react'
import { useStore } from '../../../store'
import { getLabelTexture } from '../utils/labelTexture'
import { SCALE_MM_TO_UNITS, UNIT_TO_MM } from '../../../constants/scaling'
// SCALE: 1 scene unit = 10 mm.

export function BME280Module({ isSelected, isGhost, onSelect, onHover, onUnhover, isXray }) {
  const ref = useRef()
  const { registerComponentRef } = useStore()

  useEffect(() => {
    if (ref.current) registerComponentRef('BME280', ref)
  }, [registerComponentRef])

  const isTransparent = isGhost || isXray
  const pcbOpacity = isGhost ? 0.08 : (isXray ? 0.35 : 1)
  const lidOpacity = isGhost ? 0.12 : 1

  return (
    <group
      ref={ref}
      onClick={(e) => { e.stopPropagation(); onSelect('BME280'); }}
      onPointerOver={(e) => { e.stopPropagation(); onHover('BME280'); }}
      onPointerOut={(e) => { e.stopPropagation(); onUnhover(); }}
    >
      {/* Purple Environmental Breakout PCB */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.9, 0.05, 1.1]} />
        <meshStandardMaterial 
          color={isGhost ? '#16222f' : '#3c184e'} 
          roughness={0.6} 
          transparent={isTransparent} 
          opacity={pcbOpacity}
          depthWrite={!isTransparent} 
        />
      </mesh>

      {/* Actual BME280 Metal Lid Sensor Package (2.5 × 2.5 mm) */}
      <mesh position={[-0.08, 0.045, 0]}>
        <boxGeometry args={[0.35, 0.045, 0.35]} />
        <meshStandardMaterial 
          color={isGhost ? '#1f2e3e' : '#c5ccd4'} 
          metalness={0.92} 
          roughness={0.25} 
          transparent={isTransparent}
          opacity={lidOpacity}
          depthWrite={!isTransparent}
        />
      </mesh>

      {/* Real Barometric Pressure Aperture Vent Hole */}
      {!isGhost && (
        <mesh position={[-0.08, 0.07, 0]}>
          <cylinderGeometry args={[0.035, 0.035, 0.015, 8]} />
          <meshStandardMaterial color="#111111" roughness={0.9} />
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

      <mesh position={[0, 0.04, 0.35]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.6, 0.25]} />
        <meshBasicMaterial map={getLabelTexture('BME280', '', '#ffffff', '#3c184e')} transparent />
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
