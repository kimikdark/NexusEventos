// src/app/admin/layout.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';
import { Spinner } from 'flowbite-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // console.log('AdminLayout useEffect (Inicial) START at pathname:', pathname);

    const checkAuthentication = () => {
      if (typeof window !== 'undefined') {
        const jwt = localStorage.getItem('jwt');
        // console.log('AdminLayout checkAuthentication - JWT from localStorage (raw):', jwt ? 'Presente' : 'Ausente');
        const status = !!jwt;
        setIsAuthenticated(status);
        // console.log('AdminLayout checkAuthentication - isLoggedin (após verificar JWT e definir estado):', status);
      } else {
        setIsAuthenticated(null); // SSR inicial
      }
    };

    checkAuthentication();

    const handleStorageChange = () => {
      checkAuthentication();
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [pathname]);

  // useEffect para gerir os redirecionamentos APÓS a renderização
  useEffect(() => {
    if (isAuthenticated === null) {
      return; // Ainda a carregar ou a verificar
    }

    if (isAuthenticated === true) {
      // Se autenticado e na página de login, redireciona para o dashboard
      if (pathname === '/admin/login') {
        // console.log('AdminLayout useEffect (Redirecionamento) - AUTENTICADO e na página de login. Redirecionando para dashboard.');
        router.replace('/admin/dashboard');
      }
    } else { // isAuthenticated === false
      // Se não autenticado e NÃO ESTÁ na página de login, redireciona para login
      if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
        // console.log('AdminLayout useEffect (Redirecionamento) - NÃO AUTENTICADO e em rota PROTEGIDA. Redirecionando para /admin/login.');
        router.replace('/admin/login');
      }
    }
  }, [isAuthenticated, pathname, router]);


  // Função de logout
  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('jwt');
      localStorage.removeItem('user');
      // console.log('AdminLayout handleLogout: JWT e user removidos do localStorage.');
    }
    setIsAuthenticated(false);
    router.replace('/admin/login');
    // console.log('AdminLayout handleLogout: Redirecionando para /admin/login.');
  };

  // ---------------- Lógica de Renderização ----------------

  // 1. Enquanto a autenticação está a ser verificada
  if (isAuthenticated === null) {
    // console.log('AdminLayout Render - ESTADO: LOADING ou NULL. Mostrando spinner.');
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--background)]">
        <Spinner size="xl" />
        <p className="ml-4 text-[var(--foreground)] text-lg">A verificar autenticação...</p>
      </div>
    );
  }

  // 2. Se NÃO AUTENTICADO
  if (isAuthenticated === false) {
    // Renderiza o children (o formulário de login) APENAS se estiver na rota de login
    if (pathname === '/admin/login') {
      // console.log('AdminLayout Render - ESTADO: NÃO AUTENTICADO e em /admin/login. Renderizando formulário.');
      return (
        <div className="admin-layout flex justify-center items-center min-h-screen bg-[var(--background)] text-[var(--foreground)]">
          {children} {/* Aqui o Login/page.tsx é renderizado */}
        </div>
      );
    } else {
      // Se não está na página de login e não está autenticado, assume que está a ser redirecionado
      // console.log('AdminLayout Render - ESTADO: NÃO AUTENTICADO e em rota PROTEGIDA (não login). Mostrando spinner de redirecionamento.');
      return (
        <div className="flex items-center justify-center min-h-screen bg-[var(--background)]">
            <Spinner size="xl" />
            <p className="ml-4 text-[var(--foreground)] text-lg">A redirecionar para o login...</p>
        </div>
      );
    }
  }

  // 3. Se AUTENTICADO
  // Se está autenticado, sempre renderiza o layout completo com a sidebar e o children
  // A exceção é se ele ainda está no /admin/login e precisa redirecionar para o dashboard.
  if (isAuthenticated === true) {
      if (pathname === '/admin/login') {
          // Já está autenticado mas ainda está na página de login, mostra spinner enquanto redireciona
          // console.log('AdminLayout Render - ESTADO: AUTENTICADO e na página de login. Mostrando spinner de redirecionamento para dashboard.');
          return (
              <div className="flex items-center justify-center min-h-screen bg-[var(--background)]">
                  <Spinner size="xl" />
                  <p className="ml-4 text-[var(--foreground)] text-lg">A redirecionar para o dashboard...</p>
              </div>
          );
      } else {
          // Autenticado e em rota admin, renderiza o layout principal
          // console.log('AdminLayout Render - ESTADO: AUTENTICADO. Renderizando layout admin completo.');
          return (
              <div className="flex min-h-screen bg-[var(--background)] text-[var(--foreground)]">
                  <AdminSidebar onLogout={handleLogout} />
                  <main className="flex-grow p-8">
                      {children} {/* Aqui o Dashboard/page.tsx (ou outros) é renderizado */}
                  </main>
              </div>
          );
      }
  }

  // Fallback (não deve ser alcançado)
  return null;
}