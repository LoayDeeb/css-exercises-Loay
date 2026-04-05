import { useState, useCallback, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import GlobalStyles from './GlobalStyles';
import theme from './theme';
import { CharacterProvider, useCharacterContext } from './context/CharacterContext';
import { QuestProvider, useQuestContext } from './context/QuestContext';
import { RewardProvider, useRewardContext } from './context/RewardContext';
import { AchievementProvider, useAchievementContext } from './context/AchievementContext';
import BookLayout from './components/layout/BookLayout';
import CharacterCreation from './components/character/CharacterCreation';
import CharacterSheet from './components/character/CharacterSheet';
import LevelUpOverlay from './components/character/LevelUpOverlay';
import QuestBoard from './components/quests/QuestBoard';
import QuestLog from './components/quests/QuestLog';
import QuestContract from './components/quests/QuestContract';
import QuestDetail from './components/quests/QuestDetail';
import TalentTree from './components/talents/TalentTree';
import TrophyRoom from './components/achievements/TrophyRoom';
import RewardManager from './components/rewards/RewardManager';
import TreasureChest from './components/rewards/TreasureChest';
import StatsPage from './components/statistics/StatsPage';
import SettingsPage from './components/settings/SettingsPage';
import { DIFFICULTIES } from './constants/difficulties';
import { CHARACTER_CLASSES } from './constants/classes';
import { ACHIEVEMENTS } from './constants/achievements';
import { calculateQuestXp, xpProgress as xpProgressUtil } from './utils/xp';
import { rollForReward, rollRewardTier, selectReward } from './utils/rewards';
import { isOverdue, getNextRecurrence } from './utils/dates';

const TABS = [
  { id: 'quests', label: 'Quests', icon: '📜' },
  { id: 'character', label: 'Character', icon: '⚔️' },
  { id: 'talents', label: 'Talents', icon: '✨' },
  { id: 'achievements', label: 'Trophies', icon: '🏆' },
  { id: 'rewards', label: 'Rewards', icon: '🎁' },
  { id: 'stats', label: 'Stats', icon: '📊' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
];

const HARD_PLUS = ['hard', 'epic', 'legendary'];
const DIFFICULTY_ORDER = ['trivial', 'easy', 'medium', 'hard', 'epic', 'legendary'];

function checkAchievements(charState, questState, quest, unlockedSet) {
  const newlyUnlocked = [];
  const level = xpProgressUtil(charState.xp).level;
  const totalCompleted = questState.questHistory.filter((q) => q.status === 'completed').length + 1;

  for (const ach of ACHIEVEMENTS) {
    if (unlockedSet.has(ach.id)) continue;

    const cond = ach.condition;
    let met = false;

    switch (cond.type) {
      case 'quests_completed':
        met = totalCompleted >= cond.value;
        break;
      case 'level':
        met = level >= cond.value;
        break;
      case 'category_quests': {
        const catKey = cond.category.toLowerCase();
        const count = (charState.completedQuestsByCategory[catKey] || 0) + (quest.category === catKey ? 1 : 0);
        met = count >= cond.value;
        break;
      }
      case 'all_categories': {
        met = cond.categories.every((cat) => {
          const catKey = cat.toLowerCase();
          const count = (charState.completedQuestsByCategory[catKey] || 0) + (quest.category === catKey ? 1 : 0);
          return count >= cond.value;
        });
        break;
      }
      case 'streak':
        met = charState.streakDays >= cond.value;
        break;
      case 'difficulty_completed':
        met = quest.difficulty === cond.difficulty;
        break;
      case 'quests_in_day':
        met = (charState.questsCompletedToday + 1) >= cond.value;
        break;
      case 'all_bonus_objectives':
        if (quest.bonusObjectives?.length > 0) {
          met = quest.bonusObjectives.every((b) => b.completed);
        }
        break;
    }

    if (met) newlyUnlocked.push(ach.id);
  }

  return newlyUnlocked;
}

function getCategoryCombo(questHistory, currentCategory) {
  const recent = [...questHistory]
    .filter((q) => q.status === 'completed')
    .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
    .slice(0, 2);
  const streak = recent.filter((q) => q.category === currentCategory).length;
  return streak >= 2; // current quest makes it 3+
}

function getDifficultyRun(questHistory, currentDifficulty) {
  const recent = [...questHistory]
    .filter((q) => q.status === 'completed')
    .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
    .slice(0, 2);

  if (recent.length < 2) return false;

  const currentIdx = DIFFICULTY_ORDER.indexOf(currentDifficulty);
  const prevIdx = DIFFICULTY_ORDER.indexOf(recent[0]?.difficulty);
  const prev2Idx = DIFFICULTY_ORDER.indexOf(recent[1]?.difficulty);

  return prev2Idx >= 0 && prevIdx > prev2Idx && currentIdx > prevIdx;
}

function isPerfectDay(quests) {
  const today = new Date().toISOString().split('T')[0];
  const dueToday = quests.filter((q) => {
    if (!q.dueDate) return false;
    return q.dueDate.split('T')[0] <= today && (q.status === 'available' || q.status === 'in_progress');
  });
  return dueToday.length === 0; // all due quests already completed (none remaining)
}

function AppContent() {
  const { state: charState, dispatch: charDispatch } = useCharacterContext();
  const { state: questState, dispatch: questDispatch } = useQuestContext();
  const { state: rewardState, dispatch: rewardDispatch } = useRewardContext();
  const { state: achState, dispatch: achDispatch } = useAchievementContext();
  const [activeTab, setActiveTab] = useState('quests');
  const [showContract, setShowContract] = useState(false);
  const [editingQuest, setEditingQuest] = useState(null);
  const [selectedQuest, setSelectedQuest] = useState(null);
  const [levelUpInfo, setLevelUpInfo] = useState(null);
  const [chestInfo, setChestInfo] = useState(null);
  const leveledUpRef = useRef(false);

  const handleCreateCharacter = useCallback(({ name, title, className }) => {
    charDispatch({ type: 'CREATE_CHARACTER', payload: { name, title, className } });
  }, [charDispatch]);

  const handleNewQuest = useCallback((quest) => {
    if (editingQuest) {
      questDispatch({ type: 'UPDATE_QUEST', payload: { id: quest.id, ...quest } });
      setEditingQuest(null);
    } else {
      questDispatch({ type: 'ADD_QUEST', payload: quest });
    }
    setShowContract(false);
  }, [questDispatch, editingQuest]);

  const handleEditQuest = useCallback((quest) => {
    setEditingQuest(quest);
    setShowContract(true);
    setSelectedQuest(null);
  }, []);

  const handleStartQuest = useCallback((questId) => {
    // Check prerequisites
    const quest = questState.quests.find((q) => q.id === questId);
    if (quest?.prerequisites?.length > 0) {
      const completedIds = new Set(questState.questHistory.filter((q) => q.status === 'completed').map((q) => q.id));
      const unmet = quest.prerequisites.filter((id) => !completedIds.has(id));
      if (unmet.length > 0) {
        return; // Prerequisites not met
      }
    }
    questDispatch({ type: 'START_QUEST', payload: questId });
    setSelectedQuest(null);
  }, [questState, questDispatch]);

  const handleCompleteQuest = useCallback((questId) => {
    const quest = questState.quests.find((q) => q.id === questId);
    if (!quest) return;

    const difficulty = DIFFICULTIES.find((d) => d.id === quest.difficulty);
    const classData = CHARACTER_CLASSES.find((c) => c.id === charState.className);
    const baseXp = difficulty?.xp || 50;

    // Calculate bonus objectives multiplier
    const completedBonuses = quest.bonusObjectives?.filter((b) => b.completed).length || 0;
    const bonusMultiplier = 1 + completedBonuses * 0.25;

    // Category combo: 3+ same-category = +25%
    const hasCombo = getCategoryCombo(questState.questHistory, quest.category);
    const comboMultiplier = hasCombo ? 1.25 : 1;

    // Difficulty run bonus
    const hasDiffRun = getDifficultyRun(questState.questHistory, quest.difficulty);
    const diffRunBonus = hasDiffRun ? 50 : 0;

    // Calculate total XP
    const xpGained = Math.round(
      (calculateQuestXp(baseXp, {
        streakDays: charState.streakDays,
        isFirstOfDay: charState.questsCompletedToday === 0,
        categoryCount: charState.completedQuestsByCategory[quest.category] || 0,
        classBonuses: classData?.bonuses || {},
        categoryType: quest.category,
        talents: charState.talents,
        isRecurring: quest.recurrence !== 'none',
        isHardPlus: HARD_PLUS.includes(quest.difficulty),
      }) + diffRunBonus) * bonusMultiplier * comboMultiplier
    );

    // Calculate gold
    const baseGold = Math.round(baseXp * 0.5);
    const fortuneBonus = 1 + (charState.stats.fortune - 10) * 0.01 + (charState.talents.fortune || 0) * 0.15;
    const goldGained = Math.round(baseGold * fortuneBonus);

    // Get previous level
    const prevLevel = xpProgressUtil(charState.xp).level;

    // Apply XP and gold
    charDispatch({ type: 'ADD_XP', payload: xpGained });
    charDispatch({ type: 'ADD_GOLD', payload: goldGained });
    charDispatch({ type: 'RECORD_QUEST_COMPLETION', payload: quest.category });
    charDispatch({ type: 'UPDATE_STREAK' });

    // Complete the quest
    questDispatch({ type: 'COMPLETE_QUEST', payload: questId });
    setSelectedQuest(null);

    // Handle recurrence - create next occurrence
    if (quest.recurrence !== 'none') {
      const nextDueDate = quest.dueDate
        ? getNextRecurrence(new Date(quest.dueDate), quest.recurrence)
        : getNextRecurrence(new Date(), quest.recurrence);
      const recurringQuest = {
        ...quest,
        id: uuidv4(),
        status: 'available',
        dueDate: nextDueDate ? nextDueDate.toISOString() : null,
        completedAt: null,
        createdAt: new Date().toISOString(),
        bonusObjectives: quest.bonusObjectives?.map((b) => ({ ...b, id: uuidv4(), completed: false })) || [],
      };
      questDispatch({ type: 'ADD_QUEST', payload: recurringQuest });
    }

    // Check achievements
    const unlockedSet = new Set(achState.unlockedAchievements);
    const newAchievements = checkAchievements(charState, questState, quest, unlockedSet);
    for (const achId of newAchievements) {
      achDispatch({ type: 'UNLOCK_ACHIEVEMENT', payload: achId });
    }

    // Check level up
    const newLevel = xpProgressUtil(charState.xp + xpGained).level;
    leveledUpRef.current = newLevel > prevLevel;
    if (newLevel > prevLevel) {
      const talentPointGained = newLevel % 5 === 0;
      setLevelUpInfo({ level: newLevel, talentPointGained });
    }

    // Perfect day check for guaranteed Rare+ reward
    const perfectDay = isPerfectDay(questState.quests.filter((q) => q.id !== questId));

    // Roll for reward
    const gotReward = perfectDay || rollForReward({
      difficulty: quest.difficulty,
      streakDays: charState.streakDays,
      fortuneStat: charState.stats.fortune,
    });

    const delay = leveledUpRef.current ? 3000 : 500;

    if (gotReward) {
      let tier = rollRewardTier();
      // Perfect day guarantees Rare or better
      if (perfectDay && ['Common', 'Uncommon'].includes(tier)) {
        tier = 'Rare';
      }
      const reward = selectReward(rewardState.rewards, tier);
      setTimeout(() => {
        setChestInfo({ reward, tier });
      }, delay);
    } else {
      setTimeout(() => {
        setChestInfo({ reward: null, tier: null });
      }, delay);
    }
  }, [charState, questState, rewardState, achState, charDispatch, questDispatch, achDispatch]);

  const handleFailQuest = useCallback((questId) => {
    charDispatch({ type: 'TAKE_DAMAGE', payload: 20 });
    questDispatch({ type: 'FAIL_QUEST', payload: questId });
    setSelectedQuest(null);
  }, [charDispatch, questDispatch]);

  const handleAbandonQuest = useCallback((questId) => {
    charDispatch({ type: 'TAKE_DAMAGE', payload: 10 });
    questDispatch({ type: 'ABANDON_QUEST', payload: questId });
    setSelectedQuest(null);
  }, [charDispatch, questDispatch]);

  const handleToggleBonus = useCallback((questId, objectiveId) => {
    questDispatch({ type: 'TOGGLE_BONUS_OBJECTIVE', payload: { questId, objectiveId } });
  }, [questDispatch]);

  const handleClaimChest = useCallback(() => {
    if (chestInfo?.reward) {
      rewardDispatch({ type: 'CLAIM_REWARD', payload: chestInfo.reward });
    }
    setChestInfo(null);
  }, [chestInfo, rewardDispatch]);

  const handleRestoreHpMp = useCallback(() => {
    charDispatch({ type: 'RESTORE_HP_MP' });
  }, [charDispatch]);

  // Show character creation if not created
  if (!charState.created) {
    return (
      <>
        <GlobalStyles />
        <CharacterCreation onComplete={handleCreateCharacter} />
      </>
    );
  }

  // Render left page based on active tab
  const renderLeftPage = () => {
    switch (activeTab) {
      case 'quests':
        return (
          <QuestBoard
            onNewQuest={() => { setEditingQuest(null); setShowContract(true); }}
            onSelectQuest={(quest) => setSelectedQuest(quest)}
          />
        );
      case 'character':
        return <CharacterSheet onRestoreHpMp={handleRestoreHpMp} />;
      case 'talents':
        return <TalentTree />;
      case 'achievements':
        return <TrophyRoom />;
      case 'rewards':
        return <RewardManager />;
      case 'stats':
        return <StatsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <QuestBoard onNewQuest={() => { setEditingQuest(null); setShowContract(true); }} onSelectQuest={(quest) => setSelectedQuest(quest)} />;
    }
  };

  const renderRightPage = () => {
    return <QuestLog />;
  };

  return (
    <>
      <GlobalStyles />
      <BookLayout
        leftPage={renderLeftPage()}
        rightPage={renderRightPage()}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabs={TABS}
        character={charState}
      />

      <AnimatePresence>
        {showContract && (
          <QuestContract
            onSubmit={handleNewQuest}
            onCancel={() => { setShowContract(false); setEditingQuest(null); }}
            editQuest={editingQuest}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedQuest && (
          <QuestDetail
            quest={selectedQuest}
            onClose={() => setSelectedQuest(null)}
            onStart={handleStartQuest}
            onComplete={handleCompleteQuest}
            onFail={handleFailQuest}
            onAbandon={handleAbandonQuest}
            onToggleBonus={handleToggleBonus}
            onEdit={handleEditQuest}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {levelUpInfo && (
          <LevelUpOverlay
            level={levelUpInfo.level}
            talentPointGained={levelUpInfo.talentPointGained}
            onDismiss={() => setLevelUpInfo(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {chestInfo && (
          <TreasureChest
            reward={chestInfo.reward}
            tier={chestInfo.tier}
            onClaim={handleClaimChest}
          />
        )}
      </AnimatePresence>
    </>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CharacterProvider>
        <QuestProvider>
          <RewardProvider>
            <AchievementProvider>
              <AppContent />
            </AchievementProvider>
          </RewardProvider>
        </QuestProvider>
      </CharacterProvider>
    </ThemeProvider>
  );
}

export default App;
