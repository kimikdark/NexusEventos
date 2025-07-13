// src/components/Footer.tsx
'use client';

import {
  Footer,
  FooterBrand,
  FooterLinkGroup,
  FooterLink,
  FooterDivider,
  FooterCopyright
} from 'flowbite-react';
import Link from 'next/link';

export default function AppFooter() {
  return (
    <Footer container className="mt-auto bg-gray-900 dark:bg-gray-900 text-white dark:text-gray-300 p-6">
      <div className="w-full text-center">
        <div className="w-full justify-between sm:flex sm:items-center sm:justify-between">
          {/* CORREÇÃO AQUI: ADICIONAMOS A PROPRIEDADE 'src' */}
          <FooterBrand
            href="/"
            src="https://flowbite.com/docs-assets/logo.svg" // <-- ADICIONA ESTA LINHA COM O URL DE UM LOGÓTIPO
            alt="Nexus Eventos Logo" // É boa prática adicionar um alt text
            name="Nexus Eventos"
            className="text-white"
          >
            {/* O texto "Nexus Eventos" aqui pode ser o nome visível ao lado do logótipo */}
            <span className="self-center whitespace-nowrap text-xl font-semibold text-white">
              Nexus Eventos
            </span>
          </FooterBrand>
          <FooterLinkGroup className="flex flex-wrap items-center mt-3 text-sm font-medium text-white dark:text-gray-300 sm:mt-0">
            <FooterLink as={Link} href="#">
              Sobre
            </FooterLink>
            <FooterLink as={Link} href="#" className="ml-4">
              Política de Privacidade
            </FooterLink>
            <FooterLink as={Link} href="#" className="ml-4">
              Termos & Condições
            </FooterLink>
            <FooterLink as={Link} href="/contact" className="ml-4">
              Contacto
            </FooterLink>
          </FooterLinkGroup>
        </div>
        <FooterDivider />
        <FooterCopyright href="#" by="Nexus Eventos™" year={new Date().getFullYear()} className="text-white" />
      </div>
    </Footer>
  );
}