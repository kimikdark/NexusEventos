// src/app/events/[id]/page.tsx
import React from 'react';
import Image from 'next/image';
import { HiCalendar, HiLocationMarker } from 'react-icons/hi';

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  imageUrl: string;
  // Adiciona outras propriedades que tenhas no teu modelo de evento no Strapi
}

// Função para buscar um único evento do Strapi
async function getEvent(id: string): Promise<Event | null> {
  try {
    const res = await fetch(`http://localhost:1337/api/eventos/${id}?populate=*`, {
      next: { revalidate: 60 } // Revalidar os dados a cada 60 segundos
    });

    if (!res.ok) {
      // Loga o erro se a resposta não for OK (ex: 404, 500)
      console.error(`Falha ao buscar evento ${id}: ${res.status} ${res.statusText}`);
      return null; // Retorna null se não conseguir buscar o evento
    }

    const data = await res.json();
    // Verifica a estrutura dos dados retornados pelo Strapi para um único item
    // O Strapi retorna: { data: { id: ..., attributes: { ... } } }
    if (data && data.data && data.data.attributes) {
      const item = data.data; // O objeto do evento está dentro de 'data'
      return {
        id: item.id,
        title: item.attributes.title,
        description: item.attributes.description,
        date: item.attributes.date,
        location: item.attributes.location,
        // Certifica-te de que o caminho da imagem está correto.
        // Se a imagem for um campo media no Strapi, a estrutura é data.attributes.NOME_DO_CAMPO_IMAGEM.data.attributes.url
        imageUrl: item.attributes.image?.data?.attributes?.url ? `http://localhost:1337${item.attributes.image.data.attributes.url}` : '/placeholder-event.png',
      };
    }
    console.warn(`Dados do evento ${id} em formato inesperado:`, data);
    return null; // Retorna null se a estrutura dos dados for inesperada
  } catch (error) {
    console.error(`Erro ao buscar evento ${id}:`, error);
    return null; // Retorna null em caso de exceção (ex: erro de rede)
  }
}

interface EventDetailsPageProps {
  params: { id: string }; // O id do evento virá dos parâmetros da URL
}

export default async function EventDetailsPage({ params }: EventDetailsPageProps) {
  const event = await getEvent(params.id); // Chama a função para buscar o evento

  // Se o evento não for encontrado ou houver erro, exibe uma mensagem
  if (!event) {
    return (
      <div className="text-center py-10">
        <h1 className="text-3xl font-bold text-red-600 dark:text-red-400">Evento Não Encontrado</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">O evento que procuras pode não existir ou ter sido removido.</p>
      </div>
    );
  }

  // Se o evento for encontrado, exibe os detalhes
  return (
    <section className="event-details py-8 max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
      <div className="relative w-full h-80 sm:h-96">
        <Image
          src={event.imageUrl}
          alt={event.title}
          fill
          sizes="100vw"
          style={{ objectFit: 'cover' }}
          className="rounded-t-lg"
        />
      </div>
      <div className="p-6">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{event.title}</h1>
        <div className="flex items-center text-gray-600 dark:text-gray-400 mb-2">
          <HiCalendar className="mr-2 h-6 w-6" />
          <span className="text-lg">{new Date(event.date).toLocaleDateString('pt-PT', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
        </div>
        <div className="flex items-center text-gray-600 dark:text-gray-400 mb-4">
          <HiLocationMarker className="mr-2 h-6 w-6" />
          <span className="text-lg">{event.location}</span>
        </div>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg whitespace-pre-line">
          {event.description}
        </p>
        {/* Adiciona mais detalhes do evento aqui, como mapa, palestrantes, etc. */}
      </div>
    </section>
  );
}