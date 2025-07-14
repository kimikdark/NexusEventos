// src/components/EventCard.tsx (exemplo)
import Link from 'next/link';
import Image from 'next/image'; // Certifica-te que Image é importado se usares

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
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col h-full">
      {event.imageUrl && (
        <div className="relative w-full h-48 sm:h-56 md:h-64 overflow-hidden">
          <Image
            src={event.imageUrl}
            alt={event.title}
            fill
            style={{ objectFit: 'cover' }}
            className="rounded-t-lg"
          />
        </div>
      )}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{event.title}</h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">{event.description}</p>
        <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-2">
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path></svg>
          {new Date(event.date).toLocaleDateString('pt-PT')}
        </div>
        <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-4">
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path></svg>
          {event.location}
        </div>
        <div className="mt-auto">
          <Link href={`/events/${event.id}`} passHref> {/* MUDANÇA AQUI */}
            <button className="w-full bg-[var(--accent-color)] hover:bg-[var(--secondary-accent)] text-white font-bold py-2 px-4 rounded-md transition duration-300">
              Ver Detalhes
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}