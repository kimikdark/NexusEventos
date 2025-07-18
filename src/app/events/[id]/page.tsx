// src/app/events/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link'; // Importa Link do next/link

// Interface ajustada para a estrutura REAL que o seu Strapi está a devolver
interface EventDetailResponse {
  data: Array<{ // O Strapi devolverá um ARRAY de 'data' ao usar filtros
    id: number; // O ID numérico padrão do Strapi
    documentId: string; // O seu campo personalizado de ID de string (usado para o fetch)
    title: string;
    description: string;
    date: string;
    location: string;
    totalVagas: number;
    vagasOcupadas: number;
    status: 'draft' | 'published' | 'cancelled' | 'completed';
    image?: { // Estrutura da imagem ajustada
      url: string;
    };
  }>;
  meta?: any; // Adicionado para tipagem completa
}

const STRAPI_URL = 'http://localhost:1337';

export default function EventDetailPage() {
  const params = useParams();
  const eventId = params.id as string; 
  
  const [event, setEvent] = useState<EventDetailResponse['data'][0] | null>(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!eventId) {
      setLoading(false);
      setError('ID do evento não fornecido.');
      return;
    }

    const fetchEvent = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('EventDetailPage: A tentar buscar evento com documentId (UUID):', eventId);
        
        const res = await fetch(`${STRAPI_URL}/api/eventos?filters[documentId][$eq]=${eventId}&populate=*`);
        
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error('Evento não encontrado. (Verifique se o documentId está correto e o evento publicado)');
          }
          const errorData = await res.json();
          throw new Error(errorData.error?.message || `Erro ao carregar evento: ${res.status} ${res.statusText}`);
        }

        const responseData: EventDetailResponse = await res.json();
        
        if (responseData && responseData.data && responseData.data.length > 0) {
          setEvent(responseData.data[0]); 
        } else {
          throw new Error('Evento não encontrado ou formato de dados inesperado do Strapi.');
        }

      } catch (err: any) {
        console.error('Falha ao carregar detalhes do evento:', err);
        setError(err.message || 'Falha ao carregar detalhes do evento.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[var(--background)] text-[var(--foreground)]">
        <p>A carregar detalhes do evento...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-[var(--background)] text-red-500">
        <p>Erro: {error}</p>
        {/* Botão de voltar para a lista de eventos */}
        <Link href="/events" className="ml-4 text-[var(--accent-color)] hover:underline">
          Voltar aos Eventos
        </Link>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex justify-center items-center h-screen bg-[var(--background)] text-[var(--foreground)]">
        <p>Evento não encontrado.</p>
        {/* Botão de voltar para a lista de eventos */}
        <Link href="/events" className="ml-4 text-[var(--accent-color)] hover:underline">
          Voltar aos Eventos
        </Link>
      </div>
    );
  }

  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleString('pt-PT', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  const imageUrl = event.image?.url 
    ? `${STRAPI_URL}${event.image.url}`
    : '/placeholder-image.jpg';

  const vagasDisponiveis = event.totalVagas - event.vagasOcupadas;
  const haVagas = vagasDisponiveis > 0;

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-8">
        {/* Botão de voltar para a lista de eventos */}
        <Link href="/events" className="text-[var(--accent-color)] hover:underline mb-6 block text-lg">
          &larr; Voltar aos Eventos
        </Link>
        
        <h1 className="text-4xl font-bold text-[var(--foreground)] mb-4">{event.title}</h1>
        
        {imageUrl && (
          <div className="mb-6 rounded-lg overflow-hidden">
            <Image
              src={imageUrl}
              alt={event.title}
              width={800}
              height={400}
              style={{ objectFit: 'cover' }}
              className="w-full h-auto"
              priority
            />
          </div>
        )}

        <p className="text-gray-700 text-lg mb-4">{event.description}</p>
        <p className="text-gray-600 mb-2"><strong>Data e Hora:</strong> {formattedDate}</p>
        <p className="text-gray-600 mb-2"><strong>Local:</strong> {event.location}</p>
        <p className="text-gray-600 mb-4">
          <strong>Vagas:</strong> {event.vagasOcupadas} / {event.totalVagas} 
          {haVagas ? ` (${vagasDisponiveis} disponíveis)` : ' (Esgotadas)'}
        </p>
        <p className="text-gray-600 mb-4"><strong>Status:</strong> {event.status}</p>

        {/* Botão de Inscrição Condicional */}
        {haVagas ? (
          <Link href={`/events/${event.documentId}/register`} passHref>
            <button className="mt-6 bg-[var(--accent-color)] hover:bg-[var(--secondary-accent)] text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 transform hover:scale-105">
              Inscrever-me
            </button>
          </Link>
        ) : (
          <p className="mt-6 text-red-500 font-semibold">Inscrições esgotadas!</p>
        )}
      </div>
    </div>
  );
}