// src/components/EventForm.tsx
'use client';

import { useState, useEffect } from 'react';

interface EventFormProps {
  initialData?: EventFormData;
  onSave: (event: EventFormData, imageFile?: File | null) => Promise<void>;
  isEditing: boolean;
}

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
    status: 'draft',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | undefined>(initialData?.imageUrl); // Novo estado para pré-visualização
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setPreviewImageUrl(initialData.imageUrl); // Define a URL de pré-visualização inicial
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewImageUrl(URL.createObjectURL(file)); // Cria URL para pré-visualização do novo arquivo
    } else {
      setImageFile(null);
      // Se o utilizador limpar o input de arquivo, e não estiver em edição (ou seja, novo evento), limpa a pré-visualização.
      // Se estiver em edição, manterá a imagem existente até que seja explicitamente removida.
      if (!isEditing) {
        setPreviewImageUrl(undefined);
      }
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null); // Indica que a imagem deve ser removida no PUT
    setPreviewImageUrl(undefined); // Limpa a pré-visualização
    setFormData(prev => ({ ...prev, imageUrl: undefined })); // Limpa o imageUrl do formData
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    console.log('EventForm: formData a ser enviado:', formData);
    console.log('EventForm: imageFile a ser enviado:', imageFile);

    try {
      // Aqui, garantimos que a data é um formato ISO válido ANTES de enviar para a API
      const formDataToSend = { ...formData };
      if (formDataToSend.date) {
        try {
            const parsedDate = new Date(formDataToSend.date);
            if (!isNaN(parsedDate.getTime())) {
                formDataToSend.date = parsedDate.toISOString();
            } else {
                throw new Error("Formato de data inválido.");
            }
        } catch (dateError: any) {
            console.error("EventForm: Erro ao formatar data:", dateError);
            throw new Error(dateError.message || "Por favor, insira uma data e hora válidas.");
        }
      }

      await onSave(formDataToSend, imageFile); // Passa o formData formatado e o imageFile
      alert(isEditing ? 'Evento atualizado com sucesso!' : 'Evento criado com sucesso!');
      if (!isEditing) {
        // Reset do formulário apenas para criação de novo evento
        setFormData({
          title: '', description: '', date: '', location: '', totalVagas: 0, vagasOcupadas: 0, status: 'draft'
        });
        setImageFile(null);
        setPreviewImageUrl(undefined);
      }
    } catch (err: any) {
      console.error('EventForm: Erro ao salvar evento:', err);
      setError(err.message || 'Falha ao salvar evento. Verifique a consola para detalhes.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white rounded-lg shadow-md">
      {/* Campos do formulário (Título, Descrição, Data, Local, Vagas, Status) - Mantenha como estão */}
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
          // Garante que o valor do input é formatado para 'YYYY-MM-DDTHH:MM'
          value={formData.date ? new Date(formData.date).toISOString().slice(0, 16) : ''}
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
          max={formData.totalVagas}
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

      {/* Campo Imagem com pré-visualização */}
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
        {previewImageUrl && (
          <div className="mt-2 relative w-40 h-40"> {/* Adicionado w-40 h-40 para tamanho fixo */}
            <img src={previewImageUrl} alt="Preview" className="w-full h-full object-cover rounded-md border border-gray-300" />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white rounded-full p-1 text-xs font-bold hover:bg-red-600 transition duration-200"
              title="Remover imagem"
            >
              X
            </button>
          </div>
        )}
        {isEditing && !previewImageUrl && (initialData?.imageUrl || imageFile === null) && (
             <p className="mt-2 text-sm text-gray-500">Nenhuma imagem definida para este evento. Selecione uma.</p>
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