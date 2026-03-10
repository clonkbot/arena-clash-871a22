export type HeroRole = 'tank' | 'fighter' | 'assassin' | 'mage' | 'support' | 'marksman'

export interface Skill {
  name: string
  icon: string
  cooldown: number // seconds
  damage: number
  description: string
}

export interface Hero {
  id: number
  name: string
  role: HeroRole
  color: string
  secondaryColor: string
  icon: string
  health: number
  mana: number
  attackDamage: number
  skills: [Skill, Skill, Skill]
}

export const HEROES: Hero[] = [
  // TANKS (5)
  {
    id: 1,
    name: 'Ironclad',
    role: 'tank',
    color: '#4488ff',
    secondaryColor: '#224488',
    icon: '🛡️',
    health: 3500,
    mana: 400,
    attackDamage: 85,
    skills: [
      { name: 'Shield Wall', icon: '🛡️', cooldown: 8, damage: 0, description: 'Block 500 damage' },
      { name: 'Ground Slam', icon: '💥', cooldown: 12, damage: 180, description: 'AOE stun' },
      { name: 'Fortress', icon: '🏰', cooldown: 60, damage: 0, description: 'Invincible for 3s' }
    ]
  },
  {
    id: 2,
    name: 'Stoneguard',
    role: 'tank',
    color: '#886644',
    secondaryColor: '#443322',
    icon: '🪨',
    health: 3800,
    mana: 350,
    attackDamage: 75,
    skills: [
      { name: 'Rock Armor', icon: '🪨', cooldown: 10, damage: 0, description: '+300 armor' },
      { name: 'Boulder Toss', icon: '⚫', cooldown: 14, damage: 220, description: 'Ranged stun' },
      { name: 'Earthquake', icon: '🌋', cooldown: 55, damage: 400, description: 'Massive AOE' }
    ]
  },
  {
    id: 3,
    name: 'Frostwall',
    role: 'tank',
    color: '#88ccff',
    secondaryColor: '#4488aa',
    icon: '❄️',
    health: 3200,
    mana: 500,
    attackDamage: 70,
    skills: [
      { name: 'Ice Shield', icon: '🧊', cooldown: 9, damage: 0, description: 'Absorb damage' },
      { name: 'Frozen Ground', icon: '❄️', cooldown: 11, damage: 150, description: 'Slow enemies' },
      { name: 'Absolute Zero', icon: '🌨️', cooldown: 65, damage: 300, description: 'Freeze all nearby' }
    ]
  },
  {
    id: 4,
    name: 'Titanium',
    role: 'tank',
    color: '#aaaacc',
    secondaryColor: '#666688',
    icon: '⚙️',
    health: 3600,
    mana: 380,
    attackDamage: 90,
    skills: [
      { name: 'Metal Skin', icon: '⚙️', cooldown: 7, damage: 0, description: 'Damage reflect' },
      { name: 'Overcharge', icon: '⚡', cooldown: 13, damage: 200, description: 'Electric burst' },
      { name: 'Mech Suit', icon: '🤖', cooldown: 70, damage: 0, description: 'Transform mode' }
    ]
  },
  {
    id: 5,
    name: 'Colossus',
    role: 'tank',
    color: '#cc8844',
    secondaryColor: '#885522',
    icon: '🗿',
    health: 4000,
    mana: 300,
    attackDamage: 95,
    skills: [
      { name: 'Ancient Guard', icon: '🗿', cooldown: 8, damage: 0, description: 'Team shield' },
      { name: 'Titan Punch', icon: '👊', cooldown: 10, damage: 250, description: 'Knockback' },
      { name: 'Awakening', icon: '🌟', cooldown: 80, damage: 500, description: 'True damage burst' }
    ]
  },

  // FIGHTERS (5)
  {
    id: 6,
    name: 'Bladestorm',
    role: 'fighter',
    color: '#ff6644',
    secondaryColor: '#aa3322',
    icon: '⚔️',
    health: 2600,
    mana: 450,
    attackDamage: 130,
    skills: [
      { name: 'Slash', icon: '⚔️', cooldown: 5, damage: 180, description: 'Quick strike' },
      { name: 'Whirlwind', icon: '🌀', cooldown: 10, damage: 280, description: 'Spin attack' },
      { name: 'Blade Fury', icon: '💫', cooldown: 45, damage: 500, description: 'Rapid slashes' }
    ]
  },
  {
    id: 7,
    name: 'Warlord',
    role: 'fighter',
    color: '#aa2222',
    secondaryColor: '#661111',
    icon: '🪓',
    health: 2800,
    mana: 400,
    attackDamage: 145,
    skills: [
      { name: 'Axe Throw', icon: '🪓', cooldown: 6, damage: 200, description: 'Ranged attack' },
      { name: 'Battle Cry', icon: '📣', cooldown: 15, damage: 0, description: '+50% damage' },
      { name: 'Berserker', icon: '😤', cooldown: 50, damage: 0, description: 'Rage mode' }
    ]
  },
  {
    id: 8,
    name: 'Samurai',
    role: 'fighter',
    color: '#cc4444',
    secondaryColor: '#882222',
    icon: '⛩️',
    health: 2400,
    mana: 480,
    attackDamage: 140,
    skills: [
      { name: 'Katana Slash', icon: '🗡️', cooldown: 4, damage: 160, description: 'Swift cut' },
      { name: 'Honor Strike', icon: '⚡', cooldown: 12, damage: 320, description: 'Critical hit' },
      { name: 'Bushido', icon: '⛩️', cooldown: 55, damage: 600, description: 'Ultimate slash' }
    ]
  },
  {
    id: 9,
    name: 'Gladiator',
    role: 'fighter',
    color: '#ddaa44',
    secondaryColor: '#886622',
    icon: '🏛️',
    health: 2700,
    mana: 420,
    attackDamage: 135,
    skills: [
      { name: 'Shield Bash', icon: '🛡️', cooldown: 6, damage: 150, description: 'Stun enemy' },
      { name: 'Arena Combo', icon: '💪', cooldown: 9, damage: 250, description: '3-hit combo' },
      { name: 'Champion', icon: '🏆', cooldown: 60, damage: 400, description: 'Execute low HP' }
    ]
  },
  {
    id: 10,
    name: 'Viking',
    role: 'fighter',
    color: '#6688aa',
    secondaryColor: '#445566',
    icon: '🪖',
    health: 2900,
    mana: 380,
    attackDamage: 150,
    skills: [
      { name: 'Raid', icon: '🪖', cooldown: 7, damage: 190, description: 'Charge forward' },
      { name: 'Thunder', icon: '⚡', cooldown: 14, damage: 270, description: 'Lightning strike' },
      { name: 'Valhalla', icon: '🌩️', cooldown: 65, damage: 450, description: 'Call lightning' }
    ]
  },

  // ASSASSINS (5)
  {
    id: 11,
    name: 'Shadow',
    role: 'assassin',
    color: '#8844ff',
    secondaryColor: '#442288',
    icon: '🥷',
    health: 1800,
    mana: 550,
    attackDamage: 180,
    skills: [
      { name: 'Backstab', icon: '🗡️', cooldown: 4, damage: 250, description: 'Critical from behind' },
      { name: 'Vanish', icon: '💨', cooldown: 12, damage: 0, description: 'Invisibility' },
      { name: 'Death Mark', icon: '☠️', cooldown: 40, damage: 700, description: 'Execute target' }
    ]
  },
  {
    id: 12,
    name: 'Phantom',
    role: 'assassin',
    color: '#aa66cc',
    secondaryColor: '#663388',
    icon: '👻',
    health: 1700,
    mana: 580,
    attackDamage: 175,
    skills: [
      { name: 'Phase', icon: '👻', cooldown: 5, damage: 220, description: 'Pass through' },
      { name: 'Soul Rip', icon: '💀', cooldown: 10, damage: 300, description: 'Steal life' },
      { name: 'Possession', icon: '😈', cooldown: 50, damage: 550, description: 'Control enemy' }
    ]
  },
  {
    id: 13,
    name: 'Viper',
    role: 'assassin',
    color: '#44cc44',
    secondaryColor: '#228822',
    icon: '🐍',
    health: 1850,
    mana: 520,
    attackDamage: 170,
    skills: [
      { name: 'Poison Fang', icon: '🐍', cooldown: 5, damage: 180, description: 'DOT poison' },
      { name: 'Coil', icon: '🌀', cooldown: 11, damage: 240, description: 'Constrict enemy' },
      { name: 'Venom Burst', icon: '💚', cooldown: 45, damage: 600, description: 'Deadly poison' }
    ]
  },
  {
    id: 14,
    name: 'Nightblade',
    role: 'assassin',
    color: '#2244aa',
    secondaryColor: '#112255',
    icon: '🌙',
    health: 1750,
    mana: 560,
    attackDamage: 185,
    skills: [
      { name: 'Moon Strike', icon: '🌙', cooldown: 4, damage: 230, description: 'Piercing attack' },
      { name: 'Shadow Step', icon: '🦶', cooldown: 8, damage: 0, description: 'Teleport' },
      { name: 'Eclipse', icon: '🌑', cooldown: 55, damage: 650, description: 'Darkness AOE' }
    ]
  },
  {
    id: 15,
    name: 'Reaper',
    role: 'assassin',
    color: '#333344',
    secondaryColor: '#111122',
    icon: '💀',
    health: 1900,
    mana: 500,
    attackDamage: 190,
    skills: [
      { name: 'Scythe', icon: '⚰️', cooldown: 5, damage: 260, description: 'Wide slash' },
      { name: 'Death Walk', icon: '💀', cooldown: 10, damage: 0, description: 'Gain speed' },
      { name: 'Judgment', icon: '⚖️', cooldown: 60, damage: 800, description: 'Instant kill <20%' }
    ]
  },

  // MAGES (5)
  {
    id: 16,
    name: 'Pyromancer',
    role: 'mage',
    color: '#ff4488',
    secondaryColor: '#aa2255',
    icon: '🔥',
    health: 1600,
    mana: 800,
    attackDamage: 60,
    skills: [
      { name: 'Fireball', icon: '🔥', cooldown: 3, damage: 280, description: 'Fire projectile' },
      { name: 'Inferno', icon: '🌋', cooldown: 10, damage: 350, description: 'Fire circle' },
      { name: 'Meteor', icon: '☄️', cooldown: 50, damage: 700, description: 'Sky impact' }
    ]
  },
  {
    id: 17,
    name: 'Frostweaver',
    role: 'mage',
    color: '#44aaff',
    secondaryColor: '#2266aa',
    icon: '🧊',
    health: 1650,
    mana: 780,
    attackDamage: 55,
    skills: [
      { name: 'Ice Shard', icon: '🧊', cooldown: 3, damage: 260, description: 'Slow enemy' },
      { name: 'Blizzard', icon: '🌨️', cooldown: 12, damage: 380, description: 'AOE slow' },
      { name: 'Ice Age', icon: '❄️', cooldown: 55, damage: 650, description: 'Freeze all' }
    ]
  },
  {
    id: 18,
    name: 'Thunderlord',
    role: 'mage',
    color: '#ffff44',
    secondaryColor: '#aaaa22',
    icon: '⚡',
    health: 1550,
    mana: 850,
    attackDamage: 50,
    skills: [
      { name: 'Lightning', icon: '⚡', cooldown: 2, damage: 240, description: 'Chain damage' },
      { name: 'Storm', icon: '🌩️', cooldown: 11, damage: 400, description: 'Random strikes' },
      { name: 'Thunder God', icon: '🌪️', cooldown: 60, damage: 750, description: 'Storm fury' }
    ]
  },
  {
    id: 19,
    name: 'Naturist',
    role: 'mage',
    color: '#44ff88',
    secondaryColor: '#22aa55',
    icon: '🌿',
    health: 1700,
    mana: 750,
    attackDamage: 65,
    skills: [
      { name: 'Thorn', icon: '🌿', cooldown: 4, damage: 200, description: 'Root enemy' },
      { name: 'Bloom', icon: '🌸', cooldown: 14, damage: 0, description: 'Heal allies' },
      { name: 'Wrath', icon: '🌳', cooldown: 50, damage: 600, description: 'Nature burst' }
    ]
  },
  {
    id: 20,
    name: 'Void Mage',
    role: 'mage',
    color: '#aa44aa',
    secondaryColor: '#662266',
    icon: '🌀',
    health: 1500,
    mana: 900,
    attackDamage: 45,
    skills: [
      { name: 'Void Bolt', icon: '🌀', cooldown: 3, damage: 300, description: 'Pure damage' },
      { name: 'Black Hole', icon: '⚫', cooldown: 15, damage: 450, description: 'Pull enemies' },
      { name: 'Oblivion', icon: '🕳️', cooldown: 65, damage: 850, description: 'Void explosion' }
    ]
  },

  // SUPPORTS (3)
  {
    id: 21,
    name: 'Healer',
    role: 'support',
    color: '#44ffaa',
    secondaryColor: '#22aa66',
    icon: '💚',
    health: 2000,
    mana: 700,
    attackDamage: 50,
    skills: [
      { name: 'Heal', icon: '💚', cooldown: 5, damage: -300, description: 'Restore HP' },
      { name: 'Barrier', icon: '🛡️', cooldown: 12, damage: 0, description: 'Shield ally' },
      { name: 'Resurrection', icon: '✨', cooldown: 90, damage: 0, description: 'Revive ally' }
    ]
  },
  {
    id: 22,
    name: 'Oracle',
    role: 'support',
    color: '#ffaaff',
    secondaryColor: '#aa66aa',
    icon: '🔮',
    health: 1900,
    mana: 750,
    attackDamage: 55,
    skills: [
      { name: 'Vision', icon: '👁️', cooldown: 8, damage: 0, description: 'Reveal area' },
      { name: 'Fortune', icon: '🔮', cooldown: 15, damage: 0, description: 'Buff allies' },
      { name: 'Prophecy', icon: '⭐', cooldown: 70, damage: 0, description: 'Team immunity' }
    ]
  },
  {
    id: 23,
    name: 'Enchanter',
    role: 'support',
    color: '#ffccff',
    secondaryColor: '#aa88aa',
    icon: '✨',
    health: 1850,
    mana: 800,
    attackDamage: 60,
    skills: [
      { name: 'Charm', icon: '💕', cooldown: 6, damage: 100, description: 'Stun enemy' },
      { name: 'Empower', icon: '💪', cooldown: 10, damage: 0, description: '+30% ally damage' },
      { name: 'Wish', icon: '🌟', cooldown: 80, damage: -500, description: 'Full heal ally' }
    ]
  },

  // MARKSMEN (2)
  {
    id: 24,
    name: 'Sniper',
    role: 'marksman',
    color: '#ffaa44',
    secondaryColor: '#aa6622',
    icon: '🎯',
    health: 1700,
    mana: 450,
    attackDamage: 160,
    skills: [
      { name: 'Headshot', icon: '🎯', cooldown: 6, damage: 350, description: 'Critical shot' },
      { name: 'Trap', icon: '🪤', cooldown: 14, damage: 150, description: 'Root enemy' },
      { name: 'Assassination', icon: '💀', cooldown: 55, damage: 800, description: 'Long range kill' }
    ]
  },
  {
    id: 25,
    name: 'Gunslinger',
    role: 'marksman',
    color: '#cc8866',
    secondaryColor: '#885533',
    icon: '🔫',
    health: 1750,
    mana: 400,
    attackDamage: 155,
    skills: [
      { name: 'Quickdraw', icon: '🔫', cooldown: 4, damage: 200, description: 'Fast shot' },
      { name: 'Barrage', icon: '💨', cooldown: 10, damage: 320, description: 'Multi-shot' },
      { name: 'High Noon', icon: '🌅', cooldown: 50, damage: 600, description: 'Fan the hammer' }
    ]
  }
]

export const getRoleColor = (role: HeroRole): string => {
  const colors: Record<HeroRole, string> = {
    tank: '#4488ff',
    fighter: '#ff6644',
    assassin: '#aa44ff',
    mage: '#ff44aa',
    support: '#44ffaa',
    marksman: '#ffaa44'
  }
  return colors[role]
}
