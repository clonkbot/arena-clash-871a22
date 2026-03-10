import { Canvas } from '@react-three/fiber'
import { Float, Stars, MeshDistortMaterial } from '@react-three/drei'
import { Suspense } from 'react'

interface MainMenuProps {
  onStart: () => void
}

function FloatingOrb({ position, color, scale }: { position: [number, number, number]; color: string; scale: number }) {
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh position={position} scale={scale}>
        <sphereGeometry args={[1, 32, 32]} />
        <MeshDistortMaterial
          color={color}
          distort={0.4}
          speed={3}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
    </Float>
  )
}

function MenuScene() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[5, 5, 5]} intensity={1} color="#00fff5" />
      <pointLight position={[-5, -5, 5]} intensity={0.8} color="#ff0066" />

      <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />

      <FloatingOrb position={[-3, 1, -2]} color="#00fff5" scale={0.8} />
      <FloatingOrb position={[3, -1, -3]} color="#ff0066" scale={0.6} />
      <FloatingOrb position={[0, 2, -4]} color="#ffd700" scale={0.5} />
      <FloatingOrb position={[-2, -2, -2]} color="#aa44ff" scale={0.4} />
      <FloatingOrb position={[2, 0, -1]} color="#44ffaa" scale={0.3} />
    </>
  )
}

export default function MainMenu({ onStart }: MainMenuProps) {
  return (
    <div className="main-menu">
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <Canvas camera={{ position: [0, 0, 6], fov: 60 }}>
          <Suspense fallback={null}>
            <MenuScene />
          </Suspense>
        </Canvas>
      </div>

      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <h1 className="menu-title">ARENA CLASH</h1>
        <p className="menu-subtitle">5v5 MOBA Battle</p>
        <button className="menu-btn" onClick={onStart}>
          PLAY NOW
        </button>
      </div>
    </div>
  )
}
