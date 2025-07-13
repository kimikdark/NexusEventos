// src/components/NavbarClient.tsx
// Este é o teu Client Component da Navbar
'use client'; // <-- MUITO IMPORTANTE: tem de ser a primeira linha!

import {
  Navbar,
  DarkThemeToggle,
  NavbarBrand,
  NavbarToggle,
  NavbarCollapse,
  NavbarLink
} from 'flowbite-react';
import Link from 'next/link';
import Image from 'next/image'; // <-- Importa o componente Image do Next.js

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
  return (
    <Navbar fluid rounded className="py-4 bg-primary-brand dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <NavbarBrand
        as={Link}
        href="/"
      >
        <Image
          src="/nexuseventos.png" // Caminho para o teu logótipo na pasta public
          alt="Nexus Eventos Logo"
          width={32} // Define uma largura para o logótipo (ajusta conforme necessário)
          height={32} // Define uma altura para o logótipo (ajusta conforme necessário)
          className="mr-3 h-6 sm:h-9" // Classes Tailwind para tamanho e margem
        />
        <span className="self-center whitespace-nowrap text-xl font-semibold text-white dark:text-white">
          Nexus Eventos
        </span>
      </NavbarBrand>
      <div className="flex md:order-2 items-center space-x-3">
        <DarkThemeToggle className="text-white dark:text-gray-400 hover:bg-primary-brand/80 dark:hover:bg-gray-700" />
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
              active={window.location.pathname === link.path}
              className="text-white md:hover:text-accent-brand dark:text-gray-300 dark:hover:text-white md:dark:hover:bg-transparent"
            >
              {link.title}
            </NavbarLink>
          ))}
      </NavbarCollapse>
    </Navbar>
  );
}