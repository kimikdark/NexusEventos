// src/app/admin/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const STRAPI_URL = 'http://localhost:1337'; // Ajusta se o teu Strapi estiver noutro endereço

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${STRAPI_URL}/api/auth/local`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier: email, // O Strapi usa 'identifier' para email/username
          password: password,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error('Erro de login:', errorData);
        setError(errorData.error?.message || 'Credenciais inválidas.');
        setLoading(false);
        return;
      }

      const data = await res.json();
      localStorage.setItem('jwt', data.jwt); // Armazena o JWT
      localStorage.setItem('user', JSON.stringify(data.user)); // Armazena os dados do utilizador
      setLoading(false);
      router.push('/admin/dashboard'); // Redireciona para o dashboard após o login

    } catch (err: any) {
      console.error('Erro de rede ou desconhecido:', err);
      setError(err.message || 'Ocorreu um erro. Tente novamente.');
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="bg-[var(--secondary-background)] p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">Login do Administrador</h1>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)] bg-gray-800 text-white placeholder-gray-400"
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)] bg-gray-800 text-white placeholder-gray-400"
              disabled={loading}
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[var(--accent-color)] hover:bg-[var(--secondary-accent)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent-color)] transition duration-300 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'A Entrar...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}