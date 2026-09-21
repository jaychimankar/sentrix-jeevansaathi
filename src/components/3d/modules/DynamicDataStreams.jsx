import React, { useRef, useMemo, useCallback, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from '../../../store'

const N_POINTS = 20
// Module-level scratch vectors — safe because rendering is synchronous
const _tmp = new THREE.Vector3()
const _vStart = new THREE.Vector3()
const _vEnd = new THREE.Vector3()
const _vMid = new THREE.Vector3()

function DynamicParticle({ curveRef, color, speed = 1.2, active, size = 0.05 }) {
  const meshRef = useRef()
  const offset = useMemo(() => Math.random(), [])
  const pos = useMemo(() => new THREE.Vector3(), [])

  useFrame((state) => {
    if (!active || !meshRef.current || !curveRef.current) return
    const t = ((state.clock.elapsedTime * speed + offset) % 1)
    curveRef.current.getPoint(t, pos)
    meshRef.current.position.copy(pos)
  })

  if (!active) return null
  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[size, 6, 6]} />
      <meshBasicMaterial color={color} toneMapped={false} />
    </mesh>
  )
}

function DynamicStreamLine({ startId, endId, color, active, isHighlighted }) {
  const lineRef = useRef()

  const curveRef = useRef(new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()
  ))

  // Pre-allocated buffer — never changes, never causes GC
  const { posBuffer, bufAttr } = useMemo(() => {
    const posBuffer = new Float32Array(N_POINTS * 3)
    const bufAttr = new THREE.BufferAttribute(posBuffer, 3)
    return { posBuffer, bufAttr }
  }, [])

  // Attach pre-allocated geometry to line after mount
  useEffect(() => {
    if (!lineRef.current) return
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', bufAttr)
    lineRef.current.geometry = geo
    return () => geo.dispose()
  }, [bufAttr])

  useFrame(() => {
    if (!active || !lineRef.current?.geometry) return
    const componentRefs = useStore.getState().componentRefs
    const startObj = componentRefs[startId]?.current
    const endObj = componentRefs[endId]?.current
    if (!startObj || !endObj) return

    startObj.getWorldPosition(_vStart)
    endObj.getWorldPosition(_vEnd)
    _vMid.lerpVectors(_vStart, _vEnd, 0.5)
    _vMid.y += isHighlighted ? 0.35 : 0.22

    curveRef.current.v0.copy(_vStart)
    curveRef.current.v1.copy(_vMid)
    curveRef.current.v2.copy(_vEnd)

    // Zero-allocation: write directly into Float32Array
    for (let i = 0; i < N_POINTS; i++) {
      curveRef.current.getPoint(i / (N_POINTS - 1), _tmp)
      posBuffer[i * 3] = _tmp.x
      posBuffer[i * 3 + 1] = _tmp.y
      posBuffer[i * 3 + 2] = _tmp.z
    }
    bufAttr.needsUpdate = true
  })

  if (!active) return null

  const opacity = isHighlighted ? 0.95 : 0.35
  const particleSpeed = isHighlighted ? 2.2 : 1.2
  const particleSize = isHighlighted ? 0.07 : 0.045

  return (
    <group>
      <line ref={lineRef}>
        <bufferGeometry />
        <lineBasicMaterial color={color} transparent opacity={opacity} />
      </line>
      <DynamicParticle curveRef={curveRef} color={color} speed={particleSpeed} active={active} size={particleSize} />
      {isHighlighted && (
        <DynamicParticle curveRef={curveRef} color="#ffffff" speed={particleSpeed * 0.9} active={active} size={particleSize * 0.6} />
      )}
    </group>
  )
}

export function DynamicDataStreams() {
  const isAiCoreClicked = useStore(s => s.isAiCoreClicked)
  const activeTab = useStore(s => s.activeTab)
  const riskLevel = useStore(s => s.riskLevel)
  const selectedComponentId = useStore(s => s.selectedComponentId)

  const isAiActive = isAiCoreClicked || activeTab === 'AI_CORE' || activeTab === 'SENSOR_FUSION'
  const riskColor = riskLevel === 'LOW' ? '#00ff88' : riskLevel === 'MEDIUM' ? '#ffcc00' : '#ff0044'

  const checkStream = useCallback((idA, idB) => {
    const isSelected = selectedComponentId === idA || selectedComponentId === idB
    const active = isAiActive || isSelected
    return { active, isHighlighted: isSelected }
  }, [isAiActive, selectedComponentId])

  const ecgStream = checkStream('AD8232', 'ESP32_S3')
  const tempStream = checkStream('TMP117', 'ESP32_S3')
  const gpsStream = checkStream('NEO_6M', 'ESP32_S3')
  const healthStream = checkStream('MAX30102', 'ESP32_S3')
  const motionStream = checkStream('MPU6050', 'ESP32_S3')
  const climateStream = checkStream('BME280', 'ESP32_S3')
  const gasStream = checkStream('ENS160', 'ESP32_S3')
  const displayStream = checkStream('ESP32_S3', 'OLED')
  const rgbStream = checkStream('ESP32_S3', 'RGB_LED')
  const hapticStream = checkStream('ESP32_S3', 'VIBRATION_MOTOR')
  const pmicStream = checkStream('BATTERY', 'CHARGING_PCB')
  const powerRailStream = checkStream('CHARGING_PCB', 'ESP32_S3')

  return (
    <group>
      <DynamicStreamLine startId="AD8232" endId="ESP32_S3" color="#dc2626" active={ecgStream.active} isHighlighted={ecgStream.isHighlighted} />
      <DynamicStreamLine startId="TMP117" endId="ESP32_S3" color="#3b82f6" active={tempStream.active} isHighlighted={tempStream.isHighlighted} />
      <DynamicStreamLine startId="NEO_6M" endId="ESP32_S3" color="#059669" active={gpsStream.active} isHighlighted={gpsStream.isHighlighted} />
      <DynamicStreamLine startId="MAX30102" endId="ESP32_S3" color="#ff0044" active={healthStream.active} isHighlighted={healthStream.isHighlighted} />
      <DynamicStreamLine startId="MPU6050" endId="ESP32_S3" color="#2563eb" active={motionStream.active} isHighlighted={motionStream.isHighlighted} />
      <DynamicStreamLine startId="BME280" endId="ESP32_S3" color="#ffbb00" active={climateStream.active} isHighlighted={climateStream.isHighlighted} />
      <DynamicStreamLine startId="ENS160" endId="ESP32_S3" color="#55ff88" active={gasStream.active} isHighlighted={gasStream.isHighlighted} />
      <DynamicStreamLine startId="ESP32_S3" endId="OLED" color="#00e5ff" active={displayStream.active} isHighlighted={displayStream.isHighlighted} />
      <DynamicStreamLine startId="ESP32_S3" endId="RGB_LED" color={riskColor} active={rgbStream.active} isHighlighted={rgbStream.isHighlighted} />
      <DynamicStreamLine startId="ESP32_S3" endId="VIBRATION_MOTOR" color="#ff8800" active={hapticStream.active} isHighlighted={hapticStream.isHighlighted} />
      <DynamicStreamLine startId="BATTERY" endId="CHARGING_PCB" color="#ffcc00" active={pmicStream.active} isHighlighted={pmicStream.isHighlighted} />
      <DynamicStreamLine startId="CHARGING_PCB" endId="ESP32_S3" color="#00ff88" active={powerRailStream.active} isHighlighted={powerRailStream.isHighlighted} />
    </group>
  )
}
