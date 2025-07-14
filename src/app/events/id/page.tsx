// src/app/events/[id]/page.tsx
import Image from 'next/image';

interface EventDetail {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  imageUrl: string;
}

async function getEvent(id: string): Promise<EventDetail | null> {
  try {
    const res = await fetch(`http://localhost:1337/api/eventos/${id}?populate=*`, {
      cache: 'no-store'
    });

    if (!res.ok) {
      console.error(`Falha ao buscar evento com ID ${id}:`, res.status, res.statusText);
      return null;
    }

    const data = await res.json();

    // Confirma que data, data.data e data.data.attributes existem
    if (data && data.data && data.data.attributes) {
        const eventData = data.data.attributes; // Agora eventData contém os atributos

        // Acede ao URL da imagem corretamente (aninhado)
        const imageUrl = eventData.image?.data?.attributes?.url
            ? `http://localhost:1337${eventData.image.data.attributes.url}`
            : '/placeholder-event.png'; // Fallback para uma imagem local

        return {
            id: data.data.id, // O ID principal ainda está em data.data.id
            title: eventData.title || 'Evento sem título',
            description: eventData.description || 'Sem descrição.',
            date: eventData.date || 'Data não definida',
            location: eventData.location || 'Local não definido',
            imageUrl: imageUrl,
        };
    }
    return null;

  } catch (error) {
    console.error('Erro de rede ou parsing ao buscar evento:', error);
    return null;
  }
}

export default async function EventDetailPage({ params }: { params: { id: string } }) {
  const event = await getEvent(params.id);

  if (!event) {
    return (
      <section className="py-12 px-4 max-w-4xl mx-auto text-center text-white">
        <h1 className="text-4xl font-extrabold mb-4">Evento Não Encontrado</h1>
        <p className="text-lg">Pedimos desculpa, mas o evento que procura não existe ou não está disponível.</p>
      </section>
    );
  }

  return (
    <section className="event-detail py-12 px-4 max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-extrabold text-gray-800 dark:text-white mb-4">{event.title}</h1>
        {event.imageUrl && (
          <div className="relative w-full h-80 overflow-hidden rounded-md mx-auto mb-6">
            <Image
              src={event.imageUrl}
              alt={event.title}
              fill
              style={{ objectFit: 'cover' }}
              className="rounded-md"
            />
          </div>
        )}
      </div>
      <div className="text-gray-700 dark:text-gray-300 space-y-4">
        <p className="text-lg leading-relaxed">{event.description}</p>
        <p className="flex items-center text-md">
          <svg className="w-5 h-5 mr-2 text-[var(--accent-color)]" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path>
          </svg>
          **Data:** {new Date(event.date).toLocaleDateString('pt-PT', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </p>
        <p className="flex items-center text-md">
          <svg className="w-5 h-5 mr-2 text-[var(--accent-color)]" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
          </svg>
          **Local:** {event.location}
        </p>
      </div>
      <div className="mt-8 text-center">
        <button className="bg-[var(--accent-color)] hover:bg-[var(--secondary-accent)] text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300 ease-in-out">
          Inscrever-me neste Evento
        </button>
      </div>
    </section>
  );
}