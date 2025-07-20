// src/app/page.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import EventCard from '../components/EventCard';
import { useState, useEffect } from 'react';

// Definir a URL base do teu Strapi API
const STRAPI_URL = 'http://localhost:1337'; // Ajusta se o teu Strapi estiver noutro endereço

// Interface para o formato dos dados dos eventos que vêm diretamente do Strapi API para LISTAGENS.
interface StrapiEvent {
  id: number; // O ID interno numérico do Strapi
  documentId: string; // O seu campo UUID personalizado, que é uma string
  title: string;
  description: string;
  date: string;
  location: string;
  image?: {
    url: string;
  };
  totalVagas?: number;
  vagasOcupadas?: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

// Interface para a estrutura da resposta COMPLETA do Strapi para uma LISTA de eventos
interface StrapiResponse {
  data: StrapiEvent[];
  meta: any;
}

// Interface para o formato do evento que será usado no estado e passado para o EventCard
interface Event {
  id: string; // AGORA É UMA STRING (o documentId)
  title: string;
  description: string;
  date: string;
  location: string;
  imageUrl: string;
}

// Função assíncrona para buscar e processar os eventos do Strapi
async function getEvents(): Promise<Event[]> {
  console.log("A tentar buscar eventos do Strapi para a página inicial...");
  try {
    const res = await fetch(`${STRAPI_URL}/api/eventos?populate=*`, {
      cache: 'no-store',
    });

    console.log("Status da resposta da API (page.tsx):", res.status, res.statusText);

    if (!res.ok) {
      const errorBody = await res.text();
      console.error(`Erro HTTP ao buscar eventos (page.tsx): ${res.status} - ${res.statusText}`, errorBody);
      throw new Error(`Erro ao buscar eventos: ${res.statusText}`);
    }

    const apiResponse: StrapiResponse = await res.json();
    console.log("Dados recebidos da API (raw) para page.tsx:", apiResponse);

    if (!apiResponse || !Array.isArray(apiResponse.data)) {
        console.error("Dados da API não estão no formato esperado (missing apiResponse.data array para page.tsx):", apiResponse);
        return [];
    }

    const events = apiResponse.data.map(item => {
        const imageUrl = item.image?.url
            ? `${STRAPI_URL}${item.image.url}`
            : '/images/default-event.jpg';

        if (!item.documentId) {
          console.warn(`Evento com ID numérico ${item.id} não tem documentId. Será ignorado ou terá um ID inválido.`);
          return null; // Retorna null para filtrar depois
        }

        return {
            id: item.documentId, // AGORA USA O DOCUMENT_ID (STRING)
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
    return [];
  }
}

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAndSetEvents() {
      console.log("useEffect: Iniciando busca e processamento de eventos na página inicial.");
      const fetchedEvents = await getEvents();
      console.log("useEffect: Eventos buscados (antes da ordenação/filtragem para page.tsx):", fetchedEvents);

      const sortedEvents = fetchedEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      console.log("useEffect: Eventos ordenados para page.tsx:", sortedEvents);

      const now = Date.now();
      const upcomingEvents = sortedEvents.filter(event => {
        const eventDate = new Date(event.date).getTime();
        const isUpcoming = eventDate >= now;
        return isUpcoming;
      });
      console.log("useEffect: Eventos futuros (após filtragem para page.tsx):", upcomingEvents);

      setEvents(upcomingEvents);
      setLoading(false);
      console.log("useEffect: Carregamento de eventos concluído para page.tsx.");
    }
    fetchAndSetEvents();
  }, []);

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
          sizes="100vw" // Adicionado para otimização com fill
        />
        <div className="absolute inset-0 bg-black opacity-30"></div>
      </section>

      {/* 2. Secção Hero */}
      <section className="py-16 px-4 mx-auto max-w-screen-xl text-center bg-[var(--background)]">
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-[var(--foreground)] md:text-5xl lg:text-6xl">
          Bem-vindo ao Nexus Events
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

      {/* 3. Nova Secção: Sobre o Negócio */}
      {/* Adicionado id="about-us" aqui para o link de âncora funcionar na Navbar */}
      <section id="about-us" className="py-12 px-4 mx-auto max-w-screen-xl bg-[var(--background)]">
        <h2 className="text-3xl font-bold text-[var(--foreground)] text-center mb-8">Sobre o Nexus Events</h2>
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="md:order-2">
            <Image
              src="/images/pc.jpg"
              alt="Sobre nós"
              width={500}
              height={300}
              className="rounded-lg shadow-lg w-full h-auto"
            />
          </div>
          <div className="md:order-1 text-center md:text-left">
            <p className="text-lg text-gray-500 mb-4">
              O Nexus Events é a sua plataforma dedicada à gestão e descoberta de eventos incríveis. Acreditamos que a partilha de conhecimento e a conexão entre pessoas são fundamentais para o crescimento pessoal e profissional.
            </p>
            <p className="text-lg text-gray-500">
              Desde workshops práticos a sessões de consultoria especializadas, o nosso objetivo é simplificar a forma como os pequenos negócios organizam e gerem os seus eventos, e como os participantes encontram as oportunidades que mais lhes interessam. Junte-se a nós e descubra um mundo de aprendizagem e networking!
            </p>
          </div>
        </div>
      </section>

      {/* 4. Nova Secção: Precisa de Ajuda? (Com imagem e texto lado a lado) */}
      <section className="py-12 px-4 bg-[var(--background)]"> {/* Ocupa a largura total da secção */}
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Imagem Placeholder (Esquerda em ecrãs grandes, Topo em ecrãs pequenos) */}
          <div className="md:order-1"> {/* Ordem explícita para responsividade */}
            <Image
              src="/images/call.jpg" // Exemplo de imagem, ajusta o caminho ou usa URL
              alt="Pessoas em contacto, ilustração de apoio"
              width={600} // Largura intrínseca para otimização de imagem
              height={400} // Altura intrínseca para otimização de imagem
              className="rounded-lg shadow-md w-full h-auto object-cover"
            />
          </div>

          {/* Texto e Botão (Direita em ecrãs grandes, Baixo em ecrãs pequenos) */}
          <div className="md:order-2 text-center md:text-left">
            <h2 className="text-3xl font-bold text-[var(--foreground)] mb-4">Precisa de Ajuda ou Tem Dúvidas?</h2>
            <p className="text-lg text-gray-500 mb-6">
              Estamos aqui para ajudar! Se tiver alguma questão, sugestão ou quiser saber mais sobre os nossos eventos, não hesite em entrar em contacto.
            </p>
            <Link href="/contact" passHref>
              <button className="inline-flex justify-center items-center py-3 px-8 text-base font-medium text-center text-white rounded-lg bg-[var(--accent-color)] hover:bg-[var(--secondary-accent)] focus:ring-4 focus:ring-[var(--accent-color-light)] transition duration-300 shadow-md">
                Fale Connosco
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Secção "Próximos Eventos" com Scroll Horizontal de Cards */}
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