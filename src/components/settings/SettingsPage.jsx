import { useRef, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useCharacterContext } from '../../context/CharacterContext';
import { useQuestContext } from '../../context/QuestContext';
import { useRewardContext } from '../../context/RewardContext';
import { useAchievementContext } from '../../context/AchievementContext';
import { exportAllData, importAllData, clearAllData } from '../../utils/storage';
import theme from '../../theme';

const Page = styled.div`
  padding: 5px;
`;

const PageTitle = styled.h2`
  font-family: ${theme.fonts.display};
  font-size: 1.3rem;
  color: ${theme.colors.darkBrown};
  margin: 0 0 20px;
`;

const Section = styled.div`
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(74, 55, 40, 0.1);

  &:last-child {
    border-bottom: none;
  }
`;

const SectionTitle = styled.h3`
  font-family: ${theme.fonts.display};
  font-size: 0.85rem;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: ${theme.colors.darkBrown};
  margin: 0 0 8px;
`;

const Desc = styled.p`
  font-family: ${theme.fonts.handwritten};
  font-size: 0.95rem;
  color: ${theme.colors.mediumBrown};
  margin: 0 0 12px;
  font-style: italic;
`;

const Button = styled(motion.button)`
  padding: 8px 20px;
  font-family: ${theme.fonts.display};
  font-size: 0.7rem;
  letter-spacing: 1px;
  text-transform: uppercase;
  border-radius: 3px;
  cursor: pointer;
  margin-right: 8px;
  margin-bottom: 8px;
  transition: all 0.2s;

  ${({ $variant }) => {
    switch ($variant) {
      case 'primary':
        return `
          background: ${theme.colors.mediumBrown};
          color: ${theme.colors.lightText};
          border: 1px solid ${theme.colors.mediumBrown};
          &:hover { background: ${theme.colors.darkBrown}; }
        `;
      case 'danger':
        return `
          background: transparent;
          color: #8b0000;
          border: 1px solid #8b0000;
          &:hover { background: rgba(139, 0, 0, 0.05); }
        `;
      default:
        return `
          background: transparent;
          color: ${theme.colors.mediumBrown};
          border: 1px solid rgba(74, 55, 40, 0.3);
          &:hover { background: rgba(74, 55, 40, 0.05); }
        `;
    }
  }}
`;

const Message = styled.div`
  font-family: ${theme.fonts.handwritten};
  font-size: 0.9rem;
  color: ${({ $type }) => $type === 'error' ? '#8b0000' : '#2d6a2d'};
  margin-top: 8px;
`;

const HiddenInput = styled.input`
  display: none;
`;

export default function SettingsPage() {
  const { dispatch: charDispatch } = useCharacterContext();
  const { dispatch: questDispatch } = useQuestContext();
  const { dispatch: rewardDispatch } = useRewardContext();
  const { dispatch: achDispatch } = useAchievementContext();
  const fileInputRef = useRef(null);
  const [message, setMessage] = useState(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const handleExport = () => {
    try {
      const data = exportAllData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `quest-journal-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setMessage({ type: 'success', text: 'Data exported successfully!' });
    } catch (e) {
      setMessage({ type: 'error', text: 'Failed to export data.' });
    }
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        importAllData(event.target.result);
        // Reload to pick up new state
        window.location.reload();
      } catch (err) {
        setMessage({ type: 'error', text: 'Invalid backup file.' });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleReset = () => {
    if (!confirmReset) {
      setConfirmReset(true);
      setMessage({ type: 'error', text: 'Click again to confirm. This cannot be undone!' });
      return;
    }
    clearAllData();
    window.location.reload();
  };

  return (
    <Page>
      <PageTitle>Settings</PageTitle>

      <Section>
        <SectionTitle>Export Data</SectionTitle>
        <Desc>Save your character, quests, and rewards as a JSON backup file.</Desc>
        <Button $variant="primary" onClick={handleExport} whileTap={{ scale: 0.95 }}>
          Export Backup
        </Button>
      </Section>

      <Section>
        <SectionTitle>Import Data</SectionTitle>
        <Desc>Restore from a previously exported backup. This will replace all current data.</Desc>
        <Button $variant="default" onClick={() => fileInputRef.current?.click()} whileTap={{ scale: 0.95 }}>
          Import Backup
        </Button>
        <HiddenInput
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImport}
        />
      </Section>

      <Section>
        <SectionTitle>Reset All Data</SectionTitle>
        <Desc>Permanently delete all character data, quests, rewards, and achievements. Cannot be undone.</Desc>
        <Button $variant="danger" onClick={handleReset} whileTap={{ scale: 0.95 }}>
          {confirmReset ? 'Confirm Reset' : 'Reset Everything'}
        </Button>
      </Section>

      {message && (
        <Message $type={message.type}>{message.text}</Message>
      )}
    </Page>
  );
}
