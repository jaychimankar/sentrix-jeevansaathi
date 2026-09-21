import React, { useRef, useEffect } from 'react'
import { useStore } from '../../../store'

export function WristStrap({ isSelected, isGhost, onSelect, onHover, onUnhover, isXray }) {
  const ref = useRef()
  const { registerComponentRef } = useStore()

  useEffect(() => {
    if (ref.current) registerComponentRef('STRAPS', ref)
  }, [registerComponentRef])

  const strapOpacity = isGhost ? 0.08 : (isXray ? 0.15 : 0.98)
  const isTransparent = isGhost || isXray

  return (
    <group
      ref={ref}
      onClick={(e) => { e.stopPropagation(); onSelect('STRAPS'); }}
      onPointerOver={(e) => { e.stopPropagation(); onHover('STRAPS'); }}
      onPointerOut={(e) => { e.stopPropagation(); onUnhover(); }}
    >
      {/* North Strap (Top Strap with Stainless Steel Buckle, 22 mm width) */}
      <group position={[0, -0.25, -4.2]}>
        <mesh rotation={[0.18, 0, 0]}>
          <boxGeometry args={[2.2, 0.22, 2.6]} />
          <meshStandardMaterial 
            color={isGhost ? '#16222f' : '#14171a'} 
            roughness={0.85} 
            metalness={0.1}
            transparent={isTransparent} 
            opacity={strapOpacity} 
            depthWrite={!isTransparent}
          />
        </mesh>

        {/* Fine Knit / Precision Transverse Ribbed Grooves */}
        {!isGhost && [-1.0, -0.75, -0.5, -0.25, 0, 0.25, 0.5, 0.75].map((gz, gi) => (
          <mesh key={gi} position={[0, 0.105, gz]} rotation={[0.18, 0, 0]}>
            <boxGeometry args={[1.9, 0.02, 0.08]} />
            <meshStandardMaterial color="#0c0e10" roughness={0.92} />
          </mesh>
        ))}

        {/* 316L Stainless Steel Watch Buckle Assembly */}
        <group position={[0, 0.04, -1.45]}>
          <mesh>
            <boxGeometry args={[2.36, 0.14, 0.32]} />
            <meshStandardMaterial 
              color={isGhost ? '#1f2e3e' : '#c4ccd5'} 
              metalness={0.88} 
              roughness={0.2} 
              transparent={isTransparent}
              opacity={isGhost ? 0.12 : 1}
            />
          </mesh>
          {/* Buckle Tang Pin */}
          <mesh position={[0, 0.05, 0]}>
            <boxGeometry args={[0.1, 0.06, 0.42]} />
            <meshStandardMaterial 
              color={isGhost ? '#1f2e3e' : '#c4ccd5'} 
              metalness={0.88} 
              roughness={0.2} 
              transparent={isTransparent}
              opacity={isGhost ? 0.12 : 1}
            />
          </mesh>
        </group>
      </group>

      {/* South Strap (Long Tail Strap with Adjustment Holes, 22 mm width) */}
      <group position={[0, -0.25, 4.4]}>
        <mesh rotation={[-0.18, 0, 0]}>
          <boxGeometry args={[2.2, 0.22, 3.2]} />
          <meshStandardMaterial 
            color={isGhost ? '#16222f' : '#14171a'} 
            roughness={0.85} 
            metalness={0.1}
            transparent={isTransparent} 
            opacity={strapOpacity} 
            depthWrite={!isTransparent}
          />
        </mesh>

        {/* Dual Strap Retaining Keepers (Loops) */}
        {!isGhost && [1.6, 2.0].map((kz, ki) => (
          <mesh key={ki} position={[0, 0.02, kz]} rotation={[-0.18, 0, 0]}>
            <boxGeometry args={[2.28, 0.28, 0.22]} />
            <meshStandardMaterial color="#1a1e22" roughness={0.7} />
          </mesh>
        ))}

        {/* Fine Knit / Transverse Ribbed Grooves */}
        {!isGhost && [-1.2, -0.9, -0.6, -0.3, 0, 0.3, 0.6, 0.9, 1.2].map((gz, gi) => (
          <mesh key={gi} position={[0, 0.105, gz]} rotation={[-0.18, 0, 0]}>
            <boxGeometry args={[1.9, 0.02, 0.08]} />
            <meshStandardMaterial color="#0c0e10" roughness={0.92} />
          </mesh>
        ))}

        {/* Perforated Adjustment Holes */}
        {!isGhost && [-1.0, -0.6, -0.2, 0.2, 0.6, 1.0].map((hz, hi) => (
          <mesh key={hi} position={[0, 0.02, hz]} rotation={[-0.18, 0, 0]}>
            <boxGeometry args={[0.22, 0.25, 0.14]} />
            <meshStandardMaterial color="#080a0c" roughness={0.9} />
          </mesh>
        ))}
      </group>

      {/* Cyan Wireframe Selection Bounding Cage */}
      {isSelected && (
        <group>
          <mesh position={[0, -0.25, -4.2]}>
            <boxGeometry args={[2.35, 0.35, 2.75]} />
            <meshBasicMaterial color="#2563eb" wireframe />
          </mesh>
          <mesh position={[0, -0.25, 4.4]}>
            <boxGeometry args={[2.35, 0.35, 3.35]} />
            <meshBasicMaterial color="#2563eb" wireframe />
          </mesh>
        </group>
      )}
    </group>
  )
}
