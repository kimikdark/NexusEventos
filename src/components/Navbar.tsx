// src/components/Navbar.tsx
import NavbarClient from './NavbarClient';

// Remover a função getNavLinks, pois não será usada

export default async function Navbar() {
  // Apenas uma declaração de navLinks, com os valores hardcoded
  const navLinks = [
    { id: 2, title: 'Sobre nós', path: '/#about-us', order: 1 },
    { id: 3, title: 'Contacte-nos', path: '/contact', order: 2 },
    { id: 1, title: 'Próximos Eventos', path: '/events', order: 3 },
  ];

  // Opcional: ordenar se a ordem for importante e não estiver garantida
  navLinks.sort((a, b) => a.order - b.order);

  return <NavbarClient navLinks={navLinks} />;
}