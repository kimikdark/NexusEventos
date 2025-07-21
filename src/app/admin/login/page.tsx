// src/app/admin/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Spinner } from 'flowbite-react'; // Mantenha o Spinner, pois é usado na UI

const STRAPI_URL = 'http://localhost:1337'; // Ajusta se o teu Strapi estiver noutro endereço

export default function AdminLoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    console.log('handleLogin: Botão de Entrar clicado.');

    try {
      console.log('handleLogin: A enviar requisição para Strapi...');
      const res = await fetch(`${STRAPI_URL}/api/auth/local`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await res.json();
      console.log('handleLogin: Resposta recebida do Strapi, status:', res.status);

      if (res.ok) {
        console.log('handleLogin: Login bem-sucedido. Dados recebidos:', data);
        if (typeof window !== 'undefined') {
          localStorage.setItem('jwt', data.jwt);
          localStorage.setItem('user', JSON.stringify(data.user)); // Armazena os dados do utilizador também
          console.log('handleLogin: JWT e user armazenados no localStorage.');
        }

        // Redireciona para o dashboard após login bem-sucedido
        console.log('handleLogin: Redirecionando para /admin/dashboard.');
        router.replace('/admin/dashboard'); // Use router.replace para evitar voltar para o login com o botão back
      } else {
        console.error('handleLogin: Falha no login:', data.error);
        setError(data.error?.message || 'Erro ao fazer login. Verifique as suas credenciais.');
      }
    } catch (err: any) {
      console.error('handleLogin: Erro de rede ou parsing durante o login:', err);
      setError(err.message || 'Ocorreu um erro de rede. Tente novamente.');
    } finally {
      setLoading(false);
      console.log('handleLogin: Processo de login concluído.');
    }
  };

  return (
    <section className="flex items-center justify-center min-h-screen bg-[var(--background)]">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-bold text-[var(--accent-color)] text-center mb-6">Login do Administrador</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="identifier" className="block text-sm font-medium text-gray-700">Email/Username:</label>
            <input
              type="text"
              id="identifier"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)] sm:text-sm text-gray-900"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)] sm:text-sm text-gray-900"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[var(--accent-color)] hover:bg-[var(--secondary-accent)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent-color)] transition duration-300 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Spinner size="sm" className="mr-2" />
                A Entrar...
              </>
            ) : (
              'Entrar'
            )}
          </button>
        </form>
      </div>
    </section>
  );
}