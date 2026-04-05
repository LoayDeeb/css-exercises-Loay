import { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from 'styled-components';
import GlobalStyles from './GlobalStyles';
import theme from './theme';
import { CharacterProvider, useCharacterContext } from './context/CharacterContext';
import { QuestProvider, useQuestContext } from './context/QuestContext';
import { RewardProvider, useRewardContext } from './context/RewardContext';
import { AchievementProvider } from './context/AchievementContext';
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
import { calculateQuestXp, xpProgress as xpProgressUtil } from './utils/xp';
import { rollForReward, rollRewardTier, selectReward } from './utils/rewards';

const TABS = [
  { id: 'quests', label: 'Quests', icon: '📜' },
  { id: 'character', label: 'Character', icon: '⚔️' },
  { id: 'talents', label: 'Talents', icon: '✨' },
  { id: 'achievements', label: 'Trophies', icon: '🏆' },
  { id: 'rewards', label: 'Rewards', icon: '🎁' },
  { id: 'stats', label: 'Stats', icon: '📊' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
];

function AppContent() {
  const { state: charState, dispatch: charDispatch } = useCharacterContext();
  const { state: questState, dispatch: questDispatch } = useQuestContext();
  const { state: rewardState, dispatch: rewardDispatch } = useRewardContext();
  const [activeTab, setActiveTab] = useState('quests');
  const [showContract, setShowContract] = useState(false);
  const [selectedQuest, setSelectedQuest] = useState(null);
  const [levelUpInfo, setLevelUpInfo] = useState(null);
  const [chestInfo, setChestInfo] = useState(null);

  const handleCreateCharacter = useCallback(({ name, title, className }) => {
    charDispatch({ type: 'CREATE_CHARACTER', payload: { name, title, className } });
  }, [charDispatch]);

  const handleNewQuest = useCallback((quest) => {
    questDispatch({ type: 'ADD_QUEST', payload: quest });
    setShowContract(false);
  }, [questDispatch]);

  const handleStartQuest = useCallback((questId) => {
    questDispatch({ type: 'START_QUEST', payload: questId });
    setSelectedQuest(null);
  }, [questDispatch]);

  const handleCompleteQuest = useCallback((questId) => {
    const quest = questState.quests.find((q) => q.id === questId);
    if (!quest) return;

    const difficulty = DIFFICULTIES.find((d) => d.id === quest.difficulty);
    const classData = CHARACTER_CLASSES.find((c) => c.id === charState.className);
    const baseXp = difficulty?.xp || 50;

    // Calculate bonus objectives multiplier
    const completedBonuses = quest.bonusObjectives?.filter((b) => b.completed).length || 0;
    const bonusMultiplier = 1 + completedBonuses * 0.25;

    // Calculate total XP
    const xpGained = Math.round(
      calculateQuestXp(baseXp, {
        streakDays: charState.streakDays,
        isFirstOfDay: charState.questsCompletedToday === 0,
        categoryCount: charState.completedQuestsByCategory[quest.category] || 0,
        classBonuses: classData?.bonuses || {},
        categoryType: quest.category,
        talents: charState.talents,
      }) * bonusMultiplier
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

    // Check level up
    const newLevel = xpProgressUtil(charState.xp + xpGained).level;
    if (newLevel > prevLevel) {
      const talentPointGained = newLevel % 5 === 0;
      setLevelUpInfo({ level: newLevel, talentPointGained });
    }

    // Roll for reward
    const gotReward = rollForReward({
      difficulty: quest.difficulty,
      streakDays: charState.streakDays,
      fortuneStat: charState.stats.fortune,
    });

    if (gotReward) {
      const tier = rollRewardTier();
      const reward = selectReward(rewardState.rewards, tier);
      setTimeout(() => {
        setChestInfo({ reward, tier });
      }, levelUpInfo ? 3000 : 500);
    } else {
      setTimeout(() => {
        setChestInfo({ reward: null, tier: null });
      }, levelUpInfo ? 3000 : 500);
    }
  }, [charState, questState, rewardState, charDispatch, questDispatch, levelUpInfo]);

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
            onNewQuest={() => setShowContract(true)}
            onSelectQuest={(quest) => setSelectedQuest(quest)}
          />
        );
      case 'character':
        return <CharacterSheet />;
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
        return <QuestBoard onNewQuest={() => setShowContract(true)} onSelectQuest={(quest) => setSelectedQuest(quest)} />;
    }
  };

  // Right page is always Quest Log for context
  const renderRightPage = () => {
    switch (activeTab) {
      case 'quests':
        return <QuestLog />;
      default:
        return <QuestLog />;
    }
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
            onCancel={() => setShowContract(false)}
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
