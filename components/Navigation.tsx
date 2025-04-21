'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styled from 'styled-components';
import { useState, useEffect } from 'react';

const NavWrapper = styled.div`
  align-items: center;
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  mix-blend-mode: difference;
  color: white;
`;

const MenuNav = styled.nav`
  display: none;
  @media (min-width: 1000px) {
    display: block;
    width: 100%;
  }
`;

const Menu = styled.ul`
  display: flex;
  font-size: 20px;
  font-weight: 500;
  letter-spacing: -0.0277em;
  flex-wrap: wrap;
  justify-content: space-between;
  list-style: none;
  margin: 0;
  padding: 10px 15px 10px 15px;
`;

const MenuItem = styled.li`
  font-size: inherit;
  line-height: 1.25;
  position: relative;
  text-align: center;
  width: 250px;

  &:nth-of-type(1) {
    text-align: left;
  }
  &:nth-of-type(3) {
    text-align: right;
    width: 300px;
  }

  @media(orientation: portrait) {
    margin: 0 auto;
    height: 38px;
    &:nth-of-type(1) {
      text-align: center;
    }
    &:nth-of-type(3) {
      width: 270px;
      text-align: center;
    }
  }
`;

const MenuLink = styled(Link)<{ $isActive?: boolean }>`
  text-decoration: none;
  display: block;
  font-size: 20px;
  font-weight: 500;
  white-space: nowrap;
  padding: 5px 45px 15px 45px;
  color: inherit;

  &:hover {
    text-decoration: underline;
  }

  ${props => props.$isActive && `
    text-decoration: underline;
  `}

  @media(orientation: portrait) {
    padding: 2px 15px 0px 15px;
  }
`;

export default function Navigation() {
  const pathname = usePathname() || '/';
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const routes = [
    { path: '/bio', label: 'About' },
    { path: '/', label: 'TTM' },
    { path: '/category/projects', label: 'Projects' },
  ];

  return (
    <NavWrapper>
      <MenuNav>
        <Menu>
          {routes.map(({ path, label }) => (
            <MenuItem key={path}>
              <MenuLink 
                href={path}
                $isActive={pathname === path}
              >
                {label}
              </MenuLink>
            </MenuItem>
          ))}
        </Menu>
      </MenuNav>
    </NavWrapper>
  );
} 