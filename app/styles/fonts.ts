import localFont from 'next/font/local';

export const archivGrotesk = localFont({
  src: [
    {
      path: '../../public/fonts/ArchivGrotesk-Regular.woff2',
      weight: '400',
      style: 'normal',
    }
  ],
  variable: '--font-archiv-grotesk'
}); 