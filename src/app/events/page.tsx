// src/app/events/page.tsx
import React from 'react';
import EventCard from '../../components/EventCard';

interface Event {
  // Agora o ID é o documentId (string/UUID)
  id: string; // <<--- ALTERADO PARA STRING
  title: string;
  description: string;
  date: string;
  location: string;
  imageUrl: string; 
  totalVagas: number; 
  vagasOcupadas: number; 
}

// Interface para o item de dados do Strapi na resposta da API de lista
interface StrapiEventListItem {
    id: number; // ID numérico padrão do Strapi
    documentId: string; // O seu campo personalizado de ID de string
    title: string;
    description: string;
    date: string;
    location: string;
    totalVagas: number;
    vagasOcupadas: number;
    // Assumindo que a imagem está direta no item, sem "data" aninhado
    image?: { 
        url: string;
    };
    // Adicione outras propriedades se o seu Strapi as devolver no nível superior
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
      // Mapeamos os dados do Strapi para a nossa interface Event
      const mappedEvents = apiResponse.data.map((item: StrapiEventListItem) => {
        const imageUrl = item.image?.url 
            ? `http://localhost:1337${item.image.url}` 
            : '/placeholder-event.png'; 

        return {
          // *** MUDANÇA CRÍTICA: USAMOS item.documentId COMO O ID PRINCIPAL ***
          id: item.documentId, // <<--- ALTERADO PARA USAR O documentId
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
            // A key agora será o documentId (string)
            <EventCard key={event.id} event={event} /> 
          ))}
        </div>
      )}
    </section>
  );
}