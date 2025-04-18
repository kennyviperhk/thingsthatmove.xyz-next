
import Link from 'next/link';
import styled from 'styled-components';

export default function Header() {
  return (
    <Nav>
      <Link href="/">Home</Link>
      <Link href="/bio">Bio</Link>
      <Link href="/projects">Projects</Link>
    </Nav>
  );
}

const Nav = styled.nav`
  background: #111;
  padding: 1rem;
  display: flex;
  gap: 2rem;
  a {
    color: white;
    text-decoration: none;
    font-weight: bold;
  }
`;
