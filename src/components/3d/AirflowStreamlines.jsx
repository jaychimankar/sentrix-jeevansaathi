import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from '../../store'

export function AirflowStreamlines() {
  const viewMode = useStore(s => s.viewMode)
  const isAirflowMode = viewMode === 'AIRFLOW'

  const particlesCount = isAirflowMode ? 18 : 6

  const particles = useMemo(() => {
    const list = []
    for (let i = 0; i < particlesCount; i++) {
      const zOffset = -0.8 + (i % 5) * 0.4 + (Math.random() - 0.5) * 0.08
      const yOffset = (i % 2 === 0 ? 0.1 : -0.1) + (Math.random() - 0.5) * 0.04
      list.push({
        start: new THREE.Vector3(4.5 + Math.random() * 1.2, yOffset + (Math.random() - 0.5) * 0.1, 1.2 + zOffset),
        mid: new THREE.Vector3(2.26, yOffset, 1.2 + zOffset * 0.9),
        end: new THREE.Vector3(1.4, 0.12, i % 2 === 0 ? 0.5 : 1.5),
        speed: 0.22 + Math.random() * 0.15,
        offset: Math.random() * 2
      })
    }
    return list
  }, [particlesCount])

  // Pre-allocate scratch vectors for useFrame
  const scratchPos = useMemo(() => new THREE.Vector3(), [])
  const groupRef = useRef()

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    groupRef.current.children.forEach((mesh, idx) => {
      const p = particles[idx]
      if (!p || !mesh.isObject3D) return
      const progress = ((t * p.speed + p.offset) % 1)
      if (progress < 0.45) {
        const localT = progress / 0.45
        scratchPos.lerpVectors(p.start, p.mid, localT)
      } else {
        const localT = (progress - 0.45) / 0.55
        scratchPos.lerpVectors(p.mid, p.end, localT)
      }
      mesh.position.copy(scratchPos)
      mesh.scale.setScalar(0.7 + Math.sin(progress * Math.PI) * 0.4)
    })
  })

  // Streamlines: memoize geometries so they are NOT recreated on render
  const streamlineGeometries = useMemo(() => {
    if (!isAirflowMode) return []
    return [-0.6, 0, 0.6].map(z => {
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(4.6, 0.05, 1.2 + z),
        new THREE.Vector3(2.26, 0.05, 1.2 + z * 0.8),
        new THREE.Vector3(1.4, 0.12, 1.2 + z * 0.4)
      ])
      const pts = curve.getPoints(20)
      const geo = new THREE.BufferGeometry().setFromPoints(pts)
      return geo
    })
  }, [isAirflowMode])

  const particleColor = isAirflowMode ? '#2563eb' : '#4fa3b8'
  const particleOpacity = isAirflowMode ? 0.8 : 0.25

  return (
    <group ref={groupRef}>
      {particles.map((_, idx) => (
        <mesh key={idx}>
          <sphereGeometry args={[0.038, 6, 6]} />
          <meshBasicMaterial color={particleColor} transparent opacity={particleOpacity} />
        </mesh>
      ))}

      {isAirflowMode && streamlineGeometries.map((geo, i) => (
        <line key={i} geometry={geo}>
          <lineBasicMaterial color="#2563eb" transparent opacity={0.3} />
        </line>
      ))}
    </group>
  )
}
