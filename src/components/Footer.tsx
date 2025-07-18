// src/components/Footer.tsx

import React from 'react';
// Não é necessário Link nem Image se não houver logo ou links na footer
// import Link from 'next/link';
// import Image from 'next/image'; 

export default function AppFooter() {
  return (
    // Reduzimos o padding (p-6) e o tamanho da fonte para torná-lo mais baixo
    <footer className="bg-[var(--accent-color)] text-white p-6 mt-auto shadow-inner">
      <div className="container mx-auto flex flex-col items-center justify-center text-center gap-2">
        {/* Nome da Empresa e Tagline */}
        <div>
          {/* Opcional: Adicionar um logotipo aqui se tiver. Exemplo: */}
          {/* <Image src="/images/logo-light.png" alt="Nexus Eventos Logo" width={100} height={30} className="mb-2" /> */}
          <h3 className="text-2xl font-bold">Nexus Eventos</h3> {/* Título um pouco menor */}
          <p className="text-sm opacity-90">
            Eventos que conectam e inspiram.
          </p>
        </div>

        {/* Direitos de Autor - Integrado diretamente para menor altura */}
        {/* A linha divisória é mais subtil e o texto ainda mais opaco */}
        <div className="text-center text-xs opacity-70 mt-4 pt-4 border-t border-white/[0.1]">
          &copy; {new Date().getFullYear()} Nexus Eventos. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}