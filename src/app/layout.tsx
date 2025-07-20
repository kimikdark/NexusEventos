// src/app/layout.tsx
import './globals.css';
import 'flowbite/dist/flowbite.min.css';
import { ThemeModeScript } from 'flowbite-react';
import AppNavbar from '../components/Navbar'; // Importa o seu Server Component Navbar
import AppFooter from '../components/Footer';

// Certifique-se que 'geist' está instalada no seu projeto
import { GeistSans } from 'geist/font/sans'; // Ou 'geist/font/mono', 'geist/font/serif'

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
    <html lang="pt" suppressHydrationWarning className={GeistSans.className}>
      <head>
        <ThemeModeScript />
      </head>
      <body className="flex flex-col min-h-screen">
        <AppNavbar /> {/* AppNavbar é um Server Component */}

        <main className="flex-grow container mx-auto px-8 py-8">
          {children}
        </main>

        <AppFooter />
      </body>
    </html>
  );
}