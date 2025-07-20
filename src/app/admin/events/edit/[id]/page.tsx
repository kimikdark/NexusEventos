// src/app/admin/events/edit/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import EventForm, { EventFormData } from '@/components/EventForm';

const STRAPI_URL = 'http://localhost:1337'; // URL do teu Strapi

interface EventDetailPageProps {
  params: {
    id: string;
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
        router.push('/admin/login'); // Corrigido para /admin/login
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${STRAPI_URL}/api/eventos/${id}?populate=image`, { // Usar 'populate=image' é mais específico
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
          throw new Error(errorData.error?.message || `Erro HTTP: ${res.status} ${res.statusText}`);
        }

        const apiResponse = await res.json();
        // VERIFICAÇÃO CRÍTICA: Certificar-se de que apiResponse.data e apiResponse.data.attributes existem
        const eventData = apiResponse.data;

        if (!eventData || !eventData.attributes) {
          setError('Dados do evento não encontrados ou em formato inesperado.');
          setLoading(false);
          return;
        }

        const eventAttributes = eventData.attributes;

        // Aceder à URL da imagem com segurança
        const imageUrl = eventAttributes.image?.data?.attributes?.url
          ? `${STRAPI_URL}${eventAttributes.image.data.attributes.url}`
          : undefined; // Ou uma imagem de fallback padrão, se preferir

        setInitialEventData({
          title: eventAttributes.title || '',
          description: eventAttributes.description || '',
          date: eventAttributes.date || '',
          location: eventAttributes.location || '',
          totalVagas: eventAttributes.totalVagas ?? 0,
          vagasOcupadas: eventAttributes.vagasOcupadas ?? 0,
          imageUrl: imageUrl, // Passa a URL para o EventForm
          status: eventAttributes.status || 'draft',
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
      // Já é tratado no fetchEventData, mas boa prática ter aqui também.
      throw new Error('Não autenticado. Por favor, faça login.');
    }

    const data = new FormData();
    data.append('data', JSON.stringify(formData));

    // Lógica para lidar com imageFile:
    if (imageFile instanceof File) {
      // Um novo arquivo foi selecionado, anexar.
      data.append('files.image', imageFile);
    } else if (imageFile === null) {
        if (formData.imageUrl === undefined) { // Se a URL de imagem no form data é undefined, indica que foi removida
            const currentData = JSON.parse(data.get('data') as string);
            data.set('data', JSON.stringify({ ...currentData, image: null })); // Força a remoção no Strapi
        }
    }
    // Se imageFile for undefined, significa que não houve alteração no arquivo.
    // Neste caso, não adicionamos 'files.image' ao FormData, mantendo a imagem existente.


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