import React, { useRef, useEffect } from 'react'
import { useStore } from '../../../store'

export function NEO6MModule({ isSelected, isGhost, onSelect, onHover, onUnhover, isXray }) {
  const meshRef = useRef()

  useEffect(() => {
    if (meshRef.current) {
      useStore.getState().registerComponentRef('NEO_6M', meshRef)
    }
  }, [])

  const baseOpacity = isGhost ? 0.15 : (isXray ? 0.6 : 1.0)
  const emissive = isSelected ? '#059669' : '#000000'
  const emissiveIntensity = isSelected ? 0.35 : 0

  return (
    <group
      ref={meshRef}
      onClick={(e) => {
        e.stopPropagation()
        onSelect('NEO_6M')
      }}
      onPointerOver={(e) => {
        e.stopPropagation()
        onHover('NEO_6M')
      }}
      onPointerOut={(e) => {
        e.stopPropagation()
        onUnhover()
      }}
    >
      {/* Main GPS Receiver PCB (16.0 × 12.2 × 2.4 mm) - Emerald Green Shield */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[1.6, 0.24, 1.22]} />
        <meshStandardMaterial
          color="#059669"
          metalness={0.15}
          roughness={0.7}
          transparent={isGhost || isXray}
          opacity={baseOpacity}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>

      {/* NEO-6M GPS Chipset Module (Nickel Plated Shield Can) */}
      <mesh position={[0, 0.24, 0]} castShadow>
        <boxGeometry args={[1.2, 0.2, 0.9]} />
        <meshStandardMaterial
          color="#b0bcc5"
          metalness={0.85}
          roughness={0.2}
          transparent={isGhost || isXray}
          opacity={baseOpacity}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>

      {/* Shield Can Details (screws/mounting) */}
      {[
        [-0.5, 0.35, -0.35],
        [0.5, 0.35, -0.35],
        [-0.5, 0.35, 0.35],
        [0.5, 0.35, 0.35],
      ].map((pos, idx) => (
        <mesh key={idx} position={pos} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.02, 8]} />
          <meshStandardMaterial
            color="#404040"
            metalness={0.7}
            roughness={0.3}
            transparent={isGhost || isXray}
            opacity={baseOpacity}
          />
        </mesh>
      ))}

      {/* Ceramic Patch Antenna (18.0 × 18.0 × 4.0 mm) - Positioned on top for sky visibility */}
      <group position={[0, 0.54, 0]}>
        {/* Antenna substrate (ceramic) */}
        <mesh castShadow>
          <boxGeometry args={[1.8, 0.4, 1.8]} />
          <meshStandardMaterial
            color="#d1d5db"
            metalness={0.1}
            roughness={0.5}
            transparent={isGhost || isXray}
            opacity={baseOpacity}
            emissive={emissive}
            emissiveIntensity={emissiveIntensity * 0.5}
          />
        </mesh>

        {/* Antenna copper trace pattern (spiral/patch) */}
        <mesh position={[0, 0.21, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.4, 0.7, 32]} />
          <meshStandardMaterial
            color="#d4af37"
            metalness={0.9}
            roughness={0.1}
            transparent={isGhost || isXray}
            opacity={baseOpacity}
          />
        </mesh>

        {/* Center feed point */}
        <mesh position={[0, 0.22, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.04, 16]} />
          <meshStandardMaterial
            color="#ffd700"
            metalness={0.95}
            roughness={0.05}
            transparent={isGhost || isXray}
            opacity={baseOpacity}
          />
        </mesh>

        {/* Antenna label */}
        {!isGhost && (
          <mesh position={[0, 0.21, 0.6]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[1.2, 0.18]} />
            <meshBasicMaterial
              color="#1a1a1a"
              transparent
              opacity={0.8}
              depthWrite={false}
            />
          </mesh>
        )}
      </group>

      {/* LNA (Low Noise Amplifier) and SAW Filter Components */}
      {[
        { pos: [-0.5, 0.14, 0.4], size: [0.12, 0.06, 0.1], color: '#2c2c2c' },
        { pos: [0.5, 0.14, 0.4], size: [0.1, 0.05, 0.08], color: '#3d2d1f' },
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

      {/* Backup Battery (coin cell for RTC and almanac retention) */}
      <mesh position={[-0.5, 0.08, -0.4]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 0.06, 16]} />
        <meshStandardMaterial
          color="#c0c0c0"
          metalness={0.8}
          roughness={0.2}
          transparent={isGhost || isXray}
          opacity={baseOpacity}
        />
      </mesh>

      {/* UART Pin Headers (4-pin: VCC, RX, TX, GND) */}
      {[-0.45, -0.15, 0.15, 0.45].map((xPos, idx) => (
        <mesh key={idx} position={[xPos, 0, 0.7]} castShadow>
          <boxGeometry args={[0.08, 0.24, 0.08]} />
          <meshStandardMaterial
            color={idx === 0 ? '#ff0000' : idx === 3 ? '#000000' : '#c0c0c0'}
            metalness={0.85}
            roughness={0.15}
            transparent={isGhost || isXray}
            opacity={baseOpacity}
          />
        </mesh>
      ))}

      {/* PPS (Pulse Per Second) Output Pin */}
      <mesh position={[0.7, 0, 0]} castShadow>
        <boxGeometry args={[0.08, 0.24, 0.08]} />
        <meshStandardMaterial
          color="#ffff00"
          metalness={0.85}
          roughness={0.15}
          transparent={isGhost || isXray}
          opacity={baseOpacity}
        />
      </mesh>

      {/* U.FL / IPEX Antenna Connector (alternative external antenna option) */}
      <mesh position={[0, 0.14, -0.5]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.08, 16]} />
        <meshStandardMaterial
          color="#ffd700"
          metalness={0.9}
          roughness={0.1}
          transparent={isGhost || isXray}
          opacity={baseOpacity}
        />
      </mesh>

      {/* UART Serial Connection Wire to ESP32 */}
      {!isGhost && (
        <>
          {/* TX wire (green) */}
          <mesh position={[-0.8, 0, 0.7]} rotation={[0, 0, Math.PI / 6]}>
            <cylinderGeometry args={[0.02, 0.02, 1.5, 8]} />
            <meshStandardMaterial
              color="#4ade80"
              metalness={0.3}
              roughness={0.6}
              transparent={isXray}
              opacity={isXray ? 0.4 : 1.0}
            />
          </mesh>

          {/* RX wire (blue) */}
          <mesh position={[-0.6, 0, 0.7]} rotation={[0, 0, Math.PI / 7]}>
            <cylinderGeometry args={[0.02, 0.02, 1.4, 8]} />
            <meshStandardMaterial
              color="#3b82f6"
              metalness={0.3}
              roughness={0.6}
              transparent={isXray}
              opacity={isXray ? 0.4 : 1.0}
            />
          </mesh>
        </>
      )}

      {/* GPS Signal Visualization (satellite link indicators when selected) */}
      {isSelected && !isGhost && (
        <>
          {/* Satellite signal waves emanating upward */}
          {[0.3, 0.6, 0.9].map((scale, idx) => (
            <mesh
              key={idx}
              position={[0, 0.74 + idx * 0.3, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <ringGeometry args={[0.3 * scale, 0.35 * scale, 32]} />
              <meshBasicMaterial
                color="#10b981"
                transparent
                opacity={0.4 - idx * 0.1}
                side={2}
              />
            </mesh>
          ))}

          {/* GPS lock indicator */}
          <mesh position={[0, 1.3, 0]}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshBasicMaterial color="#10b981" opacity={0.8} transparent />
          </mesh>
        </>
      )}

      {/* Silkscreen Labels */}
      {!isGhost && (
        <>
          <mesh position={[0, 0.13, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[1.3, 0.2]} />
            <meshBasicMaterial
              color="#ffffff"
              transparent
              opacity={0.9}
              depthWrite={false}
            />
          </mesh>
          <mesh position={[-0.4, 0.13, -0.4]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.3, 0.12]} />
            <meshBasicMaterial
              color="#ffff00"
              transparent
              opacity={0.85}
              depthWrite={false}
            />
          </mesh>
        </>
      )}

      {/* RF Ground Plane visualization (when X-ray mode) */}
      {isXray && (
        <mesh position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.5, 1.1]} />
          <meshStandardMaterial
            color="#d4af37"
            metalness={0.9}
            roughness={0.1}
            transparent
            opacity={0.3}
            side={2}
          />
        </mesh>
      )}
    </group>
  )
}
