import React, { useRef, useEffect } from 'react'
import { useStore } from '../../../store'
import { getLabelTexture } from '../utils/labelTexture'

export function BatteryPack({ isSelected, isGhost, onSelect, onHover, onUnhover, isXray }) {
  const ref = useRef()
  const { registerComponentRef } = useStore()

  useEffect(() => {
    if (ref.current) registerComponentRef('BATTERY', ref)
  }, [registerComponentRef])

  const isTransparent = isGhost || isXray
  const pouchOpacity = isGhost ? 0.08 : (isXray ? 0.3 : 1)

  return (
    <group
      ref={ref}
      onClick={(e) => { e.stopPropagation(); onSelect('BATTERY'); }}
      onPointerOver={(e) => { e.stopPropagation(); onHover('BATTERY'); }}
      onPointerOut={(e) => { e.stopPropagation(); onUnhover(); }}
    >
      {/* 1. Silver Aluminum Foil Pouch Body (30 × 25 × 5 mm) */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2.4, 0.28, 2.9]} />
        <meshStandardMaterial 
          color={isGhost ? '#16222f' : '#9aa5b0'} 
          metalness={0.78} 
          roughness={0.32}
          transparent={isTransparent}
          opacity={pouchOpacity}
          depthWrite={!isTransparent}
        />
      </mesh>

      {/* Heat Sealed Perimeter Flange */}
      <mesh position={[0, 0, -1.48]}>
        <boxGeometry args={[2.44, 0.05, 0.12]} />
        <meshStandardMaterial 
          color={isGhost ? '#16222f' : '#828d98'} 
          metalness={0.8} 
          roughness={0.3} 
          transparent={isTransparent}
          opacity={pouchOpacity}
          depthWrite={!isTransparent}
        />
      </mesh>

      {/* 2. Yellow Kapton Tape Insulation Collar at Terminal */}
      <mesh position={[0, 0, 1.44]}>
        <boxGeometry args={[2.42, 0.29, 0.22]} />
        <meshStandardMaterial 
          color={isGhost ? '#16222f' : '#c89618'} 
          roughness={0.4} 
          transparent={true} 
          opacity={isGhost ? 0.1 : 0.85} 
          depthWrite={!isTransparent}
        />
      </mesh>

      {/* Printed Technical Cell Rating */}
      {!isXray && !isGhost && (
        <mesh position={[0, 0.145, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2.0, 1.0]} />
          <meshBasicMaterial 
            map={getLabelTexture('3.7V 500mAh 1.85Wh', 'Li-Po PROTECTED CELL', '#1e2630', '#8e9aa5')} 
            transparent 
          />
        </mesh>
      )}


      {/* 3. Red & Black Silicone Wire Leads + JST Receptacle */}
      <group position={[0.35, 0.04, 1.6]}>
        {/* Red Lead (+) */}
        <mesh position={[-0.1, 0, 0.12]}>
          <boxGeometry args={[0.05, 0.05, 0.24]} />
          <meshStandardMaterial color="#d62828" roughness={0.6} />
        </mesh>
        {/* Black Lead (-) */}
        <mesh position={[0.1, 0, 0.12]}>
          <boxGeometry args={[0.05, 0.05, 0.24]} />
          <meshStandardMaterial color="#111111" roughness={0.8} />
        </mesh>
        {/* White JST Receptacle */}
        <mesh position={[0, 0, 0.28]}>
          <boxGeometry args={[0.32, 0.14, 0.18]} />
          <meshStandardMaterial color="#f0f4f8" roughness={0.5} />
        </mesh>
      </group>

      {isSelected && (
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[2.5, 0.38, 3.1]} />
          <meshBasicMaterial color="#2563eb" wireframe />
        </mesh>
      )}
    </group>
  )
}
