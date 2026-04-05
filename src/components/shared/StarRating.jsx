import React from 'react';
import styled from 'styled-components';
import theme from '../../theme';

const RatingContainer = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 2px;
`;

const StarWrapper = styled.span`
  position: relative;
  display: inline-block;
  width: 1em;
  height: 1em;
  font-size: inherit;
`;

const StarSVG = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const STAR_PATH =
  'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z';

const Star = ({ fill }) => {
  const id = React.useId();

  if (fill === 'full') {
    return (
      <StarWrapper>
        <StarSVG viewBox="0 0 24 24">
          <path
            d={STAR_PATH}
            fill={theme.colors.gold}
            stroke={theme.colors.gold}
            strokeWidth="1"
          />
        </StarSVG>
      </StarWrapper>
    );
  }

  if (fill === 'half') {
    return (
      <StarWrapper>
        <StarSVG viewBox="0 0 24 24">
          <defs>
            <linearGradient id={`half-${id}`}>
              <stop offset="50%" stopColor={theme.colors.gold} />
              <stop offset="50%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <path
            d={STAR_PATH}
            fill={`url(#half-${id})`}
            stroke={theme.colors.gold}
            strokeWidth="1"
          />
        </StarSVG>
      </StarWrapper>
    );
  }

  return (
    <StarWrapper>
      <StarSVG viewBox="0 0 24 24">
        <path
          d={STAR_PATH}
          fill="none"
          stroke={theme.colors.gold}
          strokeWidth="1"
          opacity="0.35"
        />
      </StarSVG>
    </StarWrapper>
  );
};

const StarRating = ({ rating = 0, maxRating = 5 }) => {
  const stars = [];

  for (let i = 1; i <= maxRating; i++) {
    if (rating >= i) {
      stars.push(<Star key={i} fill="full" />);
    } else if (rating >= i - 0.5) {
      stars.push(<Star key={i} fill="half" />);
    } else {
      stars.push(<Star key={i} fill="empty" />);
    }
  }

  return <RatingContainer>{stars}</RatingContainer>;
};

export default StarRating;
