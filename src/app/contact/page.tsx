// src/app/contact/page.tsx
'use client'; // Este é um Client Component porque terá interatividade (o formulário)

import React, { useState } from 'react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState(''); // Para feedback ao utilizador

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Previne o reload da página

    setStatus('A enviar...');

    try {
      const res = await fetch('http://localhost:1337/api/mensagem-de-contactos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: { name, email, message } }), // Strapi espera { data: { ... } }
      });

      if (res.ok) {
        setStatus('Mensagem enviada com sucesso!');
        setName('');
        setEmail('');
        setMessage('');
      } else {
        const errorData = await res.json();
        console.error('Erro ao enviar mensagem:', errorData);
        setStatus(`Falha ao enviar mensagem: ${errorData.error?.message || res.statusText}`);
      }
    } catch (error) {
      console.error('Erro de rede ao enviar mensagem:', error);
      setStatus('Erro de rede. Por favor, tente novamente.');
    }
  };

  return (
    <section className="contact-form py-12 px-4 max-w-2xl mx-auto">
      <h1 className="text-5xl font-extrabold text-center mb-12 text-gray-800 dark:text-white">
        Contacta-nos
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Nome:
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent-500 focus:border-accent-500 sm:text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Email:
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent-500 focus:border-accent-500 sm:text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Mensagem:
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent-500 focus:border-accent-500 sm:text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600"
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[var(--accent-color)] hover:bg-[var(--secondary-accent)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent-color)]"
        >
          Enviar Mensagem
        </button>
        {status && (
          <p className="mt-4 text-center text-sm font-medium text-gray-600 dark:text-gray-300">
            {status}
          </p>
        )}
      </form>
    </section>
  );
}