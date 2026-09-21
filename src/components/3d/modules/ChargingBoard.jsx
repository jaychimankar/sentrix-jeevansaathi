import React, { useRef, useEffect } from 'react'
import { useStore } from '../../../store'

export function ChargingBoard({ isSelected, isGhost, onSelect, onHover, onUnhover, isXray }) {
  const ref = useRef()
  const { registerComponentRef } = useStore()

  useEffect(() => {
    if (ref.current) registerComponentRef('CHARGING_PCB', ref)
  }, [registerComponentRef])

  const isTransparent = isGhost || isXray
  const pcbOpacity = isGhost ? 0.08 : (isXray ? 0.35 : 1)
  const usbcOpacity = isGhost ? 0.12 : 1

  return (
    <group
      ref={ref}
      onClick={(e) => { e.stopPropagation(); onSelect('CHARGING_PCB'); }}
      onPointerOver={(e) => { e.stopPropagation(); onHover('CHARGING_PCB'); }}
      onPointerOut={(e) => { e.stopPropagation(); onUnhover(); }}
    >
      {/* 1. Green FR4 PCB */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.7, 0.06, 0.9]} />
        <meshStandardMaterial 
          color={isGhost ? '#16222f' : '#1a2e22'} 
          roughness={0.7} 
          transparent={isTransparent}
          opacity={pcbOpacity}
          depthWrite={!isTransparent}
        />
      </mesh>

      {/* 2. USB-C Metallic Receptacle (Aligned with case cutout) */}
      <group position={[-0.38, 0.03, 0]}>
        {/* Outer Metal Shield Sleeve */}
        <mesh>
          <boxGeometry args={[0.3, 0.17, 0.62]} />
          <meshStandardMaterial 
            color={isGhost ? '#1f2e3e' : '#c0cad2'} 
            metalness={0.92} 
            roughness={0.2} 
            transparent={isTransparent}
            opacity={usbcOpacity}
            depthWrite={!isTransparent}
          />
        </mesh>
        {/* Internal Hollow Tongue Opening */}
        {!isGhost && (
          <mesh position={[-0.13, 0, 0]}>
            <boxGeometry args={[0.06, 0.1, 0.46]} />
            <meshStandardMaterial color="#080808" roughness={0.9} />
          </mesh>
        )}
        {/* Inner Golden Pin Tongue */}
        {!isGhost && (
          <mesh position={[-0.11, 0, 0]}>
            <boxGeometry args={[0.05, 0.03, 0.3]} />
            <meshStandardMaterial color="#ffd700" metalness={0.9} roughness={0.2} />
          </mesh>
        )}
      </group>

      {/* 3. TP4056 Linear Charge Controller IC */}
      <mesh position={[0.14, 0.06, 0]}>
        <boxGeometry args={[0.24, 0.07, 0.28]} />
        <meshStandardMaterial color="#111111" roughness={0.5} />
      </mesh>

      {/* Charging Status SMD LED */}
      <mesh position={[0.14, 0.06, 0.28]}>
        <boxGeometry args={[0.06, 0.04, 0.06]} />
        <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={0.8} />
      </mesh>

      {isSelected && (
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.82, 0.22, 1.05]} />
          <meshBasicMaterial color="#2563eb" wireframe />
        </mesh>
      )}
    </group>
  )
}
