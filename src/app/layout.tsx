// src/app/layout.tsx
import './globals.css';
import 'flowbite/dist/flowbite.min.css';
import { ThemeModeScript } from 'flowbite-react';
import AppNavbar from '../components/Navbar';
import AppFooter from '../components/Footer';

// IMPORTAÇÃO DA FONTE GEIST
// Se estás a usar a fonte Geist, precisas de importá-la do pacote 'geist/font'
// e aplicá-la à tag <html>. Se não estás a usar Geist, podes remover esta linha.
import { GeistSans } from 'geist/font/sans'; // Ou 'geist/font/mono', 'geist/font/serif' dependendo da que queres usar

export const metadata = {
  title: 'Nexus Eventos',
  description: 'Gestão e listagem de eventos',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Aplica a classe da fonte GeistSans aqui.
    // O suppressHydrationWarning é bom para temas e fontes para evitar avisos durante a hidratação.
    <html lang="pt" suppressHydrationWarning className={GeistSans.className}>
      <head>
        {/* ThemeModeScript para Flowbite React, antes do <body> */}
        <ThemeModeScript />
      </head>
      <body className="flex flex-col min-h-screen">
        <AppNavbar />

        {/* ALTERADO: px-4 para px-8 para mais espaçamento lateral */}
        <main className="flex-grow container mx-auto px-8 py-8">
          {children}
        </main>

        <AppFooter />
      </body>
    </html>
  );
}