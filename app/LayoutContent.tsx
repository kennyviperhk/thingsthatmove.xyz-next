'use client';

import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';

const Header = dynamic(() => import('@/components/Header'), { ssr: true });
const Footer = dynamic(() => import('@/components/Footer'), { ssr: true });
const TriangleLanding = dynamic(() => import('@/components/TriangleLanding'), { ssr: true });

interface LayoutContentProps {
  children: React.ReactNode;
}

export default function LayoutContent({ children }: LayoutContentProps) {
  const pathname = usePathname();
  const shouldShowTriangleLanding = pathname !== '/bio';

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      {shouldShowTriangleLanding && <TriangleLanding />}
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
} 