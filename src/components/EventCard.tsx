// src/components/EventCard.tsx
import Link from 'next/link';
import Image from 'next/image';

interface EventCardProps {
  event: {
    id: number;
    title: string;
    description: string;
    date: string;
    location: string;
    imageUrl: string;
  };
}

export default function EventCard({ event }: EventCardProps) {
  const formattedDate = new Date(event.date).toLocaleDateString('pt-PT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return (
    <div className="bg-[var(--secondary-background)] rounded-lg shadow-lg overflow-hidden flex flex-col h-full mx-2 my-2 w-72 flex-none">
      {event.imageUrl && (
        <div className="relative w-full h-48 sm:h-56 md:h-64 overflow-hidden">
          <Image
            src={event.imageUrl}
            alt={event.title}
            fill
            style={{ objectFit: 'cover' }}
            className="rounded-t-lg"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-[var(--foreground)] mb-2 line-clamp-2">
          {event.title}
        </h3>
        <p className="text-[var(--foreground)] text-sm mb-4 line-clamp-3 opacity-80">
          {event.description}
        </p>

        <div className="flex items-center text-[var(--foreground)] text-sm mb-2 opacity-70">
          <svg className="w-4 h-4 mr-2 text-[var(--accent-color)]" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path>
          </svg>
          {formattedDate}
        </div>

        <div className="flex items-center text-[var(--foreground)] text-sm mb-4 opacity-70">
          <svg className="w-4 h-4 mr-2 text-[var(--accent-color)]" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
          </svg>
          {event.location}
        </div>

        <div className="mt-auto pt-4">
        {/* RECOMENDADO: Envolva o botão diretamente com Link e use className no Link se precisar de width total */}
        <Link href={`/events/${event.id}`} className="w-full">
          <button className="w-full bg-[var(--accent-color)] hover:bg-[var(--secondary-accent)] text-white font-bold py-2 px-4 rounded-md transition duration-300 shadow-md">
            Ver Detalhes
          </button>
        </Link>
      </div>
      </div>
    </div>
  );
}