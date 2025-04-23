'use client';

import Link from 'next/link';
import styled from 'styled-components';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const HeaderContainer = styled.header<{ $isLight: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  padding: 1rem 2rem;
  background: transparent;
  pointer-events: auto;
  touch-action: manipulation;
  @media (max-width: 768px) {
    padding: 0.5rem 1rem;
    mix-blend-mode: normal;
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.2);
      z-index: -1;
    }
  }
  @media (min-width: 769px) {
    mix-blend-mode: difference;
  }
`;

const Nav = styled.nav`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  pointer-events: auto;
`;

const NavLink = styled(Link)<{ $isLight: boolean }>`
  color: white;
  text-decoration: none;
  font-size: 2.75rem;
  transition: opacity 0.2s ease;
  text-shadow: 
    0 0 5px rgba(255, 255, 255, 0.5),
    0 0 10px rgba(255, 255, 255, 0.4),
    0 0 15x rgba(255, 255, 255, 0.3);
  -webkit-tap-highlight-color: transparent;
  cursor: pointer;
  user-select: none;
  
  &:hover {
    opacity: 0.8;
  }

  @media (max-width: 768px) {
    font-size: 2rem;
    padding: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 44px;
    min-width: 44px;
    position: relative;
    touch-action: manipulation;
    
    &:active {
      opacity: 0.6;
    }
    
    &::after {
      content: '';
      position: absolute;
      top: -10px;
      left: -10px;
      right: -10px;
      bottom: -10px;
      z-index: 1;
    }
  }
`;

const LeftSection = styled.div`
  justify-self: start;
`;

const CenterSection = styled.div`
  justify-self: center;
`;

const RightSection = styled.div`
  justify-self: end;
`;

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (pathname === '/bio') {
        const isScrolledPastHero = window.scrollY > window.innerHeight;
        setIsLight(isScrolledPastHero);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  const handleClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const href = (e.currentTarget as HTMLAnchorElement).getAttribute('href');
    if (href) {
      router.push(href);
    }
  };

  return (
    <HeaderContainer $isLight={isLight}>
      <Nav>
        <LeftSection>
          <NavLink href="/bio" $isLight={isLight} onClick={handleClick}>About</NavLink>
        </LeftSection>
        <CenterSection>
          <NavLink href="/" $isLight={isLight} onClick={handleClick}>TTM</NavLink>
        </CenterSection>
        <RightSection>
          <NavLink href="/category/projects" $isLight={isLight} onClick={handleClick}>Projects</NavLink>
        </RightSection>
      </Nav>
    </HeaderContainer>
  );
};

export default Header;