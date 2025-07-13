// src/components/EventCard.tsx
'use client';

import React from 'react';
import { Card } from 'flowbite-react';
import Image from 'next/image';
import Link from 'next/link';
import { HiCalendar, HiLocationMarker } from 'react-icons/hi';

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  imageUrl: string;
}

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  return (
    // Aumentar a largura máxima do cartão e adicionar um espaçamento maior
    <Card className="max-w-md mx-auto shadow-lg hover:shadow-xl transition-shadow duration-300 dark:bg-gray-800 dark:border-gray-700 p-0 overflow-hidden">
      <Link href={`/events/${event.id}`}>
        {/* Aumentar a altura da imagem */}
        <div className="relative w-full h-64 sm:h-72"> {/* Aumentado de h-48 para h-64/h-72 */}
          <Image
            src={event.imageUrl}
            alt={event.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: 'cover' }}
            className="rounded-t-lg"
          />
        </div>
        {/* Adicionar padding e ajustar fontes para mais destaque */}
        <div className="p-4 pt-2"> {/* Adicionado padding */}
            <h5 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white mt-2 mb-2 leading-tight"> {/* Aumentado de text-2xl para text-3xl, font-bold para font-extrabold */}
              {event.title}
            </h5>
          <p className="font-normal text-gray-700 dark:text-gray-400 line-clamp-3 mb-3">
            {event.description}
          </p>
          <div className="flex items-center text-gray-600 dark:text-gray-400 text-base mt-2">
            <HiCalendar className="mr-2 h-5 w-5" />
            <span>{new Date(event.date).toLocaleDateString('pt-PT', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-400 text-base mt-1 mb-4">
            <HiLocationMarker className="mr-2 h-5 w-5" />
            <span>{event.location}</span>
          </div>
        </div>
      </Link>
      <Link href={`/events/${event.id}`} className="block text-center px-4 pb-4">
        <button className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors duration-300"> {/* Botão maior e mais proeminente */}
          Ver Detalhes
        </button>
      </Link>
    </Card>
  );
}