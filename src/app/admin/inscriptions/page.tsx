// src/app/admin/inscriptions/page.tsx
/*'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
// Mantenha apenas o Spinner se desejar, ou substitua por HTML/CSS puro
import { Spinner } from 'flowbite-react';
// Ícone para a modal (não é do Flowbite-React, é de react-icons)
import { HiOutlineExclamationCircle } from 'react-icons/hi';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337';

interface Inscricao {
    id: number;
    attributes: {
        nome: string;
        email: string;
        statusinscricao: 'pending' | 'confirmed' | 'cancelled';
        createdAt: string;
        evento: {
            data: {
                id: string | number;
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
    const [showModal, setShowModal] = useState(false);
    const [selectedInscription, setSelectedInscription] = useState<Inscricao | null>(null);
    const [newStatus, setNewStatus] = useState<string>('');
    const [filterText, setFilterText] = useState<string>('');
    const router = useRouter();

    const fetchInscriptions = useCallback(async () => {
        setLoading(true);
        setError(null);
        const jwt = typeof window !== 'undefined' ? localStorage.getItem('jwt') : null;

        if (!jwt) {
            setError('Não autenticado. Por favor, faça login.');
            router.push('/admin/login');
            setLoading(false);
            return;
        }

        try {
            const res = await fetch(`${STRAPI_URL}/api/inscricoes?populate=evento`, {
                headers: {
                    'Authorization': `Bearer ${jwt}`,
                    'Content-Type': 'application/json',
                },
                cache: 'no-store',
            });

            if (!res.ok) {
                if (res.status === 401 || res.status === 403) {
                    localStorage.removeItem('jwt'); // Remove token inválido
                    router.push('/admin/login');
                    return;
                }
                const errorData = await res.json();
                console.error("AdminInscriptionsPage: Erro da API ao buscar inscrições:", errorData);
                throw new Error(errorData.error?.message || `Erro HTTP: ${res.status} ${res.statusText}`);
            }

            const responseData = await res.json();
            console.log("Dados recebidos para AdminInscriptionsPage:", responseData);

            if (responseData.data && Array.isArray(responseData.data)) {
                setInscriptions(responseData.data as Inscricao[]);
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

    const handleOpenStatusModal = (inscription: Inscricao) => {
        setSelectedInscription(inscription);
        setNewStatus(inscription.attributes.statusinscricao);
        setShowModal(true);
    };

    const updateInscriptionStatus = async () => {
        if (!selectedInscription || !newStatus) return;

        setLoading(true);
        setError(null);
        const jwt = typeof window !== 'undefined' ? localStorage.getItem('jwt') : null;
        if (!jwt) {
            alert('Não autenticado. Por favor, faça login.');
            router.push('/admin/login');
            setLoading(false);
            return;
        }

        try {
            const res = await fetch(`${STRAPI_URL}/api/inscricoes/${selectedInscription.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwt}`,
                },
                body: JSON.stringify({
                    data: {
                        statusinscricao: newStatus,
                    },
                }),
            });

            if (!res.ok) {
                if (res.status === 401 || res.status === 403) {
                    localStorage.removeItem('jwt');
                    router.push('/admin/login');
                    return;
                }
                const errorData = await res.json();
                console.error("Erro ao atualizar status da inscrição:", errorData);
                throw new Error(errorData.error?.message || `Erro HTTP: ${res.statusText}`);
            }

            setInscriptions(prevInscriptions =>
                prevInscriptions.map(insc =>
                    insc.id === selectedInscription.id ? {
                        ...insc,
                        attributes: {
                            ...insc.attributes,
                            statusinscricao: newStatus as 'pending' | 'confirmed' | 'cancelled'
                        }
                    } : insc
                )
            );
            setShowModal(false);
            setSelectedInscription(null);
            setNewStatus('');
            alert('Status da inscrição atualizado com sucesso!');
        } catch (err: any) {
            console.error('Erro ao atualizar status da inscrição:', err);
            setError(err.message || 'Erro ao atualizar status da inscrição.');
        } finally {
            setLoading(false);
        }
    };

    const filteredInscriptions = inscriptions.filter(insc =>
        insc.attributes.nome.toLowerCase().includes(filterText.toLowerCase()) ||
        insc.attributes.email.toLowerCase().includes(filterText.toLowerCase()) ||
        (insc.attributes.evento?.data?.attributes?.title || '').toLowerCase().includes(filterText.toLowerCase()) ||
        insc.attributes.statusinscricao.toLowerCase().includes(filterText.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Spinner size="xl" />
                <span className="ml-2 text-xl text-white">A carregar inscrições...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-500 text-lg mt-8">
                <p>Erro: {error}</p>
                {/* Botão HTML nativo 
                <button
                    onClick={() => fetchInscriptions()}
                    className="mt-4 px-6 py-3 rounded-md bg-[var(--accent-color)] hover:bg-[var(--secondary-accent)] text-white font-semibold transition-colors"
                >
                    Tentar Novamente
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 bg-[var(--background)] min-h-screen text-white">
            <h1 className="text-3xl font-bold mb-6 text-center text-[var(--foreground)]">Gerir Inscrições</h1>

            <div className="mb-4">
                {/* TextInput HTML nativo}
                <input
                    id="filter"
                    type="text"
                    placeholder="Filtrar por nome, email, evento ou status..."
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                    className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] focus:border-transparent"
                />
            </div>

            {filteredInscriptions.length === 0 && !loading && !error ? (
                <p className="text-center text-gray-400 text-xl mt-10">Não há inscrições para gerir.</p>
            ) : (
                <div className="overflow-x-auto rounded-lg shadow-lg">
                    {/* Tabela HTML nativa }
                    <table className="min-w-full bg-[var(--secondary-background)] text-white">
                        <thead>
                            <tr className="bg-gray-700 text-white uppercase text-sm leading-normal">
                                <th className="py-3 px-6 text-left">ID</th>
                                <th className="py-3 px-6 text-left">Nome</th>
                                <th className="py-3 px-6 text-left">Email</th>
                                <th className="py-3 px-6 text-left">Evento</th>
                                <th className="py-3 px-6 text-left">Status</th>
                                <th className="py-3 px-6 text-left">Data Inscrição</th>
                                <th className="py-3 px-6 text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {filteredInscriptions.map((insc) => (
                                <tr key={insc.id} className="border-b border-gray-700 hover:bg-gray-800">
                                    <td className="py-3 px-6 text-left whitespace-nowrap font-medium">{insc.id}</td>
                                    <td className="py-3 px-6 text-left">{insc.attributes.nome}</td>
                                    <td className="py-3 px-6 text-left">{insc.attributes.email}</td>
                                    <td className="py-3 px-6 text-left">
                                        {insc.attributes.evento?.data?.attributes?.title || 'Evento Desconhecido'}
                                    </td>
                                    <td className="py-3 px-6 text-left">
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                insc.attributes.statusinscricao === 'confirmed'
                                                    ? 'bg-green-600 text-white'
                                                    : insc.attributes.statusinscricao === 'pending'
                                                    ? 'bg-yellow-600 text-white'
                                                    : 'bg-red-600 text-white'
                                            }`}
                                        >
                                            {insc.attributes.statusinscricao.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="py-3 px-6 text-left whitespace-nowrap text-sm">
                                        {new Date(insc.attributes.createdAt).toLocaleDateString('pt-PT', {
                                            year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                        })}
                                    </td>
                                    <td className="py-3 px-6 text-center">
                                        {/* Botão HTML nativo }
                                        <button
                                            onClick={() => handleOpenStatusModal(insc)}
                                            className="px-4 py-2 text-sm rounded-md bg-[var(--accent-color)] hover:bg-[var(--secondary-accent)] text-white font-medium transition-colors"
                                        >
                                            Alterar Status
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal customizada com Tailwind CSS - Sem Flowbite Modal }
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
                    <div className="bg-gray-800 rounded-lg shadow-xl p-6 m-4 max-w-sm w-full text-white border border-gray-700">
                        <div className="flex justify-end">
                            {/* Botão de fechar a modal }
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-200">
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="text-center mt-4">
                            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400" />
                            <h3 className="mb-5 text-lg font-normal text-gray-300">
                                Tem certeza que deseja alterar o status da inscrição de {selectedInscription?.attributes.nome}?
                            </h3>
                            <div className="mb-4">
                                {/* Label e Select HTML nativos }
                                <label htmlFor="statusSelect" className="block mb-2 text-sm font-medium text-gray-300 text-left">
                                    Novo Status
                                </label>
                                <select
                                    id="statusSelect"
                                    value={newStatus}
                                    onChange={(e) => setNewStatus(e.target.value as 'pending' | 'confirmed' | 'cancelled')}
                                    required
                                    className="w-full p-2.5 rounded-md bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] focus:border-transparent"
                                >
                                    <option value="pending">PENDING</option>
                                    <option value="confirmed">CONFIRMED</option>
                                    <option value="cancelled">CANCELLED</option>
                                </select>
                            </div>
                            <div className="flex justify-center gap-4 mt-6">
                                {/* Botões HTML nativos }
                                <button
                                    onClick={updateInscriptionStatus}
                                    className="px-5 py-2.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-800 transition-colors"
                                >
                                    Confirmar
                                </button>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="px-5 py-2.5 text-sm font-medium text-gray-900 bg-gray-300 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-400 transition-colors"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}*/