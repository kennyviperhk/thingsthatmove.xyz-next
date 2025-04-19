'use client';

import Link from 'next/link';
import styled from 'styled-components';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const HeaderContainer = styled.header<{ isLight: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 1rem 2rem;
  background: transparent;
`;

const Nav = styled.nav`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
`;

const NavLink = styled(Link)<{ isLight: boolean }>`
  color: ${props => props.isLight ? 'black' : 'white'};
  text-decoration: none;
  font-size: 1.25rem;
  transition: opacity 0.2s ease;
  
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

    // Initial check
    handleScroll();

    // Add scroll listener
    window.addEventListener('scroll', handleScroll);

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [pathname]);

  return (
    <HeaderContainer isLight={isLight}>
      <Nav>
        <LeftSection>
          <NavLink href="/bio" isLight={isLight}>About</NavLink>
        </LeftSection>
        <CenterSection>
          <NavLink href="/" isLight={isLight}>TTM</NavLink>
        </CenterSection>
        <RightSection>
          <NavLink href="/category/projects" isLight={isLight}>Projects</NavLink>
        </RightSection>
      </Nav>
    </HeaderContainer>
  );
};

export default Header; 