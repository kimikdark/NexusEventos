// src/components/NavbarClient.tsx
'use client';

import { useState, useEffect } from 'react';
import { Navbar, NavbarBrand, NavbarToggle, NavbarCollapse, NavbarLink } from 'flowbite-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';

interface NavLink {
  id: number;
  title: string;
  path: string;
  order?: number;
}

interface NavbarClientProps {
  navLinks: NavLink[];
}

export default function NavbarClient({ navLinks }: NavbarClientProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const jwt = localStorage.getItem('jwt');
      const authStatus = !!jwt;
      setIsAuthenticated(authStatus);
      console.log('NavbarClient: JWT status from localStorage (ao montar):', authStatus ? 'Presente' : 'Ausente');
    }
  }, []); // Executa apenas uma vez na montagem

  const handleLogoutClick = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('jwt');
      localStorage.removeItem('user');
    }
    setIsAuthenticated(false);
    router.push('/'); // Redireciona para a home após logout
    console.log('NavbarClient: User logged out.');
  };

  const handleLoginClick = () => {
    router.push('/admin/login');
  };

  return (
    <Navbar fluid rounded className="bg-[var(--accent-color)] text-white p-4 shadow-md">
      <NavbarBrand as={Link} href="/">
        <Image
          src="/images/Logo.png"
          alt="Nexus Events Logotipo"
          width={150}
          height={90}
          className="mr-3 h-auto max-h-24 flex-shrink-0"
          priority
          sizes="150px" // Adicionado sizes para otimização com width/height
        />
      </NavbarBrand>

      <div className="flex md:order-2 items-center space-x-4">
        {isAuthenticated ? (
          <>
            <Link href="/admin/dashboard" className="text-white hover:text-[var(--secondary-accent)] mr-2 md:mr-0 text-lg">
              Dashboard
            </Link>
            <button
              onClick={handleLogoutClick}
              className="bg-[var(--secondary-background)] text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors duration-300 text-lg"
            >
              Logout
            </button>
          </>
        ) : (
          pathname !== '/admin/login' && (
            <button
              onClick={handleLoginClick}
              className="bg-[var(--secondary-background)] text-white px-4 py-2 rounded-md hover:bg-[var(--secondary-accent)] transition-colors duration-300 text-lg"
            >
              Login
            </button>
          )
        )}
        <NavbarToggle />
      </div>

      <NavbarCollapse>
        {navLinks
          .sort((a, b) => (a.order || 0) - (b.order || 0))
          .map((link) => (
            <NavbarLink
              key={link.id}
              as={Link}
              href={link.path}
              active={pathname === link.path || (link.path.startsWith('/#') && pathname === '/')}
              className="text-white hover:text-[var(--secondary-accent)] dark:text-white dark:hover:text-[var(--secondary-accent)] text-lg"
            >
              {link.title}
            </NavbarLink>
          ))}
      </NavbarCollapse>
    </Navbar>
  );
}