'use client';

import styled from 'styled-components';
import { motion } from 'framer-motion';

const LandingSection = styled.section`
  height: 100vh;
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: black;
  overflow: hidden;
`;

const Triangle = styled(motion.div)`
  width: 0;
  height: 0;
  border-left: 50vw solid transparent;
  border-right: 50vw solid transparent;
  border-bottom: 50vh solid black;
  position: absolute;
  transform-origin: center;
`;

const Circle = styled(motion.div)`
  width: 50vh;
  height: 50vh;
  border: 2px solid white;
  border-radius: 50%;
  position: absolute;
`;

const Title = styled(motion.h1)`
  font-size: clamp(3rem, 8vw, 8rem);
  color: white;
  position: absolute;
  text-align: center;
  letter-spacing: 0.2em;
  font-weight: 400;
  font-family: var(--font-archiv), system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  z-index: 2;
`;

interface TriangleLandingProps {
  title?: string;
  backgroundColor?: string;
  videoUrl?: string;
}

export default function TriangleLanding({ 
  title = "THINGS THAT MOVE",
  backgroundColor = "black",
  videoUrl
}: TriangleLandingProps) {
  return (
    <LandingSection style={{ background: backgroundColor }}>
      {videoUrl && (
        <video
          autoPlay
          muted
          loop
          playsInline
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      )}
      
      <Circle
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />
      
      <Triangle
        initial={{ rotate: -180, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />
      
      <Title
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        {title}
      </Title>
    </LandingSection>
  );
} 