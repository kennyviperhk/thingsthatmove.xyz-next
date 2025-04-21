'use client';

import styled from 'styled-components';

interface TechInfoProps {
  data?: {
    title?: string;
    content?: string;
  };
}

const TechInfoSection = styled.section`
  width: 100%;
  max-width: 1200px;
  margin: 4rem auto;
  padding: 2rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);

  @media (min-width: 768px) {
    padding: 3rem 2rem;
  }
`;

const Title = styled.h3`
  font-size: 1.5rem;
  margin: 0 0 1.5rem;
  font-weight: 500;
`;

const Content = styled.div`
  font-size: 1rem;
  line-height: 1.6;
  
  p {
    margin: 0 0 1rem;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

export default function TechInfo({ data }: TechInfoProps) {
  if (!data || (!data.title && !data.content)) return null;

  return (
    <TechInfoSection>
      {data.title && <Title>{data.title}</Title>}
      {data.content && (
        <Content dangerouslySetInnerHTML={{ __html: data.content }} />
      )}
    </TechInfoSection>
  );
} 