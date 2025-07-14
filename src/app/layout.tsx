// src/app/layout.tsx
import './globals.css';
import 'flowbite/dist/flowbite.min.css';
import { ThemeModeScript } from 'flowbite-react';

import AppNavbar from '../components/Navbar';
import AppFooter from '../components/Footer';

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
    <html lang="pt" suppressHydrationWarning>
      <head>
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