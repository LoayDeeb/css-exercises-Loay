export const REWARD_TIERS = {
  Common: {
    name: 'Common',
    chance: 0.5,
    color: '#8B8B8B',
    glowColor: 'rgba(139, 139, 139, 0.3)',
  },
  Uncommon: {
    name: 'Uncommon',
    chance: 0.3,
    color: '#2ecc71',
    glowColor: 'rgba(46, 204, 113, 0.3)',
  },
  Rare: {
    name: 'Rare',
    chance: 0.15,
    color: '#3498db',
    glowColor: 'rgba(52, 152, 219, 0.3)',
  },
  Epic: {
    name: 'Epic',
    chance: 0.04,
    color: '#9b59b6',
    glowColor: 'rgba(155, 89, 182, 0.3)',
  },
  Legendary: {
    name: 'Legendary',
    chance: 0.01,
    color: '#f39c12',
    glowColor: 'rgba(243, 156, 18, 0.4)',
  },
};

export const DEFAULT_REWARDS = [
  // Common - Breaks
  {
    id: 'reward_short_break',
    name: '5-Minute Break',
    description: 'Take a brief respite from your labors.',
    tier: 'Common',
    category: 'breaks',
  },
  {
    id: 'reward_stretch',
    name: 'Stretching Session',
    description: 'Loosen thy muscles with a gentle stretch.',
    tier: 'Common',
    category: 'breaks',
  },
  {
    id: 'reward_walk',
    name: 'Short Walk',
    description: 'A brief stroll to clear the mind.',
    tier: 'Common',
    category: 'breaks',
  },

  // Common - Entertainment
  {
    id: 'reward_music',
    name: 'Favorite Song',
    description: 'Listen to a tune that stirs the soul.',
    tier: 'Common',
    category: 'entertainment',
  },
  {
    id: 'reward_meme_scroll',
    name: 'Scroll of Memes',
    description: '10 minutes of mirthful scrolling.',
    tier: 'Common',
    category: 'entertainment',
  },

  // Common - Treats
  {
    id: 'reward_snack',
    name: 'Small Snack',
    description: 'A modest morsel to fuel your journey.',
    tier: 'Common',
    category: 'treats',
  },
  {
    id: 'reward_tea',
    name: 'Cup of Tea',
    description: 'A warm brew to soothe the adventurer.',
    tier: 'Common',
    category: 'treats',
  },

  // Uncommon - Entertainment
  {
    id: 'reward_episode',
    name: 'TV Episode',
    description: 'Watch a single episode of your favorite tale.',
    tier: 'Uncommon',
    category: 'entertainment',
  },
  {
    id: 'reward_gaming_session',
    name: 'Gaming Session',
    description: '30 minutes of recreational gaming.',
    tier: 'Uncommon',
    category: 'entertainment',
  },

  // Uncommon - Self-Care
  {
    id: 'reward_bath',
    name: 'Relaxing Bath',
    description: 'Soak away the stress of battle.',
    tier: 'Uncommon',
    category: 'self-care',
  },
  {
    id: 'reward_nap',
    name: 'Power Nap',
    description: 'A 20-minute rest to recharge thy vitality.',
    tier: 'Uncommon',
    category: 'self-care',
  },

  // Uncommon - Social
  {
    id: 'reward_call_friend',
    name: 'Call a Friend',
    description: 'Reconnect with a companion from your travels.',
    tier: 'Uncommon',
    category: 'social',
  },

  // Rare - Treats
  {
    id: 'reward_fancy_coffee',
    name: 'Fancy Coffee',
    description: 'Treat yourself to a specialty brew from the finest shop.',
    tier: 'Rare',
    category: 'treats',
  },
  {
    id: 'reward_dessert',
    name: 'Special Dessert',
    description: 'A decadent sweet from the royal bakery.',
    tier: 'Rare',
    category: 'treats',
  },

  // Rare - Entertainment
  {
    id: 'reward_movie',
    name: 'Movie Night',
    description: 'A full cinematic experience of your choosing.',
    tier: 'Rare',
    category: 'entertainment',
  },
  {
    id: 'reward_book',
    name: 'New Book',
    description: 'Acquire a fresh tome from the library.',
    tier: 'Rare',
    category: 'entertainment',
  },

  // Epic - Splurges
  {
    id: 'reward_restaurant',
    name: 'Restaurant Meal',
    description: 'Dine at a fine establishment befitting a hero.',
    tier: 'Epic',
    category: 'splurges',
  },
  {
    id: 'reward_day_off',
    name: 'Day Off',
    description: 'An entire day free from quests and obligations.',
    tier: 'Epic',
    category: 'splurges',
  },

  // Epic - Self-Care
  {
    id: 'reward_spa',
    name: 'Spa Treatment',
    description: 'A luxurious pampering session for the weary hero.',
    tier: 'Epic',
    category: 'self-care',
  },

  // Legendary - Splurges
  {
    id: 'reward_big_purchase',
    name: 'Major Purchase',
    description: 'Something you have long desired. A truly legendary reward.',
    tier: 'Legendary',
    category: 'splurges',
  },
  {
    id: 'reward_adventure',
    name: 'Real Adventure',
    description: 'A day trip or experience worthy of song and story.',
    tier: 'Legendary',
    category: 'splurges',
  },
];
