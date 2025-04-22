'use client';

import { FC } from 'react';
import styled from 'styled-components';

interface BioTextSectionProps {
  data: {
    primary_quote?: string;
    primary_desc?: string;
    secondary_quote?: string;
    secondary_desc?: string;
  };
}

const BioTextSec = styled.section`
  display: flex;
  flex-direction: column;
  background: white;
  color: black;
  margin: 0 auto;
  width: 100%;
  height: auto;
  padding: 4rem 0;
  @media(orientation: portrait) {
    height: auto;
    padding: 2rem 0;
  }
`;

const TxtMainDivUp = styled.div`
  flex: 1;
  position: relative;
  width: 100%;
  height: auto;
  margin-bottom: 4rem;
  @media(orientation: portrait) {
    height: auto;
    margin-bottom: 2rem;
  }
`;

const TxtMainDivDown = styled.div`
  flex: 1;
  position: relative;
  width: 100%;
  height: auto;
  display: flex;
  justify-content: space-evenly;
  align-items: flex-start;
  flex-flow: row nowrap;
  @media(orientation: portrait) {
    flex-direction: column;
    height: auto;
  }
`;

const TxtSubDivL = styled.div`
  position: relative;
  height: auto;
  max-width: 600px;
  text-align: left;
  margin-left: 10%;
  font-size: 15px;
  padding: 20px 0;
  @media(orientation: portrait) {
    position: relative;
    margin-left: 0;
    padding: 20px 15px;
    height: auto;
    margin: 0 auto;
  }
`;

const TxtSubDivR = styled.div`
  position: relative;
  text-align: left;
  font-size: 15px;
  width: 50%;
  padding: 0px 45px 0 10%;
  align-items: flex-start;
  display: flex;
  flex-direction: column;

  @media(orientation: portrait) {
    position: relative;
    height: auto;
    width: 100%;
    right: 0;
    padding: 20px 15px;
    margin: 0 auto;
  }
`;

const QuoteP = styled.p`
  font-size: 2.0rem;
  font-weight: 500;
  margin-bottom: 1rem;
`;

const DescP = styled.p`
  font-size: 1.825rem;
  line-height: 1.6;
  white-space: pre-line;
`;

const BioTextSection: FC<BioTextSectionProps> = ({ data }) => {
  return (
    <BioTextSec className="container">
      <TxtMainDivUp>
        <TxtSubDivL>
          <QuoteP>{data.primary_quote}</QuoteP>
          <DescP>{data.primary_desc}</DescP>
        </TxtSubDivL>
      </TxtMainDivUp>

      <TxtMainDivDown>
        <TxtSubDivR>
          <QuoteP>{data.secondary_quote}</QuoteP>
          <DescP>{data.secondary_desc}</DescP>
        </TxtSubDivR>
      </TxtMainDivDown>
    </BioTextSec>
  );
};

export default BioTextSection; 