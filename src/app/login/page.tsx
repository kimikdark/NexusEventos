// src/app/login/page.tsx
'use client'; // Indicação para o Next.js que é um Client Component

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Hook para redirecionamento no Next.js 13+

// Definir a URL base do teu Strapi API
const STRAPI_URL = 'http://localhost:1337'; // Ajusta se o teu Strapi estiver noutro endereço

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null); // Estado para mensagens de erro
  const [loading, setLoading] = useState(false); // Estado para feedback de carregamento
  const router = useRouter(); // Instância do router para navegação

  // Função para lidar com o envio do formulário de login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Previne o comportamento padrão de recarregar a página
    setLoading(true); // Ativa o estado de carregamento
    setError(null); // Limpa erros anteriores

    try {
      // Faz a requisição POST para a API de autenticação local do Strapi
      const res = await fetch(`${STRAPI_URL}/api/auth/local`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier: email, password }), // Envia email (identificador) e password
      });

      const data = await res.json(); // Converte a resposta para JSON

      if (res.ok) {
        // Se a resposta HTTP for bem-sucedida (status 2xx)
        console.log('Login bem-sucedido:', data);
        // Armazenar o token JWT (JSON Web Token) no localStorage para futuras requisições autenticadas
        localStorage.setItem('jwt', data.jwt);
        // Opcional: armazenar informações do utilizador, se necessário
        localStorage.setItem('user', JSON.stringify(data.user));

        // Redirecionar o utilizador para a área de administração (vamos criar esta rota a seguir)
        router.push('/admin/dashboard');
      } else {
        // Se a resposta HTTP indicar um erro (status 4xx, 5xx)
        console.error('Falha no login:', data.error);
        // Exibe a mensagem de erro fornecida pelo Strapi, ou uma mensagem genérica
        setError(data.error?.message || 'Erro ao fazer login. Verifique as suas credenciais.');
      }
    } catch (err) {
      // Lida com erros de rede ou outros erros inesperados
      console.error('Erro de rede ou parsing durante o login:', err);
      setError('Ocorreu um erro de rede. Tente novamente.');
    } finally {
      setLoading(false); // Desativa o estado de carregamento
    }
  };

  return (
    <section className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-[var(--background)]">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-bold text-[var(--foreground)] text-center mb-6">Login do Administrador</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
          {/* Exibe mensagens de erro, se houver */}
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading} // Desativa o botão enquanto a requisição está a ocorrer
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[var(--accent-color)] hover:bg-[var(--secondary-accent)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent-color)] transition duration-300 disabled:opacity-50"
          >
            {loading ? 'A Entrar...' : 'Entrar'} {/* Feedback visual para o utilizador */}
          </button>
        </form>
      </div>
    </section>
  );
}