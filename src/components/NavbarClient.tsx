// src/components/NavbarClient.tsx
// CORREÇÃO AQUI: Importar os subcomponentes da Navbar diretamente
import { Navbar, NavbarBrand, NavbarToggle, NavbarCollapse, NavbarLink } from 'flowbite-react';
import Link from 'next/link'; // <--- GARANTE QUE ESTA IMPORTAÇÃO ESTÁ PRESENTE E CORRETA

interface NavLink {
    id: number;
    title: string;
    path: string;
    order?: number;
}

export default function NavbarClient({ navLinks }: { navLinks: NavLink[] }) {
  return (
    // Usa 'Navbar' diretamente agora, não 'FlowbiteNavbar'
    <Navbar fluid rounded className="bg-[var(--accent-color)] text-[var(--background)] p-4 shadow-md">
      {/* Usa 'NavbarBrand' diretamente */}
      <NavbarBrand as={Link} href="/">
        {/* <img src="/favicon.svg" className="mr-3 h-6 sm:h-9" alt="Flowbite React Logo" /> */}
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Nexus Events</span>
      </NavbarBrand>
      {/* Usa 'NavbarToggle' diretamente */}
      <NavbarToggle />
      {/* Usa 'NavbarCollapse' diretamente */}
      <NavbarCollapse>
        {navLinks
          .sort((a, b) => (a.order || 0) - (b.order || 0)) // Ordena os links
          .map((link) => (
            // Usa 'NavbarLink' diretamente
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