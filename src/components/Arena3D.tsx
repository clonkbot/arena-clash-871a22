import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Environment, Sky } from '@react-three/drei'
import * as THREE from 'three'
import { GameState } from './GameArena'
import { Hero } from '../data/heroes'

interface Arena3DProps {
  gameState: GameState
  playerHero: Hero
}

const ARENA_SIZE = 50

// Ground component
function Ground() {
  const gridTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 512
    const ctx = canvas.getContext('2d')!

    // Dark background
    ctx.fillStyle = '#0a0a15'
    ctx.fillRect(0, 0, 512, 512)

    // Grid lines
    ctx.strokeStyle = '#1a1a2a'
    ctx.lineWidth = 2

    for (let i = 0; i <= 16; i++) {
      const pos = (i / 16) * 512
      ctx.beginPath()
      ctx.moveTo(pos, 0)
      ctx.lineTo(pos, 512)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(0, pos)
      ctx.lineTo(512, pos)
      ctx.stroke()
    }

    const texture = new THREE.CanvasTexture(canvas)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(4, 4)
    return texture
  }, [])

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[ARENA_SIZE, ARENA_SIZE]} />
      <meshStandardMaterial map={gridTexture} roughness={0.8} metalness={0.2} />
    </mesh>
  )
}

// Lane paths
function Lanes() {
  return (
    <group>
      {/* Mid lane */}
      <mesh rotation={[-Math.PI / 2, 0, Math.PI / 4]} position={[0, 0.01, 0]}>
        <planeGeometry args={[3, 70]} />
        <meshStandardMaterial color="#1a1a30" transparent opacity={0.8} />
      </mesh>

      {/* Top lane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-23, 0.01, 0]}>
        <planeGeometry args={[3, 50]} />
        <meshStandardMaterial color="#1a1a30" transparent opacity={0.8} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, Math.PI / 2]} position={[0, 0.01, -23]}>
        <planeGeometry args={[3, 50]} />
        <meshStandardMaterial color="#1a1a30" transparent opacity={0.8} />
      </mesh>

      {/* Bottom lane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[23, 0.01, 0]}>
        <planeGeometry args={[3, 50]} />
        <meshStandardMaterial color="#1a1a30" transparent opacity={0.8} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, Math.PI / 2]} position={[0, 0.01, 23]}>
        <planeGeometry args={[3, 50]} />
        <meshStandardMaterial color="#1a1a30" transparent opacity={0.8} />
      </mesh>
    </group>
  )
}

// Base areas
function Bases() {
  return (
    <group>
      {/* Blue base */}
      <mesh position={[-22, 0.1, -22]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[8, 32]} />
        <meshStandardMaterial color="#112244" emissive="#001133" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[-22, 1, -22]}>
        <cylinderGeometry args={[0.5, 1, 3, 8]} />
        <meshStandardMaterial color="#3366ff" emissive="#3366ff" emissiveIntensity={0.5} />
      </mesh>

      {/* Red base */}
      <mesh position={[22, 0.1, 22]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[8, 32]} />
        <meshStandardMaterial color="#441122" emissive="#330011" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[22, 1, 22]}>
        <cylinderGeometry args={[0.5, 1, 3, 8]} />
        <meshStandardMaterial color="#ff3333" emissive="#ff3333" emissiveIntensity={0.5} />
      </mesh>
    </group>
  )
}

// Tower component
function Tower({ position, team, health, maxHealth }: {
  position: { x: number; z: number }
  team: 'blue' | 'red'
  health: number
  maxHealth: number
}) {
  const ref = useRef<THREE.Group>(null!)
  const color = team === 'blue' ? '#3366ff' : '#ff3333'
  const healthPercent = health / maxHealth

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.5
    }
  })

  return (
    <group position={[position.x, 0, position.z]}>
      {/* Base */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[1.5, 2, 1, 8]} />
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Tower body */}
      <mesh position={[0, 2.5, 0]}>
        <cylinderGeometry args={[0.8, 1.2, 4, 8]} />
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Top crystal */}
      <group ref={ref} position={[0, 5, 0]}>
        <mesh>
          <octahedronGeometry args={[0.8]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.8}
            transparent
            opacity={0.9}
          />
        </mesh>
      </group>

      {/* Health bar */}
      <group position={[0, 6.5, 0]}>
        <mesh>
          <planeGeometry args={[2, 0.2]} />
          <meshBasicMaterial color="#333" />
        </mesh>
        <mesh position={[(healthPercent - 1), 0, 0.01]} scale={[healthPercent, 1, 1]}>
          <planeGeometry args={[2, 0.2]} />
          <meshBasicMaterial color={team === 'blue' ? '#44ff44' : '#ff4444'} />
        </mesh>
      </group>

      {/* Point light */}
      <pointLight position={[0, 5, 0]} color={color} intensity={2} distance={10} />
    </group>
  )
}

// Hero model
function HeroModel({ hero, position, team, health, maxHealth, isPlayer }: {
  hero: Hero
  position: { x: number; z: number }
  team: 'blue' | 'red'
  health: number
  maxHealth: number
  isPlayer: boolean
}) {
  const ref = useRef<THREE.Group>(null!)
  const healthPercent = health / maxHealth

  useFrame((state) => {
    if (ref.current) {
      // Floating animation
      ref.current.position.y = 0.8 + Math.sin(state.clock.elapsedTime * 2 + position.x) * 0.1
    }
  })

  return (
    <group position={[position.x, 0, position.z]}>
      <group ref={ref}>
        {/* Body */}
        <mesh>
          <capsuleGeometry args={[0.4, 0.8, 8, 16]} />
          <meshStandardMaterial
            color={hero.color}
            emissive={hero.color}
            emissiveIntensity={isPlayer ? 0.4 : 0.2}
            metalness={0.3}
            roughness={0.7}
          />
        </mesh>

        {/* Head */}
        <mesh position={[0, 0.8, 0]}>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial
            color={hero.secondaryColor}
            metalness={0.5}
            roughness={0.5}
          />
        </mesh>

        {/* Team indicator ring */}
        <mesh position={[0, -0.4, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.5, 0.7, 32]} />
          <meshBasicMaterial
            color={team === 'blue' ? '#3366ff' : '#ff3333'}
            transparent
            opacity={0.8}
          />
        </mesh>

        {/* Player indicator */}
        {isPlayer && (
          <mesh position={[0, 1.5, 0]}>
            <coneGeometry args={[0.2, 0.4, 4]} />
            <meshStandardMaterial color="#00fff5" emissive="#00fff5" emissiveIntensity={1} />
          </mesh>
        )}
      </group>

      {/* Health bar */}
      <group position={[0, 2, 0]}>
        <mesh>
          <planeGeometry args={[1, 0.12]} />
          <meshBasicMaterial color="#222" />
        </mesh>
        <mesh position={[(healthPercent - 1) * 0.5, 0, 0.01]} scale={[healthPercent, 1, 1]}>
          <planeGeometry args={[1, 0.12]} />
          <meshBasicMaterial color={healthPercent > 0.3 ? '#44ff44' : '#ff4444'} />
        </mesh>
      </group>

      {/* Point light for player */}
      {isPlayer && (
        <pointLight position={[0, 2, 0]} color="#00fff5" intensity={1} distance={5} />
      )}
    </group>
  )
}

// Camera follow component
function CameraFollow({ position }: { position: { x: number; z: number } }) {
  useFrame(({ camera }) => {
    const targetX = position.x
    const targetZ = position.z + 15
    const targetY = 20

    camera.position.x += (targetX - camera.position.x) * 0.05
    camera.position.y += (targetY - camera.position.y) * 0.05
    camera.position.z += (targetZ - camera.position.z) * 0.05

    camera.lookAt(position.x, 0, position.z)
  })

  return null
}

// Arena walls
function ArenaWalls() {
  return (
    <group>
      {/* North wall */}
      <mesh position={[0, 1, -ARENA_SIZE / 2]}>
        <boxGeometry args={[ARENA_SIZE, 2, 0.5]} />
        <meshStandardMaterial color="#1a1a2a" transparent opacity={0.5} />
      </mesh>
      {/* South wall */}
      <mesh position={[0, 1, ARENA_SIZE / 2]}>
        <boxGeometry args={[ARENA_SIZE, 2, 0.5]} />
        <meshStandardMaterial color="#1a1a2a" transparent opacity={0.5} />
      </mesh>
      {/* East wall */}
      <mesh position={[ARENA_SIZE / 2, 1, 0]}>
        <boxGeometry args={[0.5, 2, ARENA_SIZE]} />
        <meshStandardMaterial color="#1a1a2a" transparent opacity={0.5} />
      </mesh>
      {/* West wall */}
      <mesh position={[-ARENA_SIZE / 2, 1, 0]}>
        <boxGeometry args={[0.5, 2, ARENA_SIZE]} />
        <meshStandardMaterial color="#1a1a2a" transparent opacity={0.5} />
      </mesh>
    </group>
  )
}

// Jungle obstacles
function JungleObstacles() {
  const obstacles = useMemo(() => {
    const positions: [number, number, number][] = []
    for (let i = 0; i < 20; i++) {
      const x = (Math.random() - 0.5) * 40
      const z = (Math.random() - 0.5) * 40

      // Avoid lanes and bases
      const inLane = Math.abs(x) < 4 || Math.abs(z) < 4 || Math.abs(x + z) < 6
      const inBase = (Math.abs(x + 22) < 10 && Math.abs(z + 22) < 10) ||
        (Math.abs(x - 22) < 10 && Math.abs(z - 22) < 10)

      if (!inLane && !inBase) {
        positions.push([x, 0, z])
      }
    }
    return positions
  }, [])

  return (
    <group>
      {obstacles.map((pos, i) => (
        <group key={i} position={pos}>
          <mesh position={[0, 1, 0]}>
            <cylinderGeometry args={[0.5, 0.8, 2, 6]} />
            <meshStandardMaterial color="#223322" roughness={0.9} />
          </mesh>
          <mesh position={[0, 2.5, 0]}>
            <sphereGeometry args={[1.2, 8, 8]} />
            <meshStandardMaterial color="#224422" roughness={0.9} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

export default function Arena3D({ gameState, playerHero }: Arena3DProps) {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[20, 30, 10]}
        intensity={0.8}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <pointLight position={[-20, 10, -20]} color="#3366ff" intensity={1} distance={40} />
      <pointLight position={[20, 10, 20]} color="#ff3333" intensity={1} distance={40} />

      {/* Environment */}
      <Sky sunPosition={[100, 20, 100]} turbidity={10} rayleigh={2} />
      <Environment preset="night" />
      <fog attach="fog" args={['#0a0a15', 30, 80]} />

      {/* Camera follow */}
      <CameraFollow position={gameState.playerPosition} />

      {/* Arena elements */}
      <Ground />
      <Lanes />
      <Bases />
      <ArenaWalls />
      <JungleObstacles />

      {/* Towers */}
      {gameState.units
        .filter(u => u.type === 'tower' && u.isAlive)
        .map(tower => (
          <Tower
            key={tower.id}
            position={tower.position}
            team={tower.team}
            health={tower.health}
            maxHealth={tower.maxHealth}
          />
        ))}

      {/* Heroes */}
      {gameState.units
        .filter(u => u.type === 'hero' && u.isAlive && u.hero)
        .map(unit => (
          <HeroModel
            key={unit.id}
            hero={unit.hero!}
            position={unit.position}
            team={unit.team}
            health={unit.health}
            maxHealth={unit.maxHealth}
            isPlayer={unit.id === 'blue-hero-0'}
          />
        ))}
    </>
  )
}
