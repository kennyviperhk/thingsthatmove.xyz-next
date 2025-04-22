'use client';

import { useEffect, useState } from 'react';
import styled from 'styled-components';
import TriangleLanding from '@/components/TriangleLanding';
import SwipeGallery from '@/components/post/SwipeGallery';
import { default as BioText } from '@/components/BioTextSection/BioTextSection';
import Loading from '@/components/Loading';

const Container = styled.article`
  max-width: 100%;
  margin: 0 auto;
  background: white;
  color: black;
`;

const BioNameDiv = styled.div`
  position: absolute;
  top: 10vh;
  right: 0;
  overflow: hidden;
  @media(orientation: portrait) {
    top: 48vh;
  }
`;

const BioName = styled.h1`
  font-family: var(--font-archiv-grotesk), -apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, sans-serif;
  font-size: 10.5vw;
  line-height: 10.5vw;
  z-index: 3;
  letter-spacing: 0.3vw;
  mix-blend-mode: difference;
  display: block;
  position: relative;
  margin-right: -6vw;
  color: white;
  @media(orientation: portrait) {
    mix-blend-mode: difference;
    display: block;
    font-size: 85px;
    color: white;
    line-height: 85px;
  }
`;

const BioTextSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4rem;
  margin-top: 2rem;
`;

const TextMainDiv = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 2rem;
  
  @media(orientation: portrait) {
    flex-direction: column;
  }
`;

const TextSubDiv = styled.div`
  flex: 1;
  
  .quote {
    font-size: 1.5rem;
    font-weight: 500;
    margin-bottom: 1rem;
  }
  
  .description {
    font-size: 1.125rem;
    line-height: 1.6;
    white-space: pre-line;
  }
`;

interface BioData {
  primary_quote?: string;
  primary_desc?: string;
  secondary_quote?: string;
  secondary_desc?: string;
  gallery?: any[];
}

export default function BioPage() {
  const [bioData, setBioData] = useState<BioData>({});
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    const fetchBioData = async () => {
      try {
        // Start loading animation
        setLoadingProgress(20);
        
        const response = await fetch('https://www.blog.thingsthatmove.xyz/wp-json/wp/v2/pages');
        setLoadingProgress(60);
        
        const pages = await response.json();
        const bioPage = pages.find((page: any) => page.slug === 'bio' || page.slug === 'about');
        
        setLoadingProgress(80);
        
        if (bioPage) {
          setBioData({
            primary_quote: bioPage.primary_quote || '',
            primary_desc: bioPage.primary_desc || '',
            secondary_quote: bioPage.secondary_quote || '',
            secondary_desc: bioPage.secondary_desc || '',
            gallery: bioPage.gallery || []
          });
        }
        
        setLoadingProgress(100);
      } catch (error) {
        console.error('Error fetching bio data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBioData();
  }, []);

  if (isLoading) {
    return <Loading progress={loadingProgress} />;
  }

  return (
    <>
      <TriangleLanding title="" backgroundColor="black" />
      <Container>
        <BioNameDiv>
          <BioName>
            <div>THINGS</div>
            <div>THAT</div>
            <div>MOVE</div>
          </BioName>
        </BioNameDiv>
        
        <BioText data={bioData} />
      </Container>
      
      {bioData.gallery && bioData.gallery.length > 0 && (
        <SwipeGallery data={bioData.gallery} />
      )}
    </>
  );
} 