import React from 'react';
import styled, { css } from 'styled-components';
import { motion } from 'framer-motion';
import theme from '../../theme';

const CardContainer = styled(motion.div)`
  position: relative;
  background-color: ${theme.colors.parchment};
  background-image:
    linear-gradient(
      135deg,
      rgba(0, 0, 0, 0.015) 25%,
      transparent 25%,
      transparent 50%,
      rgba(0, 0, 0, 0.015) 50%,
      rgba(0, 0, 0, 0.015) 75%,
      transparent 75%
    ),
    radial-gradient(
      ellipse at 30% 40%,
      rgba(139, 115, 85, 0.05) 0%,
      transparent 60%
    ),
    radial-gradient(
      ellipse at 70% 80%,
      rgba(139, 115, 85, 0.04) 0%,
      transparent 50%
    );
  background-size: 6px 6px, 100% 100%, 100% 100%;
  border: 1px solid rgba(74, 55, 40, 0.3);
  border-radius: ${theme.borderRadius.small};
  padding: ${theme.spacing.md};
  box-shadow:
    0 2px 6px rgba(0, 0, 0, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  transition:
    transform ${theme.transitions.normal},
    box-shadow ${theme.transitions.normal},
    border-color ${theme.transitions.normal};

  /* Aged edge overlay */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: inherit;
    box-shadow:
      inset 0 0 12px rgba(139, 100, 50, 0.08),
      inset 0 0 4px rgba(0, 0, 0, 0.05);
    pointer-events: none;
  }

  ${({ $hoverable }) =>
    $hoverable &&
    css`
      cursor: pointer;

      &:hover {
        transform: translateY(-2px);
        box-shadow:
          0 6px 16px rgba(0, 0, 0, 0.18),
          0 2px 6px rgba(0, 0, 0, 0.1),
          inset 0 1px 0 rgba(255, 255, 255, 0.3);
      }

      &:active {
        transform: translateY(0);
        box-shadow:
          0 1px 4px rgba(0, 0, 0, 0.15),
          inset 0 1px 0 rgba(255, 255, 255, 0.3);
      }
    `}

  ${({ $highlighted }) =>
    $highlighted &&
    css`
      border-color: ${theme.colors.gold};
      box-shadow:
        0 2px 6px rgba(0, 0, 0, 0.12),
        0 0 12px rgba(212, 175, 55, 0.25),
        inset 0 1px 0 rgba(255, 255, 255, 0.3);

      &::after {
        content: '';
        position: absolute;
        top: -1px;
        left: -1px;
        right: -1px;
        bottom: -1px;
        border-radius: inherit;
        border: 1px solid rgba(212, 175, 55, 0.3);
        pointer-events: none;
      }
    `}

  ${({ $onClick }) =>
    $onClick &&
    css`
      cursor: pointer;
    `}
`;

const ParchmentCard = ({
  children,
  onClick,
  hoverable = false,
  highlighted = false,
  className,
  ...rest
}) => {
  return (
    <CardContainer
      $hoverable={hoverable}
      $highlighted={highlighted}
      $onClick={!!onClick}
      onClick={onClick}
      className={className}
      {...rest}
    >
      {children}
    </CardContainer>
  );
};

export default ParchmentCard;
