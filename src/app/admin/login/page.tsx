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

  console.log('Tentando login com Email:', email); // Adiciona esta linha
  console.log('Tentando login com Password:', password ? '********' : 'Vazio'); // Adiciona esta linha (esconde a password por segurança)

  try {
    const res = await fetch(`${STRAPI_URL}/api/auth/local`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        identifier: email,
        password: password,
      }),
    });
    
      // Se a resposta NÃO for OK (por exemplo, 400, 401, 500)
      if (!res.ok) {
        // Tenta ler a resposta como texto primeiro para depuração profunda
        const errorText = await res.text();
        console.error('Erro de login (resposta RAW - não OK):', errorText); // Loga a resposta bruta para depuração

        try {
            // Tenta fazer parse do texto como JSON. Se for vazio ou inválido, resultará em {}.
            const errorData = errorText ? JSON.parse(errorText) : {};
            let errorMessage = 'Credenciais inválidas ou erro desconhecido.'; // Mensagem de fallback

            // Tenta extrair a mensagem de erro da estrutura comum do Strapi
            if (errorData && typeof errorData === 'object' && 'error' in errorData) {
                if (errorData.error && typeof errorData.error === 'object' && 'message' in errorData.error) {
                    errorMessage = errorData.error.message;
                } else if ('message' in errorData) { // Alguns erros do Strapi podem ter 'message' diretamente no root
                    errorMessage = errorData.message;
                }
            }
            setError(errorMessage);
        } catch (jsonParseError) {
            // Se falhar ao fazer parse do JSON, é um erro inesperado no formato da resposta
            console.error('Erro ao fazer parse da resposta de erro como JSON:', jsonParseError);
            setError('Ocorreu um erro inesperado ao processar a resposta do servidor (formato inválido).');
        }

        setLoading(false);
        return; // Sai da função, pois houve um erro de autenticação
      }

      // Se a resposta for OK (status 200), processa a resposta de sucesso
      const data = await res.json();
      localStorage.setItem('jwt', data.jwt); // Armazena o JWT no localStorage
      localStorage.setItem('user', JSON.stringify(data.user)); // Armazena os dados do utilizador

      setLoading(false);
      console.log('Login bem-sucedido. Redirecionando para /admin/dashboard...'); // Para depuração
      router.push('/admin/dashboard'); // Redireciona para o dashboard

    } catch (err: any) {
      // Captura erros de rede (ex: servidor Strapi não acessível) ou JSON inválido após um res.ok
      console.error('Erro de rede ou desconhecido (catch geral):', err);
      if (err instanceof SyntaxError) {
          setError('Ocorreu um erro ao processar a resposta do servidor (JSON inválido na resposta de sucesso).');
      } else {
          setError(err.message || 'Ocorreu um erro inesperado. Tente novamente.');
      }
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