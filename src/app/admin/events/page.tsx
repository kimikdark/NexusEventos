// src/app/admin/events/page.tsx
'use client'; // MUITO IMPORTANTE: Garante que este componente é renderizado no cliente.

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Para redirecionar para outras páginas de admin

// Definir a URL base do teu Strapi API
const STRAPI_URL = 'http://localhost:1337';

// Interfaces para os dados dos eventos
interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  imageUrl: string; // URL completa da imagem para exibição
  totalVagas: number;
  vagasOcupadas: number;
  status: 'draft' | 'published' | 'cancelled' | 'completed'; // Adicionei 'status' para gestão
}

// Interface para o formato da resposta da API do Strapi (listagem)
interface StrapiResponse {
  data: Array<{
    id: number;
    title: string;
    description: string;
    date: string;
    location: string;
    totalVagas?: number;
    vagasOcupadas?: number;
    // ... outros campos diretos do teu Strapi Evento ...
    image?: { // A imagem aninhada, como tens configurado
      url: string;
    };
    status?: string; // Adicionado status para correspondência
  }>;
  meta: any;
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Função para buscar eventos do Strapi (autenticada)
  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    const jwt = localStorage.getItem('jwt'); // Obtém o JWT armazenado

    if (!jwt) {
      setError('Não autenticado. Por favor, faça login.');
      setLoading(false);
      router.push('/login');
      return;
    }

    try {
      const res = await fetch(`${STRAPI_URL}/api/eventos?populate=*`, {
        headers: {
          'Authorization': `Bearer ${jwt}`, // Envia o JWT no cabeçalho Authorization
          'Content-Type': 'application/json',
        },
        cache: 'no-store', // Sempre busca os dados mais recentes
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error?.message || `Erro HTTP: ${res.status} ${res.statusText}`);
      }

      const apiResponse: StrapiResponse = await res.json();
      console.log("Dados de eventos recebidos para admin:", apiResponse);

      if (!Array.isArray(apiResponse.data)) {
        throw new Error('Formato de dados inesperado da API.');
      }

      // Mapeia os dados brutos do Strapi para o formato 'Event'
      const mappedEvents: Event[] = apiResponse.data.map(item => {
        const imageUrl = item.image?.url
          ? `${STRAPI_URL}${item.image.url}`
          : '/images/default-event.jpg'; // Imagem de fallback

        return {
          id: item.id,
          title: item.title || 'Evento sem título',
          description: item.description || 'Sem descrição.',
          date: item.date || 'Data não definida',
          location: item.location || 'Local não definido',
          imageUrl: imageUrl,
          totalVagas: item.totalVagas ?? 0, // Usa ?? para valor padrão se for null/undefined
          vagasOcupadas: item.vagasOcupadas ?? 0,
          status: (item.status as Event['status']) || 'published', // Assume 'published' se não houver
        };
      });

      setEvents(mappedEvents);
    } catch (err: any) {
      console.error('Erro ao buscar eventos para administração:', err);
      setError(err.message || 'Falha ao carregar eventos.');
    } finally {
      setLoading(false);
    }
  };

  // useEffect para carregar os eventos quando o componente é montado
  useEffect(() => {
    fetchEvents();
  }, []);

  // Função para lidar com a remoção de um evento
  const handleDelete = async (id: number) => {
    if (!confirm('Tem a certeza que quer apagar este evento?')) {
      return;
    }

    const jwt = localStorage.getItem('jwt');
    if (!jwt) {
      setError('Não autenticado para apagar evento.');
      router.push('/login');
      return;
    }

    try {
      const res = await fetch(`${STRAPI_URL}/api/eventos/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${jwt}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error?.message || `Erro ao apagar: ${res.status} ${res.statusText}`);
      }

      // Se a eliminação for bem-sucedida, atualiza a lista de eventos
      setEvents(events.filter(event => event.id !== id));
      alert('Evento apagado com sucesso!');
    } catch (err: any) {
      console.error('Erro ao apagar evento:', err);
      setError(err.message || 'Falha ao apagar evento.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full text-[var(--foreground)] text-xl">
        A carregar eventos...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4 text-red-500 text-lg">
        <p>{error}</p>
        <button onClick={fetchEvents} className="mt-4 bg-[var(--accent-color)] hover:bg-[var(--secondary-accent)] text-white font-bold py-2 px-4 rounded-md transition duration-300">
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className="admin-events-page p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-[var(--foreground)] mb-6">Gerir Eventos</h1>

      <div className="mb-6 flex justify-end">
        {/* Botão para Adicionar Novo Evento - leva para uma nova rota */}
        <Link href="/admin/events/new" passHref>
          <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 shadow-md">
            + Adicionar Novo Evento
          </button>
        </Link>
      </div>

      {events.length === 0 ? (
        <p className="text-center text-[var(--foreground)] text-lg">
          Não há eventos para gerir.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-gray-100 text-gray-700 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">ID</th>
                <th className="py-3 px-6 text-left">Título</th>
                <th className="py-3 px-6 text-left">Data</th>
                <th className="py-3 px-6 text-left">Local</th>
                <th className="py-3 px-6 text-center">Vagas</th>
                <th className="py-3 px-6 text-center">Status</th>
                <th className="py-3 px-6 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {events.map(event => (
                <tr key={event.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="font-medium">{event.id}</span>
                    </div>
                  </td>
                  <td className="py-3 px-6 text-left">
                    <Link href={`/admin/events/edit/${event.id}`} className="hover:underline text-[var(--accent-color)]">
                        {event.title}
                    </Link>
                  </td>
                  <td className="py-3 px-6 text-left">
                    {new Date(event.date).toLocaleDateString('pt-PT', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </td>
                  <td className="py-3 px-6 text-left">{event.location}</td>
                  <td className="py-3 px-6 text-center">{event.vagasOcupadas}/{event.totalVagas}</td>
                  <td className="py-3 px-6 text-center">
                    <span className={`py-1 px-3 rounded-full text-xs font-semibold ${
                      event.status === 'published' ? 'bg-green-200 text-green-800' :
                      event.status === 'draft' ? 'bg-gray-200 text-gray-800' :
                      event.status === 'cancelled' ? 'bg-red-200 text-red-800' :
                      event.status === 'completed' ? 'bg-blue-200 text-blue-800' :
                      'bg-yellow-200 text-yellow-800'
                    }`}>
                      {event.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-center">
                    <div className="flex item-center justify-center space-x-2">
                      {/* Botão Editar - leva para uma nova rota */}
                      <Link href={`/admin/events/edit/${event.id}`} passHref>
                        <button className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-md text-xs transition duration-300">
                          Editar
                        </button>
                      </Link>
                      {/* Botão Remover */}
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-md text-xs transition duration-300"
                      >
                        Remover
                      </button>
                    </div>
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