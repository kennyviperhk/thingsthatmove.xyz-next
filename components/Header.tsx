'use client';

import Link from 'next/link';
import Navigation from './Navigation';
import Image from 'next/image';

const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link href="/" className="logo">
            <Image 
              src="/logo.png" 
              alt="Things That Move Ltd."
              width={200}
              height={50}
              className="logo-image"
              priority
            />
          </Link>
          <Navigation />
        </div>
      </div>
    </header>
  );
};

export default Header; 