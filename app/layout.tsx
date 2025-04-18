import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from 'next/script';
import dynamic from 'next/dynamic';
import StyledComponentsRegistry from './registry';
import { GlobalStyles } from './styles/globalStyles';

const Header = dynamic(() => import('@/components/Header'), { ssr: true });
const Footer = dynamic(() => import('@/components/Footer'), { ssr: true });
const TriangleLanding = dynamic(() => import('@/components/TriangleLanding'), { ssr: true });
const GoogleTagManagerNoscript = dynamic(() => import('@/components/GoogleTagManagerNoscript'), { ssr: false });

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Things That Move Ltd.",
  description: "Artwork, Design, Technology",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Google Tag Manager */}
        <Script id="gtm" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-PKP53HR');
          `}
        </Script>
        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=UA-221885825-2`}
          strategy="afterInteractive"
        />
        <Script id="ga" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'UA-221885825-2');
          `}
        </Script>
      </head>
      <body className={inter.variable}>
        <GoogleTagManagerNoscript />
        <StyledComponentsRegistry>
          <GlobalStyles />
          <div className="min-h-screen flex flex-col">
            <Header />
            <TriangleLanding />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
