import { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
import theme from '../../theme';
import { DIFFICULTIES } from '../../constants/difficulties';

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(10, 5, 2, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Contract = styled(motion.div)`
  background: ${theme.colors.parchment};
  background-image:
    radial-gradient(ellipse at 30% 70%, rgba(139, 37, 0, 0.02) 0%, transparent 50%),
    radial-gradient(ellipse at 70% 30%, rgba(74, 55, 40, 0.04) 0%, transparent 50%);
  border: 2px solid ${theme.colors.mediumBrown};
  border-radius: 4px;
  padding: 32px 40px;
  max-width: 550px;
  width: 90%;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow:
    0 0 40px rgba(0, 0, 0, 0.5),
    inset 0 0 20px rgba(74, 55, 40, 0.08);

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${theme.colors.mediumBrown};
    border-radius: 3px;
  }
`;

const Title = styled.h2`
  font-family: ${theme.fonts.display};
  font-size: 1.5rem;
  color: ${theme.colors.darkBrown};
  text-align: center;
  margin-bottom: 4px;
`;

const Subtitle = styled.p`
  font-family: ${theme.fonts.handwritten};
  font-size: 1rem;
  color: ${theme.colors.mediumBrown};
  text-align: center;
  margin-bottom: 24px;
  font-style: italic;
`;

const FormGroup = styled.div`
  margin-bottom: 18px;
`;

const Label = styled.label`
  font-family: ${theme.fonts.display};
  font-size: 0.7rem;
  color: ${theme.colors.darkBrown};
  display: block;
  margin-bottom: 6px;
  letter-spacing: 1px;
  text-transform: uppercase;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px 12px;
  font-family: ${theme.fonts.handwritten};
  font-size: 1.1rem;
  color: ${theme.colors.darkText};
  background: rgba(255, 255, 255, 0.3);
  border: none;
  border-bottom: 2px solid rgba(74, 55, 40, 0.3);
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.3s;

  &:focus {
    border-bottom-color: ${theme.colors.gold};
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 8px 12px;
  font-family: ${theme.fonts.handwritten};
  font-size: 1.1rem;
  color: ${theme.colors.darkText};
  background: rgba(255, 255, 255, 0.3);
  border: none;
  border-bottom: 2px solid rgba(74, 55, 40, 0.3);
  outline: none;
  resize: vertical;
  min-height: 60px;
  box-sizing: border-box;
  transition: border-color 0.3s;

  &:focus {
    border-bottom-color: ${theme.colors.gold};
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 8px 12px;
  font-family: ${theme.fonts.body};
  font-size: 1rem;
  color: ${theme.colors.darkText};
  background: rgba(255, 255, 255, 0.3);
  border: 1px solid rgba(74, 55, 40, 0.3);
  border-radius: 3px;
  outline: none;
  box-sizing: border-box;
  cursor: pointer;

  &:focus {
    border-color: ${theme.colors.gold};
  }
`;

const DifficultyGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
`;

const DifficultyOption = styled.div`
  padding: 8px;
  text-align: center;
  border: 2px solid ${({ $selected }) => $selected ? theme.colors.gold : 'rgba(74, 55, 40, 0.15)'};
  background: ${({ $selected }) => $selected ? `${theme.colors.gold}11` : 'transparent'};
  border-radius: 3px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: ${theme.colors.gold};
  }
`;

const DiffName = styled.div`
  font-family: ${theme.fonts.display};
  font-size: 0.65rem;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: ${theme.colors.darkBrown};
`;

const DiffXp = styled.div`
  font-family: ${theme.fonts.handwritten};
  font-size: 0.85rem;
  color: ${theme.colors.gold};
`;

const DiffStars = styled.div`
  font-size: 0.6rem;
  color: ${theme.colors.gold};
`;

const BonusList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const BonusRow = styled.div`
  display: flex;
  gap: 8px;
`;

const BonusInput = styled(Input)`
  flex: 1;
  font-size: 0.95rem;
  padding: 6px 10px;
`;

const RemoveBtn = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.redInk};
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0 4px;
  opacity: 0.5;

  &:hover {
    opacity: 1;
  }
`;

const AddBonusBtn = styled.button`
  background: none;
  border: 1px dashed rgba(74, 55, 40, 0.3);
  color: ${theme.colors.mediumBrown};
  font-family: ${theme.fonts.handwritten};
  font-size: 0.9rem;
  padding: 6px;
  cursor: pointer;
  border-radius: 3px;
  margin-top: 4px;

  &:hover {
    border-color: ${theme.colors.gold};
    color: ${theme.colors.gold};
  }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 28px;
`;

const SubmitButton = styled(motion.button)`
  flex: 1;
  padding: 12px;
  font-family: ${theme.fonts.display};
  font-size: 0.9rem;
  color: ${theme.colors.lightText};
  background: linear-gradient(135deg, ${theme.colors.darkBrown}, ${theme.colors.mediumBrown});
  border: 2px solid ${theme.colors.gold};
  border-radius: 4px;
  cursor: pointer;
  letter-spacing: 2px;
  text-transform: uppercase;

  &:hover:not(:disabled) {
    box-shadow: 0 0 15px rgba(212, 175, 55, 0.3);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CancelButton = styled(motion.button)`
  padding: 12px 24px;
  font-family: ${theme.fonts.display};
  font-size: 0.9rem;
  color: ${theme.colors.mediumBrown};
  background: transparent;
  border: 1px solid rgba(74, 55, 40, 0.3);
  border-radius: 4px;
  cursor: pointer;
  letter-spacing: 1px;

  &:hover {
    background: rgba(74, 55, 40, 0.05);
  }
`;

const CATEGORIES = [
  { id: 'health', name: 'Health', icon: '❤️' },
  { id: 'intelligence', name: 'Intelligence', icon: '📖' },
  { id: 'money', name: 'Money', icon: '💰' },
  { id: 'relationships', name: 'Relationships', icon: '💍' },
];

export default function QuestContract({ onSubmit, onCancel, editQuest }) {
  const [title, setTitle] = useState(editQuest?.title || '');
  const [description, setDescription] = useState(editQuest?.description || '');
  const [category, setCategory] = useState(editQuest?.category || 'health');
  const [difficulty, setDifficulty] = useState(editQuest?.difficulty || 'medium');
  const [dueDate, setDueDate] = useState(editQuest?.dueDate ? editQuest.dueDate.split('T')[0] : '');
  const [recurrence, setRecurrence] = useState(editQuest?.recurrence || 'none');
  const [bonusObjectives, setBonusObjectives] = useState(
    editQuest?.bonusObjectives?.map((b) => b.text) || []
  );

  const isValid = title.trim().length > 0;

  const handleAddBonus = () => {
    setBonusObjectives([...bonusObjectives, '']);
  };

  const handleBonusChange = (index, value) => {
    const updated = [...bonusObjectives];
    updated[index] = value;
    setBonusObjectives(updated);
  };

  const handleRemoveBonus = (index) => {
    setBonusObjectives(bonusObjectives.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!isValid) return;
    const quest = {
      id: editQuest?.id || uuidv4(),
      title: title.trim(),
      description: description.trim(),
      category,
      difficulty,
      status: editQuest?.status || 'available',
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      recurrence,
      prerequisites: editQuest?.prerequisites || [],
      bonusObjectives: bonusObjectives
        .filter((b) => b.trim())
        .map((text, i) => ({
          id: editQuest?.bonusObjectives?.[i]?.id || uuidv4(),
          text: text.trim(),
          completed: editQuest?.bonusObjectives?.[i]?.completed || false,
        })),
      createdAt: editQuest?.createdAt || new Date().toISOString(),
      completedAt: editQuest?.completedAt || null,
      chainId: editQuest?.chainId || null,
    };
    onSubmit(quest);
  };

  const renderStars = (count) => {
    const full = Math.floor(count);
    const half = count % 1 !== 0;
    let s = '★'.repeat(full);
    if (half) s += '½';
    return s;
  };

  return (
    <AnimatePresence>
      <Overlay
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={(e) => e.target === e.currentTarget && onCancel()}
      >
        <Contract
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          <Title>{editQuest ? 'Amend Quest' : 'New Quest Contract'}</Title>
          <Subtitle>Detail the nature of your undertaking</Subtitle>

          <FormGroup>
            <Label>Quest Title</Label>
            <Input
              placeholder="Slay the Dragon, Read a Tome..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={80}
              autoFocus
            />
          </FormGroup>

          <FormGroup>
            <Label>Description (optional)</Label>
            <TextArea
              placeholder="The details of this noble quest..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={500}
            />
          </FormGroup>

          <FormGroup>
            <Label>Category</Label>
            <Select value={category} onChange={(e) => setCategory(e.target.value)}>
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.icon} {c.name}
                </option>
              ))}
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>Difficulty</Label>
            <DifficultyGrid>
              {DIFFICULTIES.map((d) => (
                <DifficultyOption
                  key={d.id}
                  $selected={difficulty === d.id}
                  onClick={() => setDifficulty(d.id)}
                >
                  <DiffStars>{renderStars(d.stars)}</DiffStars>
                  <DiffName>{d.name}</DiffName>
                  <DiffXp>{d.xp} XP</DiffXp>
                </DifficultyOption>
              ))}
            </DifficultyGrid>
          </FormGroup>

          <FormGroup>
            <Label>Due Date (optional)</Label>
            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              style={{ fontFamily: theme.fonts.body }}
            />
          </FormGroup>

          <FormGroup>
            <Label>Recurrence</Label>
            <Select value={recurrence} onChange={(e) => setRecurrence(e.target.value)}>
              <option value="none">One-time quest</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>Bonus Objectives</Label>
            <BonusList>
              {bonusObjectives.map((bonus, i) => (
                <BonusRow key={i}>
                  <BonusInput
                    placeholder="Additional challenge..."
                    value={bonus}
                    onChange={(e) => handleBonusChange(i, e.target.value)}
                  />
                  <RemoveBtn onClick={() => handleRemoveBonus(i)}>×</RemoveBtn>
                </BonusRow>
              ))}
              <AddBonusBtn onClick={handleAddBonus}>
                + Add Bonus Objective (+25% XP each)
              </AddBonusBtn>
            </BonusList>
          </FormGroup>

          <ButtonRow>
            <CancelButton onClick={onCancel} whileTap={{ scale: 0.95 }}>
              Cancel
            </CancelButton>
            <SubmitButton
              disabled={!isValid}
              onClick={handleSubmit}
              whileHover={isValid ? { scale: 1.02 } : {}}
              whileTap={isValid ? { scale: 0.98 } : {}}
            >
              {editQuest ? 'Update Quest' : 'Sign & Accept'}
            </SubmitButton>
          </ButtonRow>
        </Contract>
      </Overlay>
    </AnimatePresence>
  );
}
