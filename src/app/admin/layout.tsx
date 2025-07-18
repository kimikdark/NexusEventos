// src/app/admin/layout.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Start as true to always run initial check

  // Log values during each render pass to debug state propagation
  console.log('AdminLayout Render - pathname:', pathname, 'isAuthenticated:', isAuthenticated, 'loading:', loading);

  useEffect(() => {
    console.log('AdminLayout useEffect START at pathname:', pathname);
    // Reset loading to true on every pathname change, to re-evaluate auth status for the new path
    setLoading(true); 

    let jwt = null;
    if (typeof window !== 'undefined') {
        jwt = localStorage.getItem('jwt');
        console.log('AdminLayout useEffect - JWT from localStorage:', jwt);
    }
    
    const isLoggedIn = !!jwt;

    // Update authentication state
    setIsAuthenticated(isLoggedIn); 
    setLoading(false); // Mark authentication check as complete for this pathname

    console.log('AdminLayout useEffect - isLoggedIn (após verificar JWT e definir estado):', isLoggedIn);
    console.log('AdminLayout useEffect - pathname.startsWith("/admin"):', pathname.startsWith('/admin'));
    console.log('AdminLayout useEffect - pathname !== "/admin/login":', pathname !== '/admin/login');

    // Conditional redirection logic
    if (isLoggedIn && pathname === '/admin/login') {
      console.log('AdminLayout useEffect - Condição de redirecionamento ativada: Autenticado e na página de login, redirecionando para /admin/dashboard.');
      router.replace('/admin/dashboard'); 
    } else if (!isLoggedIn && pathname.startsWith('/admin') && pathname !== '/admin/login') {
      console.log('AdminLayout useEffect - Condição de redirecionamento ativada: Não autenticado e a tentar aceder rota protegida, redirecionando para /admin/login.');
      router.replace('/admin/login');
    }

    console.log('AdminLayout useEffect END.');
  }, [router, pathname]); // Depend on router and pathname for re-evaluation

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    router.replace('/admin/login'); 
  };

  // --- Rendering Logic ---

  // 1. If currently on the login page, render only its content without the admin layout.
  if (pathname === '/admin/login') {
    console.log('AdminLayout Render - Estamos na página de login, renderizando apenas o conteúdo da página.');
    return (
      <div className="admin-layout flex min-h-screen bg-[var(--background)]">
        {children} 
      </div>
    );
  }

  // 2. While authentication check is in progress, show loading state.
  if (loading) {
    console.log('AdminLayout Render - "loading" é true. Mostrando estado de verificação...');
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] text-[var(--foreground)]">
        A verificar autenticação...
      </div>
    );
  }

  // 3. If authentication check is complete (loading is false) AND NOT authenticated.
  if (!isAuthenticated) {
    console.log('AdminLayout Render - "loading" é false, mas "isAuthenticated" é false. Deveria ter redirecionado via useEffect. Retornando null.');
    return null; 
  }

  // 4. If authentication check is complete AND authenticated, render the full admin layout.
  console.log('AdminLayout Render - "loading" é false e "isAuthenticated" é true. Renderizando layout completo do admin.');
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
        {children} 
      </main>
    </div>
  );
}