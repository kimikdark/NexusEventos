// src/app/page.tsx
'use client'; // MUITO IMPORTANTE: Garante que este componente é renderizado no cliente.

import Link from 'next/link';
import Image from 'next/image';
import EventCard from '../components/EventCard';
import { useState, useEffect } from 'react'; // Importar useState e useEffect para Client Components

// Definir a URL base do teu Strapi API
const STRAPI_URL = 'http://localhost:1337'; // Ajusta se o teu Strapi estiver noutro endereço

// Interface para o formato dos dados dos eventos que vêm diretamente do Strapi API para LISTAGENS.
// Esta interface reflete a estrutura "plana" que o teu Strapi parece estar a retornar.
interface StrapiEvent {
  id: number; // O ID está diretamente no objeto
  title: string;
  description: string;
  date: string;
  location: string;
  image?: { // A imagem está diretamente aninhada, e a URL está em .url
    url: string;
    // Outras propriedades da imagem podem estar aqui (ex: name, hash, ext, mime, size, width, height)
  };
  totalVagas?: number;
  vagasOcupadas?: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

// Interface para a estrutura da resposta COMPLETA do Strapi para uma LISTA de eventos
interface StrapiResponse {
  data: StrapiEvent[]; // O array de eventos "planos"
  meta: any; // Pode conter informações de paginação, etc.
}

// Interface para o formato do evento que será usado no estado e passado para o EventCard
interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  imageUrl: string;
}

// Função assíncrona para buscar e processar os eventos do Strapi
async function getEvents(): Promise<Event[]> {
  console.log("Tentando buscar eventos do Strapi para a página inicial...");
  try {
    // Usamos populate=* para garantir que a imagem (e outros campos relacionados) venham
    const res = await fetch(`${STRAPI_URL}/api/eventos?populate=*`, {
      cache: 'no-store', // Desativa o cache para obter sempre os dados mais recentes durante o desenvolvimento
    });

    console.log("Status da resposta da API (page.tsx):", res.status, res.statusText);

    if (!res.ok) {
      const errorBody = await res.text();
      console.error(`Erro HTTP ao buscar eventos (page.tsx): ${res.status} - ${res.statusText}`, errorBody);
      throw new Error(`Erro ao buscar eventos: ${res.statusText}`);
    }

    const apiResponse: StrapiResponse = await res.json();
    console.log("Dados recebidos da API (raw) para page.tsx:", apiResponse); // Mostra a resposta JSON completa

    // Verificação crucial: certifica-se de que 'apiResponse' e 'apiResponse.data' existem e são arrays
    if (!apiResponse || !Array.isArray(apiResponse.data)) {
        console.error("Dados da API não estão no formato esperado (missing apiResponse.data array para page.tsx):", apiResponse);
        return [];
    }

    // A MUDANÇA CRÍTICA ESTÁ AQUI:
    // Mapeia os dados do Strapi para o formato esperado pelo componente EventCard
    const events = apiResponse.data.map(item => {
        // Acesso DIRETO aos campos do 'item', pois o teu Strapi retorna uma estrutura "plana"
        // para listagens (data: [{}, {}, ...]).
        // Acesso DIRETO a 'item.image.url'
        const imageUrl = item.image?.url
            ? `${STRAPI_URL}${item.image.url}` // Constrói a URL completa da imagem
            : '/images/default-event.jpg'; // Imagem de fallback se não houver imagem do Strapi

        // Retorna o objeto Event com os campos acessados diretamente do 'item'
        return {
            id: item.id, // Acessando o ID diretamente
            title: item.title || 'Evento sem título',
            description: item.description || 'Sem descrição.',
            date: item.date || 'Data não definida',
            location: item.location || 'Local não definido',
            imageUrl: imageUrl,
        };
    }).filter(Boolean) as Event[]; // Filtra quaisquer 'null' (se algum item não pudesse ser mapeado)

    console.log("Eventos processados para o EventCard (após mapeamento para page.tsx):", events);
    return events;
  } catch (error) {
    console.error("Falha geral ao buscar ou processar eventos do Strapi (para page.tsx):", error);
    return []; // Retorna um array vazio em caso de qualquer erro
  }
}

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]); // Tipagem explícita para o estado de eventos
  const [loading, setLoading] = useState(true); // Estado para indicar se os dados estão a carregar

  // useEffect para buscar os dados quando o componente é montado no lado do cliente
  useEffect(() => {
    async function fetchAndSetEvents() {
      console.log("useEffect: Iniciando busca e processamento de eventos na página inicial.");
      const fetchedEvents = await getEvents(); // CHAMADA CORRETA
      console.log("useEffect: Eventos buscados (antes da ordenação/filtragem para page.tsx):", fetchedEvents);

      // Ordena os eventos por data (do mais próximo para o mais distante)
      const sortedEvents = fetchedEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      console.log("useEffect: Eventos ordenados para page.tsx:", sortedEvents);

      // Filtra os eventos para mostrar apenas os futuros
      const now = Date.now(); // Obtém o timestamp atual
      const upcomingEvents = sortedEvents.filter(event => {
        const eventDate = new Date(event.date).getTime(); // Converte a data do evento para timestamp
        const isUpcoming = eventDate >= now; // Compara com o timestamp atual
        return isUpcoming;
      });
      console.log("useEffect: Eventos futuros (após filtragem para page.tsx):", upcomingEvents); // MUITO IMPORTANTE: Verifica este log!

      setEvents(upcomingEvents); // Atualiza o estado com os eventos filtrados e ordenados
      setLoading(false); // Define o estado de carregamento como falso
      console.log("useEffect: Carregamento de eventos concluído para page.tsx.");
    }
    fetchAndSetEvents();
  }, []); // O array vazio assegura que o efeito corre apenas uma vez (ao montar)

  return (
    <main>
      {/* 1. Secção do Banner de Imagem */}
      <section className="relative w-full h-[400px] overflow-hidden">
        <Image
          src="/images/banner.png"
          alt="Pessoas usando tecnologia e interagindo com dados digitais"
          fill
          style={{ objectFit: 'cover' }}
          className="absolute inset-0"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black opacity-30"></div>
      </section>

      {/* 2. Secção Hero */}
      <section className="py-16 px-4 mx-auto max-w-screen-xl text-center bg-[var(--background)]">
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-[var(--foreground)] md:text-5xl lg:text-6xl">
          Bem-vindo ao Nexus Eventos
        </h1>
        <p className="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 lg:px-48 dark:text-gray-400">
          Descubra os próximos eventos e workshops, e junte-se à comunidade!
        </p>
        <div className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
          <Link href="/events" passHref>
            <button className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-[var(--accent-color)] hover:bg-[var(--secondary-accent)] focus:ring-4 focus:ring-[var(--accent-color-light)] transition duration-300 shadow-md">
              Ver Todos os Eventos
              <svg className="ml-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
              </svg>
            </button>
          </Link>
          <Link href="/contact" passHref>
            <button className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center rounded-lg border-2 border-[var(--accent-color)] text-[var(--accent-color)] hover:bg-[var(--accent-color)] hover:text-white focus:ring-4 focus:ring-[var(--accent-color-light)] transition duration-300 shadow-md">
              Contacte-nos
            </button>
          </Link>
        </div>
      </section>

      {/* Secção "Próximos Eventos" com Scroll Horizontal de Cards */}
      <section className="py-12 bg-[var(--background)]">
        <h2 className="text-3xl font-bold text-[var(--foreground)] text-center mb-8 px-4">Próximos Eventos</h2>
        {loading ? (
          <p className="text-center text-[var(--foreground)] text-lg opacity-80">
            A carregar eventos...
          </p>
        ) : events.length > 0 ? (
          <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4">
            {events.map(event => (
              <div key={event.id} className="snap-center flex-shrink-0">
                <EventCard event={event} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-[var(--foreground)] text-lg opacity-80">
            Não há próximos eventos agendados no momento.
          </p>
        )}
      </section>
    </main>
  );
}