import React from 'react';
import styled, { css } from 'styled-components';
import { motion } from 'framer-motion';
import theme from '../../theme';

const variantStyles = {
  primary: css`
    background:
      linear-gradient(
        180deg,
        rgba(255, 255, 255, 0.08) 0%,
        transparent 40%,
        rgba(0, 0, 0, 0.15) 100%
      ),
      linear-gradient(135deg, ${theme.colors.mediumBrown} 0%, ${theme.colors.darkBrown} 100%);
    color: ${theme.colors.lightText};
    border: 1px solid rgba(212, 175, 55, 0.4);
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);

    &:hover:not(:disabled) {
      box-shadow:
        0 0 12px rgba(212, 175, 55, 0.3),
        0 4px 12px rgba(0, 0, 0, 0.4),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
      filter: brightness(1.15);
    }
  `,
  secondary: css`
    background:
      linear-gradient(
        180deg,
        rgba(255, 255, 255, 0.06) 0%,
        transparent 40%,
        rgba(0, 0, 0, 0.1) 100%
      ),
      linear-gradient(135deg, ${theme.colors.parchmentDark} 0%, #cdb88a 100%);
    color: ${theme.colors.darkBrown};
    border: 1px solid rgba(74, 55, 40, 0.4);
    text-shadow: 0 1px 0 rgba(255, 255, 255, 0.3);

    &:hover:not(:disabled) {
      box-shadow:
        0 0 8px rgba(212, 175, 55, 0.2),
        0 4px 10px rgba(0, 0, 0, 0.25);
      filter: brightness(1.08);
    }
  `,
  danger: css`
    background:
      linear-gradient(
        180deg,
        rgba(255, 255, 255, 0.08) 0%,
        transparent 40%,
        rgba(0, 0, 0, 0.2) 100%
      ),
      linear-gradient(135deg, ${theme.colors.redInk} 0%, #5a1500 100%);
    color: ${theme.colors.lightText};
    border: 1px solid rgba(180, 50, 20, 0.5);
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);

    &:hover:not(:disabled) {
      box-shadow:
        0 0 14px rgba(139, 37, 0, 0.4),
        0 4px 12px rgba(0, 0, 0, 0.4);
      filter: brightness(1.2);
    }
  `,
  gold: css`
    background:
      linear-gradient(
        180deg,
        rgba(255, 255, 255, 0.15) 0%,
        transparent 40%,
        rgba(0, 0, 0, 0.15) 100%
      ),
      linear-gradient(135deg, ${theme.colors.goldBright} 0%, ${theme.colors.gold} 50%, #b8962e 100%);
    color: ${theme.colors.darkBrown};
    border: 1px solid rgba(255, 215, 0, 0.6);
    text-shadow: 0 1px 0 rgba(255, 255, 255, 0.3);

    &:hover:not(:disabled) {
      box-shadow:
        0 0 16px rgba(212, 175, 55, 0.5),
        0 4px 14px rgba(0, 0, 0, 0.3);
      filter: brightness(1.1);
    }
  `,
};

const sizeStyles = {
  sm: css`
    padding: 6px 14px;
    font-size: 11px;
    letter-spacing: 0.5px;
  `,
  md: css`
    padding: 10px 22px;
    font-size: 13px;
    letter-spacing: 0.8px;
  `,
  lg: css`
    padding: 14px 32px;
    font-size: 15px;
    letter-spacing: 1px;
  `,
};

const StyledButton = styled(motion.button)`
  font-family: ${theme.fonts.display};
  font-weight: 600;
  text-transform: uppercase;
  cursor: pointer;
  position: relative;
  border-radius: ${theme.borderRadius.small};
  transition:
    box-shadow ${theme.transitions.normal},
    filter ${theme.transitions.normal};
  outline: none;
  overflow: hidden;
  white-space: nowrap;

  ${({ $variant }) => variantStyles[$variant] || variantStyles.primary}
  ${({ $size }) => sizeStyles[$size] || sizeStyles.md}

  ${({ $fullWidth }) =>
    $fullWidth &&
    css`
      width: 100%;
    `}

  /* Texture overlay */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: repeating-linear-gradient(
      45deg,
      transparent 0px,
      transparent 2px,
      rgba(0, 0, 0, 0.03) 2px,
      rgba(0, 0, 0, 0.03) 4px
    );
    pointer-events: none;
    border-radius: inherit;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    filter: grayscale(40%);
  }

  &:active:not(:disabled) {
    transform: translateY(1px);
    filter: brightness(0.9);
  }
`;

const MedievalButton = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  ...rest
}) => {
  return (
    <StyledButton
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      disabled={disabled}
      onClick={onClick}
      whileTap={!disabled ? { scale: 0.97 } : undefined}
      whileHover={!disabled ? { y: -1 } : undefined}
      {...rest}
    >
      {children}
    </StyledButton>
  );
};

export default MedievalButton;
