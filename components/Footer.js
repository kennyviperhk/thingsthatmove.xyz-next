
import styled from 'styled-components';

export default function Footer() {
  return (
    <FooterWrapper>
      <p>© Things That Move</p>
    </FooterWrapper>
  );
}

const FooterWrapper = styled.footer`
  padding: 2rem;
  text-align: center;
  background: #111;
  color: white;
`;
