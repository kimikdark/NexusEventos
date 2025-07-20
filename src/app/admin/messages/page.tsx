// src/app/admin/messages/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Spinner } from 'flowbite-react'; // Removeu Table imports

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337';

interface MensagemContacto {
  id: number;
  attributes: {
    name: string;
    email: string;
    message: string;
    createdAt: string;
  };
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<MensagemContacto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    setError(null);
    const jwt = typeof window !== 'undefined' ? localStorage.getItem('jwt') : null;

    if (!jwt) {
      setError('Não autenticado. Por favor, faça login.');
      router.push('/admin/login');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${STRAPI_URL}/api/mensagem-de-contactos`, {
        headers: {
          'Authorization': `Bearer ${jwt}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("AdminMessagesPage: Erro da API ao buscar mensagens:", errorData);
        throw new Error(errorData.error?.message || `Erro HTTP: ${res.status} ${res.statusText}`);
      }

      const responseData = await res.json();
      console.log("Dados recebidos para AdminMessagesPage:", responseData);

      if (responseData.data && Array.isArray(responseData.data)) {
        setMessages(responseData.data as MensagemContacto[]);
      } else {
        setError("Formato de dados inesperado da API. O 'data' payload não é um array para mensagens.");
        setMessages([]);
      }

    } catch (err: any) {
      console.error('AdminMessagesPage: Falha ao carregar mensagens:', err);
      setError(err.message || 'Falha ao carregar mensagens.');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
        <span className="ml-2 text-xl text-white">A carregar mensagens...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 text-lg mt-8">
        <p>Erro: {error}</p>
        <Button onClick={() => router.push('/admin/login')} className="mt-4 bg-[var(--accent-color)] hover:bg-[var(--secondary-accent)] text-white">
          Ir para Login
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 bg-[var(--background)] min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6 text-center text-[var(--foreground)]">Mensagens de Contacto</h1>

      {messages.length === 0 && !loading && !error ? (
        <p className="text-center text-gray-400 text-xl mt-10">Não há mensagens para exibir.</p>
      ) : (
        <div className="overflow-x-auto">
          {/* USANDO TABELAS HTML NATIVAS */}
          <table className="min-w-full bg-[var(--secondary-background)] text-white border border-gray-700 rounded-lg">
            <thead>
              <tr className="bg-gray-700 text-white uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">ID</th>
                <th className="py-3 px-6 text-left">Nome</th>
                <th className="py-3 px-6 text-left">Email</th>
                <th className="py-3 px-6 text-left">Mensagem</th>
                <th className="py-3 px-6 text-left">Recebida Em</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {messages.map((msg) => (
                <tr key={msg.id} className="border-b border-gray-700 hover:bg-gray-800">
                  <td className="py-3 px-6 text-left whitespace-nowrap font-medium">{msg.id}</td>
                  <td className="py-3 px-6 text-left">{msg.attributes.name}</td>
                  <td className="py-3 px-6 text-left">{msg.attributes.email}</td>
                  <td className="py-3 px-6 text-left">{msg.attributes.message}</td>
                  <td className="py-3 px-6 text-left whitespace-nowrap text-sm">
                    {new Date(msg.attributes.createdAt).toLocaleDateString('pt-PT', {
                      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}