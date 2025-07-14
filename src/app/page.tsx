// src/app/page.tsx
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <main>
      {/* 1. Secção do Banner de Imagem (Apenas a Imagem como destaque visual) */}
      <section className="relative w-full h-[400px] overflow-hidden"> {/* Altura ligeiramente ajustada, experimente 350px, 400px, 450px */}
        <Image
          src="/images/banner.png" // Caminho para a imagem na pasta public/images/
          alt="Pessoas usando tecnologia e interagindo com dados digitais"
          fill // Faz com que a imagem preencha o container
          style={{ objectFit: 'cover' }} // Estilos para cobrir a área
          className="absolute inset-0" // Posicionamento absoluto para preencher
          priority // Otimiza o carregamento por ser uma imagem acima da dobra
        />
        {/* Adiciona um overlay sutil para dar um toque de profundidade ou se a imagem for muito clara */}
        <div className="absolute inset-0 bg-black opacity-30"></div>
      </section>

      {/* 2. Secção Hero (Título, Descrição e Botões) - Abaixo do banner, com fundo sólido */}
      <section className="py-16 px-4 mx-auto max-w-screen-xl text-center bg-[var(--background)]"> {/* Usa a tua variável CSS para o fundo */}
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-[var(--foreground)] md:text-5xl lg:text-6xl">
          Bem-vindo ao Nexus Eventos
        </h1>
        <p className="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 lg:px-48 dark:text-gray-400">
          Descubra os próximos eventos e workshops, e junte-se à comunidade!
        </p>
        <div className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
          {/* Botão "Ver Todos os Eventos" - Cor de acento primária */}
          <Link href="/events" passHref>
            <button className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-[var(--accent-color)] hover:bg-[var(--secondary-accent)] focus:ring-4 focus:ring-[var(--accent-color-light)] transition duration-300 shadow-md">
              Ver Todos os Eventos
              <svg className="ml-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
              </svg>
            </button>
          </Link>

          {/* Botão "Contacte-nos" - Agora mais visível no tema escuro */}
          <Link href="/contact" passHref>
            <button className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center rounded-lg border-2 border-[var(--accent-color)] text-[var(--accent-color)] hover:bg-[var(--accent-color)] hover:text-white focus:ring-4 focus:ring-[var(--accent-color-light)] transition duration-300 shadow-md">
              Contacte-nos
            </button>
          </Link>
        </div>
      </section>

      {/* Secção "Próximos Eventos" */}
      <section className="py-12 px-4 max-w-screen-xl mx-auto bg-[var(--background)]">
        <h2 className="text-3xl font-bold text-[var(--foreground)] text-center mb-8">Próximos Eventos</h2>
        {/* Placeholder para os cards de eventos ou outro conteúdo */}
      </section>
    </main>
  );
}