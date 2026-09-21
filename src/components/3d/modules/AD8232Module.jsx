import React, { useRef, useEffect } from 'react'
import { useStore } from '../../../store'

export function AD8232Module({ isSelected, isGhost, onSelect, onHover, onUnhover, isXray }) {
  const meshRef = useRef()

  useEffect(() => {
    if (meshRef.current) {
      useStore.getState().registerComponentRef('AD8232', meshRef)
    }
  }, [])

  const baseOpacity = isGhost ? 0.15 : (isXray ? 0.6 : 1.0)
  const emissive = isSelected ? '#dc2626' : '#000000'
  const emissiveIntensity = isSelected ? 0.4 : 0

  return (
    <group
      ref={meshRef}
      onClick={(e) => {
        e.stopPropagation()
        onSelect('AD8232')
      }}
      onPointerOver={(e) => {
        e.stopPropagation()
        onHover('AD8232')
      }}
      onPointerOut={(e) => {
        e.stopPropagation()
        onUnhover()
      }}
    >
      {/* Main PCB Module (28.0 × 18.0 × 2.0 mm) - Cardiac Red PCB */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[2.8, 0.2, 1.8]} />
        <meshStandardMaterial
          color="#dc2626"
          metalness={0.1}
          roughness={0.75}
          transparent={isGhost || isXray}
          opacity={baseOpacity}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>

      {/* AD8232 QFN Package (4.0 × 4.0 × 0.8 mm) - Main IC */}
      <mesh position={[0, 0.14, 0]} castShadow>
        <boxGeometry args={[0.4, 0.08, 0.4]} />
        <meshStandardMaterial
          color="#1a1a1a"
          metalness={0.5}
          roughness={0.2}
          transparent={isGhost || isXray}
          opacity={baseOpacity}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>

      {/* IC Marking/Label (white dot) */}
      <mesh position={[-0.12, 0.19, 0.12]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.05, 16]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.9}
          depthWrite={false}
        />
      </mesh>

      {/* Instrumentation Amplifier Circuit (SMD Components) */}
      {[
        { pos: [0.6, 0.12, 0.3], size: [0.15, 0.06, 0.1], color: '#3d2d1f' },
        { pos: [0.6, 0.12, -0.3], size: [0.15, 0.06, 0.1], color: '#3d2d1f' },
        { pos: [-0.6, 0.12, 0.3], size: [0.12, 0.05, 0.08], color: '#555555' },
        { pos: [-0.6, 0.12, -0.3], size: [0.12, 0.05, 0.08], color: '#555555' },
      ].map((comp, idx) => (
        <mesh key={idx} position={comp.pos} castShadow>
          <boxGeometry args={comp.size} />
          <meshStandardMaterial
            color={comp.color}
            metalness={0.3}
            roughness={0.6}
            transparent={isGhost || isXray}
            opacity={baseOpacity}
          />
        </mesh>
      ))}

      {/* Pin Headers (Left side - 6 pins) */}
      {[-0.7, -0.42, -0.14, 0.14, 0.42, 0.7].map((zPos, idx) => (
        <mesh key={`left-${idx}`} position={[-1.5, 0, zPos]} castShadow>
          <boxGeometry args={[0.1, 0.2, 0.08]} />
          <meshStandardMaterial
            color="#c0c0c0"
            metalness={0.85}
            roughness={0.15}
            transparent={isGhost || isXray}
            opacity={baseOpacity}
          />
        </mesh>
      ))}

      {/* Pin Headers (Right side - 6 pins) */}
      {[-0.7, -0.42, -0.14, 0.14, 0.42, 0.7].map((zPos, idx) => (
        <mesh key={`right-${idx}`} position={[1.5, 0, zPos]} castShadow>
          <boxGeometry args={[0.1, 0.2, 0.08]} />
          <meshStandardMaterial
            color="#c0c0c0"
            metalness={0.85}
            roughness={0.15}
            transparent={isGhost || isXray}
            opacity={baseOpacity}
          />
        </mesh>
      ))}

      {/* ECG Electrode Connector Pads (3.5mm jack style connectors) */}
      <group position={[0, 0, -1.1]}>
        {/* LA (Left Arm) Electrode Connector - Yellow */}
        <mesh position={[-0.6, 0.15, 0]} castShadow>
          <cylinderGeometry args={[0.12, 0.12, 0.3, 16]} />
          <meshStandardMaterial
            color="#ffd700"
            metalness={0.7}
            roughness={0.3}
            transparent={isGhost || isXray}
            opacity={baseOpacity}
          />
        </mesh>

        {/* RA (Right Arm) Electrode Connector - Red */}
        <mesh position={[0, 0.15, 0]} castShadow>
          <cylinderGeometry args={[0.12, 0.12, 0.3, 16]} />
          <meshStandardMaterial
            color="#ff0000"
            metalness={0.7}
            roughness={0.3}
            transparent={isGhost || isXray}
            opacity={baseOpacity}
          />
        </mesh>

        {/* RL (Right Leg / Ground) Electrode Connector - Black */}
        <mesh position={[0.6, 0.15, 0]} castShadow>
          <cylinderGeometry args={[0.12, 0.12, 0.3, 16]} />
          <meshStandardMaterial
            color="#1a1a1a"
            metalness={0.7}
            roughness={0.3}
            transparent={isGhost || isXray}
            opacity={baseOpacity}
          />
        </mesh>
      </group>

      {/* ECG Electrode Cables/Leads (showing connection path to user) */}
      {!isGhost && [
        { start: [-0.6, 0.3, -1.1], color: '#ffd700', label: 'LA' },
        { start: [0, 0.3, -1.1], color: '#ff0000', label: 'RA' },
        { start: [0.6, 0.3, -1.1], color: '#1a1a1a', label: 'RL' },
      ].map((lead, idx) => (
        <group key={idx}>
          {/* Cable segment */}
          <mesh position={[lead.start[0], lead.start[1] - 0.5, lead.start[2] - 0.8]} rotation={[Math.PI / 4, 0, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 1.6, 8]} />
            <meshStandardMaterial
              color={lead.color}
              metalness={0.2}
              roughness={0.8}
              transparent={isXray}
              opacity={isXray ? 0.4 : 1.0}
            />
          </mesh>

          {/* Electrode pad (dry electrode style) */}
          <mesh position={[lead.start[0], lead.start[1] - 1.5, lead.start[2] - 1.8]} castShadow>
            <cylinderGeometry args={[0.15, 0.15, 0.05, 16]} />
            <meshStandardMaterial
              color="#808080"
              metalness={0.6}
              roughness={0.4}
              transparent={isXray}
              opacity={isXray ? 0.5 : 1.0}
            />
          </mesh>
        </group>
      ))}

      {/* Output Signal Wire to ESP32 ADC */}
      {!isGhost && (
        <mesh position={[0, 0.1, 0.9]} rotation={[0, 0, -Math.PI / 8]}>
          <cylinderGeometry args={[0.02, 0.02, 1.8, 8]} />
          <meshStandardMaterial
            color="#4ade80"
            metalness={0.3}
            roughness={0.6}
            transparent={isXray}
            opacity={isXray ? 0.4 : 1.0}
          />
        </mesh>
      )}

      {/* Lead-Off Detection Indicators (when not connected) */}
      {isSelected && !isGhost && (
        <>
          <mesh position={[-0.6, 0.5, -1.1]}>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshBasicMaterial color="#ffd700" opacity={0.7} transparent />
          </mesh>
          <mesh position={[0, 0.5, -1.1]}>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshBasicMaterial color="#ff0000" opacity={0.7} transparent />
          </mesh>
          <mesh position={[0.6, 0.5, -1.1]}>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshBasicMaterial color="#1a1a1a" opacity={0.7} transparent />
          </mesh>
        </>
      )}

      {/* Silkscreen Labels */}
      {!isGhost && (
        <>
          <mesh position={[0, 0.11, 0.6]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[1.2, 0.2]} />
            <meshBasicMaterial
              color="#ffffff"
              transparent
              opacity={0.9}
              depthWrite={false}
            />
          </mesh>
          <mesh position={[0, 0.11, -0.8]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[1.5, 0.15]} />
            <meshBasicMaterial
              color="#ffff00"
              transparent
              opacity={0.85}
              depthWrite={false}
            />
          </mesh>
        </>
      )}
    </group>
  )
}
