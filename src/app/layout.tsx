// src/app/layout.tsx
import './globals.css';
import { ThemeModeScript } from 'flowbite-react';

// Garante que estas linhas estão corretas:
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
        {/* E estas linhas aqui também: */}
        <AppNavbar />

        <main className="flex-grow container mx-auto px-4 py-8">
          {children}
        </main>

        <AppFooter />
      </body>
    </html>
  );
}