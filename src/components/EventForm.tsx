// src/components/EventForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const STRAPI_URL = 'http://localhost:1337'; // URL do teu Strapi

interface EventFormProps {
  initialData?: EventFormData; // Dados iniciais para edição (opcional)
  onSave: (event: EventFormData, imageFile?: File | null) => Promise<void>; // Função para salvar
  isEditing: boolean; // Indica se o formulário está em modo de edição
}

// Interface para os dados do formulário
export interface EventFormData {
  title: string;
  description: string;
  date: string;
  location: string;
  totalVagas: number;
  vagasOcupadas: number;
  imageUrl?: string; // URL da imagem existente (para exibição em edição)
  status: 'draft' | 'published' | 'cancelled' | 'completed';
}

const EventForm: React.FC<EventFormProps> = ({ initialData, onSave, isEditing }) => {
  const [formData, setFormData] = useState<EventFormData>(initialData || {
    title: '',
    description: '',
    date: '',
    location: '',
    totalVagas: 0,
    vagasOcupadas: 0,
    status: 'draft', // Por padrão, começa como rascunho
  });
  const [imageFile, setImageFile] = useState<File | null>(null); // Para o novo ficheiro de imagem
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Efeito para atualizar o formulário se initialData mudar (útil para edição)
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    // Converte para número se for campo numérico
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    } else {
      setImageFile(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onSave(formData, imageFile); // Chama a função onSave passada pelas props
      alert(isEditing ? 'Evento atualizado com sucesso!' : 'Evento criado com sucesso!');
      // Limpa o formulário se estiver a adicionar um novo evento
      if (!isEditing) {
        setFormData({
          title: '', description: '', date: '', location: '', totalVagas: 0, vagasOcupadas: 0, status: 'draft'
        });
        setImageFile(null);
      }
    } catch (err: any) {
      console.error('Erro ao salvar evento:', err);
      setError(err.message || 'Falha ao salvar evento.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white rounded-lg shadow-md">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Título:</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)] text-gray-900"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descrição:</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)] text-gray-900"
        ></textarea>
      </div>

      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700">Data e Hora:</label>
        <input
          type="datetime-local"
          id="date"
          name="date"
          value={formData.date ? formData.date.substring(0, 16) : ''} // Formato para datetime-local
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)] text-gray-900"
        />
      </div>

      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700">Local:</label>
        <input
          type="text"
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)] text-gray-900"
        />
      </div>

      <div>
        <label htmlFor="totalVagas" className="block text-sm font-medium text-gray-700">Total de Vagas:</label>
        <input
          type="number"
          id="totalVagas"
          name="totalVagas"
          value={formData.totalVagas}
          onChange={handleChange}
          min="0"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)] text-gray-900"
        />
      </div>

      <div>
        <label htmlFor="vagasOcupadas" className="block text-sm font-medium text-gray-700">Vagas Ocupadas:</label>
        <input
          type="number"
          id="vagasOcupadas"
          name="vagasOcupadas"
          value={formData.vagasOcupadas}
          onChange={handleChange}
          min="0"
          max={formData.totalVagas} // Não pode ser mais que as vagas totais
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)] text-gray-900"
        />
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status:</label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)] text-gray-900"
        >
          <option value="draft">Rascunho</option>
          <option value="published">Publicado</option>
          <option value="cancelled">Cancelado</option>
          <option value="completed">Concluído</option>
        </select>
      </div>

      <div>
        <label htmlFor="image" className="block text-sm font-medium text-gray-700">Imagem do Evento:</label>
        <input
          type="file"
          id="image"
          name="image"
          accept="image/*"
          onChange={handleImageChange}
          className="mt-1 block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[var(--accent-color)] file:text-white hover:file:bg-[var(--secondary-accent)]"
        />
        {isEditing && formData.imageUrl && !imageFile && (
          <p className="mt-2 text-sm text-gray-500">
            Imagem atual: <a href={formData.imageUrl} target="_blank" rel="noopener noreferrer" className="text-[var(--accent-color)] hover:underline">Ver Imagem</a>
          </p>
        )}
        {imageFile && (
          <p className="mt-2 text-sm text-gray-500">Nova imagem selecionada: {imageFile.name}</p>
        )}
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[var(--accent-color)] hover:bg-[var(--secondary-accent)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent-color)] transition duration-300 disabled:opacity-50"
      >
        {loading ? 'A Guardar...' : (isEditing ? 'Atualizar Evento' : 'Criar Evento')}
      </button>
    </form>
  );
};

export default EventForm;