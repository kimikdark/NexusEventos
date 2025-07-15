// src/components/AdminSidebar.tsx
'use client'; // Essencial se este componente usar hooks ou for interativo

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation'; // Importar usePathname e useRouter para destacar o link ativo e redirecionar

export default function AdminSidebar() {
  const pathname = usePathname(); // Hook para obter o caminho atual
  const router = useRouter();

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('jwt'); // Remove o token JWT
      localStorage.removeItem('user'); // Remove info do usuário, se houver
    }
    router.push('/admin/login'); // Redireciona para a página de login
  };

  const linkClasses = (path: string) =>
    `flex items-center px-4 py-2 rounded-md transition-colors duration-200 ${
      pathname === path
        ? 'bg-[var(--accent-color)] text-white font-semibold' // Classe para link ativo
        : 'text-gray-300 hover:bg-gray-700 hover:text-white' // Classe para link inativo
    }`;

  return (
    <aside className="w-64 bg-[var(--secondary-background)] text-white p-6 flex flex-col">
      <div className="text-2xl font-bold mb-8 text-[var(--accent-color)]">Admin Dashboard</div>
      <nav className="flex-grow">
        <ul className="space-y-2">
          <li>
            <Link href="/admin/dashboard" passHref legacyBehavior>
              <a className={linkClasses('/admin/dashboard')}>
                Dashboard
              </a>
            </Link>
          </li>
          <li>
            <Link href="/admin/events" passHref legacyBehavior>
              <a className={linkClasses('/admin/events')}>
                Gerir Eventos
              </a>
            </Link>
          </li>
          {/* NOVO LINK AQUI: */}
          <li>
            <Link href="/admin/inscriptions" passHref legacyBehavior>
              <a className={linkClasses('/admin/inscriptions')}>
                Ver Inscrições
              </a>
            </Link>
          </li>
        </ul>
      </nav>
      <div className="mt-auto"> {/* Empurra o botão Sair para o fundo */}
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 text-white font-bold py-2 px-4 rounded-md hover:bg-red-700 transition-colors duration-200"
        >
          Sair
        </button>
      </div>
    </aside>
  );
}