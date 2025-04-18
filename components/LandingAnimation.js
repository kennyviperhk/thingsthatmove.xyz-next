
import styled from 'styled-components';

export default function LandingAnimation() {
  return (
    <Hero>
      <h1>THINGS THAT MOVE</h1>
    </Hero>
  );
}

const Hero = styled.section`
  height: 60vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: black;
  color: white;
  font-size: 2.5rem;
  text-transform: uppercase;
`;
