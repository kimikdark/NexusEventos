// src/app/contact/page.tsx
'use client'; // Necessário para usar useState e interatividade

import { Button, Label, TextInput, Textarea, Alert } from 'flowbite-react';
import { HiInformationCircle } from 'react-icons/hi';
import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    assunto: '',
    mensagem: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    // Verifica se os campos MensagemContacto no Strapi incluem 'nome', 'email', 'assunto', 'mensagem'
    // Se o teu Strapi só tiver o campo 'mensagem', terás de ajustar aqui o payload
    const payload = {
      data: { // O Strapi requer que os dados estejam dentro de um objeto 'data'
        nome: formData.nome,
        email: formData.email,
        assunto: formData.assunto,
        mensagem: formData.mensagem,
      },
    };

    try {
      // Ajusta esta URL para o teu endpoint de criação de MensagemContacto no Strapi
      const res = await fetch('http://localhost:1337/api/mensagem-contactos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error?.message || 'Erro ao enviar mensagem.');
      }

      setStatus('success');
      setMessage('Mensagem enviada com sucesso!');
      setFormData({ nome: '', email: '', assunto: '', mensagem: '' }); // Limpa o formulário
    } catch (error) {
      setStatus('error');
      setMessage(`Erro: ${(error as Error).message}`);
    }
  };

  return (
    <section className="bg-white dark:bg-gray-900 py-8">
      <div className="py-8 lg:py-16 px-4 mx-auto max-w-screen-md">
        <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-center text-gray-900 dark:text-white">
          Contacte-nos
        </h2>
        <p className="mb-8 lg:mb-16 font-light text-center text-gray-500 dark:text-gray-400 sm:text-xl">
          Tem alguma questão? Quer enviar feedback? Deixe-nos uma mensagem.
        </p>

        {status === 'success' && (
          <Alert color="success" icon={HiInformationCircle} className="mb-4">
            <span>
              <p>{message}</p>
            </span>
          </Alert>
        )}

        {status === 'error' && (
          <Alert color="failure" icon={HiInformationCircle} className="mb-4">
            <span>
              <p>{message}</p>
            </span>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <Label htmlFor="nome" value="O seu Nome" />
            <TextInput
              id="nome"
              name="nome"
              type="text"
              placeholder="Nome Completo"
              required
              value={formData.nome}
              onChange={handleChange}
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="email" value="O seu Email" />
            <TextInput
              id="email"
              name="email"
              type="email"
              placeholder="name@flowbite.com"
              required
              value={formData.email}
              onChange={handleChange}
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="assunto" value="Assunto" />
            <TextInput
              id="assunto"
              name="assunto"
              type="text"
              placeholder="Qual o motivo do seu contacto?"
              required
              value={formData.assunto}
              onChange={handleChange}
              className="mt-2"
            />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="mensagem" value="A sua Mensagem" />
            <Textarea
              id="mensagem"
              name="mensagem"
              placeholder="Deixe a sua mensagem..."
              required
              rows={6}
              value={formData.mensagem}
              onChange={handleChange}
              className="mt-2"
            />
          </div>
          <Button type="submit" disabled={status === 'loading'} className="w-full">
            {status === 'loading' ? (
              <>
                <Spinner size="sm" light={true} className="mr-2" />
                Enviando...
              </>
            ) : (
              'Enviar Mensagem'
            )}
          </Button>
        </form>
      </div>
    </section>
  );
}