'use client';

import { styled } from 'styled-components';
import Link from 'next/link';
import Image from 'next/image';

// Component that provides scroll to top functionality
const BackToTop = () => {
  const scrollToTop = (event: React.MouseEvent) => {
    event.preventDefault();
    scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  return (
    <ToTopLink href="#site-header" onClick={scrollToTop}>
      To the top ↑
    </ToTopLink>
  );
};

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const arrowLink = "https://blog.thingsthatmove.xyz/wp-content/uploads/2022/03/arrowUpWhite.svg";

  return (
    <SiteFooter role="contentinfo">
      <FooterBackground>
        <Image 
          src="https://www.blog.thingsthatmove.xyz/wp-content/uploads/2022/03/image-4_s.jpg" 
          alt="Footer background" 
          fill 
          style={{ objectFit: 'cover', opacity: 0.7 }}
          priority
        />
      </FooterBackground>
      
      <SiteFooterInner>
        <CollaborateSection>
          <BigTxt>LET&apos;S COLLABORATE</BigTxt>
          <EmailLink>
            <Image src={arrowLink} alt="email arrow" width={16} height={16} />
            <span>me@thingsthatmove.xyz</span>
          </EmailLink>
        </CollaborateSection>

        <SocialLinks>
          <SocialLink href="https://www.facebook.com/thingsthatmove.xyz/" target="_blank">
            Facebook
          </SocialLink>
          <SocialDivider />
          <SocialLink href="https://www.instagram.com/thingsthatmove.xyz/" target="_blank">
            Instagram
          </SocialLink>
          <SocialDivider />
          <SocialLink href="https://vimeo.com/thingsthatmove" target="_blank">
            Vimeo
          </SocialLink>
        </SocialLinks>

        <BottomBar>
          <Copyright>
            © {currentYear} Things That Move Ltd.
          </Copyright>
          <BackToTop />
        </BottomBar>
      </SiteFooterInner>
    </SiteFooter>
  );
};

const SiteFooter = styled.footer`
  position: relative;
  width: 100%;
  height: 30vh;
  background-color: black;
  color: white;
  overflow: hidden;
  padding-top: 10rem;
`;

const FooterBackground = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 1;
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.8) 100%);
  }
`;

const SiteFooterInner = styled.div`
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 4rem 2rem;
`;

const CollaborateSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-top: 4rem;
`;

const BigTxt = styled.h1`
  font-family: "Archiv Grotesk", -apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, sans-serif;
  font-size: clamp(2.5rem, 5vw, 5rem);
  font-weight: 400;
  letter-spacing: 0.1em;
  color: white;
  text-align: center;
  margin: 0;
`;

const EmailLink = styled.a`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
  text-decoration: none;
  font-size: 0.9rem;
  letter-spacing: 0.05em;
  
  &:hover {
    text-decoration: underline;
  }
  
  span {
    margin-top: 2px;
  }
`;

const SocialLinks = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  margin: 2rem 0;
  width: 100%;
`;

const SocialLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-size: 1.5rem;
  letter-spacing: 0.05em;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.8;
  }
`;

const SocialDivider = styled.div`
  width: 20vw;
  height: 1px;
  background-color: white;
  opacity: 0.5;

  @media (max-width: 768px) {
    width: 2rem;
  }
`;

const BottomBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0 2rem;
  margin-bottom: 2rem;
`;

const Copyright = styled.p`
  font-size: 0.9rem;
  opacity: 0.8;
  margin: 0;
`;

const ToTopLink = styled.a`
  color: white;
  text-decoration: none;
  font-size: 0.9rem;
  opacity: 0.8;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 1;
  }
`;

export default Footer; 