// src/app/events/page.tsx
import React from 'react';
import EventCard from '../../components/EventCard';

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  imageUrl: string; 
  totalVagas: number; 
  vagasOcupadas: number; 
}

async function getEvents(): Promise<Event[]> {
  try {
    const res = await fetch('http://localhost:1337/api/eventos?populate=*', {
      next: { revalidate: 60 } 
    });
    if (!res.ok) {
      console.error(`Falha ao buscar eventos: ${res.status} ${res.statusText}`);
      return [];
    }
    const apiResponse = await res.json();
    console.log("Dados brutos do Strapi (no getEvents):", apiResponse); 

    if (apiResponse && Array.isArray(apiResponse.data)) {
      const mappedEvents = apiResponse.data.map((item: any) => {
        // *** ESTAS FORAM AS MUDANÇAS CRÍTICAS! ***
        // Acesso direto aos campos do 'item', pois o JSON do seu Strapi não tem 'attributes'.
        // Acesso direto a 'item.image.url', pois o JSON não tem 'data.attributes' dentro de 'image'.
        const imageUrl = item.image?.url 
            ? `http://localhost:1337${item.image.url}` 
            : '/placeholder-event.png'; 

        return {
          id: item.id, 
          title: item.title || 'Evento sem título', 
          description: item.description || 'Sem descrição.', 
          date: item.date || 'Data não definida', 
          location: item.location || 'Local não definido', 
          imageUrl: imageUrl,
          totalVagas: item.totalVagas || 0, 
          vagasOcupadas: item.vagasOcupadas || 0, 
        };
      });
      console.log("Eventos mapeados (no getEvents):", mappedEvents); 
      return mappedEvents;
    }
    console.warn("Formato de dados inesperado do Strapi (no getEvents):", apiResponse); 
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
      <h1 className="text-5xl font-extrabold text-center mb-12 text-[var(--foreground)]">
        Próximos Eventos
      </h1>
      {events.length === 0 ? (
        <p className="text-center text-xl text-[var(--foreground)] opacity-70">Nenhum evento encontrado de momento.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-10 px-4">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </section>
  );
}