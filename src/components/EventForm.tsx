// src/components/EventForm.tsx
'use client';

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Spinner } from 'flowbite-react';
import Image from 'next/image';

// Interface para os dados do formulário
export interface EventFormData {
    title: string;
    description: string;
    date: string; // Vai ser uma string no formato "YYYY-MM-DDTHH:MM" do input datetime-local
    location: string;
    totalVagas: number;
    vagasOcupadas: number;
    imageUrl?: string; // URL da imagem atual (para pré-visualização, não enviado para o Strapi)
    status: 'draft' | 'published' | 'cancelled' | 'completed';
}

interface EventFormProps {
    onSave: (formData: EventFormData, imageFile?: File | null) => Promise<void>;
    initialData?: EventFormData | null;
    isEditing: boolean;
}

const EventForm: React.FC<EventFormProps> = ({ onSave, initialData, isEditing }) => {
    const [formData, setFormData] = useState<EventFormData>(initialData || {
        title: '',
        description: '',
        date: '',
        location: '',
        totalVagas: 0,
        vagasOcupadas: 0,
        status: 'draft',
    });
    const [imageFile, setImageFile] = useState<File | null | undefined>(undefined); // undefined: não alterado; null: removido; File: novo arquivo
    const [currentImageUrl, setCurrentImageUrl] = useState<string | undefined>(initialData?.imageUrl); // Para exibir a imagem atual
    const [isSaving, setIsSaving] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    // Atualiza o estado do formulário quando `initialData` muda (no modo de edição)
    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                // Formatar a data para o input date-time-local (YYYY-MM-DDTHH:MM)
                date: initialData.date ? new Date(initialData.date).toISOString().slice(0, 16) : '',
            });
            setCurrentImageUrl(initialData.imageUrl);
            setImageFile(undefined); // Resetar o file para undefined (não alterado)
        }
    }, [initialData]);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        setFormData(prevData => ({
            ...prevData,
            [name]: type === 'number' ? Number(value) : value,
        }));
        setFormError(null);
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setCurrentImageUrl(URL.createObjectURL(file)); // Pré-visualização da nova imagem
        } else {
            setImageFile(undefined); // Nenhum arquivo selecionado, volta ao estado original
            setCurrentImageUrl(initialData?.imageUrl); // Volta à imagem inicial se existir
        }
        setFormError(null);
    };

    const handleRemoveImage = () => {
        setImageFile(null); // Marcar a imagem como removida
        setCurrentImageUrl(undefined); // Limpar pré-visualização
        setFormError(null);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setFormError(null);
        setIsSaving(true);

        if (!formData.title || !formData.description || !formData.date || !formData.location) {
            setFormError('Por favor, preencha todos os campos obrigatórios.');
            setIsSaving(false);
            return;
        }

        try {
            // Criar um objeto de dados para enviar ao Strapi
            const dataToSend: EventFormData = { ...formData };
            // Formatar a data para o formato ISO completo esperado pelo Strapi
            dataToSend.date = new Date(formData.date).toISOString();

            await onSave(dataToSend, imageFile);
        } catch (err: any) {
            console.error("EventForm: Erro ao salvar/atualizar:", err);
            setFormError(err.message || 'Erro ao salvar o evento.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {formError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Erro!</strong>
                    <span className="block sm:inline"> {formError}</span>
                </div>
            )}

            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    // Adicionar classes para estilo do texto
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                    required
                />
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                <textarea
                    id="description"
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    // Adicionar classes para estilo do texto
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                    required
                ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Data e Hora</label>
                    <input
                        type="datetime-local"
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        // Adicionar classes para estilo do texto
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Localização</label>
                    <input
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        // Adicionar classes para estilo do texto
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                        required
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="totalVagas" className="block text-sm font-medium text-gray-700 mb-1">Total de Vagas</label>
                    <input
                        type="number"
                        id="totalVagas"
                        name="totalVagas"
                        value={formData.totalVagas}
                        onChange={handleChange}
                        // Adicionar classes para estilo do texto
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                        required
                        min="0"
                    />
                </div>
                <div>
                    <label htmlFor="vagasOcupadas" className="block text-sm font-medium text-gray-700 mb-1">Vagas Ocupadas</label>
                    <input
                        type="number"
                        id="vagasOcupadas"
                        name="vagasOcupadas"
                        value={formData.vagasOcupadas}
                        onChange={handleChange}
                        // Adicionar classes para estilo do texto
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                        required
                        min="0"
                    />
                </div>
            </div>

            <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    // Adicionar classes para estilo do texto
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                >
                    <option value="draft">Rascunho</option>
                    <option value="published">Publicado</option>
                    <option value="cancelled">Cancelado</option>
                    <option value="completed">Concluído</option>
                </select>
            </div>

            {/* Gerenciamento da Imagem */}
            <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">Imagem do Evento</label>
                <input
                    type="file"
                    id="image"
                    name="image"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {(currentImageUrl && imageFile !== null) && ( // Exibir pré-visualização se houver URL e não foi removido
                    <div className="mt-4 relative w-48 h-32 border border-gray-300 rounded-md overflow-hidden">
                        <Image src={currentImageUrl} alt="Pré-visualização da imagem" layout="fill" objectFit="cover" />
                        <button
                            type="button"
                            onClick={handleRemoveImage}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                            title="Remover imagem"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>
                )}
                {imageFile === null && ( // Mensagem se a imagem foi removida
                    <p className="mt-2 text-sm text-gray-500">Imagem removida. Para adicionar uma nova, selecione um arquivo.</p>
                )}
            </div>

            <div className="flex justify-end space-x-4 mt-6">
                <button
                    type="button"
                    onClick={() => window.history.back()}
                    className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    disabled={isSaving}
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center justify-center"
                    disabled={isSaving}
                >
                    {isSaving ? (
                        <>
                            <Spinner aria-label="Salvando" size="sm" className="mr-2" />
                            Salvando...
                        </>
                    ) : (
                        isEditing ? 'Atualizar Evento' : 'Criar Evento'
                    )}
                </button>
            </div>
        </form>
    );
};

export default EventForm;