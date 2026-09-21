import React from 'react'
import { useStore } from '../../store'
import { getLabelTexture } from './utils/labelTexture'

export function SkinContactWrist() {
  const { viewMode } = useStore()
  const isSkinContactMode = viewMode === 'SKIN_CONTACT'

  if (!isSkinContactMode) return null

  return (
    <group position={[0, -1.05, 0]}>
      {/* 1. Subtle Anatomical Forearm Segment */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[2.8, 2.9, 14.0, 32, 1, false, 0, Math.PI]} />
        <meshStandardMaterial 
          color="#c49278" 
          roughness={0.7} 
          metalness={0.05}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Epidermal Stratum Corneum Surface Contact Plane */}
      <mesh position={[0, 0.48, 0]}>
        <boxGeometry args={[5.2, 0.06, 11.0]} />
        <meshStandardMaterial 
          color="#d29d84" 
          roughness={0.75} 
          transparent 
          opacity={0.9} 
        />
      </mesh>

      {/* 2. Optical PPG Cones (Red 660 nm & Infrared 880 nm) */}
      {/* Red Light Cone (660 nm) */}
      <mesh position={[-0.14, 0.28, 0]} rotation={[0, 0, Math.PI]}>
        <coneGeometry args={[0.26, 0.44, 16]} />
        <meshBasicMaterial 
          color="#ff0022" 
          transparent 
          opacity={0.45} 
          toneMapped={false} 
        />
      </mesh>

      {/* Infrared Light Cone (880 nm) */}
      <mesh position={[0.14, 0.24, 0]} rotation={[0, 0, Math.PI]}>
        <coneGeometry args={[0.3, 0.52, 16]} />
        <meshBasicMaterial 
          color="#aa0044" 
          transparent 
          opacity={0.35} 
          toneMapped={false} 
        />
      </mesh>

      {/* Annotations */}
      <mesh position={[0, 0.58, 3.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4.2, 1.2]} />
        <meshBasicMaterial 
          map={getLabelTexture('OPTICAL PPG SKIN CONTACT INTERFACE', 'Downward-Facing Optical Window Sealed by Dark Elastomeric Gasket', '#2563eb', '#141e28')} 
          transparent 
        />
      </mesh>
    </group>
  )
}

