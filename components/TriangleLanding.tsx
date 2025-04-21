'use client';

import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Animated } from "react-animated-css";

const sectionHeight = 'calc(100vw / 2.2)';
const sectionHeightPortrait = 'calc(100vw * 1.42)';

const LandingSection = styled.section`
  width: 100%;
  height: ${sectionHeight};
  overflow: hidden;
  position: relative;
  @media(orientation: portrait) {
    height: ${sectionHeightPortrait};
  }
`;

const TextLoopDiv = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: ${sectionHeight};
  top: 0;
  left: 0;
  width: 100%;
  z-index: 3;
  mix-blend-mode: normal;
  overflow: hidden;
  @media(orientation: portrait) {
    height: ${sectionHeightPortrait};
  }
  & div {
    & div {
      width: 100vw;
    }
  }
`;

const MyName = styled.h1`
  justify-content: center;
  align-items: center;
  font-family: var(--font-archiv), -apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, sans-serif;
  font-size: 7.5vw;
  text-align: center;
  z-index: 3;
  letter-spacing: 0.3vw;
  mix-blend-mode: normal;
  display: flex;
  @media(orientation: portrait) {
    display: block;
    font-size: 15.5vw;
    padding-top: 150px;
  }
`;

const BgH1Span = styled.div`
  padding: 0 50px;
  transition: all 1.0s;
  @media(orientation: portrait) {
    padding: 0 0;
  }
`;

const NumbersDeco = styled.span`
  color: #707070;
  width: 100%;
  z-index: 1;
  position: absolute;
  top: calc(${sectionHeight} * 0.22);
  display: flex;
  align-items: flex-start;
  flex-wrap: nowrap;
  justify-content: space-evenly;
  transition: all 1.0s;
  & span {
    font-weight: 200;
  }
  @media(orientation: portrait) {
    display: none;
    top: calc(${sectionHeightPortrait} * 0.35);
  }
`;

const MyNameBottomLine = styled.span`
  border-bottom: 1px #707070 solid;
  width: 100%;
  z-index: 2;
  position: absolute;
  top: calc(${sectionHeight} * 0.75);
  @media(orientation: portrait) {
    top: calc(${sectionHeightPortrait} * 0.80);
  }
`;

const circleAnimation = keyframes`
  33% {
    transform: translate(20%,-10%) scale(1.2);
  }
  66% {
    transform: translate(-20%,10%) scale(0.8);
  }
`;

const DecoCircle = styled.span`
  border: 1px #707070 solid;
  border-radius: 50%;
  width: calc(${sectionHeight} * 0.6);
  height: calc(${sectionHeight} * 0.6);
  z-index: 2;
  position: absolute;
  top: calc(${sectionHeight} * 0.20);
  left: 8%;
  animation: ${circleAnimation} 120s ease infinite;
  overflow: hidden;
  @media(orientation: portrait) {
    width: calc(${sectionHeightPortrait} * 0.4);
    height: calc(${sectionHeightPortrait} * 0.4);
    top: calc(${sectionHeightPortrait} * 0.22);
  }
`;

const triangleAnimation = keyframes`
  33% {
    clip-path: polygon(50% 15%, 31% 88%, 77% 60%);
  }
  66% {
    clip-path: polygon(72% 19%, 29% 39%, 60% 94%);
  }
`;

const triangleAnimationMobile = keyframes`
  33% {
    clip-path: polygon(73% 13%, 8% 58%, 95% 91%);
  }
  66% {
    clip-path: polygon(100% 19%, 0 37%, 59% 86%);
  }
`;

const FrontImageDiv = styled.div`
  position: absolute;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: ${sectionHeight};
  overflow: hidden;
  transition: all 1.0s;
  top: 0;
  @media(orientation: portrait) {
    height: ${sectionHeightPortrait};
  }
`;

const FrontImagePolygonOutDiv = styled.div`
  width: 100%;
  height: ${sectionHeight};
  background: #707070;
  animation: ${triangleAnimation} 120s ease infinite;
  clip-path: polygon(63% 10%, 28% 65%, 72% 92%);
  @media(orientation: portrait) {
    clip-path: polygon(35% 18%, 4% 89%, 120% 66%);
    animation: ${triangleAnimationMobile} 120s ease infinite;
    height: ${sectionHeightPortrait};
  }
`;

const FrontImagePolygonDiv = styled.div`
  position: absolute;
  top: 3px;
  left: 3px;
  right: 3px;
  bottom: 3px;
  background-size: cover;
  animation: ${triangleAnimation} 120s ease infinite;
  clip-path: polygon(63% 10%, 28% 65%, 72% 92%);
  @media(orientation: portrait) {
    clip-path: polygon(35% 18%, 4% 89%, 120% 66%);
    animation: ${triangleAnimationMobile} 120s ease infinite;
  }
`;

const Video = styled.video<{ $isForeground?: boolean }>`
  display: block;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  overflow: hidden;
  object-fit: cover;
  z-index: ${props => props.$isForeground ? 1 : 0};
  height: ${sectionHeight};
  width: 100%;
  @media(orientation: portrait) {
    height: ${sectionHeightPortrait};
  }
`;

const Title = styled(motion.h1)`
  font-size: clamp(3rem, 8vw, 8rem);
  color: white;
  position: absolute;
  text-align: center;
  letter-spacing: 0.2em;
  font-weight: 400;
  font-family: var(--font-archiv), system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  z-index: 3;
`;

const WhiteBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: white;
  z-index: 0;
`;

const BlackBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: black;
  z-index: -2;
`;

interface TriangleLandingProps {
  title?: string;
  backgroundColor?: string;
}

interface LandingData {
  foreground_media?: { guid: string }[];
  background_media?: { guid: string }[];
}

export default function TriangleLanding({ 
  title = "THINGS THAT MOVE",
  backgroundColor = "black",
}: TriangleLandingProps) {
  const pathname = usePathname() || '/';
  const [landingData, setLandingData] = useState<LandingData | null>(null);
  const [pageType, setPageType] = useState<'home' | 'bio' | 'projects' | 'other'>('other');

  useEffect(() => {
    // Determine page type
    const newPageType = pathname === '/' ? 'home' 
      : pathname === '/bio' || pathname.includes('/about') ? 'bio'
      : pathname.includes('/projects') || 
        pathname.includes('/category/projects') ||
        pathname.includes('/kinetics-robotics') ||
        pathname.includes('/interactive-digital') ||
        pathname.includes('/tech-research') ? 'projects'
      : 'other';
    
    setPageType(newPageType);
    console.log('Current page type:', newPageType);

    const fetchLandingData = async () => {
      try {
        const response = await axios.get('https://www.blog.thingsthatmove.xyz/wp-json/wp/v2/landings');
        const landings = response.data;
        console.log('All landings:', landings);
        
        let targetLanding;
        let targetId: number | undefined;

        if (newPageType === 'home') {
          targetId = 3003;
        } else if (newPageType === 'bio') {
          targetId = 3008;
        } else if (newPageType === 'projects') {
          targetId = 3133;
        }

        console.log('Looking for landing ID:', targetId);
        targetLanding = landings.find((landing: any) => landing.id === targetId);
        console.log('Found landing:', targetLanding);

        if (targetLanding) {
          const newLandingData = {
            foreground_media: targetLanding.foreground_media,
            background_media: targetLanding.background_media
          };
          console.log('Setting landing data:', newLandingData);
          setLandingData(newLandingData);
        }
      } catch (error) {
        console.error('Error fetching landing data:', error);
      }
    };

    fetchLandingData();
  }, [pathname]);

  const renderBackground = () => {
    console.log('Rendering background for page type:', pageType);
    console.log('Landing data:', landingData);

    if ((pageType === 'home' || pageType === 'projects') && landingData?.background_media?.[0]?.guid) {
      const videoUrl = landingData.background_media[0].guid;
      console.log('Using background video URL:', videoUrl);
      
      return (
        <Video
          autoPlay
          muted
          loop
          playsInline
          src={videoUrl}
        >
          <source src={videoUrl} type="video/mp4" />
        </Video>
      );
    } else if (pageType === 'bio') {
      return <WhiteBackground />;
    } else {
      return <BlackBackground />;
    }
  };

  return (
    <LandingSection>
      <TextLoopDiv>
        <MyName>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 5 }}
          >
            <BgH1Span>{title}</BgH1Span>
          </motion.div>
        </MyName>
      </TextLoopDiv>

      <NumbersDeco>
        {Array.from({ length: 10 }, (_, i) => (
          <span key={i}>{String(i + 1).padStart(2, '0')}</span>
        ))}
      </NumbersDeco>

      <MyNameBottomLine />
      <DecoCircle />

      {renderBackground()}
      
      <FrontImageDiv>
        <FrontImagePolygonOutDiv>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 4, delay: 2 }}
          >
            <FrontImagePolygonDiv>
              {landingData?.foreground_media?.[0]?.guid && (
                <Video
                  $isForeground
                  autoPlay
                  muted
                  loop
                  playsInline
                  src={landingData.foreground_media[0].guid}
                >
                  <source src={landingData.foreground_media[0].guid} type="video/mp4" />
                </Video>
              )}
            </FrontImagePolygonDiv>
          </motion.div>
        </FrontImagePolygonOutDiv>
      </FrontImageDiv>
    </LandingSection>
  );
} 