// src/app/events/[id]/page.tsx
'use client'; // Muito importante para que hooks como useState e useEffect funcionem

import { useState, useEffect, FormEvent } from 'react'; // Importar FormEvent
import { useParams, notFound } from 'next/navigation'; // Importar notFound
import Image from 'next/image';
import Link from 'next/link';

const STRAPI_URL = 'http://localhost:1337'; // Ajusta se o teu Strapi estiver noutro endereço

// Interface para os dados do evento tal como vêm do Strapi
interface StrapiEventDetail {
  id: number;
  attributes: {
    title: string;
    description: string;
    date: string;
    location: string;
    totalVagas: number;
    vagasOcupadas: number;
    status: 'draft' | 'published' | 'cancelled' | 'completed'; // Status do Evento
    image?: {
      data: { // Para um único evento populado, a imagem geralmente vem aninhada em data.attributes
        attributes: {
          url: string;
        };
      } | null;
    };
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
}

// Interface para o estado local do evento na página
interface EventDetail {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  totalVagas: number;
  vagasOcupadas: number;
  vagasDisponiveis: number; // Campo calculado para facilitar
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  imageUrl: string;
}

export default function EventDetailsPage() {
  const { id } = useParams(); // Para pegar o ID da URL
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para o formulário de inscrição
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [registrationMessage, setRegistrationMessage] = useState<string | null>(null);
  const [registrationError, setRegistrationError] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);

  // Função para buscar os detalhes do evento
  const fetchEventDetails = async () => {
    if (!id) return; // Garante que o ID existe antes de fazer a requisição

    setLoading(true);
    setError(null);
    try {
      // Usar `populate=*` para carregar a imagem e outros campos relacionados
      const res = await fetch(`${STRAPI_URL}/api/eventos/${id}?populate=*`, {
        cache: 'no-store', // Importante para sempre obter os dados mais recentes das vagas
      });

      if (!res.ok) {
        if (res.status === 404) {
          notFound(); // Redireciona para a página 404 do Next.js se o evento não for encontrado
        }
        const errorData = await res.json();
        console.error("Erro da API ao buscar detalhes do evento:", errorData);
        throw new Error(errorData.error?.message || `Erro HTTP: ${res.status} ${res.statusText}`);
      }

      const apiResponse: { data: StrapiEventDetail } = await res.json();
      console.log("Detalhes do evento recebidos da API:", apiResponse);

      if (!apiResponse.data || !apiResponse.data.attributes) {
        // Se a API retornar 200 OK mas sem dados ou atributos, tratar como não encontrado
        notFound();
      }

      const item = apiResponse.data;
      const imageUrl = item.attributes.image?.data?.attributes?.url
        ? `${STRAPI_URL}${item.attributes.image.data.attributes.url}`
        : '/images/default-event.jpg'; // Imagem de fallback

      const vagasOcupadas = item.attributes.vagasOcupadas || 0;
      const totalVagas = item.attributes.totalVagas || 0;

      setEvent({
        id: item.id,
        title: item.attributes.title || 'Evento sem título',
        description: item.attributes.description || 'Sem descrição.',
        date: item.attributes.date || 'Data não definida',
        location: item.attributes.location || 'Local não definido',
        totalVagas: totalVagas,
        vagasOcupadas: vagasOcupadas,
        vagasDisponiveis: totalVagas - vagasOcupadas, // Campo calculado
        status: item.attributes.status,
        imageUrl: imageUrl,
      });

    } catch (err: any) {
      console.error("Falha ao carregar detalhes do evento:", err);
      setError(err.message || 'Falha ao carregar detalhes do evento.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventDetails();
  }, [id]); // Dependência no ID para refetch se a rota mudar

  // Lógica para enviar a inscrição (RF5 e RF6)
  const handleRegistrationSubmit = async (e: FormEvent) => { // Use FormEvent
    e.preventDefault();
    if (!event) return; // Não permite inscrição se o evento não estiver carregado

    setIsRegistering(true);
    setRegistrationMessage(null);
    setRegistrationError(null);

    if (event.vagasDisponiveis <= 0) { // Usar vagasDisponiveis do estado local
      setRegistrationError('Este evento já não tem vagas disponíveis.');
      setIsRegistering(false);
      return;
    }

    try {
      // 1. Criar a inscrição
      const inscriptionRes = await fetch(`${STRAPI_URL}/api/inscricoes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: { // IMPORTANTE: O Strapi 4.x espera que o payload esteja dentro de um objeto 'data'
            nome: clientName,
            email: clientEmail,
            evento: event.id, // Liga a inscrição ao evento pelo ID
            // CORREÇÃO AQUI: Usar o novo nome do campo `statusInscricao`
            statusInscricao: 'pending', // Status inicial da inscrição
          },
        }),
      });

      if (!inscriptionRes.ok) {
        const errorData = await inscriptionRes.json();
        console.error("Erro ao criar inscrição:", errorData);
        throw new Error(errorData.error?.message || `Falha ao inscrever: ${inscriptionRes.statusText}`);
      }

      // 2. Atualizar o número de vagas ocupadas no evento (RF6)
      // Certifica-te que o role 'Public' NO STRAPI TEM PERMISSÃO 'UPDATE' PARA O Content-Type 'EVENTO'.
      // Repito, isto é para fins de prototipagem/teste. Em produção, isto deve ser seguro.
      const updatedVagasOcupadas = event.vagasOcupadas + 1; // Incrementa as vagas ocupadas

      const eventUpdateRes = await fetch(`${STRAPI_URL}/api/eventos/${event.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: { // IMPORTANTE: O Strapi 4.x espera que o payload esteja dentro de um objeto 'data'
            vagasOcupadas: updatedVagasOcupadas,
          },
        }),
      });

      if (!eventUpdateRes.ok) {
        const errorData = await eventUpdateRes.json();
        console.error("Erro ao atualizar vagas do evento:", errorData);
        // A inscrição foi feita, mas a atualização das vagas falhou. Informar o utilizador.
        setRegistrationMessage('Inscrição efetuada, mas houve um erro ao atualizar as vagas do evento. Por favor, contacte o administrador.');
        setRegistrationError(errorData.error?.message || `Erro ao atualizar vagas: ${eventUpdateRes.statusText}`);
        // Tentar re-fetch do evento para ter certeza que os dados locais estão sincronizados
        fetchEventDetails();
      } else {
        // Sucesso total
        setRegistrationMessage('Inscrição efetuada com sucesso! Vagas atualizadas.');
        setRegistrationError(null);
        // Atualiza o estado local do evento para refletir as novas vagas imediatamente
        setEvent(prevEvent => prevEvent ? {
          ...prevEvent,
          vagasOcupadas: updatedVagasOcupadas,
          vagasDisponiveis: prevEvent.totalVagas - updatedVagasOcupadas,
        } : null);
      }

      // Limpar formulário
      setClientName('');
      setClientEmail('');

    } catch (err: any) {
      console.error('Erro geral na inscrição ou atualização de vagas:', err);
      setRegistrationError(err.message || 'Falha na inscrição. Tente novamente.');
      setRegistrationMessage(null);
    } finally {
      setIsRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[var(--background)] text-[var(--foreground)] text-xl">
        A carregar detalhes do evento...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-[var(--background)] text-red-500 text-xl p-4">
        <p>Erro: {error}</p>
        <Link href="/" className="text-[var(--accent-color)] hover:underline mt-4">
          Voltar à página inicial
        </Link>
      </div>
    );
  }

  // Se o evento for nulo após o carregamento e sem erro, significa que notFound() já foi chamado ou algo deu muito errado.
  if (!event) {
    return null; // ou um fallback, mas notFound() deve lidar com isso
  }

  const vagasRestantes = event.vagasDisponiveis; // Já está calculado no estado 'event'
  const isFull = vagasRestantes <= 0;
  const isPublished = event.status === 'published';

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] p-6">
      <div className="max-w-4xl mx-auto bg-[var(--secondary-background)] rounded-lg shadow-lg overflow-hidden">
        {event.imageUrl && event.imageUrl !== '/images/default-event.jpg' && ( // Apenas mostra se houver URL válida e não for a fallback
          <div className="relative w-full h-72">
            <Image
              src={event.imageUrl}
              alt={event.title}
              fill
              style={{ objectFit: 'cover' }}
              className="rounded-t-lg"
              priority // Prioriza o carregamento da imagem principal
              sizes="(max-width: 768px) 100vw, 700px"
            />
          </div>
        )}
        <div className="p-8">
          <h1 className="text-4xl font-bold text-[var(--foreground)] mb-4">{event.title}</h1>
          <p className="text-gray-400 text-lg mb-6">{event.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center text-gray-400">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" fillRule="evenodd"></path></svg>
              Data e Hora: {new Date(event.date).toLocaleDateString('pt-PT', {
                year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
              })}
            </div>
            <div className="flex items-center text-gray-400">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path></svg>
              Local: {event.location}
            </div>
            <div className="flex items-center text-gray-400">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zm-3 8a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM11 13a6 6 0 01-6 6v1h12v-1a6 6 0 01-6-6zm4-7a3 3 0 11-6 0 3 3 0 016 0z" clipRule="evenodd" fillRule="evenodd"></path></svg>
              Vagas Disponíveis: <span className={`${isFull ? 'text-red-400 font-bold' : ''}`}>
                {vagasRestantes}
              </span> de {event.totalVagas}
            </div>
            <div className="flex items-center text-gray-400">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                event.status === 'published' ? 'bg-green-500 text-white' :
                event.status === 'draft' ? 'bg-gray-500 text-white' :
                event.status === 'cancelled' ? 'bg-red-500 text-white' :
                'bg-blue-500 text-white'
              }`}>
                Status: {event.status.toUpperCase()}
              </span>
            </div>
          </div>

          <hr className="border-gray-700 my-8" />

          {isPublished && !isFull && (
            <div className="registration-form">
              <h2 className="text-2xl font-bold mb-4">Inscreva-se neste evento!</h2>
              {registrationMessage && (
                <p className={`mb-4 ${registrationError ? 'text-red-500' : 'text-green-500'}`}>{registrationMessage}</p>
              )}
              {/* Removido o registrationError separado, agora consolidado em registrationMessage */}
              <form onSubmit={handleRegistrationSubmit} className="space-y-4">
                <div>
                  <label htmlFor="clientName" className="block text-sm font-medium text-gray-300">Seu Nome:</label> {/* Cor do label ajustada */}
                  <input
                    type="text"
                    id="clientName"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)] bg-gray-800 text-white placeholder-gray-400" // Cores de input ajustadas para o tema
                  />
                </div>
                <div>
                  <label htmlFor="clientEmail" className="block text-sm font-medium text-gray-300">Seu Email:</label> {/* Cor do label ajustada */}
                  <input
                    type="email"
                    id="clientEmail"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)] bg-gray-800 text-white placeholder-gray-400" // Cores de input ajustadas para o tema
                  />
                </div>
                <button
                  type="submit"
                  disabled={isRegistering || isFull}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[var(--accent-color)] hover:bg-[var(--secondary-accent)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent-color)] transition duration-300 disabled:opacity-50"
                >
                  {isRegistering ? 'A Inscrever...' : (isFull ? 'Vagas Esgotadas' : 'Inscrever-se')}
                </button>
              </form>
            </div>
          )}

          {!isPublished && ( // Se o evento não estiver publicado
            <p className="text-center text-red-500 text-lg mt-4">Este evento não está disponível para inscrições (Status: {event.status.toUpperCase()}).</p>
          )}
          {isFull && isPublished && ( // Se estiver cheio e publicado
            <p className="text-center text-red-500 text-lg mt-4">Vagas esgotadas para este evento.</p>
          )}

          <div className="mt-8 text-center">
            <Link href="/events" className="text-[var(--accent-color)] hover:underline">Voltar para a lista de eventos</Link>
          </div>
        </div>
      </div>
    </main>
  );
}