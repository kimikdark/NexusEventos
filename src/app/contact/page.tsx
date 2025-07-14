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
    <section className="contact-form py-12 px-4 max-w-3xl mx-auto">
      {/* O título mantém a cor do foreground para contraste com o fundo da página */}
      <h1 className="text-5xl font-extrabold text-center mb-12 text-[var(--foreground)]">
        Contacta-nos
      </h1>
      {/* NOVO: Fundo do formulário agora é accent-color (o mesmo da Navbar/Footer) */}
      <form onSubmit={handleSubmit} className="space-y-6 bg-[var(--accent-color)] p-8 rounded-lg shadow-lg">
        <div>
          {/* NOVO: Labels agora são brancas */}
          <label htmlFor="name" className="block text-sm font-medium text-white">
            Nome:
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            // Inputs com fundo branco e texto branco ou levemente escurecido para contraste, bordas cinzentas claras
            // A cor do texto pode ser branca ou uma cor muito clara para contraste no fundo azul.
            // Aqui, mantemos o texto branco e o fundo dos inputs como um azul muito escuro para contraste.
            className="mt-1 block w-full px-3 py-2 border border-[var(--secondary-accent)] rounded-md shadow-sm focus:outline-none focus:ring-[var(--secondary-accent)] focus:border-[var(--secondary-accent)] sm:text-sm bg-[#1A202C] text-white placeholder-gray-400"
            // Adicionado placeholder-gray-400 para garantir que o placeholder seja visível
          />
        </div>
        <div>
          {/* NOVO: Labels agora são brancas */}
          <label htmlFor="email" className="block text-sm font-medium text-white">
            Email:
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-[var(--secondary-accent)] rounded-md shadow-sm focus:outline-none focus:ring-[var(--secondary-accent)] focus:border-[var(--secondary-accent)] sm:text-sm bg-[#1A202C] text-white placeholder-gray-400"
          />
        </div>
        <div>
          {/* NOVO: Labels agora são brancas */}
          <label htmlFor="message" className="block text-sm font-medium text-white">
            Mensagem:
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            required
            className="mt-1 block w-full px-3 py-2 border border-[var(--secondary-accent)] rounded-md shadow-sm focus:outline-none focus:ring-[var(--secondary-accent)] focus:border-[var(--secondary-accent)] sm:text-sm bg-[#1A202C] text-white placeholder-gray-400"
          ></textarea>
        </div>
        <button
          type="submit"
          // O botão pode manter a accent-color ou usar a secondary-accent para um destaque diferente
          // Vamos usar secondary-accent aqui para um contraste no form azul
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[var(--secondary-accent)] hover:bg-[#0097A7] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--secondary-accent)]"
        >
          Enviar Mensagem
        </button>
        {status && (
          <p className="mt-4 text-center text-sm font-medium text-white">
            {status}
          </p>
        )}
      </form>
    </section>
  );
}