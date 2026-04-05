import React from 'react';
import styled from 'styled-components';
import theme from '../../theme';

const PageContainer = styled.div`
  flex: 1;
  position: relative;
  background-color: ${theme.colors.parchment};
  background-image:
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 29px,
      rgba(139, 115, 85, 0.04) 29px,
      rgba(139, 115, 85, 0.04) 30px
    ),
    linear-gradient(
      135deg,
      rgba(0, 0, 0, 0.02) 25%,
      transparent 25%,
      transparent 50%,
      rgba(0, 0, 0, 0.02) 50%,
      rgba(0, 0, 0, 0.02) 75%,
      transparent 75%
    ),
    radial-gradient(
      ellipse at 20% 50%,
      rgba(139, 115, 85, 0.06) 0%,
      transparent 70%
    ),
    radial-gradient(
      ellipse at 80% 20%,
      rgba(139, 115, 85, 0.04) 0%,
      transparent 60%
    );
  background-size: 100% 30px, 8px 8px, 100% 100%, 100% 100%;
  padding: ${theme.spacing.lg};
  overflow-y: auto;
  overflow-x: hidden;
  min-height: 0;

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(74, 55, 40, 0.1);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(74, 55, 40, 0.4);
    border-radius: 3px;

    &:hover {
      background: rgba(74, 55, 40, 0.6);
    }
  }

  scrollbar-width: thin;
  scrollbar-color: rgba(74, 55, 40, 0.4) rgba(74, 55, 40, 0.1);

  /* Aged edges */
  box-shadow:
    ${({ $side }) =>
      $side === 'left'
        ? `inset -8px 0 16px -8px rgba(0, 0, 0, 0.15),
           inset 6px 0 20px -6px rgba(0, 0, 0, 0.08),
           inset 0 6px 12px -6px rgba(139, 100, 50, 0.15),
           inset 0 -6px 12px -6px rgba(139, 100, 50, 0.15)`
        : `inset 8px 0 16px -8px rgba(0, 0, 0, 0.15),
           inset -6px 0 20px -6px rgba(0, 0, 0, 0.08),
           inset 0 6px 12px -6px rgba(139, 100, 50, 0.15),
           inset 0 -6px 12px -6px rgba(139, 100, 50, 0.15)`};

  /* Burnt outer edges */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    width: 30px;
    pointer-events: none;
    z-index: 1;
    ${({ $side }) =>
      $side === 'left'
        ? `left: 0;
           background: linear-gradient(90deg, rgba(139, 100, 50, 0.12) 0%, transparent 100%);`
        : `right: 0;
           background: linear-gradient(270deg, rgba(139, 100, 50, 0.12) 0%, transparent 100%);`}
  }

  /* Top and bottom aged edges */
  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    height: 20px;
    pointer-events: none;
    z-index: 1;
    top: 0;
    background: linear-gradient(180deg, rgba(139, 100, 50, 0.08) 0%, transparent 100%);
  }

  /* Corner decorations */
  ${({ $side }) =>
    $side === 'left'
      ? `
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;
  `
      : `
    border-top-right-radius: 3px;
    border-bottom-right-radius: 3px;
  `}

  @media (max-width: 768px) {
    padding: ${theme.spacing.md};
  }
`;

const CornerDecoration = styled.div`
  position: absolute;
  width: 32px;
  height: 32px;
  pointer-events: none;
  z-index: 2;
  opacity: 0.35;

  &::before,
  &::after {
    content: '';
    position: absolute;
    background: ${theme.colors.gold};
  }

  ${({ $position }) => {
    switch ($position) {
      case 'top-left':
        return `
          top: 8px; left: 8px;
          &::before { top: 0; left: 0; width: 20px; height: 2px; border-radius: 1px; }
          &::after { top: 0; left: 0; width: 2px; height: 20px; border-radius: 1px; }
        `;
      case 'top-right':
        return `
          top: 8px; right: 8px;
          &::before { top: 0; right: 0; width: 20px; height: 2px; border-radius: 1px; }
          &::after { top: 0; right: 0; width: 2px; height: 20px; border-radius: 1px; }
        `;
      case 'bottom-left':
        return `
          bottom: 8px; left: 8px;
          &::before { bottom: 0; left: 0; width: 20px; height: 2px; border-radius: 1px; }
          &::after { bottom: 0; left: 0; width: 2px; height: 20px; border-radius: 1px; }
        `;
      case 'bottom-right':
        return `
          bottom: 8px; right: 8px;
          &::before { bottom: 0; right: 0; width: 20px; height: 2px; border-radius: 1px; }
          &::after { bottom: 0; right: 0; width: 2px; height: 20px; border-radius: 1px; }
        `;
      default:
        return '';
    }
  }}
`;

const BookPage = ({ children, side = 'left', className }) => {
  return (
    <PageContainer $side={side} className={className}>
      <CornerDecoration $position={`top-${side}`} />
      <CornerDecoration $position={`bottom-${side}`} />
      {side === 'left' && (
        <>
          <CornerDecoration $position="top-left" />
          <CornerDecoration $position="bottom-left" />
        </>
      )}
      {side === 'right' && (
        <>
          <CornerDecoration $position="top-right" />
          <CornerDecoration $position="bottom-right" />
        </>
      )}
      {children}
    </PageContainer>
  );
};

export default BookPage;
