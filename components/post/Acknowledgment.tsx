'use client';

import styled from 'styled-components';

interface AcknowledgmentProps {
  data?: {
    title?: string;
    content?: string;
  };
}

const AcknowledgmentSection = styled.section`
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
  text-align: center;
`;

const Content = styled.div`
  font-size: 1rem;
  line-height: 1.6;
  text-align: center;
  
  p {
    margin: 0 0 1rem;
    
    &:last-child {
      margin-bottom: 0;
    }
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li {
    margin-bottom: 0.5rem;
  }
`;

export default function Acknowledgment({ data }: AcknowledgmentProps) {
  if (!data || (!data.title && !data.content)) return null;

  return (
    <AcknowledgmentSection>
      {data.title && <Title>{data.title}</Title>}
      {data.content && (
        <Content dangerouslySetInnerHTML={{ __html: data.content }} />
      )}
    </AcknowledgmentSection>
  );
} 