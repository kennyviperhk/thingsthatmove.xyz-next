'use client';

import { useState, useEffect } from 'react';
import styled from 'styled-components';
import Loading from '@/components/Loading';

interface ModelViewerProps {
  data1?: string; // model URL
  data2?: string; // model height
  data3?: string; // distance from ground
}

const ModelSection = styled.section`
  width: 100%;
  max-width: 1200px;
  margin: 4rem auto;
  padding: 0 1rem;
  aspect-ratio: 16/9;
  position: relative;

  @media (min-width: 768px) {
    padding: 0 2rem;
  }
`;

const ModelFrame = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
  position: absolute;
  top: 0;
  left: 0;
`;

const LoadingContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;
  position: absolute;
  top: 0;
  left: 0;
`;

export default function ModelViewer({ data1, data2, data3 }: ModelViewerProps) {
  const [isLoading, setIsLoading] = useState(true);

  if (!data1) return null;

  // Construct the model viewer URL with parameters
  const modelUrl = new URL(data1);
  if (data2) modelUrl.searchParams.append('height', data2);
  if (data3) modelUrl.searchParams.append('ground_distance', data3);

  return (
    <ModelSection>
      {isLoading && (
        <LoadingContainer>
          <Loading />
        </LoadingContainer>
      )}
      <ModelFrame 
        src={modelUrl.toString()} 
        allowFullScreen
        onLoad={() => setIsLoading(false)}
      />
    </ModelSection>
  );
} 