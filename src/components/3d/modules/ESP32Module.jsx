import React, { useRef, useEffect } from 'react'
import { useStore } from '../../../store'
import { getLabelTexture } from '../utils/labelTexture'
import { SCALE_MM_TO_UNITS, UNIT_TO_MM } from '../../../constants/scaling'
// SCALE: 1 scene unit = 10 mm. Dimensions already scaled.

export function ESP32Module({ isSelected, isGhost, onSelect, onHover, onUnhover, isXray }) {
  const ref = useRef()
  const { registerComponentRef, isAiCoreClicked, activeTab } = useStore()
  const isAiActive = isAiCoreClicked || activeTab === 'AI_CORE' || activeTab === 'SENSOR_FUSION'

  useEffect(() => {
    if (ref.current) registerComponentRef('ESP32_S3', ref)
  }, [registerComponentRef])

  const isTransparent = isGhost || (isXray && !isAiActive)
  const pcbOpacity = isGhost ? 0.08 : ((isXray && !isAiActive) ? 0.35 : 1)
  const shieldOpacity = isGhost ? 0.12 : 1

  return (
    <group
      ref={ref}
      onClick={(e) => { e.stopPropagation(); onSelect('ESP32_S3'); }}
      onPointerOver={(e) => { e.stopPropagation(); onHover('ESP32_S3'); }}
      onPointerOut={(e) => { e.stopPropagation(); onUnhover(); }}
    >
      {/* 1. Mainboard Multi-Layer PCB (Representative Module: ~25.5 × 18.0 × 1.6 mm) */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2.55, 0.08, 1.8]} />
        <meshStandardMaterial 
          color={isGhost ? '#16222f' : '#121614'} 
          roughness={0.7} 
          metalness={0.2}
          transparent={isTransparent}
          opacity={pcbOpacity}
          depthWrite={!isTransparent}
        />
      </mesh>

      {/* Gold Edge Header Castellations / Pins */}
      {!isGhost && [-1.22, 1.22].map((hx, i) => (
        <group key={i} position={[hx, 0, 0]}>
          {[-0.7, -0.42, -0.14, 0.14, 0.42, 0.7].map((pz, j) => (
            <mesh key={j} position={[0, 0.045, pz]}>
              <boxGeometry args={[0.1, 0.04, 0.14]} />
              <meshStandardMaterial color="#ffd700" metalness={0.9} roughness={0.2} />
            </mesh>
          ))}
        </group>
      ))}

      {/* 2. ESP32-S3 Metallic RF Shield Can */}
      <mesh position={[0.12, 0.08, 0.15]}>
        <boxGeometry args={[1.65, 0.09, 1.35]} />
        <meshStandardMaterial 
          color={isGhost ? '#1f2e3e' : '#b4c0c8'} 
          metalness={0.88} 
          roughness={0.28}
          transparent={isTransparent}
          opacity={shieldOpacity}
          emissive={(isAiActive && !isGhost) ? '#2563eb' : '#000000'}
          emissiveIntensity={(isAiActive && !isGhost) ? 0.45 : 0}
        />
      </mesh>

      {/* Laser Engraved Identification */}
      {!isGhost && (
        <mesh position={[0.12, 0.13, 0.15]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.4, 0.9]} />
          <meshBasicMaterial 
            map={getLabelTexture('ESP32-S3', 'EDGE-AI CORE', '#1e2830', '#a8b6c0')} 
            transparent 
          />
        </mesh>
      )}


      {/* 3. Inverted-F PCB Meandered Antenna Zone */}
      <group position={[0.12, 0.045, -0.72]}>
        <mesh>
          <boxGeometry args={[1.7, 0.015, 0.32]} />
          <meshStandardMaterial color="#0c120e" roughness={0.9} />
        </mesh>
        {/* Copper / Gold Antenna Trace */}
        <mesh position={[0, 0.008, 0]}>
          <boxGeometry args={[1.4, 0.006, 0.22]} />
          <meshStandardMaterial color="#ffd700" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* Supporting SMD Passives (Crystal, Decoupling Caps) */}
      <mesh position={[-0.85, 0.06, 0.2]}>
        <boxGeometry args={[0.22, 0.06, 0.18]} />
        <meshStandardMaterial color="#a08560" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[-0.85, 0.06, -0.15]}>
        <boxGeometry args={[0.25, 0.06, 0.38]} />
        <meshStandardMaterial color="#c0c5cc" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Standoff Mounting Holes with Brass Bushing */}
      {[
        [-1.08, -0.75],
        [1.08, -0.75],
        [-1.08, 0.75],
        [1.08, 0.75]
      ].map(([cx, cz], k) => (
        <mesh key={k} position={[cx, 0.045, cz]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.04, 0.1, 16]} />
          <meshStandardMaterial color="#c4a558" metalness={0.9} roughness={0.3} />
        </mesh>
      ))}

      {/* Selection / AI Core Active Glow Border */}
      {(isSelected || isAiActive) && (
        <mesh position={[0, 0.06, 0]}>
          <boxGeometry args={[2.62, 0.18, 1.88]} />
          <meshBasicMaterial color="#2563eb" wireframe />
        </mesh>
      )}
    </group>
  )
}
