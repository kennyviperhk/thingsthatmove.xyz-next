'use client';

import styled from 'styled-components';

const BioContainer = styled.article`
  max-width: 800px;
  margin: 0 auto;
  padding: 8rem 2rem;
  min-height: 100vh;
  background: white;
  color: black;
  
  h1 {
    font-size: clamp(2rem, 4vw, 3rem);
    margin-bottom: 2rem;
    font-weight: 500;
  }
  
  .content {
    font-size: 1.125rem;
    line-height: 1.6;
    
    p {
      margin-bottom: 1.5rem;
      
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
`;

interface StyledBioContentProps {
  title: string;
  content: string;
}

export default function StyledBioContent({ title, content }: StyledBioContentProps) {
  return (
    <BioContainer>
      <h1 dangerouslySetInnerHTML={{ __html: title }} />
      <div 
        className="content"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </BioContainer>
  );
} 