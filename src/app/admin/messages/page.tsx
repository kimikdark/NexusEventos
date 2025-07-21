// src/app/admin/messages/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { HiOutlineExclamationCircle } from 'react-icons/hi'; 

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337';

// Interface para a estrutura de dados de uma Mensagem recebida do Strapi
interface Message {
    id: number;
    name: string;
    email: string;
    message: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
}

export default function AdminMessagesPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [messageToDelete, setMessageToDelete] = useState<Message | null>(null);
    const [filterText, setFilterText] = useState<string>('');
    const router = useRouter();

    const fetchMessages = useCallback(async () => {
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
            const res = await fetch(`${STRAPI_URL}/api/mensagem-de-contactos`, {
                headers: {
                    'Authorization': `Bearer ${jwt}`,
                    'Content-Type': 'application/json',
                },
                cache: 'no-store',
            });

            if (!res.ok) {
                if (res.status === 401 || res.status === 403) {
                    localStorage.removeItem('jwt');
                    router.push('/admin/login');
                    return;
                }
                const errorData = await res.json();
                console.error("AdminMessagesPage: Erro da API ao buscar mensagens:", errorData);
                throw new Error(errorData.error?.message || `Erro HTTP: ${res.status} ${res.statusText}`);
            }

            const responseData = await res.json();
            console.log("Dados recebidos para AdminMessagesPage:", responseData);

            if (responseData.data && Array.isArray(responseData.data)) {
                setMessages(responseData.data.map((item: any) => ({
                    id: item.id,
                    ...item // Espalha as propriedades diretamente, assumindo que já estão planas
                }) as Message));
            } else {
                setError("Formato de dados inesperado da API. O 'data' payload não é um array para mensagens.");
                setMessages([]);
            }

        } catch (err: any) {
            console.error('AdminMessagesPage: Falha ao carregar mensagens:', err);
            setError(err.message || 'Falha ao carregar mensagens.');
        } finally {
            setLoading(false);
        }
    }, [router]);

    useEffect(() => {
        fetchMessages();
    }, [fetchMessages]);

    const handleOpenDeleteModal = (message: Message) => {
        setMessageToDelete(message);
        setShowDeleteModal(true);
    };

    const handleDeleteMessage = async () => {
        if (!messageToDelete) return;

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
            const res = await fetch(`${STRAPI_URL}/api/mensagem-de-contactos/${messageToDelete.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${jwt}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!res.ok) {
                if (res.status === 401 || res.status === 403) {
                    localStorage.removeItem('jwt');
                    router.push('/admin/login');
                    return;
                }
                const errorData = await res.json();
                console.error("Erro ao eliminar mensagem:", errorData);
                throw new Error(errorData.error?.message || `Erro HTTP: ${res.statusText}`);
            }

            setMessages(prevMessages =>
                prevMessages.filter(msg => msg.id !== messageToDelete.id)
            );
            setShowDeleteModal(false);
            setMessageToDelete(null);
            alert('Mensagem eliminada com sucesso!');
        } catch (err: any) {
            console.error('Erro ao eliminar mensagem:', err);
            setError(err.message || 'Erro ao eliminar mensagem.');
        } finally {
            setLoading(false);
        }
    };

    const filteredMessages = messages.filter(msg =>
        (msg.name || '').toLowerCase().includes(filterText.toLowerCase()) ||
        (msg.email || '').toLowerCase().includes(filterText.toLowerCase()) ||
        (msg.message || '').toLowerCase().includes(filterText.toLowerCase())
    );

    const LoadingSpinner = () => (
        <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
            <span className="ml-2 text-xl text-[var(--foreground)]">A carregar mensagens...</span>
        </div>
    );

    const ErrorDisplay = () => (
        <div className="text-center text-red-500 text-lg mt-8">
            <p>Erro: {error}</p>
            <button
                onClick={() => fetchMessages()}
                className="mt-4 px-6 py-3 rounded-md bg-[var(--accent-color)] hover:bg-[var(--secondary-accent)] text-white font-semibold transition-colors"
            >
                Tentar Novamente
            </button>
        </div>
    );

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <ErrorDisplay />;
    }

    return (
        <div className="container mx-auto p-4 bg-[var(--background)] min-h-screen text-[var(--foreground)]">
            <h1 className="text-3xl font-bold mb-6 text-center text-[var(--foreground)]">Gerir Mensagens</h1>

            <div className="mb-4">
                <input
                    id="filter"
                    type="text"
                    placeholder="Filtrar por nome, email ou conteúdo da mensagem..."
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                    className="w-full p-3 rounded-md bg-[var(--secondary-background)] border border-[var(--border-color)] text-[var(--foreground)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] focus:border-transparent"
                />
            </div>

            {filteredMessages.length === 0 ? (
                <p className="text-center text-[var(--text-muted)] text-xl mt-10">Não há mensagens para gerir.</p>
            ) : (
                <div className="overflow-x-auto rounded-lg shadow-lg">
                    <table className="min-w-full bg-[var(--secondary-background)] text-[var(--foreground)]">
                        <thead>
                            <tr className="bg-[var(--header-background)] text-[var(--header-foreground)] uppercase text-sm leading-normal">
                                <th className="py-3 px-6 text-left">ID</th>
                                <th className="py-3 px-6 text-left">Nome</th>
                                <th className="py-3 px-6 text-left">Email</th>
                                <th className="py-3 px-6 text-left">Mensagem</th>
                                <th className="py-3 px-6 text-left">Data Recebida</th>
                                <th className="py-3 px-6 text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-color)]">
                            {filteredMessages.map((msg) => (
                                <tr key={msg.id} className="border-b border-[var(--border-color)] hover:bg-[var(--hover-background)]">
                                    <td className="py-3 px-6 text-left whitespace-nowrap font-medium">{msg.id}</td>
                                    <td className="py-3 px-6 text-left">{msg.name}</td>
                                    <td className="py-3 px-6 text-left">{msg.email}</td>
                                    <td className="py-3 px-6 text-left max-w-xs overflow-hidden text-ellipsis whitespace-nowrap"
                                        title={msg.message}
                                    >
                                        {msg.message}
                                    </td>
                                    <td className="py-3 px-6 text-left whitespace-nowrap text-sm">
                                        {new Date(msg.createdAt).toLocaleDateString('pt-PT', {
                                            year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                        })}
                                    </td>
                                    <td className="py-3 px-6 text-center">
                                        <button
                                            onClick={() => handleOpenDeleteModal(msg)}
                                            className="px-4 py-2 text-sm rounded-md bg-red-600 hover:bg-red-700 text-white font-medium transition-colors"
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {showDeleteModal && messageToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
                    <div className="bg-[var(--secondary-background)] rounded-lg shadow-xl p-6 m-4 max-w-sm w-full text-[var(--foreground)] border border-[var(--border-color)]">
                        <div className="flex justify-end">
                            <button onClick={() => setShowDeleteModal(false)} className="text-[var(--text-muted)] hover:text-[var(--foreground)]">
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="text-center mt-4">
                            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-red-500" />
                            <h3 className="mb-5 text-lg font-normal text-[var(--foreground)]">
                                Tem certeza que deseja eliminar a mensagem de {messageToDelete.name}?
                            </h3>
                            <div className="flex justify-center gap-4 mt-6">
                                <button
                                    onClick={handleDeleteMessage}
                                    className="px-5 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-800 transition-colors"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <div className="flex items-center">
                                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white mr-2"></div>
                                            A Eliminar...
                                        </div>
                                    ) : (
                                        'Sim, Eliminar'
                                    )}
                                </button>
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="px-5 py-2.5 text-sm font-medium text-[var(--foreground)] bg-[var(--button-bg-secondary)] rounded-lg hover:bg-[var(--button-hover-secondary)] focus:outline-none focus:ring-4 focus:ring-[var(--button-ring-secondary)] transition-colors"
                                    disabled={loading}
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
}