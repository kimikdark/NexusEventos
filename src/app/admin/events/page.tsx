// src/app/admin/events/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // Importa o CSS do datepicker

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337';

// Interface para a estrutura de dados de um Evento recebida do Strapi
interface Evento {
    id: number;
    title: string;
    description: string;
    date: string; // Formato ISO string para compatibilidade com Date e Strapi
    location: string;
    totalVagas: number;
    vagasOcupadas: number;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    Evento: any; 
    image?: { // Campo de imagem. Pode ser um array ou objeto, dependendo da configuração
        data: {
            id: number;
            attributes: {
                url: string;
                // outros atributos como name, width, height, etc.
            };
        } | null;
    };
    inscricaos: any[]; // Relação com Inscrições
}

export default function AdminEventsPage() {
    const [events, setEvents] = useState<Evento[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filterText, setFilterText] = useState<string>('');

    // Estados para a modal de edição
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingEvent, setEditingEvent] = useState<Evento | null>(null);
    const [formValues, setFormValues] = useState<Partial<Evento>>({});
    const [modalLoading, setModalLoading] = useState(false);
    const [modalError, setModalError] = useState<string | null>(null);

    const router = useRouter();

    const fetchEvents = useCallback(async () => {
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
            // Popula a imagem se você precisar dela na listagem
            const res = await fetch(`${STRAPI_URL}/api/eventos?populate=image`, { // Assumindo plural 'eventos'
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
                console.error("AdminEventsPage: Erro da API ao buscar eventos:", errorData);
                throw new Error(errorData.error?.message || `Erro HTTP: ${res.status} ${res.statusText}`);
            }

            const responseData = await res.json();
            console.log("Dados recebidos para AdminEventsPage:", responseData);

            if (responseData.data && Array.isArray(responseData.data)) {
                setEvents(responseData.data.map((item: any) => ({
                    id: item.id,
                    ...item // Espalha as propriedades diretamente
                }) as Evento));
            } else {
                setError("Formato de dados inesperado da API. O 'data' payload não é um array para eventos.");
                setEvents([]);
            }

        } catch (err: any) {
            console.error('AdminEventsPage: Falha ao carregar eventos:', err);
            setError(err.message || 'Falha ao carregar eventos.');
        } finally {
            setLoading(false);
        }
    }, [router]);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    const handleOpenEditModal = (event: Evento) => {
        setEditingEvent(event);
        // Inicializa formValues com os dados do evento, convertendo a data para objeto Date
        setFormValues({
            title: event.title,
            description: event.description,
            date: event.date ? new Date(event.date).toISOString() : '', // Sempre armazene como ISO string
            location: event.location,
            totalVagas: event.totalVagas,
            vagasOcupadas: event.vagasOcupadas,
            // A imagem não será editada diretamente aqui; precisaria de upload separado
        });
        setModalError(null);
        setShowEditModal(true);
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormValues(prev => ({
            ...prev,
            [name]: type === 'number' ? Number(value) : value,
        }));
    };

    const handleDateChange = (date: Date | null) => {
        setFormValues(prev => ({
            ...prev,
            date: date ? date.toISOString() : '', // Armazena a data como ISO string
        }));
    };

    const handleUpdateEvent = async () => {
        if (!editingEvent) return;

        setModalLoading(true);
        setModalError(null);

        const jwt = typeof window !== 'undefined' ? localStorage.getItem('jwt') : null;
        if (!jwt) {
            alert('Não autenticado. Por favor, faça login.');
            router.push('/admin/login');
            setModalLoading(false);
            return;
        }

        try {
            const res = await fetch(`${STRAPI_URL}/api/eventos/${editingEvent.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwt}`,
                },
                // CORREÇÃO: Encapsular os valores do formulário em 'data'
                body: JSON.stringify({
                    data: formValues, 
                }),
            });

            if (!res.ok) {
                if (res.status === 401 || res.status === 403) {
                    localStorage.removeItem('jwt');
                    router.push('/admin/login');
                    return;
                }
                const errorData = await res.json();
                console.error("Erro ao atualizar evento:", errorData);
                throw new Error(errorData.error?.message || `Erro HTTP: ${res.statusText}`);
            }

            const updatedEventData = await res.json();
            console.log("Evento atualizado com sucesso:", updatedEventData);

            // Atualiza o estado local com os dados atualizados
            setEvents(prevEvents =>
                prevEvents.map(event =>
                    event.id === editingEvent.id ? {
                        ...event,
                        ...updatedEventData.data // Strapi retorna o objeto atualizado dentro de 'data'
                    } : event
                )
            );
            setShowEditModal(false);
            setEditingEvent(null);
            setFormValues({});
            alert('Evento atualizado com sucesso!');
        } catch (err: any) {
            console.error('Erro ao atualizar evento:', err);
            setModalError(err.message || 'Erro ao atualizar evento.');
        } finally {
            setModalLoading(false);
        }
    };

    const filteredEvents = events.filter(event =>
        (event.title || '').toLowerCase().includes(filterText.toLowerCase()) ||
        (event.description || '').toLowerCase().includes(filterText.toLowerCase()) ||
        (event.location || '').toLowerCase().includes(filterText.toLowerCase())
    );

    const LoadingSpinner = () => (
        <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
            <span className="ml-2 text-xl text-[var(--foreground)]">A carregar eventos...</span>
        </div>
    );

    const ErrorDisplay = () => (
        <div className="text-center text-red-500 text-lg mt-8">
            <p>Erro: {error}</p>
            <button
                onClick={() => fetchEvents()}
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
            <h1 className="text-3xl font-bold mb-6 text-center text-[var(--foreground)]">Gerir Eventos</h1>

            <div className="flex justify-between items-center mb-4"> {/* Flexbox para alinhar filtro e botão */}
                <input
                    id="filter"
                    type="text"
                    placeholder="Filtrar por título, descrição ou localização..."
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                    className="flex-grow p-3 rounded-md bg-[var(--secondary-background)] border border-[var(--border-color)] text-[var(--foreground)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] focus:border-transparent mr-4" // Adiciona margem à direita
                />
                <button
                    onClick={() => router.push('/admin/events/new')} // Navega para a página de criação
                    className="px-6 py-3 rounded-md bg-sky-600 hover:bg-sky-700 text-white font-semibold transition-colors whitespace-nowrap"
                >
                    Adicionar Novo Evento
                </button>
            </div>

            {filteredEvents.length === 0 ? (
                <p className="text-center text-[var(--text-muted)] text-xl mt-10">Não há eventos para gerir.</p>
            ) : (
                <div className="overflow-x-auto rounded-lg shadow-lg">
                    <table className="min-w-full bg-[var(--secondary-background)] text-[var(--foreground)]">
                        <thead>
                            <tr className="bg-[var(--header-background)] text-[var(--header-foreground)] uppercase text-sm leading-normal">
                                {/* <th className="py-3 px-6 text-left">ID</th> <-- ID REMOVIDO */}
                                <th className="py-3 px-6 text-left">Título</th>
                                <th className="py-3 px-6 text-left">Descrição</th>
                                <th className="py-3 px-6 text-left">Data</th>
                                <th className="py-3 px-6 text-left">Localização</th>
                                <th className="py-3 px-6 text-left">Vagas</th>
                                <th className="py-3 px-6 text-left">Ocupadas</th>
                                <th className="py-3 px-6 text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-color)]">
                            {filteredEvents.map((event) => (
                                <tr key={event.id} className="border-b border-[var(--border-color)] hover:bg-[var(--hover-background)]">
                                    {/* <td className="py-3 px-6 text-left whitespace-nowrap font-medium">{event.id}</td> <-- ID REMOVIDO */}
                                    <td className="py-3 px-6 text-left">{event.title}</td>
                                    <td className="py-3 px-6 text-left max-w-xs overflow-hidden text-ellipsis whitespace-nowrap"
                                        title={event.description}>
                                        {event.description}
                                    </td>
                                    <td className="py-3 px-6 text-left whitespace-nowrap text-sm">
                                        {new Date(event.date).toLocaleDateString('pt-PT', {
                                            year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                        })}
                                    </td>
                                    <td className="py-3 px-6 text-left">{event.location}</td>
                                    <td className="py-3 px-6 text-left">{event.totalVagas}</td>
                                    <td className="py-3 px-6 text-left">{event.vagasOcupadas}</td>
                                    <td className="py-3 px-6 text-center">
                                        <button
                                            onClick={() => handleOpenEditModal(event)}
                                            className="px-4 py-2 text-sm rounded-md bg-[var(--accent-color)] hover:bg-[var(--secondary-accent)] text-white font-medium transition-colors"
                                        >
                                            Editar
                                        </button>
                                        {/* Você pode adicionar um botão para deletar eventos aqui, similar ao das mensagens */}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {showEditModal && editingEvent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
                    <div className="bg-[var(--secondary-background)] rounded-lg shadow-xl p-6 m-4 max-w-lg w-full text-[var(--foreground)] border border-[var(--border-color)]">
                        <div className="flex justify-end">
                            <button onClick={() => setShowEditModal(false)} className="text-[var(--text-muted)] hover:text-[var(--foreground)]">
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="text-center mt-4">
                            <h3 className="mb-5 text-lg font-normal text-[var(--foreground)]">
                                Editar Evento: {editingEvent.title}
                            </h3>
                            <form className="space-y-4 text-left">
                                <div>
                                    <label htmlFor="title" className="block text-sm font-medium text-[var(--foreground)]">Título</label>
                                    <input
                                        type="text"
                                        id="title"
                                        name="title"
                                        value={formValues.title || ''}
                                        onChange={handleFormChange}
                                        className="mt-1 block w-full p-2.5 rounded-md bg-[var(--background)] border border-[var(--border-color)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-[var(--foreground)]">Descrição</label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={formValues.description || ''}
                                        onChange={handleFormChange}
                                        rows={4}
                                        className="mt-1 block w-full p-2.5 rounded-md bg-[var(--background)] border border-[var(--border-color)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
                                        required
                                    ></textarea>
                                </div>
                                <div>
                                    <label htmlFor="date" className="block text-sm font-medium text-[var(--foreground)]">Data e Hora</label>
                                    <DatePicker
                                        selected={formValues.date ? new Date(formValues.date) : null}
                                        onChange={handleDateChange}
                                        showTimeSelect
                                        dateFormat="dd/MM/yyyy HH:mm"
                                        className="mt-1 block w-full p-2.5 rounded-md bg-[var(--background)] border border-[var(--border-color)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="location" className="block text-sm font-medium text-[var(--foreground)]">Localização</label>
                                    <input
                                        type="text"
                                        id="location"
                                        name="location"
                                        value={formValues.location || ''}
                                        onChange={handleFormChange}
                                        className="mt-1 block w-full p-2.5 rounded-md bg-[var(--background)] border border-[var(--border-color)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="totalVagas" className="block text-sm font-medium text-[var(--foreground)]">Total de Vagas</label>
                                    <input
                                        type="number"
                                        id="totalVagas"
                                        name="totalVagas"
                                        value={formValues.totalVagas || 0}
                                        onChange={handleFormChange}
                                        className="mt-1 block w-full p-2.5 rounded-md bg-[var(--background)] border border-[var(--border-color)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="vagasOcupadas" className="block text-sm font-medium text-[var(--foreground)]">Vagas Ocupadas</label>
                                    <input
                                        type="number"
                                        id="vagasOcupadas"
                                        name="vagasOcupadas"
                                        value={formValues.vagasOcupadas || 0}
                                        onChange={handleFormChange}
                                        className="mt-1 block w-full p-2.5 rounded-md bg-[var(--background)] border border-[var(--border-color)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
                                        required
                                    />
                                </div>
                                {/* Adicionar campo para upload de imagem aqui se for necessário */}
                                {/* Para a imagem, seria mais complexo, exigiria um input type="file" e um upload separado para o Strapi */}

                                {modalError && <p className="text-red-500 text-sm mt-2">{modalError}</p>}

                                <div className="flex justify-center gap-4 mt-6">
                                    <button
                                        type="button"
                                        onClick={handleUpdateEvent}
                                        className="px-5 py-2.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-800 transition-colors"
                                        disabled={modalLoading}
                                    >
                                        {modalLoading ? (
                                            <div className="flex items-center">
                                                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white mr-2"></div>
                                                A Salvar...
                                            </div>
                                        ) : (
                                            'Salvar Alterações'
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowEditModal(false)}
                                        className="px-5 py-2.5 text-sm font-medium text-[var(--foreground)] bg-[var(--button-bg-secondary)] rounded-lg hover:bg-[var(--button-hover-secondary)] focus:outline-none focus:ring-4 focus:ring-[var(--button-ring-secondary)] transition-colors"
                                        disabled={modalLoading}
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}