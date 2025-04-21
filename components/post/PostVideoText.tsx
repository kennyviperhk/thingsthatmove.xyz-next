'use client';

import styled from 'styled-components';

interface PostVideoTextProps {
  concept?: string;
  video?: string;
  isSecondary?: boolean;
}

const VideoTextSection = styled.section`
  display: flex;
  flex-direction: column;
  padding: 2rem 0;
  width: 100%;
  margin: 0 auto;
  gap: 2rem;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: flex-start;
  }
`;

const TextContent = styled.div`
  flex: 1;
  font-size: 1.1rem;
  line-height: 1.6;
  color: white;

  p {
    color: white;
    margin-bottom: 1.5rem;
  }

  h1, h2, h3, h4, h5, h6 {
    color: white;
    margin: 2rem 0 1rem;
  }

  @media (min-width: 768px) {
    padding-right: 2rem;
  }
`;

const VideoContainer = styled.div`
  flex: 1;
  position: relative;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  height: 0;
  overflow: hidden;
  background: #111;
  border-radius: 8px;
  
  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: none;
  }
`;

export default function PostVideoText({ concept, video, isSecondary = false }: PostVideoTextProps) {
  if (!concept && !video) return null;

  return (
    <VideoTextSection>
      {concept && (
        <TextContent dangerouslySetInnerHTML={{ __html: concept }} />
      )}
      {video && (
        <VideoContainer>
          <iframe
            src={video}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </VideoContainer>
      )}
    </VideoTextSection>
  );
} 