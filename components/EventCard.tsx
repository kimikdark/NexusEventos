// src/components/EventCard.tsx
import { Card, Button } from 'flowbite-react';
import { HiArrowRight } from 'react-icons/hi';
import Link from 'next/link';

interface EventCardProps {
  id: number;
  title: string;
  date: string; // Formato string, ex: "2025-07-20T10:00:00.000Z"
  location: string;
  description: string;
}

export default function EventCard({ id, title, date, location, description }: EventCardProps) {
  // Formatar a data para um formato legível
  const eventDate = new Date(date).toLocaleDateString('pt-PT', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Card className="max-w-sm hover:shadow-lg transition-shadow duration-300 dark:bg-gray-800 dark:border-gray-700">
      <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        {title}
      </h5>
      <p className="font-normal text-gray-700 dark:text-gray-400">
        <span className="font-semibold">Data:</span> {eventDate}
      </p>
      <p className="font-normal text-gray-700 dark:text-gray-400">
        <span className="font-semibold">Local:</span> {location}
      </p>
      {/* Opcional: mostrar uma pequena parte da descrição */}
      <p className="font-light text-gray-600 dark:text-gray-500 line-clamp-3">
        {description}
      </p>
      <Link href={`/events/${id}`} passHref>
        <Button className="bg-primary-brand hover:bg-primary-brand/90 focus:ring-4 focus:ring-primary-brand/50">
          Ver Detalhes
          <HiArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </Link>
    </Card>
  );
}