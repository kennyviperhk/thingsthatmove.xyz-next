'use client'

import { createGlobalStyle } from 'styled-components'

export const GlobalStyles = createGlobalStyle`
  html {
    font-size: 62.5%; /* 1rem = 10px */
  }

  body {
    box-sizing: border-box;
    font-family: "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Helvetica Neue",
      Helvetica, sans-serif;
    font-weight: 300;
    letter-spacing: -0.015em;
    text-align: left;
  }

  *,
  *::before,
  *::after {
    box-sizing: inherit;
    word-break: break-word;
    word-wrap: break-word;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  .faux-heading {
    font-feature-settings: "lnum";
    font-variant-numeric: lining-nums;
    font-weight: 500;
    letter-spacing: -0.0415625em;
    line-height: 1.25;
    margin: 3.5rem 0 2rem;
  }

  h1,
  .heading-size-1 {
    font-family: "Archiv Grotesk", -apple-system, BlinkMacSystemFont, "Helvetica Neue",
    Helvetica, sans-serif;
    font-size: 10vw;
    letter-spacing: 0.2rem;
    text-transform: uppercase;
  }

  h2,
  .heading-size-2 {
    font-size: 3.2rem;
  }

  h3,
  .heading-size-3 {
    font-size: 3.0rem;
  }

  h4,
  .heading-size-4 {
    font-size: 2.0rem;
    @media(orientation: portrait){
      font-size: 1.5rem;
    }
  }

  p {
    line-height: 1.5;
    margin: 0 0 1em 0;
    font-size: 18px;
    font-weight: 300;
  }

  span {
    line-height: 1.5;
    margin: 0 0 1em 0;
    font-size: 13px;
    font-weight: 700;
  }

  a,
  path {
    transition: all 0.15s linear;
  }

  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0s !important;
      transition-duration: 0s !important;
    }
  }
` 