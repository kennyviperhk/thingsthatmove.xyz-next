'use client';

import { useEffect, useState, useCallback } from 'react';
import styled, { css } from 'styled-components';
import ReactPlayer from 'react-player/lazy';
import Loading from '@/components/Loading';
import { getProxiedMediaUrl } from '@/lib/media';

interface PostVideoTextProps {
  concept?: string;
  video?: string;
  isSecondary?: boolean;
}

interface MediaLoadingState {
  isLoading: boolean;
  failed: boolean;
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

export default function PostVideoText({ concept, video, isSecondary = false }: PostVideoTextProps) {
  const [videoElement, setVideoElement] = useState<React.ReactNode | null>(null);
  const [mediaState, setMediaState] = useState<MediaLoadingState>({ isLoading: true, failed: false });

  const loadMediaItem = useCallback(async (url: string): Promise<boolean> => {
    try {
      setMediaState({ isLoading: true, failed: false });

      await new Promise<void>((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          reject(new Error('Loading timeout'));
        }, 30000);

        const fileExtension = url.split('.').pop()?.toLowerCase();
        const imageExtensions = ['jpg', 'jpeg', 'gif', 'tiff', 'png', 'webp'];
        const videoExtensions = ['mp4', 'webm'];

        if (imageExtensions.includes(fileExtension || '')) {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => {
            clearTimeout(timeoutId);
            resolve();
          };
          img.onerror = () => {
            clearTimeout(timeoutId);
            reject();
          };
          img.src = getProxiedMediaUrl(url);
        } else if (videoExtensions.includes(fileExtension || '')) {
          const video = document.createElement('video');
          video.crossOrigin = "anonymous";
          video.onloadeddata = () => {
            clearTimeout(timeoutId);
            resolve();
          };
          video.onerror = () => {
            clearTimeout(timeoutId);
            reject();
          };
          video.src = getProxiedMediaUrl(url);
        } else {
          // For external videos (YouTube, Vimeo), resolve immediately
          clearTimeout(timeoutId);
          resolve();
        }
      });

      setMediaState({ isLoading: false, failed: false });
      return true;
    } catch (error) {
      setMediaState({ isLoading: false, failed: true });
      return false;
    }
  }, []);

  useEffect(() => {
    if (!video) {
      setMediaState({ isLoading: false, failed: false });
      return;
    }

    const fileExtension = video.split('.').pop()?.toLowerCase();
    const imageExtensions = ['jpg', 'jpeg', 'gif', 'tiff', 'png', 'webp'];
    const videoExtensions = ['mp4', 'webm'];

    loadMediaItem(video).then(success => {
      if (success) {
        if (imageExtensions.includes(fileExtension || '')) {
          setVideoElement(<img src={getProxiedMediaUrl(video)} crossOrigin="anonymous" />);
        } else if (videoExtensions.includes(fileExtension || '')) {
          setVideoElement(
            <NativeVideo playsInline autoPlay muted loop crossOrigin="anonymous">
              <source src={`${getProxiedMediaUrl(video)}#t=0.1`} type={`video/${fileExtension}`} />
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
      }
    });
  }, [video, loadMediaItem]);

  if (!concept && !video) return null;

  return (
    <VideoTextSection isSecondary={isSecondary}>
      <TextContent>
        <ConceptText>{concept}</ConceptText>
      </TextContent>
      <VideoContainer>
        {mediaState.isLoading && (
          <LoadingContainer>
            <Loading />
          </LoadingContainer>
        )}
        {mediaState.failed ? (
          <LoadingContainer>
            <div style={{ color: 'white', textAlign: 'center' }}>
              Failed to load media
              <br />
              <button onClick={() => loadMediaItem(video || '')}>Retry</button>
            </div>
          </LoadingContainer>
        ) : (
          videoElement
        )}
      </VideoContainer>
    </VideoTextSection>
  );
} 