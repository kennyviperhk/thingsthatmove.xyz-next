'use client'

import { createGlobalStyle } from 'styled-components'

export const GlobalStyles = createGlobalStyle`
  :root {
    --font-archiv: var(--font-archiv-grotesk);
  }

  * {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
  }

  html,
  body {
    max-width: 100vw;
    overflow-x: hidden;
    font-family: var(--font-archiv), system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-archiv), system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-weight: 400;
  }

  html {
    font-size: 62.5%; /* 1rem = 10px */
  }

  body {
    box-sizing: border-box;
    font-weight: 400;
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
    font-weight: 400;
    letter-spacing: -0.0415625em;
    line-height: 1.25;
    margin: 3.5rem 0 2rem;
  }

  h1,
  .heading-size-1 {
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
    font-weight: 400;
  }

  span {
    line-height: 1.5;
    margin: 0 0 1em 0;
    font-size: 13px;
    font-weight: 400;
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