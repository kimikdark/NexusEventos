// src/app/admin/login/page.tsx
'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const STRAPI_URL = 'http://localhost:1337'; // Confirma que esta URL está correta

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); // Impede o recarregamento padrão da página
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`${STRAPI_URL}/api/auth/local`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier: email, // Strapi espera 'identifier' para email/username
          password: password,
        }),
      });

      const data = await res.json();
      console.log("Resposta da API de Login:", data); // IMPORTANTE: Verifica este log na consola

      if (!res.ok) {
        // Se a resposta não for OK (status 4xx ou 5xx), é um erro
        console.error("Erro no login:", data);
        setError(data.error?.message || 'Erro ao fazer login. Verifique as suas credenciais.');
        // Se for um erro de credenciais, o Strapi geralmente retorna 400 Bad Request
        // e a mensagem em data.error.message
        return; // Sai da função para não prosseguir
      }

      // Login bem-sucedido
      if (data.jwt) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('jwt', data.jwt);
          localStorage.setItem('user', JSON.stringify(data.user)); // Armazena info do utilizador se necessário
        }
        router.push('/admin/dashboard'); // Redireciona para o dashboard
      } else {
        setError('Resposta inesperada da API. Token JWT não encontrado.');
      }
    } catch (err: any) {
      console.error('Falha na conexão ou erro inesperado:', err);
      setError(err.message || 'Ocorreu um erro. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)] p-4">
      <div className="w-full max-w-md rounded-lg bg-[var(--secondary-background)] p-8 shadow-lg">
        <h1 className="mb-6 text-center text-3xl font-bold text-[var(--foreground)]">Login do Administrador</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 sr-only">Email:</label>
            <input
              type="email"
              id="email"
              placeholder="Email:"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-3 text-gray-900 shadow-sm focus:border-[var(--accent-color)] focus:ring-[var(--accent-color)]"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 sr-only">Password:</label>
            <input
              type="password"
              id="password"
              placeholder="Password:"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-3 text-gray-900 shadow-sm focus:border-[var(--accent-color)] focus:ring-[var(--accent-color)]"
            />
          </div>
          {error && (
            <p className="text-center text-sm text-red-500">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-[var(--accent-color)] py-3 px-4 text-center font-medium text-white shadow-sm hover:bg-[var(--secondary-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'A Entrar...' : 'Entrar'}
          </button>
        </form>
        {/* Opcional: Link para registo, se tiveres permissão para auto-registo de admins */}
        {/* <p className="mt-6 text-center text-sm text-gray-500">
          Não tem uma conta?{' '}
          <Link href="/admin/register" className="font-medium text-[var(--accent-color)] hover:underline">
            Registar-se
          </Link>
        </p> */}
      </div>
    </div>
  );
}