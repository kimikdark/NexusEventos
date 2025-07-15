// src/app/events/[id]/page.tsx
import Image from 'next/image';

// Definir a URL base do teu Strapi API
const STRAPI_URL = 'http://localhost:1337'; // Ajusta se o teu Strapi estiver noutro endereço

// Interface para o formato dos dados de um único evento vindo diretamente do Strapi API
interface EventDetail {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  imageUrl: string;
  totalVagas: number;
  vagasOcupadas: number;
}

// Interface para a estrutura da resposta COMPLETA do Strapi para um ÚNICO evento
interface StrapiSingleResponse {
    data: { // Para um único item, o Strapi envolve em 'data' e depois tem os campos diretos
        id: number;
        title: string;
        description: string;
        date: string;
        location: string;
        image?: { // A imagem está aninhada aqui
            url: string;
        };
        totalVagas?: number;
        vagasOcupadas?: number;
        // Outros campos como createdAt, updatedAt, publishedAt podem estar aqui mas não são necessários para a interface EventDetail
    } | null; // Pode ser null se o evento não for encontrado
    meta: any;
}


async function getEvent(id: string): Promise<EventDetail | null> {
  try {
    // A URL da API para buscar um evento específico - usar o API ID plural 'eventos'
    const apiUrl = `${STRAPI_URL}/api/eventos/${id}?populate=*`;
    console.log(`[getEvent - details page] A buscar evento com ID: ${id}`);
    console.log(`[getEvent - details page] URL da API: ${apiUrl}`);

    const res = await fetch(apiUrl, {
      cache: 'no-store'
    });

    console.log(`[getEvent - details page] Status da resposta do Strapi: ${res.status} ${res.statusText}`);

    if (!res.ok) {
      console.error(`[getEvent - details page] Falha ao buscar evento com ID ${id}:`, res.status, res.statusText);
      return null;
    }

    const apiResponse: StrapiSingleResponse = await res.json();
    console.log("[getEvent - details page] Dados brutos do Strapi (para detalhe):", apiResponse);

    // Acessar diretamente apiResponse.data, pois é a estrutura para um único item
    if (apiResponse && apiResponse.data) {
        const eventData = apiResponse.data;

        // Acessar a URL da imagem diretamente de eventData.image.url
        const imageUrl = eventData.image?.url
            ? `${STRAPI_URL}${eventData.image.url}`
            : '/images/placeholder-event.png'; // Usar uma imagem de fallback

        const mappedEvent: EventDetail = {
            id: eventData.id,
            title: eventData.title || 'Evento sem título',
            description: eventData.description || 'Sem descrição.',
            date: eventData.date || 'Data não definida',
            location: eventData.location || 'Local não definido',
            imageUrl: imageUrl,
            totalVagas: eventData.totalVagas || 0,
            vagasOcupadas: eventData.vagasOcupadas || 0,
        };
        console.log("[getEvent - details page] Evento mapeado:", mappedEvent);
        return mappedEvent;
    }
    console.warn(`[getEvent - details page] Formato de dados inesperado do Strapi para ID ${id}:`, apiResponse);
    return null;

  } catch (error) {
    console.error(`[getEvent - details page] Erro de rede ou parsing ao buscar evento com ID ${id}:`, error);
    return null;
  }
}

export default async function EventDetailPage({ params }: { params: { id: string } }) {
  console.log(`[EventDetailPage] Parâmetro ID recebido: ${params.id}`);
  const event = await getEvent(params.id);

  if (!event) {
    return (
      <section className="py-12 px-4 max-w-4xl mx-auto text-center text-[var(--foreground)]">
        <h1 className="text-4xl font-extrabold mb-4">Evento Não Encontrado</h1>
        <p className="text-lg">Pedimos desculpa, mas o evento que procura não existe ou não está disponível.</p>
      </section>
    );
  }

  const vagasRestantes = event.totalVagas - event.vagasOcupadas;

  return (
    <section className="event-detail py-12 px-4 max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-extrabold text-[var(--foreground)] mb-4">{event.title}</h1>
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
      <div className="text-[var(--foreground)] space-y-4">
        <p className="text-lg leading-relaxed">{event.description}</p>
        <p className="flex items-center text-md">
          <svg className="w-5 h-5 mr-2 text-[var(--accent-color)]" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path>
          </svg>
          <strong>Data:</strong> {new Date(event.date).toLocaleDateString('pt-PT', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </p>
        <p className="flex items-center text-md">
          <svg className="w-5 h-5 mr-2 text-[var(--accent-color)]" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
          </svg>
          <strong>Local:</strong> {event.location}
        </p>
        {event.totalVagas > 0 && (
            <p className="flex items-center text-md">
                <svg className="w-5 h-5 mr-2 text-[var(--accent-color)]" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM11 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2h-2zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2h-2z"></path>
                </svg>
                <strong>Vagas:</strong> {vagasRestantes} disponível{vagasRestantes === 1 ? '' : 'is'} de {event.totalVagas}
                {event.vagasOcupadas > 0 && ` (${event.vagasOcupadas} ocupada${event.vagasOcupadas === 1 ? '' : 's'})`}
            </p>
        )}
      </div>
      <div className="mt-8 text-center">
        <button className="bg-[var(--accent-color)] hover:bg-[var(--secondary-accent)] text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300 ease-in-out">
          Inscrever-me neste Evento
        </button>
      </div>
    </section>
  );
}