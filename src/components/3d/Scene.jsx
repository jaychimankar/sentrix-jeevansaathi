import React, { useRef, useMemo, useCallback } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { WearableModel } from './WearableModel'
import { useStore } from '../../store'

function CameraRig() {
  const { camera } = useThree()
  const controlsRef = useRef()
  const viewMode = useStore(s => s.viewMode)
  const activeTab = useStore(s => s.activeTab)
  const isAiCoreClicked = useStore(s => s.isAiCoreClicked)
  const selectedComponentId = useStore(s => s.selectedComponentId)
  const componentRefs = useStore(s => s.componentRefs)
  const cameraPreset = useStore(s => s.cameraPreset)
  const isCameraAnimating = useStore(s => s.isCameraAnimating)
  const setIsCameraAnimating = useStore(s => s.setIsCameraAnimating)
  const autoRotate = useStore(s => s.autoRotate)
  const zoomAction = useStore(s => s.zoomAction)
  const isComponentIsolated = useStore(s => s.isComponentIsolated)

  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0))
  const targetLookAt = useMemo(() => new THREE.Vector3(), [])
  const targetCamPos = useMemo(() => new THREE.Vector3(), [])
  const tempPos = useMemo(() => new THREE.Vector3(), [])
  // Track whether we have already stopped animating (to avoid repeated setIsCameraAnimating calls)
  const animatingRef = useRef(false)

  const prevZoomAction = useRef(zoomAction)
  React.useEffect(() => {
    if (zoomAction !== prevZoomAction.current && controlsRef.current) {
      const diff = zoomAction - prevZoomAction.current
      prevZoomAction.current = zoomAction
      const target = controlsRef.current.target
      const dir = new THREE.Vector3().subVectors(camera.position, target).normalize()
      const currentDist = camera.position.distanceTo(target)
      const newDist = Math.max(1.8, Math.min(28, currentDist + (diff > 0 ? -1.8 : 1.8)))
      camera.position.copy(target).addScaledVector(dir, newDist)
      controlsRef.current.update()
    }
  }, [zoomAction, camera])

  React.useEffect(() => {
    animatingRef.current = true
    setIsCameraAnimating(true)
  }, [cameraPreset, selectedComponentId, isComponentIsolated, viewMode, activeTab, isAiCoreClicked, setIsCameraAnimating])

  useFrame((_, delta) => {
    if (!isCameraAnimating) return

    // 1. Isolated Component Studio View
    if (isComponentIsolated && selectedComponentId) {
      targetLookAt.set(0, 0, 0)
      if (selectedComponentId === 'MAX30102') {
        targetCamPos.set(2.8, 2.4, 3.2)
      } else if (selectedComponentId === 'BME280' || selectedComponentId === 'ENS160' || selectedComponentId === 'MPU6050') {
        targetCamPos.set(2.6, 2.2, 3.0)
      } else if (selectedComponentId === 'OLED') {
        targetCamPos.set(0.01, 3.6, 3.2)
      } else if (selectedComponentId === 'ESP32_S3') {
        targetCamPos.set(2.8, 2.6, 3.2)
      } else if (selectedComponentId === 'CHASSIS' || selectedComponentId === 'TOP_COVER' || selectedComponentId === 'BOTTOM_COVER' || selectedComponentId === 'STRAPS') {
        targetCamPos.set(4.5, 4.0, 4.8)
      } else {
        targetCamPos.set(3.2, 2.8, 3.6)
      }
    }
    // 2. Dynamic Component Targeting via getWorldPosition
    else if (selectedComponentId && componentRefs[selectedComponentId]?.current) {
      const obj = componentRefs[selectedComponentId].current
      obj.getWorldPosition(tempPos)
      targetLookAt.copy(tempPos)

      if (selectedComponentId === 'MAX30102') {
        targetCamPos.set(tempPos.x + 2.6, tempPos.y - 3.4, tempPos.z + 3.8)
      } else if (selectedComponentId === 'BME280' || selectedComponentId === 'ENS160') {
        targetCamPos.set(tempPos.x + 4.6, tempPos.y + 1.8, tempPos.z + 1.8)
      } else if (selectedComponentId === 'OLED') {
        targetCamPos.set(tempPos.x, tempPos.y + 4.8, tempPos.z + 2.2)
      } else if (selectedComponentId === 'ESP32_S3') {
        targetCamPos.set(tempPos.x + 3.2, tempPos.y + 3.8, tempPos.z + 3.4)
      } else if (selectedComponentId === 'CHARGING_PCB') {
        targetCamPos.set(tempPos.x - 4.6, tempPos.y + 1.5, tempPos.z + 1.5)
      } else if (selectedComponentId === 'BATTERY') {
        targetCamPos.set(tempPos.x - 2.8, tempPos.y - 3.2, tempPos.z + 3.6)
      } else if (selectedComponentId === 'VIBRATION_MOTOR') {
        targetCamPos.set(tempPos.x - 3.0, tempPos.y - 3.0, tempPos.z + 3.0)
      } else {
        targetCamPos.set(tempPos.x + 3.8, tempPos.y + 3.6, tempPos.z + 4.2)
      }
    }
    // 3. Camera Presets
    else if (cameraPreset === 'TOP') {
      targetLookAt.set(0, 0, 0); targetCamPos.set(0.01, 8.8, 0.01)
    } else if (cameraPreset === 'BOTTOM') {
      targetLookAt.set(0, 0, 0); targetCamPos.set(0.01, -8.8, 0.01)
    } else if (cameraPreset === 'LEFT_USB') {
      targetLookAt.set(-0.2, 0, 0); targetCamPos.set(-8.8, 0.3, 0)
    } else if (cameraPreset === 'RIGHT_VENTS') {
      targetLookAt.set(0.2, 0, 0); targetCamPos.set(8.8, 0.3, 0)
    } else if (cameraPreset === 'FRONT') {
      targetLookAt.set(0, 0, 0); targetCamPos.set(0, 0.4, 8.8)
    }
    // 4. Mode-Based Cameras
    else if (viewMode === 'SKIN_CONTACT') {
      targetLookAt.set(0, -0.6, 0); targetCamPos.set(0, -5.2, 3.4)
    } else if (viewMode === 'AIRFLOW') {
      targetLookAt.set(1.4, 0.1, 1.0); targetCamPos.set(5.8, 0.5, 1.0)
    } else if (viewMode === 'EXPLODED') {
      targetLookAt.set(0, 0, 0); targetCamPos.set(7.2, 5.8, 7.0)
    } else if (activeTab === 'AI_CORE' || activeTab === 'SENSOR_FUSION' || isAiCoreClicked) {
      targetLookAt.set(0.1, 0.1, -0.4); targetCamPos.set(3.2, 5.0, 4.2)
    } else {
      // Default Hero View 45°
      targetLookAt.set(0, 0, 0); targetCamPos.set(5.2, 5.2, 6.0)
    }

    const step = Math.min(delta * 4.0, 0.18)
    camera.position.lerp(targetCamPos, step)
    currentLookAt.current.lerp(targetLookAt, step)

    if (controlsRef.current) {
      controlsRef.current.target.copy(currentLookAt.current)
      controlsRef.current.update()
    }

    // Only call setIsCameraAnimating once when we arrive - check local ref to avoid Zustand thrashing
    if (camera.position.distanceTo(targetCamPos) < 0.08 && currentLookAt.current.distanceTo(targetLookAt) < 0.08) {
      if (animatingRef.current) {
        animatingRef.current = false
        setIsCameraAnimating(false)
      }
    }
  })

  const handleUserOrbitStart = useCallback(() => {
    animatingRef.current = false
    setIsCameraAnimating(false)
  }, [setIsCameraAnimating])

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={true}
      minDistance={1.8}
      maxDistance={28}
      minPolarAngle={0}
      maxPolarAngle={Math.PI - 0.001}
      autoRotate={autoRotate}
      autoRotateSpeed={0.8}
      dampingFactor={0.06}
      enableDamping={true}
      onStart={handleUserOrbitStart}
    />
  )
}

export function Scene() {
  const viewMode = useStore(s => s.viewMode)
  const isComponentIsolated = useStore(s => s.isComponentIsolated)
  const isSkinContact = viewMode === 'SKIN_CONTACT'

  return (
    <div className="w-full h-full absolute inset-0 z-0 bg-[#e8e8ed]">
      <Canvas
        camera={{ position: [5.2, 5.2, 6.0], fov: 40 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        performance={{ min: 0.5 }}
        dpr={[1, 1.5]}
      >
        <color attach="background" args={['#e8e8ed']} />

        {/* Studio Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 15, 10]} intensity={1.8} castShadow />
        <directionalLight position={[-10, 8, -10]} intensity={0.8} color="#b0c4de" />
        <directionalLight position={[0, -10, 5]} intensity={0.4} color="#e0d0c0" />
        <pointLight position={[0, 5, 3]} intensity={1.2} color="#ffffff" />
        <pointLight position={[6, 0, 0]} intensity={0.6} color="#2563eb" />
        <pointLight position={[-6, 0, 0]} intensity={0.5} color="#ffffff" />

        {/* 3D Wearable Model */}
        <group position={[0, -0.1, 0]}>
          <WearableModel />
          {!isSkinContact && !isComponentIsolated && (
            <mesh position={[0, -2.4, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0, 6.5, 32]} />
              <meshBasicMaterial color="#9ca3af" transparent opacity={0.15} />
            </mesh>
          )}
        </group>

        <CameraRig />
      </Canvas>
    </div>
  )
}
