// src/components/AdminSidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface AdminSidebarProps {
  onLogout: () => void; // A prop que o AdminLayout está a passar
}

export default function AdminSidebar({ onLogout }: AdminSidebarProps) {
  const pathname = usePathname();

  const getLinkClasses = (path: string) => {
    // Verifica se o caminho atual corresponde ao link, ou se é um prefixo para rotas aninhadas
    const isActive = pathname === path || (path !== '/admin/dashboard' && pathname.startsWith(path));
    return `
      flex items-center p-2 text-white rounded-lg text-lg
      ${isActive ? 'bg-gray-700 font-bold' : 'hover:bg-gray-700'}
      transition-colors duration-200
    `;
  };

  return (
    <nav className="w-64 flex-shrink-0 bg-gray-800 text-white p-4">
      <ul className="space-y-2">
        {/* Dashboard Link */}
        <li>
          <Link href="/admin/dashboard" className={getLinkClasses('/admin/dashboard')}>
            Dashboard
          </Link>
        </li>

        {/* Events Link */}
        <li>
          <Link href="/admin/events" className={getLinkClasses('/admin/events')}>
            Eventos
          </Link>
        </li>

        {/* Inscriptions Link */}
        <li>
          <Link href="/admin/inscriptions" className={getLinkClasses('/admin/inscriptions')}>
            Inscrições
          </Link>
        </li>

        {/* Messages Link */}
        <li>
          <Link href="/admin/messages" className={getLinkClasses('/admin/messages')}>
            Mensagens
          </Link>
        </li>

        {/* Botão de Logout */}
        <li>
          <button
            onClick={onLogout} // Chama a prop onLogout fornecida pelo AdminLayout
            className="w-full text-left flex items-center p-2 text-white hover:bg-red-700 rounded-lg text-lg transition-colors duration-200 mt-auto" // mt-auto para empurrar para o fundo
          >
            Sair
          </button>
        </li>
      </ul>
    </nav>
  );
}