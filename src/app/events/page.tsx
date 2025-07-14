// src/app/events/page.tsx
import React from 'react';
import EventCard from '../../components/EventCard'; // Certifica-te que o caminho para EventCard está correto

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  imageUrl: string; 
}

async function getEvents(): Promise<Event[]> {
  try {
    // Busca eventos da tua API Strapi
    const res = await fetch('http://localhost:1337/api/eventos?populate=*', {
      next: { revalidate: 60 } // Revalida os dados a cada 60 segundos
    });
    if (!res.ok) {
      console.error(`Falha ao buscar eventos: ${res.status} ${res.statusText}`);
      return [];
    }
    const data = await res.json();
    console.log("Dados brutos do Strapi (no getEvents):", data); 

    if (data && Array.isArray(data.data)) {
      const mappedEvents = data.data.map((item: any) => ({
        id: item.id,
        // *** IMPORTANTE: Acesso direto aos campos do item ***
        // Se o teu Strapi aninha estes campos em 'attributes', então terás de usar:
        // title: item.attributes.title || '',
        // description: item.attributes.description || '',
        // etc.
        title: item.title || '', 
        description: item.description || '', 
        date: item.date || '', 
        location: item.location || '', 
        // Construção do URL da imagem:
        // Verifica se 'item.image' existe e se tem 'url'. Adiciona o domínio Strapi.
        imageUrl: item.image?.url ? `http://localhost:1337${item.image.url}` : '/placeholder-event.png',
      }));
      console.log("Eventos mapeados (no getEvents):", mappedEvents); 
      return mappedEvents;
    }
    console.warn("Formato de dados inesperado do Strapi (no getEvents):", data); 
    return [];
  } catch (error) {
    console.error("Erro ao buscar eventos (no getEvents):", error); 
    return [];
  }
}

export default async function EventsPage() {
  const events = await getEvents();
  console.log("Array de eventos recebido na EventsPage:", events); 
  console.log("Comprimento do array de eventos:", events.length); 

  return (
    <section className="events-list py-12">
      <h1 className="text-5xl font-extrabold text-center mb-12 text-gray-800 dark:text-white">
        Próximos Eventos
      </h1>
      {events.length === 0 ? (
        <p className="text-center text-xl text-gray-600 dark:text-gray-400">Nenhum evento encontrado de momento.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-10 px-4">
          {events.map((event) => (
            // Passa os dados do evento para o componente EventCard
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </section>
  );
}