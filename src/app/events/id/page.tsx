// src/app/events/[id]/page.tsx
import { Button } from 'flowbite-react';
import { HiArrowLeft } from 'react-icons/hi';
import Link from 'next/link';

interface EventoDetalhes {
  id: number;
  attributes: {
    titulo: string;
    data: string;
    local: string;
    descricao: string;
    vagas?: number; // Exemplo de campo opcional
    // Adiciona aqui outros campos do teu Content Type 'Evento' no Strapi
  };
}

async function getEventDetails(id: string): Promise<EventoDetalhes | null> {
  const res = await fetch(`http://localhost:1337/api/eventos/${id}`, {
    next: { revalidate: 60 }
  });

  if (!res.ok) {
    if (res.status === 404) return null; // Evento não encontrado
    throw new Error('Falha ao buscar detalhes do evento do Strapi');
  }

  const data = await res.json();
  return data.data;
}

export default async function EventDetailsPage({ params }: { params: { id: string } }) {
  const evento = await getEventDetails(params.id);

  if (!evento) {
    return (
      <div className="text-center py-10">
        <h1 className="text-3xl font-bold text-red-600 dark:text-red-400">Evento Não Encontrado</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-4">
          O evento com o ID &quot;{params.id}&quot; não pôde ser encontrado.
        </p>
        <Button as={Link} href="/events" className="mt-8">
          <HiArrowLeft className="mr-2 h-5 w-5" />
          Voltar para Eventos
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
        {evento.attributes.titulo}
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-2">
        **Data:** {new Date(evento.attributes.data).toLocaleDateString()}
      </p>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        **Local:** {evento.attributes.local}
      </p>
      {evento.attributes.vagas && (
        <p className="text-gray-600 dark:text-gray-400 mb-4">
            **Vagas:** {evento.attributes.vagas}
        </p>
      )}

      <div className="prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200">
        <h2 className="text-2xl font-semibold mb-2">Descrição</h2>
        <p>{evento.attributes.descricao}</p>
        {/* Adiciona aqui mais detalhes do evento conforme os teus campos no Strapi */}
      </div>

      <div className="mt-8 flex gap-4">
        <Button as={Link} href="/events" color="light">
          <HiArrowLeft className="mr-2 h-5 w-5" />
          Voltar para Eventos
        </Button>
        {/* Aqui podes adicionar um botão para "Inscrever-me" se tiveres essa funcionalidade */}
        {/* <Button>Inscrever-me</Button> */}
      </div>
    </div>
  );
}