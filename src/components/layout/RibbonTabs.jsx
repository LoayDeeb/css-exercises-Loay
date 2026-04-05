import styled from 'styled-components';
import { motion } from 'framer-motion';
import theme from '../../theme';

const RIBBON_COLORS = {
  quests: { bg: '#8b2500', border: '#a83000' },
  character: { bg: '#1a1a3e', border: '#2a2a5e' },
  talents: { bg: '#6b3a6b', border: '#8b4a8b' },
  achievements: { bg: '#d4af37', border: '#e4bf47' },
  rewards: { bg: '#2d6b3a', border: '#3d8b4a' },
  stats: { bg: '#4a3728', border: '#5a4738' },
  settings: { bg: '#555555', border: '#707070' },
};

const RibbonContainer = styled.div`
  position: absolute;
  right: -44px;
  top: 40px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  z-index: 10;

  @media (max-width: 768px) {
    display: none;
  }
`;

const RibbonTab = styled(motion.button)`
  position: relative;
  width: ${({ $active }) => ($active ? '54px' : '44px')};
  height: 36px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3px;
  font-family: ${theme.fonts.display};
  font-size: 7px;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: ${theme.colors.lightText};
  background: ${({ $color }) => $color.bg};
  border-top: 1px solid ${({ $color }) => $color.border};
  border-bottom: 1px solid rgba(0, 0, 0, 0.3);
  border-right: 1px solid ${({ $color }) => $color.border};
  padding: 0 6px 0 4px;
  text-align: center;
  transition: width 0.3s ease, filter 0.3s ease;
  clip-path: polygon(0 0, 100% 0, 100% 40%, 90% 50%, 100% 60%, 100% 100%, 0 100%);

  ${({ $active }) =>
    $active &&
    `
    filter: brightness(1.3);
    box-shadow: 0 0 8px rgba(212, 175, 55, 0.3);
  `}

  &:hover {
    width: 58px;
    filter: brightness(1.2);
  }

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.1) 0%,
      transparent 50%,
      rgba(0, 0, 0, 0.15) 100%
    );
    pointer-events: none;
  }
`;

const ActiveIndicator = styled(motion.div)`
  position: absolute;
  left: 0;
  top: 2px;
  bottom: 2px;
  width: 3px;
  background: ${theme.colors.goldBright};
  border-radius: 0 2px 2px 0;
`;

const MobileNav = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: ${theme.colors.darkBrown};
    border-top: 2px solid ${theme.colors.gold}55;
    z-index: 100;
    overflow-x: auto;
    padding: 0;

    &::-webkit-scrollbar {
      display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

const MobileTab = styled.button`
  flex: 1;
  min-width: 50px;
  padding: 6px 2px;
  border: none;
  background: ${({ $active, $color }) =>
    $active ? $color.bg : 'transparent'};
  color: ${({ $active }) =>
    $active ? theme.colors.goldBright : theme.colors.parchmentDark};
  font-family: ${theme.fonts.display};
  font-size: 8px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  transition: background 0.3s ease, color 0.3s ease;
`;

const TabIcon = styled.span`
  font-size: 14px;
`;

const RibbonTabs = ({ activeTab, onTabChange, tabs = [] }) => {
  return (
    <>
      <RibbonContainer>
        {tabs.map((tab) => {
          const colors = RIBBON_COLORS[tab.id] || RIBBON_COLORS.settings;
          const isActive = activeTab === tab.id;

          return (
            <RibbonTab
              key={tab.id}
              $active={isActive}
              $color={colors}
              onClick={() => onTabChange(tab.id)}
              whileTap={{ scale: 0.95 }}
              title={tab.label}
            >
              {isActive && (
                <ActiveIndicator
                  layoutId="activeRibbon"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span style={{ fontSize: '12px' }}>{tab.icon}</span>
              {tab.label.length > 5 ? tab.label.slice(0, 4) + '.' : tab.label}
            </RibbonTab>
          );
        })}
      </RibbonContainer>

      <MobileNav>
        {tabs.map((tab) => {
          const colors = RIBBON_COLORS[tab.id] || RIBBON_COLORS.settings;
          return (
            <MobileTab
              key={tab.id}
              $active={activeTab === tab.id}
              $color={colors}
              onClick={() => onTabChange(tab.id)}
            >
              <TabIcon>{tab.icon}</TabIcon>
              {tab.label.length > 5 ? tab.label.slice(0, 4) + '.' : tab.label}
            </MobileTab>
          );
        })}
      </MobileNav>
    </>
  );
};

export default RibbonTabs;
