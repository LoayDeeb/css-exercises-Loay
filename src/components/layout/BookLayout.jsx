import { useState, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import theme from '../../theme';

const candleFlicker = keyframes`
  0%, 100% { opacity: 0.03; }
  25% { opacity: 0.05; }
  50% { opacity: 0.02; }
  75% { opacity: 0.06; }
`;
import BookPage from './BookPage';
import BookSpine from './BookSpine';
import RibbonTabs from './RibbonTabs';
import FloatingParticles from './FloatingParticles';

/* Outermost wrapper - fills viewport */
const AppWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0d0805;
  overflow: hidden;
  position: relative;

  /* Candle flicker ambient effect */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at 30% 20%, rgba(255, 180, 60, 0.08) 0%, transparent 50%),
                radial-gradient(ellipse at 70% 80%, rgba(255, 160, 40, 0.06) 0%, transparent 50%);
    animation: ${candleFlicker} 4s ease-in-out infinite;
    pointer-events: none;
    z-index: 0;
  }
`;

/* Leather cover - the book's outer casing */
const LeatherCover = styled.div`
  position: relative;
  width: 92vw;
  max-width: 1200px;
  height: 88vh;
  max-height: 800px;
  background:
    radial-gradient(ellipse at 20% 30%, rgba(60, 40, 25, 0.8) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 70%, rgba(55, 35, 20, 0.6) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 50%, rgba(45, 27, 14, 1) 0%, rgba(30, 18, 8, 1) 100%);
  border-radius: 8px;
  padding: 12px;
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.8),
    0 8px 24px rgba(0, 0, 0, 0.6),
    inset 0 1px 0 rgba(100, 70, 40, 0.2),
    inset 0 -1px 0 rgba(0, 0, 0, 0.5);

  /* Embossed border */
  &::before {
    content: '';
    position: absolute;
    top: 6px;
    left: 6px;
    right: 6px;
    bottom: 6px;
    border: 2px solid rgba(212, 175, 55, 0.15);
    border-radius: 6px;
    pointer-events: none;
    z-index: 0;
  }

  /* Leather texture overlay */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 8px;
    background-image:
      radial-gradient(circle at 15% 25%, rgba(80, 55, 30, 0.4) 0%, transparent 3%),
      radial-gradient(circle at 85% 15%, rgba(80, 55, 30, 0.3) 0%, transparent 2%),
      radial-gradient(circle at 45% 75%, rgba(80, 55, 30, 0.3) 0%, transparent 4%),
      radial-gradient(circle at 70% 55%, rgba(80, 55, 30, 0.2) 0%, transparent 3%),
      radial-gradient(circle at 30% 45%, rgba(80, 55, 30, 0.25) 0%, transparent 2%),
      radial-gradient(circle at 60% 30%, rgba(60, 40, 20, 0.3) 0%, transparent 3%),
      radial-gradient(circle at 20% 80%, rgba(60, 40, 20, 0.25) 0%, transparent 4%);
    pointer-events: none;
    z-index: 0;
  }

  @media (max-width: 1024px) {
    width: 94vw;
    height: 90vh;
    padding: 8px;
  }

  @media (max-width: 768px) {
    width: 100vw;
    height: 100vh;
    max-width: none;
    max-height: none;
    border-radius: 0;
    padding: 4px;
    padding-bottom: 56px; /* space for mobile nav */
  }
`;

/* Inner book spread - contains both pages + spine */
const BookSpread = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
  z-index: 1;
  background: ${theme.colors.parchment};

  @media (max-width: 1024px) {
    /* Single page mode */
  }
`;

/* Desktop two-page layout */
const DesktopSpread = styled.div`
  display: flex;
  width: 100%;
  height: 100%;

  @media (max-width: 1024px) {
    display: none;
  }
`;

/* Tablet/mobile single-page layout */
const SinglePageView = styled.div`
  display: none;
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;

  @media (max-width: 1024px) {
    display: flex;
  }
`;

const SwipeablePageWrapper = styled(motion.div)`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
`;

/* Page indicator dots for mobile/tablet */
const PageIndicator = styled.div`
  display: none;

  @media (max-width: 1024px) {
    display: flex;
    position: absolute;
    bottom: 8px;
    left: 50%;
    transform: translateX(-50%);
    gap: 8px;
    z-index: 5;
  }

  @media (max-width: 768px) {
    bottom: 4px;
  }
`;

const Dot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ $active }) =>
    $active ? theme.colors.gold : 'rgba(74, 55, 40, 0.3)'};
  transition: background ${theme.transitions.normal};
`;

const pageVariants = {
  enter: (direction) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0.5,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction) => ({
    x: direction > 0 ? '-100%' : '100%',
    opacity: 0.5,
  }),
};

const pageTransition = {
  type: 'tween',
  duration: 0.35,
  ease: 'easeInOut',
};

const BookLayout = ({ leftPage, rightPage, activeTab, onTabChange, tabs, character }) => {
  const [mobilePage, setMobilePage] = useState(0); // 0 = left, 1 = right
  const [swipeDirection, setSwipeDirection] = useState(1);

  const handleSwipe = useCallback(
    (event, info) => {
      const threshold = 50;
      if (info.offset.x < -threshold && mobilePage === 0) {
        setSwipeDirection(1);
        setMobilePage(1);
      } else if (info.offset.x > threshold && mobilePage === 1) {
        setSwipeDirection(-1);
        setMobilePage(0);
      }
    },
    [mobilePage]
  );

  const currentMobileContent = mobilePage === 0 ? leftPage : rightPage;
  const currentSide = mobilePage === 0 ? 'left' : 'right';

  return (
    <AppWrapper>
      <FloatingParticles count={25} />
      <LeatherCover>
        <BookSpread>
          {/* Desktop: both pages visible */}
          <DesktopSpread>
            <BookPage side="left">{leftPage}</BookPage>
            <BookSpine />
            <BookPage side="right">{rightPage}</BookPage>
          </DesktopSpread>

          {/* Tablet/Mobile: single page with swipe */}
          <SinglePageView>
            <AnimatePresence mode="wait" custom={swipeDirection}>
              <SwipeablePageWrapper
                key={mobilePage}
                custom={swipeDirection}
                variants={pageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={pageTransition}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={handleSwipe}
              >
                <BookPage side={currentSide}>{currentMobileContent}</BookPage>
              </SwipeablePageWrapper>
            </AnimatePresence>
            <PageIndicator>
              <Dot $active={mobilePage === 0} />
              <Dot $active={mobilePage === 1} />
            </PageIndicator>
          </SinglePageView>
        </BookSpread>

        <RibbonTabs activeTab={activeTab} onTabChange={onTabChange} tabs={tabs} />
      </LeatherCover>
    </AppWrapper>
  );
};

export default BookLayout;
