// src/app/admin/events/edit/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import EventForm, { EventFormData } from '@/components/EventForm';

const STRAPI_URL = 'http://localhost:1337';

interface EventDetailPageProps {
    params: {
        id: string; // O ID virá como string da URL (documentId)
    };
}

export default function EditEventPage({ params }: EventDetailPageProps) {
    const { id } = params; // Este 'id' é o seu 'documentId'
    const router = useRouter();
    const [initialEventData, setInitialEventData] = useState<EventFormData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEventData = async () => {
            const jwt = localStorage.getItem('jwt');
            if (!jwt) {
                setError('Não autenticado. Por favor, faça login.');
                router.push('/admin/login');
                setLoading(false);
                return;
            }

            try {
                // IMPORTANT: Use populate=image para obter os dados completos da imagem
                // O `id` aqui é o seu `documentId` da URL, que o Strapi usa para lookup
                const res = await fetch(`${STRAPI_URL}/api/eventos/${id}?populate=image`, {
                    headers: {
                        'Authorization': `Bearer ${jwt}`,
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
                    console.error("EditEventPage: Erro da API ao buscar evento para edição:", errorData);
                    throw new Error(errorData.error?.message || `Erro HTTP: ${res.status} ${res.statusText}. Verifique a consola para detalhes.`);
                }

                const apiResponse = await res.json();
                const eventData = apiResponse.data; // O objeto de dados principal

                // CORREÇÃO CRÍTICA AQUI: Os dados principais (title, description, etc.) não estão em 'attributes'
                // Eles estão diretamente no objeto 'eventData' retornado pelo Strapi para uma única entrada.
                // Apenas a imagem é aninhada em 'attributes' quando populada.
                if (!eventData) {
                    setError('Dados do evento não encontrados ou em formato inesperado.');
                    setLoading(false);
                    return;
                }

                // Aceder à URL da imagem com segurança
                // Assumimos que 'image' é uma relação e vem aninhada assim quando 'populate=image'
                const imageUrl = eventData.image?.data?.attributes?.url
                    ? `${STRAPI_URL}${eventData.image.data.attributes.url}`
                    : undefined; // undefined se não houver imagem

                setInitialEventData({
                    title: eventData.title || '',
                    description: eventData.description || '',
                    date: eventData.date || '', // A data será formatada pelo EventForm para o input
                    location: eventData.location || '',
                    totalVagas: eventData.totalVagas ?? 0,
                    vagasOcupadas: eventData.vagasOcupadas ?? 0,
                    imageUrl: imageUrl, // Passa a URL para o EventForm para pré-visualização
                    status: eventData.status || 'draft',
                });
            } catch (err: any) {
                console.error('EditEventPage: Erro ao carregar dados do evento para edição:', err);
                setError(err.message || 'Falha ao carregar evento.');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchEventData();
        }
    }, [id, router]);

    const handleUpdateEvent = async (formData: EventFormData, imageFile?: File | null) => {
        const jwt = localStorage.getItem('jwt');
        if (!jwt) {
            throw new Error('Não autenticado. Por favor, faça login.');
        }

        const data = new FormData();

        const eventDataPayload: any = { ...formData };
        delete eventDataPayload.imageUrl; // Remove campo que não pertence ao Strapi Content Type

        if (imageFile instanceof File) {
            data.append('files.image', imageFile);
        } else if (imageFile === null) {
            eventDataPayload.image = null; // Envia null para remover a imagem no Strapi
        }
        // Se imageFile é undefined, a imagem não foi alterada, então não precisamos enviar nada para ela.

        data.append('data', JSON.stringify(eventDataPayload));

        try {
            const res = await fetch(`${STRAPI_URL}/api/eventos/${id}`, { // Usa o 'id' (documentId) da URL
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${jwt}`,
                },
                body: data,
            });

            if (!res.ok) {
                const errorData = await res.json();
                console.error("EditEventPage: Erro completo da API ao atualizar evento:", errorData);
                throw new Error(errorData.error?.message || `Erro HTTP: ${res.status} ${res.statusText}. Verifique a consola para detalhes.`);
            }

            const responseData = await res.json();
            console.log('EditEventPage: Evento atualizado com sucesso:', responseData);
            router.push('/admin/events');
        } catch (err: any) {
            console.error('EditEventPage: Falha ao atualizar evento (catch principal):', err);
            throw err;
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full text-[var(--foreground)] text-xl">
                A carregar dados do evento...
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center p-4 text-red-500 text-lg">
                <p>{error}</p>
                <button onClick={() => window.location.reload()} className="mt-4 bg-[var(--accent-color)] hover:bg-[var(--secondary-accent)] text-white font-bold py-2 px-4 rounded-md transition duration-300">
                    Tentar Novamente (Recarregar Página)
                </button>
            </div>
        );
    }

    if (!initialEventData) {
        return (
            <div className="text-center p-4 text-gray-500 text-lg">
                Evento não encontrado para edição.
            </div>
        );
    }

    return (
        <div className="admin-edit-event-page p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-3xl font-bold text-[var(--foreground)] mb-6">Editar Evento (ID: {id})</h1>
            <EventForm onSave={handleUpdateEvent} initialData={initialEventData} isEditing={true} />
        </div>
    );
}