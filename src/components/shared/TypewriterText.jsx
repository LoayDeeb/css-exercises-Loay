import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';

const TypewriterContainer = styled.span`
  /* Blinking cursor */
  &::after {
    content: '|';
    animation: blink 0.8s step-end infinite;
    opacity: ${({ $done }) => ($done ? 0 : 1)};
    margin-left: 1px;
    font-weight: 300;
  }

  @keyframes blink {
    50% {
      opacity: 0;
    }
  }
`;

const TypewriterText = ({
  text = '',
  speed = 50,
  onComplete,
  className,
  tag = 'span',
}) => {
  const [displayedCount, setDisplayedCount] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Reset when text changes
  useEffect(() => {
    setDisplayedCount(0);
    setIsDone(false);
  }, [text]);

  useEffect(() => {
    if (displayedCount >= text.length) {
      if (text.length > 0 && !isDone) {
        setIsDone(true);
        onCompleteRef.current?.();
      }
      return;
    }

    const timer = setTimeout(() => {
      setDisplayedCount((prev) => prev + 1);
    }, speed);

    return () => clearTimeout(timer);
  }, [displayedCount, text, speed, isDone]);

  const Component = TypewriterContainer.withComponent(tag);

  return (
    <Component className={className} $done={isDone}>
      {text.slice(0, displayedCount)}
    </Component>
  );
};

export default TypewriterText;
