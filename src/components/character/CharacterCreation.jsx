import { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { CHARACTER_CLASSES } from '../../constants/classes';
import theme from '../../theme';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(10, 5, 2, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: ${fadeIn} 0.5s ease;
`;

const Contract = styled(motion.div)`
  background: ${theme.colors.parchment};
  background-image:
    radial-gradient(ellipse at 20% 50%, rgba(139, 37, 0, 0.03) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 20%, rgba(74, 55, 40, 0.05) 0%, transparent 50%),
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 29px,
      rgba(74, 55, 40, 0.03) 29px,
      rgba(74, 55, 40, 0.03) 30px
    );
  border: 2px solid ${theme.colors.mediumBrown};
  border-radius: 4px;
  padding: 40px 50px;
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow:
    0 0 40px rgba(0, 0, 0, 0.5),
    inset 0 0 30px rgba(74, 55, 40, 0.1);
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 10px;
    left: 10px;
    right: 10px;
    bottom: 10px;
    border: 1px solid rgba(74, 55, 40, 0.2);
    pointer-events: none;
  }

  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-track {
    background: ${theme.colors.parchmentDark};
  }
  &::-webkit-scrollbar-thumb {
    background: ${theme.colors.mediumBrown};
    border-radius: 4px;
  }
`;

const Title = styled.h1`
  font-family: ${theme.fonts.display};
  font-size: 2rem;
  color: ${theme.colors.darkBrown};
  text-align: center;
  margin-bottom: 8px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
`;

const Subtitle = styled.p`
  font-family: ${theme.fonts.handwritten};
  font-size: 1.2rem;
  color: ${theme.colors.mediumBrown};
  text-align: center;
  margin-bottom: 30px;
  font-style: italic;
`;

const FormGroup = styled.div`
  margin-bottom: 24px;
`;

const Label = styled.label`
  font-family: ${theme.fonts.display};
  font-size: 0.9rem;
  color: ${theme.colors.darkBrown};
  display: block;
  margin-bottom: 8px;
  letter-spacing: 1px;
  text-transform: uppercase;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 14px;
  font-family: ${theme.fonts.handwritten};
  font-size: 1.3rem;
  color: ${theme.colors.darkText};
  background: rgba(255, 255, 255, 0.3);
  border: none;
  border-bottom: 2px solid ${theme.colors.mediumBrown};
  outline: none;
  transition: border-color 0.3s;
  box-sizing: border-box;

  &:focus {
    border-bottom-color: ${theme.colors.gold};
  }

  &::placeholder {
    color: rgba(74, 55, 40, 0.4);
  }
`;

const ClassGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
  margin-top: 8px;
`;

const ClassCard = styled(motion.div)`
  background: ${({ $selected }) =>
    $selected ? `linear-gradient(135deg, ${theme.colors.gold}22, ${theme.colors.goldBright}11)` : 'rgba(255, 255, 255, 0.2)'};
  border: 2px solid ${({ $selected }) =>
    $selected ? theme.colors.gold : 'rgba(74, 55, 40, 0.2)'};
  border-radius: 4px;
  padding: 14px;
  cursor: pointer;
  transition: all 0.3s;
  text-align: center;

  &:hover {
    border-color: ${theme.colors.gold};
    background: linear-gradient(135deg, ${theme.colors.gold}11, ${theme.colors.goldBright}08);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(212, 175, 55, 0.2);
  }
`;

const ClassIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 6px;
`;

const ClassName = styled.div`
  font-family: ${theme.fonts.display};
  font-size: 0.85rem;
  color: ${theme.colors.darkBrown};
  font-weight: 700;
  margin-bottom: 4px;
`;

const ClassDesc = styled.div`
  font-family: ${theme.fonts.body};
  font-size: 0.75rem;
  color: ${theme.colors.mediumBrown};
  line-height: 1.3;
`;

const ClassBonus = styled.div`
  font-family: ${theme.fonts.handwritten};
  font-size: 0.85rem;
  color: ${theme.colors.redInk};
  margin-top: 6px;
  font-weight: 600;
`;

const AcceptButton = styled(motion.button)`
  display: block;
  width: 100%;
  padding: 14px 24px;
  font-family: ${theme.fonts.display};
  font-size: 1.1rem;
  color: ${theme.colors.lightText};
  background: linear-gradient(135deg, ${theme.colors.darkBrown}, ${theme.colors.mediumBrown});
  border: 2px solid ${theme.colors.gold};
  border-radius: 4px;
  cursor: pointer;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-top: 30px;
  transition: all 0.3s;

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, ${theme.colors.mediumBrown}, ${theme.colors.darkBrown});
    box-shadow: 0 0 20px rgba(212, 175, 55, 0.4);
  }

  &:active:not(:disabled) {
    transform: translateY(2px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Flourish = styled.div`
  text-align: center;
  font-size: 1.5rem;
  color: ${theme.colors.mediumBrown};
  margin: 10px 0;
  opacity: 0.5;
`;

function getBonusText(cls) {
  if (cls.id === 'adventurer') return '+5% XP to all categories';
  const cat = Object.entries(cls.bonuses).find(([, v]) => v > 0.05);
  if (cat) {
    const names = { health: 'Health', intelligence: 'Intelligence', money: 'Money', relationships: 'Relationships' };
    return `+${Math.round(cat[1] * 100)}% ${names[cat[0]]} XP`;
  }
  return '';
}

export default function CharacterCreation({ onComplete }) {
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [selectedClass, setSelectedClass] = useState(null);

  const isValid = name.trim().length > 0 && selectedClass;

  const handleSubmit = () => {
    if (!isValid) return;
    onComplete({
      name: name.trim(),
      title: title.trim() || 'The Unnamed',
      className: selectedClass,
    });
  };

  return (
    <Overlay
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Contract
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
      >
        <Title>Quest Contract</Title>
        <Subtitle>"By signing this contract, you bind yourself to the path of adventure..."</Subtitle>
        <Flourish>~ ⚜ ~</Flourish>

        <FormGroup>
          <Label>Your Name</Label>
          <Input
            type="text"
            placeholder="Enter your name, brave one..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={30}
            autoFocus
          />
        </FormGroup>

        <FormGroup>
          <Label>Your Title</Label>
          <Input
            type="text"
            placeholder="The Brave, The Wise, The Bold..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={40}
          />
        </FormGroup>

        <FormGroup>
          <Label>Choose Your Class</Label>
          <ClassGrid>
            {CHARACTER_CLASSES.map((cls) => (
              <ClassCard
                key={cls.id}
                $selected={selectedClass === cls.id}
                onClick={() => setSelectedClass(cls.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <ClassIcon>{cls.icon}</ClassIcon>
                <ClassName>{cls.name}</ClassName>
                <ClassDesc>{cls.description}</ClassDesc>
                <ClassBonus>{getBonusText(cls)}</ClassBonus>
              </ClassCard>
            ))}
          </ClassGrid>
        </FormGroup>

        <Flourish>~ ⚜ ~</Flourish>

        <AcceptButton
          disabled={!isValid}
          onClick={handleSubmit}
          whileHover={isValid ? { scale: 1.02 } : {}}
          whileTap={isValid ? { scale: 0.98 } : {}}
        >
          Sign & Begin Your Journey
        </AcceptButton>
      </Contract>
    </Overlay>
  );
}
