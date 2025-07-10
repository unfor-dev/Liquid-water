import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, Environment, MeshTransmissionMaterial, AccumulativeShadows, RandomizedLight, CameraControls, RoundedBox, OrbitControls } from '@react-three/drei'
import { useRef } from 'react'
import { useControls, Leva } from 'leva'

function Earth(props) {
  const ref = useRef()
  const { nodes, materials } = useGLTF('/earth-transformed.glb')
  useFrame((state, delta) => {
    ref.current.position.y = Math.sin(state.clock.elapsedTime / 1.5) / 10
    ref.current.rotation.y += delta / 15
  })
  return (
    <group {...props} dispose={null}>
      <mesh castShadow ref={ref} geometry={nodes.Object_4.geometry} material={materials['Scene_-_Root']} scale={1.128} />
    </group>
  )
}

export default function Viewer() {
  // Material selection
  const { selectedMaterial } = useControls({
    selectedMaterial: {
      value: 'sphere',
      options: ['sphere', 'roundedBox']
    }
  })

  // Common material controls
  const materialControls = useControls('Material Settings', {
    thickness: { value: 0.6, min: 0, max: 10, step: 0.1 },
    backsideThickness: { value: -2.5, min: -5, max: 5, step: 0.1 },
    distortion: { value: 0.7, min: 0, max: 5, step: 0.1 },
    distortionScale: { value: 0.39, min: 0, max: 2, step: 0.01 },
    temporalDistortion: { value: 0.13, min: 0, max: 1, step: 0.01 },
    anisotropicBlur: { value: 0, min: 0, max: 1, step: 0.01 },
    envMapIntensity: { value: 0.2, min: 0, max: 5, step: 0.1 }
  })

  // RoundedBox specific controls
  const boxControls = useControls('Rounded Box Settings', {
    scale: { value: 2.1, min: 0.1, max: 5, step: 0.1 },
    radius: { value: 0.1, min: 0, max: 0.5, step: 0.01 }
  }, { collapsed: true })

  // Environment controls
  const envControls = useControls('Environment', {
    preset: { value: 'dawn', options: ['sunset', 'dawn', 'night', 'warehouse', 'forest'] },
    blur: { value: 0.8, min: 0, max: 1, step: 0.01 }
  })

  // Shadows controls
  const shadowControls = useControls('Shadows', {
    color: 'pink',
    opacity: { value: 1.75, min: 0, max: 3, step: 0.01 },
    frames: { value: 50, min: 1, max: 100, step: 1 }
  })

  return (
    <>
      <Leva 
        style={{ 
          position: 'fixed',
          left: '10px',
          top: '10px',
          zIndex: 1000
        }}
      />
      <Canvas shadows camera={{ position: [5, 2, 0], fov: 55 }}>
        <group position={[0, 0.5, 0]}>
          {/* Sphere (visible when selected) */}
          {selectedMaterial === 'sphere' && (
            <mesh castShadow receiveShadow>
              <sphereGeometry args={[1.4, 64, 64]} />
              <MeshTransmissionMaterial backside {...materialControls} />
            </mesh>
          )}

          {/* Rounded Box (visible when selected) */}
          {selectedMaterial === 'roundedBox' && (
            <RoundedBox 
              castShadow 
              scale={boxControls.scale}
              radius={boxControls.radius}
              smoothness={4}
            >
              <MeshTransmissionMaterial backside {...materialControls} />
            </RoundedBox>
          )}

          <Earth scale={0.8} position={[0, 0, 0]} />
        </group>
        
        <Environment preset={envControls.preset} background blur={envControls.blur} />
        
        <AccumulativeShadows 
          color={shadowControls.color} 
          position={[0, -1, 0]} 
          frames={shadowControls.frames} 
          opacity={shadowControls.opacity}
        >
          <RandomizedLight radius={100} position={[-5, 5, 2]} />
        </AccumulativeShadows>
        <OrbitControls 
          target={[0, 0.35, 0]}
          maxPolarAngle={1.45}
          minDistance={2.8}
          maxDistance={8}
          enablePan={false}
        />
      </Canvas>
    </>
  )
}
/**
 * Music toggle button
 */
const audio = document.getElementById('backgroundMusic')
const musicButton = document.getElementById('musicButton')
let isPlaying = false

musicButton.addEventListener('click', () => {
    if (!isPlaying) {
        audio.play()
        musicButton.textContent = 'Pause'
        isPlaying = true
    } else {
        audio.pause()
        musicButton.textContent = 'Play'
        isPlaying = false
    }
})