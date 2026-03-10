import { Canvas } from '@react-three/fiber'
import { Suspense, useState, useCallback, useEffect, useRef } from 'react'
import Arena3D from './Arena3D'
import GameHUD from './GameHUD'
import { Hero } from '../data/heroes'

interface GameArenaProps {
  playerHero: Hero
  teamHeroes: { blue: Hero[]; red: Hero[] }
  onMatchEnd: (result: { winner: 'blue' | 'red'; kills: { blue: number; red: number }; duration: number }) => void
}

export interface GameState {
  playerPosition: { x: number; z: number }
  playerHealth: number
  playerMana: number
  blueKills: number
  redKills: number
  timeRemaining: number
  skillCooldowns: [number, number, number]
  units: UnitState[]
  killFeed: KillEvent[]
}

export interface UnitState {
  id: string
  type: 'hero' | 'minion' | 'tower'
  team: 'blue' | 'red'
  hero?: Hero
  position: { x: number; z: number }
  health: number
  maxHealth: number
  isAlive: boolean
  targetPosition?: { x: number; z: number }
}

export interface KillEvent {
  id: number
  killer: string
  victim: string
  killerTeam: 'blue' | 'red'
  timestamp: number
}

const MATCH_DURATION = 600 // 10 minutes in seconds
const ARENA_SIZE = 50

export default function GameArena({ playerHero, teamHeroes, onMatchEnd }: GameArenaProps) {
  const [joystickInput, setJoystickInput] = useState({ x: 0, y: 0 })
  const gameLoopRef = useRef<number | null>(null)
  const lastUpdateRef = useRef<number>(Date.now())

  const [gameState, setGameState] = useState<GameState>(() => {
    const units: UnitState[] = []

    // Add blue team heroes
    teamHeroes.blue.forEach((hero, i) => {
      units.push({
        id: `blue-hero-${i}`,
        type: 'hero',
        team: 'blue',
        hero,
        position: { x: -20 + i * 3, z: -20 + i * 2 },
        health: hero.health,
        maxHealth: hero.health,
        isAlive: true
      })
    })

    // Add red team heroes
    teamHeroes.red.forEach((hero, i) => {
      units.push({
        id: `red-hero-${i}`,
        type: 'hero',
        team: 'red',
        hero,
        position: { x: 20 - i * 3, z: 20 - i * 2 },
        health: hero.health,
        maxHealth: hero.health,
        isAlive: true
      })
    })

    // Add towers
    const towerPositions = {
      blue: [
        { x: -22, z: 0 },
        { x: 0, z: -22 },
        { x: -22, z: -22 }
      ],
      red: [
        { x: 22, z: 0 },
        { x: 0, z: 22 },
        { x: 22, z: 22 }
      ]
    }

    towerPositions.blue.forEach((pos, i) => {
      units.push({
        id: `blue-tower-${i}`,
        type: 'tower',
        team: 'blue',
        position: pos,
        health: 3000,
        maxHealth: 3000,
        isAlive: true
      })
    })

    towerPositions.red.forEach((pos, i) => {
      units.push({
        id: `red-tower-${i}`,
        type: 'tower',
        team: 'red',
        position: pos,
        health: 3000,
        maxHealth: 3000,
        isAlive: true
      })
    })

    return {
      playerPosition: { x: -15, z: -15 },
      playerHealth: playerHero.health,
      playerMana: playerHero.mana,
      blueKills: 0,
      redKills: 0,
      timeRemaining: MATCH_DURATION,
      skillCooldowns: [0, 0, 0],
      units,
      killFeed: []
    }
  })

  // Game loop
  useEffect(() => {
    let killIdCounter = 0

    const gameLoop = () => {
      const now = Date.now()
      const delta = (now - lastUpdateRef.current) / 1000
      lastUpdateRef.current = now

      setGameState(prev => {
        // Check if match ended
        if (prev.timeRemaining <= 0) {
          const winner = prev.blueKills >= prev.redKills ? 'blue' : 'red'
          onMatchEnd({
            winner,
            kills: { blue: prev.blueKills, red: prev.redKills },
            duration: MATCH_DURATION
          })
          return prev
        }

        // Update time
        const newTimeRemaining = Math.max(0, prev.timeRemaining - delta)

        // Update player position based on joystick
        const speed = 8 * delta
        let newX = prev.playerPosition.x + joystickInput.x * speed
        let newZ = prev.playerPosition.z - joystickInput.y * speed

        // Clamp to arena bounds
        newX = Math.max(-ARENA_SIZE / 2 + 2, Math.min(ARENA_SIZE / 2 - 2, newX))
        newZ = Math.max(-ARENA_SIZE / 2 + 2, Math.min(ARENA_SIZE / 2 - 2, newZ))

        // Update cooldowns
        const newCooldowns: [number, number, number] = [
          Math.max(0, prev.skillCooldowns[0] - delta),
          Math.max(0, prev.skillCooldowns[1] - delta),
          Math.max(0, prev.skillCooldowns[2] - delta)
        ]

        // Regenerate mana
        const newMana = Math.min(playerHero.mana, prev.playerMana + 5 * delta)

        // Simple AI movement for other units
        const newUnits = prev.units.map(unit => {
          if (!unit.isAlive) return unit
          if (unit.id === 'blue-hero-0') {
            // Player unit - sync with player position
            return { ...unit, position: { x: newX, z: newZ }, health: prev.playerHealth }
          }

          // AI movement for heroes
          if (unit.type === 'hero') {
            const moveSpeed = 3 * delta
            let targetX = unit.position.x
            let targetZ = unit.position.z

            if (unit.team === 'blue') {
              // Blue team moves toward top-right
              targetX += moveSpeed * 0.5
              targetZ += moveSpeed * 0.5
            } else {
              // Red team moves toward bottom-left
              targetX -= moveSpeed * 0.5
              targetZ -= moveSpeed * 0.5
            }

            // Add some randomness
            targetX += (Math.random() - 0.5) * moveSpeed * 2
            targetZ += (Math.random() - 0.5) * moveSpeed * 2

            // Clamp to arena
            targetX = Math.max(-ARENA_SIZE / 2 + 2, Math.min(ARENA_SIZE / 2 - 2, targetX))
            targetZ = Math.max(-ARENA_SIZE / 2 + 2, Math.min(ARENA_SIZE / 2 - 2, targetZ))

            return { ...unit, position: { x: targetX, z: targetZ } }
          }

          return unit
        })

        // Check for combat - heroes damaging each other when close
        let newBlueKills = prev.blueKills
        let newRedKills = prev.redKills
        const newKillFeed = [...prev.killFeed]

        newUnits.forEach(unit => {
          if (!unit.isAlive || unit.type !== 'hero') return

          newUnits.forEach(target => {
            if (!target.isAlive || target.type !== 'hero' || target.team === unit.team) return

            const dist = Math.sqrt(
              Math.pow(unit.position.x - target.position.x, 2) +
              Math.pow(unit.position.z - target.position.z, 2)
            )

            // If within attack range
            if (dist < 5) {
              const damage = (unit.hero?.attackDamage || 50) * delta * 0.5
              target.health = Math.max(0, target.health - damage)

              if (target.health <= 0 && target.isAlive) {
                target.isAlive = false
                if (unit.team === 'blue') {
                  newBlueKills++
                } else {
                  newRedKills++
                }
                newKillFeed.push({
                  id: killIdCounter++,
                  killer: unit.hero?.name || 'Unknown',
                  victim: target.hero?.name || 'Unknown',
                  killerTeam: unit.team,
                  timestamp: Date.now()
                })

                // Respawn after 5 seconds
                setTimeout(() => {
                  setGameState(s => ({
                    ...s,
                    units: s.units.map(u =>
                      u.id === target.id
                        ? {
                          ...u,
                          isAlive: true,
                          health: u.maxHealth,
                          position: u.team === 'blue'
                            ? { x: -20 + Math.random() * 5, z: -20 + Math.random() * 5 }
                            : { x: 20 - Math.random() * 5, z: 20 - Math.random() * 5 }
                        }
                        : u
                    )
                  }))
                }, 5000)
              }
            }
          })
        })

        // Remove old kill feed entries
        const recentKillFeed = newKillFeed.filter(k => Date.now() - k.timestamp < 3000)

        // Update player health if player unit was damaged
        const playerUnit = newUnits.find(u => u.id === 'blue-hero-0')
        const newPlayerHealth = playerUnit?.health ?? prev.playerHealth

        return {
          ...prev,
          playerPosition: { x: newX, z: newZ },
          playerHealth: newPlayerHealth,
          playerMana: newMana,
          timeRemaining: newTimeRemaining,
          skillCooldowns: newCooldowns,
          units: newUnits,
          blueKills: newBlueKills,
          redKills: newRedKills,
          killFeed: recentKillFeed
        }
      })

      gameLoopRef.current = requestAnimationFrame(gameLoop)
    }

    gameLoopRef.current = requestAnimationFrame(gameLoop)

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current)
      }
    }
  }, [joystickInput, playerHero, onMatchEnd])

  const handleJoystickMove = useCallback((x: number, y: number) => {
    setJoystickInput({ x, y })
  }, [])

  const handleSkillUse = useCallback((skillIndex: number) => {
    setGameState(prev => {
      if (prev.skillCooldowns[skillIndex] > 0) return prev

      const skill = playerHero.skills[skillIndex]
      if (prev.playerMana < 50) return prev // Not enough mana

      // Apply skill effects
      let newUnits = [...prev.units]
      let newBlueKills = prev.blueKills
      const newKillFeed = [...prev.killFeed]

      if (skill.damage > 0) {
        // Damage nearby enemies
        newUnits = newUnits.map(unit => {
          if (unit.team === 'red' && unit.type === 'hero' && unit.isAlive) {
            const dist = Math.sqrt(
              Math.pow(prev.playerPosition.x - unit.position.x, 2) +
              Math.pow(prev.playerPosition.z - unit.position.z, 2)
            )
            if (dist < 10) {
              const newHealth = Math.max(0, unit.health - skill.damage)
              if (newHealth <= 0) {
                newBlueKills++
                newKillFeed.push({
                  id: Date.now(),
                  killer: playerHero.name,
                  victim: unit.hero?.name || 'Enemy',
                  killerTeam: 'blue',
                  timestamp: Date.now()
                })
              }
              return { ...unit, health: newHealth, isAlive: newHealth > 0 }
            }
          }
          return unit
        })
      }

      const newCooldowns: [number, number, number] = [...prev.skillCooldowns]
      newCooldowns[skillIndex] = skill.cooldown

      return {
        ...prev,
        playerMana: prev.playerMana - 50,
        skillCooldowns: newCooldowns,
        units: newUnits,
        blueKills: newBlueKills,
        killFeed: newKillFeed
      }
    })
  }, [playerHero])

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas
        camera={{ position: [0, 25, 20], fov: 50 }}
        style={{ background: '#0a0a0f' }}
      >
        <Suspense fallback={null}>
          <Arena3D
            gameState={gameState}
            playerHero={playerHero}
          />
        </Suspense>
      </Canvas>

      <GameHUD
        gameState={gameState}
        playerHero={playerHero}
        onJoystickMove={handleJoystickMove}
        onSkillUse={handleSkillUse}
      />
    </div>
  )
}
