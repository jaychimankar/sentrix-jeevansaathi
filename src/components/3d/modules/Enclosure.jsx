import React, { useRef, useEffect, useMemo } from 'react'
import { getLabelTexture } from '../utils/labelTexture'
import * as THREE from 'three'
import { useStore } from '../../../store'
import { SCALE_MM_TO_UNITS, UNIT_TO_MM, DEVICE, ENCLOSURE, COMPONENTS as SCALE_COMPONENTS } from '../../../constants/scaling'
// SCALE: 1 scene unit = 10 mm. All geometry args are pre-scaled (e.g., 7.0 = 70 mm).

export function Enclosure({
  explodeY,
  isXray,
  isTopGhost,
  isBottomGhost,
  isGhost,
  selectedComponentId,
  onSelect,
  onHover,
  onUnhover
}) {
  const topRef = useRef()
  const bottomRef = useRef()
  const { registerComponentRef } = useStore()

  useEffect(() => {
    if (topRef.current) registerComponentRef('TOP_COVER', topRef)
    if (bottomRef.current) registerComponentRef('BOTTOM_COVER', bottomRef)
  }, [registerComponentRef])

  const isTopSelected = selectedComponentId === 'TOP_COVER'
  const isBottomSelected = selectedComponentId === 'BOTTOM_COVER'

  // Top Graphite PETG Casing Material - memoized to avoid GPU resource leaks
  const topCasingMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: isTopGhost ? '#16222f' : '#181b1e',
    roughness: 0.45,
    metalness: 0.25,
    transparent: isXray || isTopGhost,
    opacity: isTopGhost ? 0.08 : (isXray ? 0.12 : 0.98),
    depthWrite: !isXray && !isTopGhost
  }), [isTopGhost, isXray])

  // Bottom Graphite PETG Casing Material
  const bottomCasingMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: isBottomGhost ? '#16222f' : '#181b1e',
    roughness: 0.45,
    metalness: 0.25,
    transparent: isXray || isBottomGhost,
    opacity: isBottomGhost ? 0.08 : (isXray ? 0.12 : 0.98),
    depthWrite: !isXray && !isBottomGhost
  }), [isBottomGhost, isXray])

  // Accent Chamfer Ring
  const accentRingMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: (isTopGhost || isBottomGhost) ? '#1f2e3d' : '#2c3138',
    roughness: 0.35,
    metalness: 0.6,
    transparent: isXray || isTopGhost || isBottomGhost,
    opacity: (isTopGhost || isBottomGhost) ? 0.10 : (isXray ? 0.15 : 1)
  }), [isTopGhost, isBottomGhost, isXray])

  return (
    <group>
      {/* ============================================================ */}
      {/* 1. TOP COVER (70 × 45 × 12 mm -> 7.0 × 4.5 × 1.2 units)      */}
      {/* Precision injection molded PETG with recessed OLED window     */}
      {/* ============================================================ */}
      <group 
        ref={topRef}
        position={[0, 0.45 + explodeY * 1.8, 0]}
        onClick={(e) => { e.stopPropagation(); onSelect('TOP_COVER'); }}
        onPointerOver={(e) => { e.stopPropagation(); onHover('TOP_COVER'); }}
        onPointerOut={(e) => { e.stopPropagation(); onUnhover(); }}
      >
        {/* Outer Perimeter Side Walls */}
        {/* Left Side Flank (-X) */}
        <mesh position={[-2.14, 0, 0]} material={topCasingMaterial} castShadow receiveShadow>
          <boxGeometry args={[0.22, 0.85, 7.0]} />
        </mesh>
        {/* Right Side Flank (+X, houses environmental chamber vent mating) */}
        <mesh position={[2.14, 0, 0]} material={topCasingMaterial} castShadow receiveShadow>
          <boxGeometry args={[0.22, 0.85, 7.0]} />
        </mesh>
        {/* Rear Wall (-Z) */}
        <mesh position={[0, 0, -3.39]} material={topCasingMaterial} castShadow receiveShadow>
          <boxGeometry args={[4.5, 0.85, 0.22]} />
        </mesh>
        {/* Front Wall (+Z) */}
        <mesh position={[0, 0, 3.39]} material={topCasingMaterial} castShadow receiveShadow>
          <boxGeometry args={[4.5, 0.85, 0.22]} />
        </mesh>

        {/* Top Face Plates Surrounding the Centered OLED Display Window (Z: 0, X: 0) */}
        {/* Rear Top Plate (Z: -3.5 to -0.9, Length: 2.6) */}
        <mesh position={[0, 0.38, -2.2]} material={topCasingMaterial} castShadow receiveShadow>
          <boxGeometry args={[4.1, 0.1, 2.6]} />
        </mesh>
        {/* Front Top Plate (Z: +0.9 to +3.5, Length: 2.6) */}
        <mesh position={[0, 0.38, 2.2]} material={topCasingMaterial} castShadow receiveShadow>
          <boxGeometry args={[4.1, 0.1, 2.6]} />
        </mesh>
        {/* Left Top Border Plate (X: -2.05 to -1.45) */}
        <mesh position={[-1.75, 0.38, 0]} material={topCasingMaterial} castShadow receiveShadow>
          <boxGeometry args={[0.6, 0.1, 1.8]} />
        </mesh>
        {/* Right Top Border Plate (X: +1.45 to +2.05) */}
        <mesh position={[1.75, 0.38, 0]} material={topCasingMaterial} castShadow receiveShadow>
          <boxGeometry args={[0.6, 0.1, 1.8]} />
        </mesh>

        {/* Recessed OLED Bezel Frame Collar (Dark Aluminum Chamfered Inset at Z:0) */}
        <mesh position={[0, 0.35, 0]} material={accentRingMaterial}>
          <boxGeometry args={[2.7, 0.06, 1.6]} />
        </mesh>

        {/* RGB Light Pipe Bezel Aperture Rim */}
        <mesh position={[1.55, 0.44, 2.55]}>
          <cylinderGeometry args={[0.15, 0.17, 0.08, 16]} />
          <meshStandardMaterial 
            color={isTopGhost ? '#16222f' : '#33383f'} 
            metalness={0.8} 
            roughness={0.2} 
            transparent={isTopGhost}
            opacity={isTopGhost ? 0.1 : 1}
          />
        </mesh>

        {/* Engraved Technical Product Markings on Rear Plate */}
        {!isXray && !isTopGhost && (
          <mesh position={[0, 0.44, -2.4]} rotation={[-Math.PI / 2, 0, Math.PI]}>
            <planeGeometry args={[2.8, 0.4]} />
            <meshBasicMaterial 
              map={getLabelTexture('EDGE-AI • SENSOR FUSION V4', '', '#687888', '#1a1e22')} 
              transparent 
            />
          </mesh>
        )}

        {/* Selection indicator */}
        {isTopSelected && (
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[4.6, 0.92, 7.1]} />
            <meshBasicMaterial color="#2563eb" wireframe />
          </mesh>
        )}
      </group>


      {/* ============================================================ */}
      {/* 2. BOTTOM COVER (70 × 45 × 8 mm -> 7.0 × 4.5 × 0.8 units)    */}
      {/* ============================================================ */}
      <group 
        ref={bottomRef}
        position={[0, -0.55 - explodeY * 1.6, 0]}
        onClick={(e) => { e.stopPropagation(); onSelect('BOTTOM_COVER'); }}
        onPointerOver={(e) => { e.stopPropagation(); onHover('BOTTOM_COVER'); }}
        onPointerOut={(e) => { e.stopPropagation(); onUnhover(); }}
      >
        {/* Main Lower Shell Body */}
        <mesh material={bottomCasingMaterial} castShadow receiveShadow>
          <boxGeometry args={[4.5, 0.75, 7.0]} />
        </mesh>

        {/* Bottom Ergonomic Wrist Curved Contour */}
        <mesh position={[0, -0.38, 0]} material={accentRingMaterial}>
          <boxGeometry args={[4.3, 0.08, 6.8]} />
        </mesh>

        {/* Central Recessed Optical Window Aperture for MAX30102 */}
        <mesh position={[0, -0.39, 0]}>
          <boxGeometry args={[1.5, 0.14, 1.8]} />
          <meshStandardMaterial color="#050507" roughness={0.8} />
        </mesh>
        {/* Optical Bezel Ring */}
        <mesh position={[0, -0.41, 0]}>
          <ringGeometry args={[0.7, 0.88, 24]} />
          <meshStandardMaterial color="#3a4048" metalness={0.7} roughness={0.3} />
        </mesh>

        {/* Side USB-C Cutout Opening */}
        <group position={[-2.26, 0.08, -1.1]}>
          <mesh rotation={[0, Math.PI / 2, 0]}>
            <boxGeometry args={[0.75, 0.28, 0.12]} />
            <meshStandardMaterial color="#0b0d0e" roughness={0.9} />
          </mesh>
        </group>

        {/* ============================================================ */}
        {/* 10 REAL CUT GEOMETRY VENTILATION HOLES ON ENVIRONMENTAL WALL */}
        {/* 2 rows × 5 holes, ~2.5 mm diameter                           */}
        {/* ============================================================ */}
        <group position={[2.26, 0.05, 1.2]}>
          {/* Vent Grille Cavity Inset */}
          <mesh rotation={[0, Math.PI / 2, 0]}>
            <boxGeometry args={[2.2, 0.44, 0.06]} />
            <meshStandardMaterial color="#0d1012" roughness={0.9} />
          </mesh>

          {/* 10 Distinct Cylindrical Cut Holes */}
          {[-0.8, -0.4, 0, 0.4, 0.8].map((zOffset, colIdx) => (
            <React.Fragment key={colIdx}>
              {/* Upper Row Hole */}
              <mesh position={[0, 0.1, zOffset]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.08, 0.08, 0.16, 16]} />
                <meshStandardMaterial color="#020405" roughness={0.9} metalness={0.1} />
              </mesh>
              {/* Lower Row Hole */}
              <mesh position={[0, -0.1, zOffset]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.08, 0.08, 0.16, 16]} />
                <meshStandardMaterial color="#020405" roughness={0.9} metalness={0.1} />
              </mesh>
            </React.Fragment>
          ))}
        </group>

        {/* Strap Lug Hinge Bosses (Anterior & Posterior, 22 mm width) */}
        {/* North Lugs (Z: -3.55) */}
        <group position={[0, -0.1, -3.55]}>
          <mesh position={[-1.25, 0, 0]}>
            <boxGeometry args={[0.3, 0.45, 0.42]} />
            <meshStandardMaterial color="#1a1d20" roughness={0.4} />
          </mesh>
          <mesh position={[1.25, 0, 0]}>
            <boxGeometry args={[0.3, 0.45, 0.42]} />
            <meshStandardMaterial color="#1a1d20" roughness={0.4} />
          </mesh>
          {/* 22 mm Stainless Steel Spring Bar Pin */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.065, 0.065, 2.3, 16]} />
            <meshStandardMaterial color="#a0abb5" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>

        {/* South Lugs (Z: +3.55) */}
        <group position={[0, -0.1, 3.55]}>
          <mesh position={[-1.25, 0, 0]}>
            <boxGeometry args={[0.3, 0.45, 0.42]} />
            <meshStandardMaterial color="#1a1d20" roughness={0.4} />
          </mesh>
          <mesh position={[1.25, 0, 0]}>
            <boxGeometry args={[0.3, 0.45, 0.42]} />
            <meshStandardMaterial color="#1a1d20" roughness={0.4} />
          </mesh>
          {/* 22 mm Stainless Steel Spring Bar Pin */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.065, 0.065, 2.3, 16]} />
            <meshStandardMaterial color="#a0abb5" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>

        {isBottomSelected && (
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[4.6, 0.82, 7.1]} />
            <meshBasicMaterial color="#2563eb" wireframe />
          </mesh>
        )}
      </group>
    </group>
  )
}
