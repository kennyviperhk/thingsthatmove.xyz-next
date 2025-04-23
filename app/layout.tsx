import type { Metadata } from "next";
import "./globals.css";
import Script from 'next/script';
import dynamic from 'next/dynamic';
import StyledComponentsRegistry from './registry';
import { GlobalStyles } from './styles/globalStyles';
import LayoutContent from './LayoutContent';
import { archivGrotesk } from './styles/fonts';

const GoogleTagManagerNoscript = dynamic(() => import('@/components/GoogleTagManagerNoscript'), { ssr: false });

export const metadata: Metadata = {
  title: "Things That Move | Kinetic Art & Interactive Design Studio",
  description: "Award-winning creative technology studio specializing in kinetic art, interactive design, robotics, and technical consultancy. We bring motion and innovation to life through art and technology.",
  keywords: "kinetic art, interactive design, robotics, technical consultancy, creative technology, art installation, motion design, Things That Move",
  openGraph: {
    title: "Things That Move | Kinetic Art & Interactive Design Studio",
    description: "Award-winning creative technology studio specializing in kinetic art, interactive design, robotics, and technical consultancy.",
    url: "https://www.thingsthatmove.xyz",
    siteName: "Things That Move",
    images: [
      {
        url: "https://www.blog.thingsthatmove.xyz/wp-content/uploads/2022/03/image-4_s.jpg",
        width: 1200,
        height: 630,
        alt: "Things That Move Studio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Things That Move | Kinetic Art & Interactive Design Studio",
    description: "Award-winning creative technology studio specializing in kinetic art, interactive design, robotics, and technical consultancy.",
    images: ["https://www.blog.thingsthatmove.xyz/wp-content/uploads/2022/03/image-4_s.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "YOUR-GOOGLE-VERIFICATION-CODE",
  },
  alternates: {
    canonical: "https://www.thingsthatmove.xyz",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={archivGrotesk.variable}>
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
      <body>
        <GoogleTagManagerNoscript />
        <StyledComponentsRegistry>
          <GlobalStyles />
          <LayoutContent>
            {children}
          </LayoutContent>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
