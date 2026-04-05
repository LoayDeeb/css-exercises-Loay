export const TALENT_PATHS = [
  {
    id: 'discipline',
    name: 'Path of Discipline',
    icon: '🔄',
    description:
      'Hone the power of routine and repetition. Each rank increases experience earned from recurring quests.',
    maxRanks: 5,
    ranks: [
      {
        rank: 1,
        effect: '+5% XP from recurring quests',
        modifier: { type: 'recurring_xp', value: 0.05 },
      },
      {
        rank: 2,
        effect: '+10% XP from recurring quests',
        modifier: { type: 'recurring_xp', value: 0.1 },
      },
      {
        rank: 3,
        effect: '+15% XP from recurring quests',
        modifier: { type: 'recurring_xp', value: 0.15 },
      },
      {
        rank: 4,
        effect: '+20% XP from recurring quests',
        modifier: { type: 'recurring_xp', value: 0.2 },
      },
      {
        rank: 5,
        effect: '+25% XP from recurring quests',
        modifier: { type: 'recurring_xp', value: 0.25 },
      },
    ],
  },
  {
    id: 'ambition',
    name: 'Path of Ambition',
    icon: '🏔️',
    description:
      'Embrace the thrill of greater challenges. Each rank increases experience earned from Hard difficulty quests and above.',
    maxRanks: 5,
    ranks: [
      {
        rank: 1,
        effect: '+10% XP from Hard+ quests',
        modifier: { type: 'hard_quest_xp', value: 0.1 },
      },
      {
        rank: 2,
        effect: '+20% XP from Hard+ quests',
        modifier: { type: 'hard_quest_xp', value: 0.2 },
      },
      {
        rank: 3,
        effect: '+30% XP from Hard+ quests',
        modifier: { type: 'hard_quest_xp', value: 0.3 },
      },
      {
        rank: 4,
        effect: '+40% XP from Hard+ quests',
        modifier: { type: 'hard_quest_xp', value: 0.4 },
      },
      {
        rank: 5,
        effect: '+50% XP from Hard+ quests',
        modifier: { type: 'hard_quest_xp', value: 0.5 },
      },
    ],
  },
  {
    id: 'fortune',
    name: 'Path of Fortune',
    icon: '🍀',
    description:
      'Court the favor of Lady Luck. Each rank increases gold earned and improves your chances of receiving better reward tiers.',
    maxRanks: 5,
    ranks: [
      {
        rank: 1,
        effect: '+15% gold and improved reward tier chances',
        modifier: { type: 'fortune', goldBonus: 0.15, tierBonus: 0.02 },
      },
      {
        rank: 2,
        effect: '+30% gold and improved reward tier chances',
        modifier: { type: 'fortune', goldBonus: 0.3, tierBonus: 0.04 },
      },
      {
        rank: 3,
        effect: '+45% gold and improved reward tier chances',
        modifier: { type: 'fortune', goldBonus: 0.45, tierBonus: 0.06 },
      },
      {
        rank: 4,
        effect: '+60% gold and improved reward tier chances',
        modifier: { type: 'fortune', goldBonus: 0.6, tierBonus: 0.08 },
      },
      {
        rank: 5,
        effect: '+75% gold and improved reward tier chances',
        modifier: { type: 'fortune', goldBonus: 0.75, tierBonus: 0.1 },
      },
    ],
  },
  {
    id: 'wisdom',
    name: 'Path of Wisdom',
    icon: '📖',
    description:
      'Unlock the secrets of arcane efficiency. Each rank reduces the mental energy (MP) cost of completing quests.',
    maxRanks: 5,
    ranks: [
      {
        rank: 1,
        effect: '-10% MP costs',
        modifier: { type: 'mp_reduction', value: 0.1 },
      },
      {
        rank: 2,
        effect: '-20% MP costs',
        modifier: { type: 'mp_reduction', value: 0.2 },
      },
      {
        rank: 3,
        effect: '-30% MP costs',
        modifier: { type: 'mp_reduction', value: 0.3 },
      },
      {
        rank: 4,
        effect: '-40% MP costs',
        modifier: { type: 'mp_reduction', value: 0.4 },
      },
      {
        rank: 5,
        effect: '-50% MP costs',
        modifier: { type: 'mp_reduction', value: 0.5 },
      },
    ],
  },
  {
    id: 'resilience',
    name: 'Path of Resilience',
    icon: '🛡️',
    description:
      'Fortify your body and spirit against adversity. Each rank increases maximum HP and reduces penalties from failed or abandoned quests.',
    maxRanks: 5,
    ranks: [
      {
        rank: 1,
        effect: '+20 max HP, slightly reduced failure penalties',
        modifier: { type: 'resilience', hpBonus: 20, failureReduction: 0.05 },
      },
      {
        rank: 2,
        effect: '+40 max HP, reduced failure penalties',
        modifier: { type: 'resilience', hpBonus: 40, failureReduction: 0.1 },
      },
      {
        rank: 3,
        effect: '+60 max HP, moderately reduced failure penalties',
        modifier: { type: 'resilience', hpBonus: 60, failureReduction: 0.15 },
      },
      {
        rank: 4,
        effect: '+80 max HP, significantly reduced failure penalties',
        modifier: { type: 'resilience', hpBonus: 80, failureReduction: 0.2 },
      },
      {
        rank: 5,
        effect: '+100 max HP, greatly reduced failure penalties',
        modifier: { type: 'resilience', hpBonus: 100, failureReduction: 0.25 },
      },
    ],
  },
];
