// src/components/Navbar.tsx
// Este é o teu Server Component da Navbar
import NavbarClient from './NavbarClient';

export default async function Navbar() {
  
  const navLinks = [
    { id: 2, title: 'Sobre nós', path: '/#about-us', order: 1 }, // Novo link com âncora para a secção "Sobre nós"
    { id: 3, title: 'Contacte-nos', path: '/contact', order: 2 }, // Link existente para a página de contacto
    { id: 1, title: 'Próximos Eventos', path: '/events', order: 3 }, // "Home" muda de nome para "Próximos Eventos" e aponta para a raiz

  ];

  return <NavbarClient navLinks={navLinks} />; // Passa a prop navLinks para o Client Component
}