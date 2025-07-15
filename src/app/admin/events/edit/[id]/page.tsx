// src/app/admin/events/edit/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import EventForm, { EventFormData } from '@/components/EventForm';

const STRAPI_URL = 'http://localhost:1337'; // URL do teu Strapi

interface EventDetailPageProps {
  params: {
    id: string; // O ID do evento virá da URL (ex: /admin/events/edit/123)
  };
}

export default function EditEventPage({ params }: EventDetailPageProps) {
  const { id } = params;
  const router = useRouter();
  const [initialEventData, setInitialEventData] = useState<EventFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEventData = async () => {
      const jwt = localStorage.getItem('jwt');
      if (!jwt) {
        setError('Não autenticado. Por favor, faça login.');
        router.push('/login');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${STRAPI_URL}/api/eventos/${id}?populate=*`, { // Usa populate para obter a imagem
          headers: {
            'Authorization': `Bearer ${jwt}`,
          },
          cache: 'no-store',
        });

        if (!res.ok) {
          const errorData = await res.json();
          // DEBUG: Log do erro da API ao buscar o evento
          console.error("EditEventPage: Erro da API ao buscar evento para edição:", errorData);
          throw new Error(errorData.error?.message || `Erro HTTP: ${res.status} ${res.statusText}`);
        }

        const apiResponse = await res.json();
        // **CORREÇÃO AQUI:** Aceder aos atributos e à URL da imagem
        const eventAttributes = apiResponse.data.attributes;

        if (!eventAttributes) {
          setError('Dados do evento não encontrados.');
          setLoading(false);
          return;
        }

        const imageUrl = eventAttributes.image?.data?.attributes?.url
          ? `${STRAPI_URL}${eventAttributes.image.data.attributes.url}`
          : undefined;

        setInitialEventData({
          title: eventAttributes.title || '',
          description: eventAttributes.description || '',
          date: eventAttributes.date || '',
          location: eventAttributes.location || '',
          totalVagas: eventAttributes.totalVagas ?? 0,
          vagasOcupadas: eventAttributes.vagasOcupadas ?? 0,
          imageUrl: imageUrl,
          status: eventAttributes.status || 'draft',
        });
      } catch (err: any) {
        console.error('EditEventPage: Erro ao carregar dados do evento para edição (catch principal):', err);
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
    data.append('data', JSON.stringify(formData));

    if (imageFile) {
      data.append('files.image', imageFile); // Se um novo ficheiro de imagem for selecionado
    }

    // DEBUG: Log do FormData antes de enviar para o Strapi
    console.log('EditEventPage: FormData a ser enviado para o Strapi (PUT):');
    for (let [key, value] of data.entries()) {
        if (key === 'data') {
            try {
                console.log(`${key}:`, JSON.parse(value as string));
            } catch (e) {
                console.log(`${key}: ${value}`);
            }
        } else {
            console.log(`${key}: ${value}`);
        }
    }

    try {
      const res = await fetch(`${STRAPI_URL}/api/eventos/${id}`, {
        method: 'PUT', // Método PUT para atualização
        headers: {
          'Authorization': `Bearer ${jwt}`,
          // REMOVIDO: 'Content-Type'
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
      router.push('/admin/events'); // Redireciona de volta para a lista de eventos
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