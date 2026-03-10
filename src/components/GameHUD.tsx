import { useRef, useState, useCallback, useEffect } from 'react'
import { GameState } from './GameArena'
import { Hero } from '../data/heroes'

interface GameHUDProps {
  gameState: GameState
  playerHero: Hero
  onJoystickMove: (x: number, y: number) => void
  onSkillUse: (skillIndex: number) => void
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

function Joystick({ onMove }: { onMove: (x: number, y: number) => void }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [knobPosition, setKnobPosition] = useState({ x: 0, y: 0 })
  const [isActive, setIsActive] = useState(false)
  const touchIdRef = useRef<number | null>(null)

  const handleStart = useCallback((clientX: number, clientY: number, touchId?: number) => {
    if (!containerRef.current) return

    if (touchId !== undefined) {
      touchIdRef.current = touchId
    }

    setIsActive(true)
    const rect = containerRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const x = (clientX - centerX) / (rect.width / 2)
    const y = (clientY - centerY) / (rect.height / 2)

    const distance = Math.sqrt(x * x + y * y)
    const clampedDistance = Math.min(distance, 1)
    const angle = Math.atan2(y, x)

    const clampedX = Math.cos(angle) * clampedDistance
    const clampedY = Math.sin(angle) * clampedDistance

    setKnobPosition({ x: clampedX * 40, y: clampedY * 40 })
    onMove(clampedX, -clampedY)
  }, [onMove])

  const handleMove = useCallback((clientX: number, clientY: number) => {
    if (!isActive || !containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const x = (clientX - centerX) / (rect.width / 2)
    const y = (clientY - centerY) / (rect.height / 2)

    const distance = Math.sqrt(x * x + y * y)
    const clampedDistance = Math.min(distance, 1)
    const angle = Math.atan2(y, x)

    const clampedX = Math.cos(angle) * clampedDistance
    const clampedY = Math.sin(angle) * clampedDistance

    setKnobPosition({ x: clampedX * 40, y: clampedY * 40 })
    onMove(clampedX, -clampedY)
  }, [isActive, onMove])

  const handleEnd = useCallback(() => {
    setIsActive(false)
    setKnobPosition({ x: 0, y: 0 })
    onMove(0, 0)
    touchIdRef.current = null
  }, [onMove])

  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      if (touchIdRef.current !== null) {
        for (let i = 0; i < e.touches.length; i++) {
          if (e.touches[i].identifier === touchIdRef.current) {
            handleMove(e.touches[i].clientX, e.touches[i].clientY)
            break
          }
        }
      }
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (touchIdRef.current !== null) {
        let found = false
        for (let i = 0; i < e.touches.length; i++) {
          if (e.touches[i].identifier === touchIdRef.current) {
            found = true
            break
          }
        }
        if (!found) {
          handleEnd()
        }
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (isActive) {
        handleMove(e.clientX, e.clientY)
      }
    }

    const handleMouseUp = () => {
      if (isActive) {
        handleEnd()
      }
    }

    window.addEventListener('touchmove', handleTouchMove, { passive: false })
    window.addEventListener('touchend', handleTouchEnd)
    window.addEventListener('touchcancel', handleTouchEnd)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
      window.removeEventListener('touchcancel', handleTouchEnd)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isActive, handleMove, handleEnd])

  return (
    <div
      ref={containerRef}
      className="joystick-container"
      onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
      onTouchStart={(e) => {
        e.preventDefault()
        const touch = e.touches[0]
        handleStart(touch.clientX, touch.clientY, touch.identifier)
      }}
    >
      <div
        className="joystick-knob"
        style={{
          transform: `translate(${knobPosition.x}%, ${knobPosition.y}%)`,
          transition: isActive ? 'none' : 'transform 0.15s ease-out'
        }}
      />
    </div>
  )
}

function SkillButton({ skill, index, cooldown, onUse }: {
  skill: Hero['skills'][0]
  index: number
  cooldown: number
  onUse: () => void
}) {
  const isOnCooldown = cooldown > 0
  const cooldownPercent = cooldown / skill.cooldown

  return (
    <button
      className={`skill-btn skill-${index + 1} ${isOnCooldown ? 'on-cooldown' : ''}`}
      onClick={() => !isOnCooldown && onUse()}
      onTouchStart={(e) => {
        e.preventDefault()
        if (!isOnCooldown) onUse()
      }}
      disabled={isOnCooldown}
    >
      <span className="skill-icon">{skill.icon}</span>
      <span className="skill-key">{index === 2 ? 'ULT' : `Q${index + 1}`}</span>

      {isOnCooldown && (
        <>
          <div
            className="cooldown-overlay"
            style={{ height: `${cooldownPercent * 100}%` }}
          />
          <span className="cooldown-text">{Math.ceil(cooldown)}</span>
        </>
      )}
    </button>
  )
}

function Minimap({ gameState }: { gameState: GameState }) {
  const mapSize = 100

  return (
    <div className="minimap">
      <div className="minimap-bg">
        {gameState.units.filter(u => u.isAlive).map(unit => {
          const x = ((unit.position.x + 25) / 50) * mapSize
          const y = ((unit.position.z + 25) / 50) * mapSize

          return (
            <div
              key={unit.id}
              className={`minimap-dot ${unit.id === 'blue-hero-0' ? 'dot-player' : unit.team === 'blue' ? 'dot-blue' : 'dot-red'
                }`}
              style={{
                left: `${x}%`,
                top: `${y}%`
              }}
            />
          )
        })}
      </div>
    </div>
  )
}

export default function GameHUD({
  gameState,
  playerHero,
  onJoystickMove,
  onSkillUse
}: GameHUDProps) {
  return (
    <div className="game-hud">
      {/* Top bar */}
      <div className="hud-top">
        <div className="team-score">
          <div className="score-badge score-blue">{gameState.blueKills}</div>
        </div>

        <div className="match-timer">{formatTime(gameState.timeRemaining)}</div>

        <div className="team-score">
          <div className="score-badge score-red">{gameState.redKills}</div>
        </div>
      </div>

      {/* Minimap */}
      <Minimap gameState={gameState} />

      {/* Kill feed */}
      <div className="kill-feed">
        {gameState.killFeed.map(kill => (
          <div key={kill.id} className="kill-entry">
            <span style={{ color: kill.killerTeam === 'blue' ? '#66aaff' : '#ff6666' }}>
              {kill.killer}
            </span>
            {' '}killed{' '}
            <span style={{ color: kill.killerTeam === 'blue' ? '#ff6666' : '#66aaff' }}>
              {kill.victim}
            </span>
          </div>
        ))}
      </div>

      {/* Player stats */}
      <div className="player-stats">
        <div className="stat-bar">
          <div
            className="stat-fill health-fill"
            style={{ width: `${(gameState.playerHealth / playerHero.health) * 100}%` }}
          />
          <span className="stat-text">
            {Math.round(gameState.playerHealth)} / {playerHero.health}
          </span>
        </div>
        <div className="stat-bar">
          <div
            className="stat-fill mana-fill"
            style={{ width: `${(gameState.playerMana / playerHero.mana) * 100}%` }}
          />
          <span className="stat-text">
            {Math.round(gameState.playerMana)} / {playerHero.mana}
          </span>
        </div>
      </div>

      {/* Joystick */}
      <Joystick onMove={onJoystickMove} />

      {/* Skill bar */}
      <div className="skill-bar">
        {playerHero.skills.map((skill, i) => (
          <SkillButton
            key={i}
            skill={skill}
            index={i}
            cooldown={gameState.skillCooldowns[i]}
            onUse={() => onSkillUse(i)}
          />
        ))}
      </div>
    </div>
  )
}
