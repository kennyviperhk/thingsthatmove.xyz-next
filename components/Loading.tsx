'use client';

import styled, { keyframes } from 'styled-components';

export default function Loading() {
  return (
    <Container data-testid="loading">
      <SpinnerItem>
        <Svg id="triangle" width="100px" height="100px" viewBox="-3 -4 39 39">
          <Polygon fill="#fff" stroke="#333333" strokeWidth="1" points="16,0 32,32 0,32" />
        </Svg>
      </SpinnerItem>
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  width: 100%;
  height: calc(80vh);
  margin: 0;
  padding: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  background: black;

  @media(orientation: portrait) {
    height: calc(100vw * 1.3);
  }
`;

const SpinnerItem = styled.div``;

const Svg = styled.svg`
  transform-origin: 50% 65%;
`;

const Dash = keyframes`
  to {
    stroke-dashoffset: 136;
  }
`;

const Polygon = styled.polygon`
  stroke-dasharray: 17;
  animation: ${Dash} 2.5s cubic-bezier(0.35, 0.04, 0.63, 0.95) infinite;
  fill: #333333;
  stroke: #ffffff;
`; 