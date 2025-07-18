// src/components/EventCard.tsx
'use client';
import Link from 'next/link';
import Image from 'next/image';

interface EventProps {
  event: {
    id: string; // <<--- ALTERADO PARA STRING (UUID)
    title: string;
    description: string;
    date: string;
    location: string;
    imageUrl: string;
  };
}

const EventCard: React.FC<EventProps> = ({ event }) => {
  // Limita a descrição para evitar cards muito longos
  const trimmedDescription = event.description.length > 100
    ? event.description.substring(0, 97) + '...'
    : event.description;

  // Formata a data para melhor leitura
  const formattedDate = new Date(event.date).toLocaleDateString('pt-PT', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="w-80 bg-[var(--secondary-background)] rounded-lg shadow-lg overflow-hidden m-4 flex flex-col">
      {event.imageUrl && (
        <div className="relative w-full h-48 overflow-hidden">
          <Image
            src={event.imageUrl}
            alt={event.title}
            fill
            style={{ objectFit: 'cover' }}
            className="rounded-t-lg"
          />
        </div>
      )}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-[var(--foreground)] mb-2 line-clamp-2">{event.title}</h3>
        <p className="text-[var(--foreground)] text-sm mb-4 line-clamp-3 opacity-80">{trimmedDescription}</p>
        <div className="flex items-center text-[var(--foreground)] text-sm mb-2 opacity-70">
          <svg className="w-4 h-4 mr-2 text-[var(--accent-color)]" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path>
          </svg>
          {formattedDate}
        </div>
        <div className="flex items-center text-[var(--foreground)] text-sm opacity-70">
          <svg className="w-4 h-4 mr-2 text-[var(--accent-color)]" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
          </svg>
          {event.location}
        </div>
        <div className="mt-auto pt-4">
          {/* O Link usará o documentId (UUID) que agora será passado como event.id */}
          <Link href={`/events/${event.id}`} className="w-full">
            <button className="w-full bg-[var(--accent-color)] hover:bg-[var(--secondary-accent)] text-white font-bold py-2 px-4 rounded-md transition duration-300 shadow-md">
              Ver Detalhes
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;