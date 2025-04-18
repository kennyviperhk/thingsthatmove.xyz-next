'use client';

import styled, { keyframes } from 'styled-components';

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const TriangleContainer = styled.div`
  width: 100%;
  height: 100px;
  overflow: hidden;
  
  svg {
    width: 100%;
    height: 100%;
    animation: ${rotate} 20s linear infinite;
    transform-origin: center;
    
    &:hover {
      animation-play-state: paused;
    }
  }
`;

const TriangleLanding = () => {
  return (
    <TriangleContainer>
      <svg 
        id="triangle" 
        width="100%" 
        height="100px" 
        viewBox="-3 -4 39 39"
      >
        <polygon 
          fill="#fff" 
          stroke="#333333" 
          strokeWidth="1" 
          points="16,0 32,32 0,32"
        />
      </svg>
    </TriangleContainer>
  );
};

export default TriangleLanding; 