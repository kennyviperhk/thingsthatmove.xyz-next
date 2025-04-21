'use client';

import styled from 'styled-components';

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  font-size: 1.5rem;
`;

export default function Loading() {
  return (
    <LoadingWrapper>
      Loading...
    </LoadingWrapper>
  );
} 