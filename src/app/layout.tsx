// src/app/layout.tsx
import './globals.css'; // Mantenha esta linha
import { ThemeModeScript } from 'flowbite-react'; // Para o Dark Mode

// Importa os teus componentes de Header e Footer
// Vamos criá-los ou reintroduzi-los logo abaixo
// Ex: import Navbar from '../components/Navbar';
// Ex: import Footer from '../components/Footer';

export const metadata = {
  title: 'Nexus Eventos', // O título da tua aplicação
  description: 'Gestão e listagem de eventos',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeModeScript /> {/* Essencial para o modo escuro */}
      </head>
      <body>
        {/* Aqui podes incluir o teu cabeçalho, se tiveres um componente */}
        {/* <Navbar /> */}

        <main className="min-h-screen">
          {children} {/* O conteúdo da tua página atual (home, contact, events) */}
        </main>

        {/* Aqui podes incluir o teu rodapé, se tiveres um componente */}
        {/* <Footer /> */}
      </body>
    </html>
  );
}