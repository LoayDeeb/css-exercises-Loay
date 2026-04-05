import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  *, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.1rem;
    line-height: 1.6;
    color: ${({ theme }) => theme.colors.parchment};
    background: ${({ theme }) => theme.colors.darkBrown};
    overflow: hidden;
    min-height: 100vh;
    position: relative;
  }

  body::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 0;
    background-image:
      radial-gradient(1px 1px at 10% 20%, rgba(212, 175, 55, 0.15) 0%, transparent 100%),
      radial-gradient(1px 1px at 30% 60%, rgba(212, 175, 55, 0.1) 0%, transparent 100%),
      radial-gradient(1px 1px at 50% 10%, rgba(244, 228, 188, 0.08) 0%, transparent 100%),
      radial-gradient(1px 1px at 70% 80%, rgba(212, 175, 55, 0.12) 0%, transparent 100%),
      radial-gradient(1px 1px at 90% 40%, rgba(244, 228, 188, 0.06) 0%, transparent 100%),
      radial-gradient(1.5px 1.5px at 15% 85%, rgba(212, 175, 55, 0.1) 0%, transparent 100%),
      radial-gradient(1.5px 1.5px at 45% 35%, rgba(244, 228, 188, 0.07) 0%, transparent 100%),
      radial-gradient(1.5px 1.5px at 75% 55%, rgba(212, 175, 55, 0.09) 0%, transparent 100%),
      radial-gradient(1px 1px at 85% 15%, rgba(244, 228, 188, 0.11) 0%, transparent 100%),
      radial-gradient(1px 1px at 25% 45%, rgba(212, 175, 55, 0.08) 0%, transparent 100%);
    animation: floatingParticles 30s linear infinite;
  }

  @keyframes floatingParticles {
    0% {
      transform: translateY(0) translateX(0);
      opacity: 0.6;
    }
    25% {
      transform: translateY(-15px) translateX(8px);
      opacity: 0.8;
    }
    50% {
      transform: translateY(-5px) translateX(-5px);
      opacity: 0.5;
    }
    75% {
      transform: translateY(-20px) translateX(12px);
      opacity: 0.7;
    }
    100% {
      transform: translateY(0) translateX(0);
      opacity: 0.6;
    }
  }

  #root {
    position: relative;
    z-index: 1;
    min-height: 100vh;
  }

  /* Hide scrollbar but allow scrolling */
  ::-webkit-scrollbar {
    width: 0;
    height: 0;
    background: transparent;
  }

  * {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: 'Cinzel', serif;
    font-weight: 600;
    line-height: 1.3;
  }

  a {
    color: ${({ theme }) => theme.colors.gold};
    text-decoration: none;
    transition: color 0.3s ease;

    &:hover {
      color: ${({ theme }) => theme.colors.goldBright};
    }
  }

  button {
    font-family: 'Cinzel', serif;
    cursor: pointer;
    border: none;
    outline: none;
    background: none;
  }

  input, textarea, select {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1rem;
    outline: none;
  }

  ::selection {
    background: rgba(212, 175, 55, 0.3);
    color: ${({ theme }) => theme.colors.parchment};
  }
`;

export default GlobalStyles;
