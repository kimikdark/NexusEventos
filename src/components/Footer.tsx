// src/components/Footer.tsx

import React from 'react';
import Link from 'next/link';

export default function AppFooter() {
  return (
    // Certifica-te que as classes de cor estão assim no elemento <footer>
    <footer className="bg-[var(--accent-color)] text-white p-8 mt-auto shadow-inner">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Coluna 1: Informações da Empresa / Logo */}
        <div>
          <h3 className="text-2xl font-bold mb-4">Nexus Eventos</h3>
          <p className="text-sm">A sua plataforma para gerir e descobrir eventos incríveis.</p>
        </div>

        {/* Coluna 2: Navegação */}
        <div>
          <h3 className="text-2xl font-bold mb-4">Navegação</h3>
          <ul className="space-y-2">
            <li><Link href="/" className="hover:text-[var(--secondary-accent)] transition duration-200">Home</Link></li>
            <li><Link href="/events" className="hover:text-[var(--secondary-accent)] transition duration-200">Eventos</Link></li>
            <li><Link href="/contact" className="hover:text-[var(--secondary-accent)] transition duration-200">Contacte-nos</Link></li>
          </ul>
        </div>

        {/* Coluna 3: Redes Sociais ou Outro Conteúdo */}
        <div>
          <h3 className="text-2xl font-bold mb-4">Redes Sociais</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-[var(--secondary-accent)] transition duration-200">Facebook</a></li>
            <li><a href="#" className="hover:text-[var(--secondary-accent)] transition duration-200">Instagram</a></li>
          </ul>
        </div>
      </div>
      <div className="text-center text-sm mt-8 pt-4 border-t border-white/[0.2]"> {/* Alterado para border-white para consistência */}
        &copy; {new Date().getFullYear()} Nexus Eventos. Todos os direitos reservados.
      </div>
    </footer>
  );
}