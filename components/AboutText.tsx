'use client';

import styled from 'styled-components';
import { motion } from 'framer-motion';

const TextSection = styled.section`
  width: 100%;
  padding: 8rem 2rem;
  background: white;
  color: black;
  
  @media (min-width: 768px) {
    padding: 8rem 4rem;
  }
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  gap: 4rem;
  
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const TextColumn = styled.div`
  h2 {
    font-size: 2.5rem;
    margin-bottom: 2rem;
    font-weight: 600;
  }
  
  p {
    font-size: 1.125rem;
    line-height: 1.6;
    margin-bottom: 1.5rem;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

interface AboutTextProps {
  title: string;
  content: string[];
}

export default function AboutText({ title, content }: AboutTextProps) {
  return (
    <TextSection>
      <ContentWrapper>
        <TextColumn>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {title}
          </motion.h2>
        </TextColumn>
        <TextColumn>
          {content.map((paragraph, index) => (
            <motion.p
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              {paragraph}
            </motion.p>
          ))}
        </TextColumn>
      </ContentWrapper>
    </TextSection>
  );
} 