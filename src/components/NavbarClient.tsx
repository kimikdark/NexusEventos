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

export default function NavbarClient({ navLinks }: { navLinks: NavLink[] }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('jwt');
      console.log('NavbarClient: Token JWT no localStorage:', token ? 'Presente' : 'Ausente (ao montar)');
      setIsLoggedIn(!!token);
      console.log('NavbarClient: isLoggedIn (após verificação ao montar):', !!token);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    setIsLoggedIn(false);
    router.push('/admin/login');
  };

  const handleLoginClick = () => {
    router.push('/admin/login');
  };

  return (
    <Navbar fluid rounded className="bg-[var(--accent-color)] text-white p-4 shadow-md">
      <NavbarBrand as={Link} href="/">
        {/* LOGOTIPO: Ajuste de dimensões para proporção 2048x1347 */}
        <Image
          src="/images/NexusEventos.png" // Caminho para o teu logotipo.
          alt="Nexus Events Logotipo"
          width={60}  // Nova Largura proporcional (aprox. 60.8 arredondado para 60)
          height={40} // Nova Altura proporcional (aprox. 39.47 arredondado para 40)
          className="mr-3 h-auto" // Remover h-6 sm:h-9 para que width/height do Image tomem precedência. h-auto para manter proporção.
        />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Nexus Events</span>
      </NavbarBrand>

      <div className="flex md:order-2 items-center space-x-4">
        {isLoggedIn ? (
          <>
            <Link href="/admin/dashboard" className="text-white hover:text-[var(--secondary-accent)] mr-2 md:mr-0">
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="bg-[var(--secondary-background)] text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors duration-300"
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={handleLoginClick}
            className="bg-[var(--secondary-background)] text-white px-4 py-2 rounded-md hover:bg-[var(--secondary-accent)] transition-colors duration-300"
          >
            Login
          </button>
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
              className="text-white hover:text-[var(--secondary-accent)] dark:text-white dark:hover:text-[var(--secondary-accent)]"
            >
              {link.title}
            </NavbarLink>
          ))}
      </NavbarCollapse>
    </Navbar>
  );
}