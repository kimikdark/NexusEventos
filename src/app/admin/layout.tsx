// src/app/admin/layout.tsx
'use client'; // Indicação para o Next.js que é um Client Component

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Para redirecionar
import Link from 'next/link'; // Para navegação dentro da área admin

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Estado de autenticação
  const [loading, setLoading] = useState(true); // Estado de carregamento da autenticação

  useEffect(() => {
    // Esta função é executada apenas no lado do cliente
    const jwt = localStorage.getItem('jwt'); // Tenta obter o token JWT do localStorage

    if (jwt) {
      // Se o JWT existe, assumimos que o utilizador está autenticado.
      // Em um sistema real, seria prudente fazer uma chamada a uma API protegida
      // (ex: /api/users/me) para validar o JWT no backend e verificar se não expirou.
      setIsAuthenticated(true);
    } else {
      // Se não houver JWT, o utilizador não está autenticado, redireciona para a página de login
      router.push('/login');
    }
    setLoading(false); // Finaliza o estado de carregamento
  }, [router]); // Dependência do `router` garante que o efeito re-executa se o objeto router mudar (raro)

  // Função para lidar com o logout
  const handleLogout = () => {
    localStorage.removeItem('jwt'); // Remove o token JWT
    localStorage.removeItem('user'); // Remove quaisquer informações de utilizador armazenadas
    setIsAuthenticated(false); // Atualiza o estado de autenticação
    router.push('/login'); // Redireciona para a página de login
  };

  // Exibe um estado de carregamento enquanto verifica a autenticação
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] text-[var(--foreground)]">
        A verificar autenticação...
      </div>
    );
  }

  // Se não estiver autenticado após o carregamento (e já foi redirecionado), não renderiza nada temporariamente
  if (!isAuthenticated) {
    return null;
  }

  // Se estiver autenticado, renderiza o layout da administração com o conteúdo filho
  return (
    <div className="admin-layout flex min-h-screen bg-[var(--background)]">
      {/* Sidebar de Navegação da Administração */}
      <aside className="w-64 bg-gray-800 text-white p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-8">Admin Dashboard</h2>
        <nav>
          <ul>
            <li className="mb-4">
              <Link href="/admin/dashboard" className="block text-lg hover:text-[var(--accent-color)] transition duration-200">
                Dashboard
              </Link>
            </li>
            <li className="mb-4">
              <Link href="/admin/events" className="block text-lg hover:text-[var(--accent-color)] transition duration-200">
                Gerir Eventos
              </Link>
            </li>
            <li className="mb-4">
              <Link href="/admin/inscriptions" className="block text-lg hover:text-[var(--accent-color)] transition duration-200">
                Ver Inscrições
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="w-full text-left py-2 px-3 text-lg bg-red-600 hover:bg-red-700 rounded transition duration-200"
              >
                Sair
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Conteúdo Principal da Administração */}
      <main className="flex-1 p-8">
        {children} {/* Aqui serão renderizadas as páginas aninhadas (ex: dashboard, gerir eventos) */}
      </main>
    </div>
  );
}