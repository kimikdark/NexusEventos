// src/components/Footer.tsx
'use client'; // <-- MUITO IMPORTANTE: tem de ser a primeira linha!

import { Footer } from 'flowbite-react';
import Link from 'next/link';

export default function AppFooter() {
  return (
    <Footer container className="mt-auto bg-gray-900 dark:bg-gray-900 text-white dark:text-gray-300 p-6">
      <div className="w-full text-center">
        <div className="w-full justify-between sm:flex sm:items-center sm:justify-between">
          <Footer.Brand
            as={Link}
            href="/"
            name="Nexus Eventos"
            className="text-white"
          >
            <span className="text-xl font-semibold whitespace-nowrap text-white">
              Nexus Eventos
            </span>
          </Footer.Brand>
          <Footer.LinkGroup className="flex flex-wrap items-center mt-3 text-sm font-medium text-white dark:text-gray-300 sm:mt-0">
            <Footer.Link as={Link} href="#">
              Sobre
            </Footer.Link>
            <Footer.Link as={Link} href="#" className="ml-4">
              Política de Privacidade
            </Footer.Link>
            <Footer.Link as={Link} href="#" className="ml-4">
              Termos & Condições
            </Footer.Link>
            <Footer.Link as={Link} href="/contact" className="ml-4">
              Contacto
            </Footer.Link>
          </Footer.LinkGroup>
        </div>
        <Footer.Divider />
        <Footer.Copyright href="#" by="Nexus Eventos™" year={new Date().getFullYear()} className="text-white" />
      </div>
    </Footer>
  );
}