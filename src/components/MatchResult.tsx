import { Canvas } from '@react-three/fiber'
import { Stars, Float, MeshDistortMaterial } from '@react-three/drei'
import { Suspense } from 'react'

interface MatchResultProps {
  result: {
    winner: 'blue' | 'red'
    kills: { blue: number; red: number }
    duration: number
  }
  onReturn: () => void
}

function VictoryScene() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 5, 5]} intensity={2} color="#ffd700" />

      <Stars radius={50} depth={50} count={2000} factor={4} saturation={0} fade speed={2} />

      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
        <mesh position={[0, 0, 0]} scale={2}>
          <torusKnotGeometry args={[1, 0.3, 128, 32]} />
          <MeshDistortMaterial
            color="#ffd700"
            distort={0.3}
            speed={2}
            roughness={0.2}
            metalness={0.9}
          />
        </mesh>
      </Float>
    </>
  )
}

function DefeatScene() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 5, 5]} intensity={1} color="#ff3333" />

      <Stars radius={50} depth={50} count={1000} factor={2} saturation={0} fade speed={0.5} />

      <Float speed={0.5} rotationIntensity={0.1} floatIntensity={0.2}>
        <mesh position={[0, 0, 0]} scale={1.5}>
          <icosahedronGeometry args={[1.5, 0]} />
          <MeshDistortMaterial
            color="#441111"
            distort={0.2}
            speed={1}
            roughness={0.8}
            metalness={0.3}
          />
        </mesh>
      </Float>
    </>
  )
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export default function MatchResult({ result, onReturn }: MatchResultProps) {
  const isVictory = result.winner === 'blue'

  return (
    <div className="match-result">
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <Canvas camera={{ position: [0, 0, 6], fov: 60 }}>
          <Suspense fallback={null}>
            {isVictory ? <VictoryScene /> : <DefeatScene />}
          </Suspense>
        </Canvas>
      </div>

      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <h1 className={`result-title ${isVictory ? 'result-victory' : 'result-defeat'}`}>
          {isVictory ? 'VICTORY' : 'DEFEAT'}
        </h1>

        <div className="result-stats">
          <div className="result-stat">
            <div className="stat-value" style={{ color: '#66aaff' }}>
              {result.kills.blue}
            </div>
            <div className="stat-label">Blue Kills</div>
          </div>

          <div className="result-stat">
            <div className="stat-value" style={{ color: '#888' }}>
              {formatTime(result.duration)}
            </div>
            <div className="stat-label">Duration</div>
          </div>

          <div className="result-stat">
            <div className="stat-value" style={{ color: '#ff6666' }}>
              {result.kills.red}
            </div>
            <div className="stat-label">Red Kills</div>
          </div>
        </div>

        <button className="menu-btn" onClick={onReturn}>
          RETURN TO MENU
        </button>
      </div>
    </div>
  )
}
