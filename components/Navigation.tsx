'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navigation = () => {
  const pathname = usePathname();

  const routes = [
    { path: '/', label: 'Home' },
    { path: '/landings/bio', label: 'Bio' },
    { path: '/landings/interactive-digital', label: 'Interactive Digital' },
    { path: '/landings/tech-research', label: 'Tech Research' },
    { path: '/landings/kinetics-robotics', label: 'Kinetics & Robotics' },
  ];

  return (
    <nav className="main-navigation">
      <ul className="flex gap-6 p-4">
        {routes.map(({ path, label }) => (
          <li key={path}>
            <Link 
              href={path}
              className={`
                text-lg hover:text-blue-500 transition-colors
                ${pathname === path ? 'text-blue-500 font-bold' : 'text-gray-700'}
              `}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation; 