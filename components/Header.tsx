'use client';

import Link from 'next/link';
import styled from 'styled-components';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const HeaderContainer = styled.header<{ $isLight: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 1rem 2rem;
  background: transparent;
  mix-blend-mode: difference;
`;

const Nav = styled.nav`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
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
  
  &:hover {
    opacity: 0.8;
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

  return (
    <HeaderContainer $isLight={isLight}>
      <Nav>
        <LeftSection>
          <NavLink href="/bio" $isLight={isLight}>About</NavLink>
        </LeftSection>
        <CenterSection>
          <NavLink href="/" $isLight={isLight}>TTM</NavLink>
        </CenterSection>
        <RightSection>
          <NavLink href="/category/projects" $isLight={isLight}>Projects</NavLink>
        </RightSection>
      </Nav>
    </HeaderContainer>
  );
};

export default Header; 