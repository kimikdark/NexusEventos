// src/app/contact/page.tsx
import React from 'react';

export const metadata = {
  title: 'Contacte-nos',
  description: 'Entre em contacto com a Nexus Eventos.',
};

export default function ContactPage() {
  return (
    <section className="contact-section py-12">
      <h1 className="text-5xl font-extrabold text-center mb-12 text-gray-800 dark:text-white">
        Contacte-nos
      </h1>
      <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
          Estamos aqui para ajudar! Se tiver alguma questão, sugestão ou feedback, por favor, entre em contacto connosco.
        </p>
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">Informações de Contacto</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Email: <a href="mailto:info@nexuseventos.pt" className="text-blue-600 hover:underline">info@nexuseventos.pt</a>
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              Telefone: +351 987 654 321
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              Morada: Rua dos Eventos, 123, 1000-000 Lisboa, Portugal
            </p>
          </div>
          {/* Podes adicionar um formulário de contacto aqui, se quiseres */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">Horário de Funcionamento</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Segunda a Sexta: 9h00 - 18h00
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              Sábado e Domingo: Encerrado
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}