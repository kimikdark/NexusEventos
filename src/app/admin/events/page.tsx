// src/app/admin/events/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const STRAPI_URL = 'http://localhost:1337';

// Interfaces para os dados dos eventos
interface Event {
    id: number;
    title: string;
    description: string;
    date: string;
    location: string;
    imageUrl?: string; // Pode ser opcional se o evento não tiver imagem
    totalVagas: number;
    vagasOcupadas: number;
    status: 'draft' | 'published' | 'cancelled' | 'completed';
}

// Interface para o formato da resposta da API do Strapi (listagem)
interface StrapiResponse {
    data: Array<{
        id: number;
        attributes?: { // Atributos podem ser undefined se o populate falhar ou for vazio
            title: string;
            description: string;
            date: string;
            location: string;
            totalVagas?: number;
            vagasOcupadas?: number;
            status?: 'draft' | 'published' | 'cancelled' | 'completed';
            image?: { // A imagem aninhada dentro de attributes
                data?: { // data da imagem também pode ser undefined se não houver imagem
                    attributes: {
                        url: string;
                    };
                };
            };
            documentId?: string;
        };
    }>;
    meta?: any;
}

export default function AdminEventsPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const fetchEvents = async () => {
        setLoading(true);
        setError(null);
        const jwt = localStorage.getItem('jwt');

        if (!jwt) {
            setError('Não autenticado. Por favor, faça login.');
            setLoading(false);
            router.push('/admin/login');
            return;
        }

        try {
            const res = await fetch(`${STRAPI_URL}/api/eventos?populate=image`, { // Use populate=image
                headers: {
                    'Authorization': `Bearer ${jwt}`,
                    'Content-Type': 'application/json',
                },
                cache: 'no-store',
            });

            if (!res.ok) {
                if (res.status === 401 || res.status === 403) {
                    localStorage.removeItem('jwt');
                    router.push('/admin/login');
                    return;
                }
                const errorData = await res.json();
                throw new Error(errorData.error?.message || `Erro HTTP: ${res.status} ${res.statusText}`);
            }

            const apiResponse: StrapiResponse = await res.json();
            console.log("Dados de eventos recebidos para admin:", apiResponse);

            if (!Array.isArray(apiResponse.data)) {
                throw new Error('Formato de dados inesperado da API.');
            }

            const mappedEvents: Event[] = apiResponse.data.map(item => {
                // Adicionar verificações de segurança para 'attributes'
                const attributes = item.attributes;

                // Se attributes for undefined, retornar um objeto Event padrão para evitar erros
                if (!attributes) {
                    console.warn(`Evento com ID ${item.id} não possui atributos. Pulando ou usando defaults.`);
                    return {
                        id: item.id,
                        title: 'Evento Inválido',
                        description: 'Dados incompletos.',
                        date: 'N/A',
                        location: 'N/A',
                        imageUrl: '/images/default-event.jpg', // Fallback
                        totalVagas: 0,
                        vagasOcupadas: 0,
                        status: 'draft',
                    };
                }

                const imageUrl = attributes.image?.data?.attributes?.url
                    ? `${STRAPI_URL}${attributes.image.data.attributes.url}`
                    : '/images/default-event.jpg'; // Imagem de fallback

                return {
                    id: item.id,
                    title: attributes.title || 'Evento sem título',
                    description: attributes.description || 'Sem descrição.',
                    date: attributes.date || 'Data não definida',
                    location: attributes.location || 'Local não definido',
                    imageUrl: imageUrl,
                    totalVagas: attributes.totalVagas ?? 0,
                    vagasOcupadas: attributes.vagasOcupadas ?? 0,
                    status: (attributes.status as Event['status']) || 'published',
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

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleDelete = async (id: number) => {
        if (!confirm('Tem a certeza que quer apagar este evento?')) {
            return;
        }

        const jwt = localStorage.getItem('jwt');
        if (!jwt) {
            setError('Não autenticado para apagar evento.');
            router.push('/admin/login');
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
                if (res.status === 401 || res.status === 403) {
                    localStorage.removeItem('jwt');
                    router.push('/admin/login');
                    return;
                }
                const errorData = await res.json();
                throw new Error(errorData.error?.message || `Erro ao apagar: ${res.status} ${res.statusText}`);
            }

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
                                            <Link href={`/admin/events/edit/${event.id}`} passHref>
                                                <button className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-md text-xs transition duration-300">
                                                    Editar
                                                </button>
                                            </Link>
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