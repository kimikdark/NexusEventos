// src/app/page.tsx
import { Button } from 'flowbite-react';
import { HiArrowRight } from 'react-icons/hi';
import Link from 'next/link';

export default function Home() {
  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16">
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
          Bem-vindo ao Nexus Eventos
        </h1>
        <p className="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 lg:px-48 dark:text-gray-400">
          Descubra os próximos eventos e workshops, e junte-se à comunidade!
        </p>
        <div className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
          <Button as={Link} href="/events" size="xl">
            Ver Todos os Eventos
            <HiArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button as={Link} href="/contact" size="xl" color="light">
            Contacte-nos
          </Button>
        </div>
      </div>
    </section>
  );
}