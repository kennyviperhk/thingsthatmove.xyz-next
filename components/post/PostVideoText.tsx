'use client';

import { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import ReactPlayer from 'react-player/lazy';

interface PostVideoTextProps {
  concept?: string;
  video?: string;
  isSecondary?: boolean;
}

const VideoTextSection = styled.section.withConfig({
  componentId: 'VideoTextSection',
  shouldForwardProp: (prop) => !['isSecondary'].includes(prop)
})<{ isSecondary?: boolean }>`
  display: flex;
  padding: 100px 0;
  width: 100%;
  margin: 0 auto;
  align-items: stretch;
  ${props => props.isSecondary ? css`flex-flow: row-reverse;` : css`flex-flow: row;`}

  @media (orientation: portrait) {
    flex-flow: column-reverse;
    padding: 50px 0;
  }
`;

const TextContent = styled.div`
  width: 40%;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-self: start;

  @media (orientation: portrait) {
    width: 100%;
  }
`;

const ConceptText = styled.p`
  max-width: 800px;
  padding: 0 50px;
  white-space: pre-line;

  @media (orientation: portrait) {
    padding: 20px 15px;
  }
`;

const VideoContainer = styled.div`
  margin: 0 auto;
  width: 60%;
  padding: 0 5%;
  min-height: calc(50vw / 1.7);
  position: relative;

  @media (orientation: portrait) {
    padding: 0;
    width: 100%;
    height: calc(90vw / 1.78);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .react-player {
    position: absolute;
    top: 0;
    left: 0;
  }
`;

const NativeVideo = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export default function PostVideoText({ concept, video, isSecondary = false }: PostVideoTextProps) {
  const [videoElement, setVideoElement] = useState<React.ReactNode | null>(null);

  useEffect(() => {
    if (!video) return;

    const fileExtension = video.split('.').pop()?.toLowerCase();
    const imageExtensions = ['jpg', 'jpeg', 'gif', 'tiff', 'png', 'webp'];
    const videoExtensions = ['mp4', 'webm'];

    if (imageExtensions.includes(fileExtension || '')) {
      setVideoElement(<img src={video} alt={concept || 'Media content'} />);
    } else if (videoExtensions.includes(fileExtension || '')) {
      setVideoElement(
        <NativeVideo playsInline autoPlay muted loop>
          <source src={`${video}#t=0.1`} type={`video/${fileExtension}`} />
        </NativeVideo>
      );
    } else if (ReactPlayer.canPlay(video)) {
      setVideoElement(
        <ReactPlayer
          url={video}
          width="100%"
          height="100%"
          controls
          className="react-player"
          config={{
            vimeo: {
              playerOptions: {
                title: false,
                byline: false,
                portrait: false,
                playsinline: true,
                autopause: false,
                responsive: true,
                dnt: true
              }
            }
          }}
        />
      );
    }
  }, [video, concept]);

  if (!concept && !video) return null;

  return (
    <VideoTextSection isSecondary={isSecondary}>
      <TextContent>
        <ConceptText>{concept}</ConceptText>
      </TextContent>
      <VideoContainer>
        {videoElement}
      </VideoContainer>
    </VideoTextSection>
  );
} 