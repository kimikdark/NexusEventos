// src/components/Navbar.tsx
'use client'; // Necessário para usar componentes interativos do Flowbite React no App Router

import { Navbar, DarkThemeToggle } from 'flowbite-react';
import Link from 'next/link';

export default function AppNavbar() {
  return (
    <Navbar fluid rounded className="py-4 bg-primary-brand dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <Navbar.Brand as={Link} href="/">
        <span className="self-center whitespace-nowrap text-xl font-semibold text-white dark:text-white">
          Nexus Eventos
        </span>
      </Navbar.Brand>
      <div className="flex md:order-2 items-center space-x-3">
        <DarkThemeToggle className="text-white dark:text-gray-400 hover:bg-primary-brand/80 dark:hover:bg-gray-700" />
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link as={Link} href="/" active className="text-white md:hover:text-accent-brand dark:text-gray-300 dark:hover:text-white md:dark:hover:bg-transparent">
          Home
        </Navbar.Link>
        <Navbar.Link as={Link} href="/events" className="text-white md:hover:text-accent-brand dark:text-gray-300 dark:hover:text-white md:dark:hover:bg-transparent">
          Eventos
        </Navbar.Link>
        <Navbar.Link as={Link} href="/contact" className="text-white md:hover:text-accent-brand dark:text-gray-300 dark:hover:text-white md:dark:hover:bg-transparent">
          Contacto
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}