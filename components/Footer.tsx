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
  
  // Email obfuscation
  const encodedEmail = "&#109;&#101;&#64;&#116;&#104;&#105;&#110;&#103;&#115;&#116;&#104;&#97;&#116;&#109;&#111;&#118;&#101;&#46;&#120;&#121;&#122;";
  const mailtoLink = "mailto:me@thingsthatmove.xyz".split('').map(char => '&#' + char.charCodeAt(0) + ';').join('');

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
        <TopSection>
          <BigTxt>LET&apos;S COLLABORATE</BigTxt>
          <EmailLink 
            href={`mailto:me@thingsthatmove.xyz`}
            dangerouslySetInnerHTML={{
              __html: `
                <img src="${arrowLink}" alt="email arrow" width="16" height="16" style="margin-right: 0.5rem;" />
                <span>${encodedEmail}</span>
              `
            }}
          />
        </TopSection>

        <BottomSection>
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
        </BottomSection>
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
  padding-top: 5rem;

  @media (max-width: 768px) {
    height: 40vh;
    padding-top: 5rem;
  }
`;

const FooterBackground = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 1;
  top: 0;
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
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
`;

const TopSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  margin-top: -3rem;

  @media (max-width: 768px) {
    align-items: flex-start;
    gap: 2rem;
    margin-top: 0;
  }
`;

const BottomSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    gap: 2rem;
    margin-bottom: 1rem;
  }
`;

const BigTxt = styled.h1`
  font-family: "Archiv Grotesk", -apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, sans-serif;
  font-size: clamp(3.5rem, 5vw, 5rem);
  font-weight: 400;
  letter-spacing: 0.1em;
  color: white;
  text-align: center;
  margin: 0;
  line-height: 1;

  @media (max-width: 768px) {
    font-size: 3rem;
    text-align: left;
  }
`;

const EmailLink = styled.a`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
  text-decoration: none;
  font-size: 1.2rem;
  letter-spacing: 0.05em;
  
  &:hover {
    text-decoration: underline;
  }
  
  img {
    display: inline-block;
    vertical-align: middle;
  }

  span {
    margin-top: 2px;
  }

  @media (max-width: 768px) {
    font-size: 1.4rem;
  }
`;

const SocialLinks = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  width: 100%;
  margin: 2rem 0;

  @media (max-width: 768px) {
    justify-content: flex-start;
    gap: 1.5rem;
    margin: 1rem 0;
  }
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

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const SocialDivider = styled.div`
  width: 20vw;
  height: 1px;
  background-color: white;
  opacity: 0.5;

  @media (max-width: 768px) {
    width: 3rem;
  }
`;

const BottomBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0;

  @media (max-width: 768px) {
    margin-top: auto;
  }
`;

const Copyright = styled.p`
  font-size: 0.9rem;
  opacity: 0.8;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
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

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

export default Footer; 