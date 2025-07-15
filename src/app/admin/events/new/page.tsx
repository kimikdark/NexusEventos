// src/app/admin/events/new/page.tsx
'use client';

import EventForm, { EventFormData } from '@/components/EventForm';
import { useRouter } from 'next/navigation';

const STRAPI_URL = 'http://localhost:1337';

export default function NewEventPage() {
  const router = useRouter();

  const handleSaveNewEvent = async (formData: EventFormData, imageFile?: File | null) => {
    const jwt = localStorage.getItem('jwt');
    if (!jwt) {
      throw new Error('Não autenticado. Por favor, faça login.');
    }

    const data = new FormData();
    data.append('data', JSON.stringify(formData)); // Os dados do evento vão em 'data'

    if (imageFile) {
      data.append('files.image', imageFile); // O ficheiro de imagem vai em 'files.nomeDoCampo'
    }

    try {
      const res = await fetch(`${STRAPI_URL}/api/eventos`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${jwt}`,
          // REMOVE QUALQUER LINA 'Content-Type': 'application/json' AQUI!
          // O navegador irá adicionar 'Content-Type: multipart/form-data' automaticamente.
        },
        body: data, // Envia o FormData
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Erro completo da API ao criar evento:", errorData);
        throw new Error(errorData.error?.message || `Erro HTTP: ${res.status} ${res.statusText}`);
      }

      const responseData = await res.json();
      console.log('Evento criado com sucesso:', responseData);
      router.push('/admin/events');
    } catch (err: any) {
      console.error('Falha ao criar evento:', err);
      throw err;
    }
  };

  return (
    <div className="admin-new-event-page p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-[var(--foreground)] mb-6">Adicionar Novo Evento</h1>
      <EventForm onSave={handleSaveNewEvent} isEditing={false} />
    </div>
  );
}