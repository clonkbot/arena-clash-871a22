import { useState, useCallback } from 'react'
import GameArena from './components/GameArena'
import HeroSelect from './components/HeroSelect'
import MainMenu from './components/MainMenu'
import MatchResult from './components/MatchResult'
import { Hero, HEROES } from './data/heroes'
import './styles.css'

type GameState = 'menu' | 'hero-select' | 'playing' | 'result'

interface MatchData {
  winner: 'blue' | 'red'
  kills: { blue: number; red: number }
  duration: number
}

function App() {
  const [gameState, setGameState] = useState<GameState>('menu')
  const [selectedHero, setSelectedHero] = useState<Hero | null>(null)
  const [teamHeroes, setTeamHeroes] = useState<{ blue: Hero[]; red: Hero[] }>({ blue: [], red: [] })
  const [matchResult, setMatchResult] = useState<MatchData | null>(null)

  const handleStartGame = useCallback(() => {
    setGameState('hero-select')
  }, [])

  const handleHeroSelect = useCallback((hero: Hero) => {
    setSelectedHero(hero)

    // Auto-select teammates and enemies
    const availableHeroes = HEROES.filter(h => h.id !== hero.id)
    const shuffled = [...availableHeroes].sort(() => Math.random() - 0.5)

    const blueTeam = [hero, ...shuffled.slice(0, 4)]
    const redTeam = shuffled.slice(4, 9)

    setTeamHeroes({ blue: blueTeam, red: redTeam })
    setGameState('playing')
  }, [])

  const handleMatchEnd = useCallback((result: MatchData) => {
    setMatchResult(result)
    setGameState('result')
  }, [])

  const handleReturnToMenu = useCallback(() => {
    setGameState('menu')
    setSelectedHero(null)
    setTeamHeroes({ blue: [], red: [] })
    setMatchResult(null)
  }, [])

  return (
    <div className="app-container">
      {gameState === 'menu' && (
        <MainMenu onStart={handleStartGame} />
      )}

      {gameState === 'hero-select' && (
        <HeroSelect onSelect={handleHeroSelect} />
      )}

      {gameState === 'playing' && selectedHero && (
        <GameArena
          playerHero={selectedHero}
          teamHeroes={teamHeroes}
          onMatchEnd={handleMatchEnd}
        />
      )}

      {gameState === 'result' && matchResult && (
        <MatchResult
          result={matchResult}
          onReturn={handleReturnToMenu}
        />
      )}

      <footer className="game-footer">
        Requested by @flambons · Built by @clonkbot
      </footer>
    </div>
  )
}

export default App
