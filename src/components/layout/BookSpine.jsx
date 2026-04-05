import React from 'react';
import styled from 'styled-components';
import theme from '../../theme';

const SpineContainer = styled.div`
  width: 28px;
  min-height: 100%;
  position: relative;
  background: linear-gradient(
    90deg,
    rgba(0, 0, 0, 0.35) 0%,
    rgba(45, 27, 14, 0.6) 15%,
    rgba(74, 55, 40, 0.4) 30%,
    rgba(74, 55, 40, 0.15) 50%,
    rgba(74, 55, 40, 0.4) 70%,
    rgba(45, 27, 14, 0.6) 85%,
    rgba(0, 0, 0, 0.35) 100%
  );
  flex-shrink: 0;
  z-index: 2;

  &::before {
    content: '';
    position: absolute;
    top: 12px;
    bottom: 12px;
    left: 50%;
    transform: translateX(-50%);
    width: 2px;
    background: repeating-linear-gradient(
      180deg,
      transparent 0px,
      transparent 4px,
      ${theme.colors.parchmentDark} 4px,
      ${theme.colors.parchmentDark} 8px,
      transparent 8px,
      transparent 14px
    );
    opacity: 0.5;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0.3) 0%,
      transparent 3%,
      transparent 97%,
      rgba(0, 0, 0, 0.3) 100%
    );
    pointer-events: none;
  }
`;

const StitchLine = styled.div`
  position: absolute;
  top: 8px;
  bottom: 8px;
  width: 1px;
  border-left: 1px dashed rgba(212, 175, 55, 0.25);

  &:first-child {
    left: 8px;
  }

  &:last-child {
    right: 8px;
    left: auto;
  }
`;

const BookSpine = () => {
  return (
    <SpineContainer>
      <StitchLine />
      <StitchLine />
    </SpineContainer>
  );
};

export default BookSpine;
