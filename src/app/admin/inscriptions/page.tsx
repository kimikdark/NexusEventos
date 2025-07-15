// src/app/admin/inscriptions/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const STRAPI_URL = 'http://localhost:1337';

interface Inscricao {
  id: number;
  attributes: {
    nome: string;
    email: string;
    status: 'pending' | 'confirmed' | 'cancelled';
    createdAt: string;
    evento: { // Relação com o evento
      data: {
        id: number;
        attributes: {
          title: string;
        };
      } | null;
    };
  };
}

export default function AdminInscriptionsPage() {
  const [inscriptions, setInscriptions] = useState<Inscricao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchInscriptions = useCallback(async () => {
    const jwt = typeof window !== 'undefined' ? localStorage.getItem('jwt') : null;
    if (!jwt) {
      setError('Não autenticado. Por favor, faça login.');
      router.push('/admin/login');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${STRAPI_URL}/api/inscricoes?populate=evento`, { // Popula o evento para pegar o título
        headers: {
          'Authorization': `Bearer ${jwt}`,
        },
        cache: 'no-store',
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("AdminInscriptionsPage: Erro da API ao buscar inscrições:", errorData);
        throw new Error(errorData.error?.message || `Erro HTTP: ${res.status} ${res.statusText}`);
      }

      const responseData = await res.json();
      console.log("Dados recebidos para AdminInscriptionsPage:", responseData);

      if (responseData.data && Array.isArray(responseData.data)) {
        const formattedInscriptions = responseData.data.map((item: any) => ({
            id: item.id,
            attributes: item.attributes
        }));
        setInscriptions(formattedInscriptions);
      } else {
        setError("Formato de dados inesperado da API. O 'data' payload não é um array para inscrições.");
        setInscriptions([]);
      }

    } catch (err: any) {
      console.error('AdminInscriptionsPage: Falha ao carregar inscrições:', err);
      setError(err.message || 'Falha ao carregar inscrições.');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchInscriptions();
  }, [fetchInscriptions]);

  const updateInscriptionStatus = async (id: number, newStatus: 'confirmed' | 'cancelled') => {
    const jwt = typeof window !== 'undefined' ? localStorage.getItem('jwt') : null;
    if (!jwt) {
      alert('Não autenticado. Por favor, faça login.');
      router.push('/admin/login');
      return;
    }

    try {
      const res = await fetch(`${STRAPI_URL}/api/inscricoes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          data: { // Strapi 4.x espera o payload dentro de 'data'
            status: newStatus,
          },
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Erro ao atualizar status da inscrição:", errorData);
        alert(`Falha ao atualizar status: ${errorData.error?.message || res.statusText}`);
        return;
      }

      // Atualiza o estado local para refletir a mudança
      setInscriptions(prevInscriptions =>
        prevInscriptions.map(insc =>
          insc.id === id ? { ...insc, attributes: { ...insc.attributes, status: newStatus } } : insc
        )
      );
      alert(`Status da inscrição atualizado para ${newStatus.toUpperCase()}!`);
    } catch (err: any) {
      console.error('Erro ao atualizar status da inscrição:', err);
      alert(`Erro ao atualizar status: ${err.message || 'Erro de rede'}`);
    }
  };

  if (loading) {
    return (
      <div className="admin-inscriptions-page p-6 bg-white rounded-lg shadow-md min-h-screen">
        <div className="flex justify-center items-center h-full text-[var(--foreground)] text-xl">
          A carregar inscrições...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-inscriptions-page p-6 bg-white rounded-lg shadow-md min-h-screen">
        <div className="text-center p-4 text-red-500 text-lg">
          <p>{error}</p>
          <button
            onClick={() => router.push('/admin/login')}
            className="mt-4 px-4 py-2 bg-[var(--accent-color)] text-white rounded-md hover:bg-[var(--secondary-accent)] transition duration-300"
          >
            Ir para Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-inscriptions-page p-6 bg-white rounded-lg shadow-md min-h-screen">
      <h1 className="text-3xl font-bold text-[var(--foreground)] mb-6">Gerir Inscrições</h1>

      {inscriptions.length === 0 ? (
        <p className="text-center text-gray-500 text-lg mt-10">Não há inscrições para gerir.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Evento</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Inscrição</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {inscriptions.map((insc) => (
                <tr key={insc.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{insc.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{insc.attributes.nome}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{insc.attributes.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {insc.attributes.evento?.data?.attributes?.title || 'Evento Desconhecido'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      insc.attributes.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      insc.attributes.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {insc.attributes.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(insc.attributes.createdAt).toLocaleDateString('pt-PT', {
                      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {insc.attributes.status === 'pending' && (
                      <>
                        <button
                          onClick={() => updateInscriptionStatus(insc.id, 'confirmed')}
                          className="text-green-600 hover:text-green-900 mr-4"
                        >
                          Confirmar
                        </button>
                        <button
                          onClick={() => updateInscriptionStatus(insc.id, 'cancelled')}
                          className="text-red-600 hover:text-red-900"
                        >
                          Cancelar
                        </button>
                      </>
                    )}
                    {insc.attributes.status !== 'pending' && (
                        <span className="text-gray-500 italic">Ação completa</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}