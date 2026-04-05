const theme = {
  colors: {
    darkBrown: '#2d1b0e',
    mediumBrown: '#4a3728',
    parchment: '#f4e4bc',
    parchmentDark: '#e8d5a3',
    redInk: '#8b2500',
    gold: '#d4af37',
    goldBright: '#ffd700',
    midnightBlue: '#1a1a3e',
    darkText: '#1a0a00',
    lightText: '#f4e4bc',
  },

  categoryColors: {
    Health: '#8b2500',
    Intelligence: '#1a1a3e',
    Money: '#d4af37',
    Relationships: '#6b3a6b',
  },

  difficultyColors: {
    Trivial: '#808080',
    Easy: '#2ecc71',
    Medium: '#3498db',
    Hard: '#e67e22',
    Epic: '#9b59b6',
    Legendary: '#d4af37',
  },

  rewardTierColors: {
    Common: '#8B8B8B',
    Uncommon: '#2ecc71',
    Rare: '#3498db',
    Epic: '#9b59b6',
    Legendary: '#f39c12',
  },

  fonts: {
    display: "'Cinzel', serif",
    medieval: "'MedievalSharp', cursive",
    body: "'Cormorant Garamond', serif",
    handwritten: "'Caveat', cursive",
  },

  shadows: {
    soft: '0 2px 8px rgba(0, 0, 0, 0.3)',
    medium: '0 4px 16px rgba(0, 0, 0, 0.5)',
    hard: '0 8px 32px rgba(0, 0, 0, 0.7)',
    inset: 'inset 0 2px 8px rgba(0, 0, 0, 0.3)',
    glow: '0 0 12px rgba(212, 175, 55, 0.4)',
    textGlow: '0 0 8px rgba(212, 175, 55, 0.6)',
  },

  borders: {
    thin: '1px solid #4a3728',
    medium: '2px solid #4a3728',
    thick: '3px solid #4a3728',
    gold: '2px solid #d4af37',
    ornate: '3px double #d4af37',
    parchment: '1px solid #e8d5a3',
  },

  borderRadius: {
    small: '4px',
    medium: '8px',
    large: '12px',
    round: '50%',
  },

  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },

  transitions: {
    fast: '0.15s ease',
    normal: '0.3s ease',
    slow: '0.5s ease',
  },

  zIndex: {
    base: 0,
    dropdown: 100,
    modal: 1000,
    tooltip: 1100,
    overlay: 900,
  },
};

export default theme;
