// src/app/events/[id]/register/page.tsx
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, FormEvent, useEffect } from 'react'; // <<--- useEffect adicionado/garantido aqui
import Link from 'next/link';

interface EventDetailResponseData {
  id: number;
  documentId: string;
  title: string;
  description: string;
  date: string;
  location: string;
  totalVagas: number;
  vagasOcupadas: number;
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  image?: {
    url: string;
  };
}

const STRAPI_URL = 'http://localhost:1337';

export default function RegisterForEventPage() {
  const params = useParams();
  const router = useRouter();
  const eventDocumentId = params.id as string; // O ID do evento (UUID) da URL

  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const [event, setEvent] = useState<EventDetailResponseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Variáveis para as vagas e 'haVagas' (definidas aqui no componente)
  const vagasDisponiveis = event ? event.totalVagas - event.vagasOcupadas : 0;
  const haVagas = vagasDisponiveis > 0; // <<--- haVagas definida aqui

  // 1. Fetch Event Details (para obter o ID numérico e garantir que o evento existe e tem vagas)
  useEffect(() => {
    if (!eventDocumentId) {
      setLoading(false);
      setError('ID do evento não fornecido.');
      return;
    }

    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${STRAPI_URL}/api/eventos?filters[documentId][$eq]=${eventDocumentId}&populate=*`);

        if (!res.ok) {
          if (res.status === 404) {
            throw new Error('Evento não encontrado. (Verifique se o ID está correto e o evento publicado)');
          }
          const errorData = await res.json();
          throw new Error(errorData.error?.message || `Erro ao carregar detalhes do evento: ${res.status} ${res.statusText}`);
        }

        const responseData = await res.json();
        if (responseData && responseData.data && responseData.data.length > 0) {
          const fetchedEvent = responseData.data[0];
          setEvent(fetchedEvent);
          if (fetchedEvent.vagasOcupadas >= fetchedEvent.totalVagas) {
            setError('Desculpe, as vagas para este evento esgotaram.');
          }
        } else {
          throw new Error('Evento não encontrado ou formato de dados inesperado.');
        }
      } catch (err: any) {
        console.error('Falha ao carregar detalhes do evento para inscrição:', err);
        setError(err.message || 'Falha ao carregar detalhes do evento.');
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventDocumentId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    // Usa a variável haVagas para a condição
    if (!event || !haVagas) { // <<--- haVagas usada aqui
      setError('Não é possível inscrever-se: evento não encontrado ou vagas esgotadas.');
      setSubmitting(false);
      return;
    }

    try {
      // 2. Criar Inscrição no Strapi
      const registrationResponse = await fetch(`${STRAPI_URL}/api/inscricaos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Inclui o JWT se o endpoint de inscrição exigir autenticação
          // 'Authorization': `Bearer ${localStorage.getItem('jwt')}`, 
        },
        body: JSON.stringify({
          data: {
            nome: formData.name,
            email: formData.email,
            statusInscricao: 'pendente', // Ou outro status inicial
            evento: event.id, // Liga a inscrição ao ID numérico do evento
          },
        }),
      });

      if (!registrationResponse.ok) {
        const errorData = await registrationResponse.json();
        throw new Error(errorData.error?.message || 'Falha ao registar inscrição.');
      }

      // 3. Atualizar vagasOcupadas no evento
      const updatedVagasOcupadas = event.vagasOcupadas + 1;
      const eventUpdateResponse = await fetch(`${STRAPI_URL}/api/eventos/${event.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          // Inclui o JWT se o endpoint de atualização do evento exigir autenticação
          // 'Authorization': `Bearer ${localStorage.getItem('jwt')}`, 
        },
        body: JSON.stringify({
          data: {
            vagasOcupadas: updatedVagasOcupadas,
          },
        }),
      });

      if (!eventUpdateResponse.ok) {
        const errorData = await eventUpdateResponse.json();
        // Se a atualização de vagas falhar, considere reverter a inscrição ou logar o erro
        console.error('Falha ao atualizar vagas ocupadas:', errorData);
        throw new Error(errorData.error?.message || 'Inscrição registada, mas falha ao atualizar vagas.');
      }

      setSuccess('Inscrição realizada com sucesso! Redirecionando...');
      // Redireciona de volta para a página de detalhes do evento após alguns segundos
      setTimeout(() => {
        router.push(`/events/${eventDocumentId}`);
      }, 2000);

    } catch (err: any) {
      console.error('Erro no processo de inscrição:', err);
      setError(err.message || 'Ocorreu um erro ao processar a sua inscrição.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[var(--background)] text-[var(--foreground)]">
        <p>A carregar detalhes para inscrição...</p>
      </div>
    );
  }

  if (error && error !== 'Desculpe, as vagas para este evento esgotaram.') {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-[var(--background)] text-red-500">
        <p>Erro: {error}</p>
        <Link href={`/events/${eventDocumentId}`} className="mt-4 text-[var(--accent-color)] hover:underline">
          Voltar aos Detalhes do Evento
        </Link>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-[var(--background)] text-[var(--foreground)]">
        <p>Evento não encontrado.</p>
        <Link href="/events" className="mt-4 text-[var(--accent-color)] hover:underline">
          Voltar à Lista de Eventos
        </Link>
      </div>
    );
  }

  // Se as vagas esgotaram, mostra uma mensagem e um link para voltar
  if (!haVagas) { // <<--- haVagas usada aqui
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-[var(--background)] text-red-500">
        <p>As vagas para o evento "{event.title}" esgotaram!</p>
        <Link href={`/events/${eventDocumentId}`} className="mt-4 text-[var(--accent-color)] hover:underline">
          Voltar aos Detalhes do Evento
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] p-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-xl p-8">
        <Link href={`/events/${eventDocumentId}`} className="text-[var(--accent-color)] hover:underline mb-6 block text-lg">
          &larr; Voltar aos Detalhes do Evento
        </Link>

        <h1 className="text-3xl font-bold text-[var(--foreground)] mb-6 text-center">
          Inscrição para: <br /> "{event.title}"
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Vagas restantes: {vagasDisponiveis}
        </p>

        {success && <p className="text-green-600 text-center mb-4">{success}</p>}
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
              Nome Completo:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <button
            type="submit"
            // Usa a variável haVagas para a condição do botão
            disabled={submitting || !haVagas} // <<--- haVagas usada aqui
            className={`w-full py-2 px-4 rounded-lg font-bold transition duration-300 ${
              submitting || !haVagas
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-[var(--accent-color)] hover:bg-[var(--secondary-accent)] text-white shadow-md'
            }`}
          >
            {submitting ? 'A Inscrever...' : 'Confirmar Inscrição'}
          </button>
        </form>
      </div>
    </div>
  );
}