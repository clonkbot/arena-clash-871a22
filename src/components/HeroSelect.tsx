import { useState } from 'react'
import { HEROES, Hero, getRoleColor } from '../data/heroes'

interface HeroSelectProps {
  onSelect: (hero: Hero) => void
}

export default function HeroSelect({ onSelect }: HeroSelectProps) {
  const [selectedRole, setSelectedRole] = useState<string | null>(null)

  const filteredHeroes = selectedRole
    ? HEROES.filter(h => h.role === selectedRole)
    : HEROES

  const roles = ['tank', 'fighter', 'assassin', 'mage', 'support', 'marksman']

  return (
    <div className="hero-select">
      <div className="hero-select-header">
        <h1 className="hero-select-title">Choose Your Hero</h1>
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginTop: '0.75rem'
        }}>
          <button
            onClick={() => setSelectedRole(null)}
            style={{
              padding: '0.5rem 1rem',
              background: !selectedRole ? 'var(--cyan)' : 'var(--bg-surface)',
              border: '1px solid var(--cyan-dim)',
              borderRadius: '4px',
              color: !selectedRole ? 'var(--bg-deep)' : 'var(--white)',
              cursor: 'pointer',
              fontFamily: "'Orbitron', sans-serif",
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              minHeight: '44px',
              minWidth: '60px'
            }}
          >
            All
          </button>
          {roles.map(role => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              style={{
                padding: '0.5rem 1rem',
                background: selectedRole === role ? getRoleColor(role as Hero['role']) : 'var(--bg-surface)',
                border: `1px solid ${getRoleColor(role as Hero['role'])}`,
                borderRadius: '4px',
                color: selectedRole === role ? 'var(--bg-deep)' : 'var(--white)',
                cursor: 'pointer',
                fontFamily: "'Orbitron', sans-serif",
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                minHeight: '44px',
                minWidth: '60px'
              }}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      <div className="hero-grid">
        {filteredHeroes.map(hero => (
          <button
            key={hero.id}
            className="hero-card"
            onClick={() => onSelect(hero)}
            style={{
              borderColor: hero.color
            }}
          >
            <div
              className="hero-avatar"
              style={{
                background: `linear-gradient(135deg, ${hero.color} 0%, ${hero.secondaryColor} 100%)`,
                color: 'white'
              }}
            >
              {hero.icon}
            </div>
            <span className="hero-name">{hero.name}</span>
            <span className={`hero-role role-${hero.role}`}>{hero.role}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
