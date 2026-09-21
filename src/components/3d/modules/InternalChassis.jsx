import React, { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { useStore } from '../../../store'
import { SCALE_MM_TO_UNITS, UNIT_TO_MM } from '../../../constants/scaling'
// SCALE: 1 scene unit = 10 mm.

export function InternalChassis({ isSelected, isGhost, onSelect, onHover, onUnhover, isXray }) {
  const ref = useRef()
  const { registerComponentRef } = useStore()

  useEffect(() => {
    if (ref.current) registerComponentRef('CHASSIS', ref)
  }, [registerComponentRef])

  const isTransparent = isGhost || isXray
  const chassisOpacity = isGhost ? 0.08 : (isXray ? 0.25 : 0.95)

  // Polycarbonate / ABS Chassis Material
  const chassisMaterial = new THREE.MeshStandardMaterial({
    color: isGhost ? '#16222f' : '#23272d',
    roughness: 0.65,
    metalness: 0.2,
    transparent: isTransparent,
    opacity: chassisOpacity,
    depthWrite: !isTransparent
  })

  // Brass Threaded Standoff Inserts Material
  const brassMaterial = new THREE.MeshStandardMaterial({
    color: isGhost ? '#1f2e3e' : '#d4af37',
    metalness: 0.85,
    roughness: 0.25,
    transparent: isTransparent,
    opacity: isGhost ? 0.1 : 1
  })

  return (
    <group
      ref={ref}
      onClick={(e) => { e.stopPropagation(); onSelect('CHASSIS'); }}
      onPointerOver={(e) => { e.stopPropagation(); onHover('CHASSIS'); }}
      onPointerOut={(e) => { e.stopPropagation(); onUnhover(); }}
    >
      {/* 1. Main Structural Chassis Frame (66 × 41 × 16 mm -> 6.6 × 4.1 × 1.6 units) */}
      <mesh position={[0, -0.05, 0]} material={chassisMaterial}>
        <boxGeometry args={[4.1, 0.26, 6.6]} />
      </mesh>

      {/* Main Internal Cavity Core (Cutout interior where boards sit) */}
      <mesh position={[0, 0.04, 0]}>
        <boxGeometry args={[3.8, 0.18, 6.2]} />
        <meshStandardMaterial color="#191c20" roughness={0.8} transparent={isXray} opacity={isXray ? 0.15 : 1} />
      </mesh>

      {/* ============================================================ */}
      {/* 2. THERMAL / AIRFLOW PARTITION WALL                          */}
      {/* Structural rib separating environmental sensors from battery */}
      {/* ============================================================ */}
      <group position={[1.1, 0.1, 1.2]}>
        {/* Longitudinal partition rib */}
        <mesh position={[0, 0, 0]} material={chassisMaterial}>
          <boxGeometry args={[0.15, 0.42, 2.5]} />
        </mesh>
        {/* Transverse sealing ribs */}
        <mesh position={[0.45, 0, -1.25]} material={chassisMaterial}>
          <boxGeometry args={[0.9, 0.42, 0.15]} />
        </mesh>
        <mesh position={[0.45, 0, 1.25]} material={chassisMaterial}>
          <boxGeometry args={[0.9, 0.42, 0.15]} />
        </mesh>
      </group>

      {/* ============================================================ */}
      {/* 3. BATTERY TRAY (Dedicated pocket in lower chassis)           */}
      {/* ============================================================ */}
      <group position={[-0.3, -0.22, 0]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[2.7, 0.08, 3.4]} />
          <meshStandardMaterial color="#16181b" roughness={0.9} />
        </mesh>
        {/* Battery retention side lip */}
        <mesh position={[-1.38, 0.1, 0]} material={chassisMaterial}>
          <boxGeometry args={[0.12, 0.24, 3.4]} />
        </mesh>
      </group>

      {/* ============================================================ */}
      {/* 4. VIBRATION MOTOR PRESS-FIT RETENTION CRADLE                */}
      {/* Located at lower left for direct wrist mechanical coupling   */}
      {/* ============================================================ */}
      <group position={[-1.0, -0.22, 2.1]}>
        <mesh material={chassisMaterial}>
          <cylinderGeometry args={[0.45, 0.45, 0.22, 24, 1, true]} />
        </mesh>
        {/* Retaining base */}
        <mesh position={[0, -0.1, 0]} material={chassisMaterial}>
          <cylinderGeometry args={[0.45, 0.45, 0.05, 24]} />
        </mesh>
      </group>

      {/* ============================================================ */}
      {/* 5. CHARGING PCB GUIDE RAILS & USB-C PORT ANCHOR              */}
      {/* ============================================================ */}
      <group position={[-1.75, -0.08, -1.1]}>
        <mesh material={chassisMaterial}>
          <boxGeometry args={[0.4, 0.26, 1.0]} />
        </mesh>
      </group>

      {/* ============================================================ */}
      {/* 6. REALISTIC STANDOFF BOSSES WITH BRASS INSERTS               */}
      {/* ============================================================ */}
      {[
        [-1.5, -2.2],
        [1.5, -2.2],
        [-1.5, 2.2],
        [0.8, -0.6],
        [-0.8, 0.8]
      ].map(([sx, sz], idx) => (
        <group key={idx} position={[sx, 0.12, sz]}>
          {/* Plastic Standoff Post */}
          <mesh material={chassisMaterial}>
            <cylinderGeometry args={[0.15, 0.18, 0.3, 16]} />
          </mesh>
          {/* Brass Threaded Insert (Top Ring) */}
          <mesh position={[0, 0.15, 0]} material={brassMaterial}>
            <cylinderGeometry args={[0.09, 0.09, 0.04, 16]} />
          </mesh>
        </group>
      ))}

      {isSelected && (
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[4.2, 0.5, 6.7]} />
          <meshBasicMaterial color="#2563eb" wireframe />
        </mesh>
      )}
    </group>
  )
}
