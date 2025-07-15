// src/components/NavbarClient.tsx
'use client'; // Marcar como Client Component

import { useState, useEffect } from 'react'; // Importar hooks
import { Navbar, NavbarBrand, NavbarToggle, NavbarCollapse, NavbarLink } from 'flowbite-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Importar useRouter para navegação programática

interface NavLink {
  id: number;
  title: string;
  path: string;
  order?: number;
}

export default function NavbarClient({ navLinks }: { navLinks: NavLink[] }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter(); // Inicializar useRouter

  // Verifica o status de login ao montar o componente
  useEffect(() => {
    // Apenas executa no browser (para evitar erros de localStorage no server)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('jwt');
      setIsLoggedIn(!!token); // true se o token existir, false caso contrário
    }
  }, []); // Executa apenas uma vez no mount

  const handleLogout = () => {
    localStorage.removeItem('jwt'); // Remove o token
    setIsLoggedIn(false); // Atualiza o estado de login
    router.push('/admin/login'); // Redireciona para a página de login
  };

  const handleLoginClick = () => {
    router.push('/admin/login'); // Redireciona para a página de login
  };

  return (
    <Navbar fluid rounded className="bg-[var(--accent-color)] text-[var(--background)] p-4 shadow-md">
      <NavbarBrand as={Link} href="/">
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Nexus Events</span>
      </NavbarBrand>

      <div className="flex md:order-2 items-center space-x-4"> {/* Container para o botão de login/logout */}
        {isLoggedIn ? (
          <>
            {/* O Link para o Dashboard pode continuar assim, pois é um Link simples */}
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
          // CORREÇÃO AQUI: Chamar router.push no onClick do botão
          <button
            onClick={handleLoginClick} // Usa a nova função para navegar
            className="bg-[var(--secondary-background)] text-white px-4 py-2 rounded-md hover:bg-[var(--secondary-accent)] transition-colors duration-300"
          >
            Login
          </button>
        )}
        <NavbarToggle /> {/* O toggle deve vir depois dos elementos extras no md:order-2 */}
      </div>

      <NavbarCollapse>
        {navLinks
          .sort((a, b) => (a.order || 0) - (b.order || 0)) // Ordena os links
          .map((link) => (
            <NavbarLink
              key={link.id}
              as={Link}
              href={link.path}
              className="text-[var(--background)] hover:text-[var(--secondary-accent)] dark:text-[var(--foreground)] dark:hover:text-[var(--secondary-accent)]"
            >
              {link.title}
            </NavbarLink>
          ))}
      </NavbarCollapse>
    </Navbar>
  );
}