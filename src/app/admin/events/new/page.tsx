// src/app/admin/events/new/page.tsx
'use client';

import EventForm, { EventFormData } from '@/components/EventForm';
import { useRouter } from 'next/navigation';

const STRAPI_URL = 'http://localhost:1337'; // URL do teu Strapi

export default function NewEventPage() {
  const router = useRouter();

  const handleSaveNewEvent = async (formData: EventFormData, imageFile?: File | null) => {
    // AINDA A LER DO LOCALSTORAGE - PONTO DE MELHORIA: MIGRAR PARA COOKIES/API ROUTE SERVERSIDE
    const jwt = localStorage.getItem('jwt'); 
    if (!jwt) {
      throw new Error('Não autenticado. Por favor, faça login.');
    }

    // --- CÓDIGO DA DATA (JÁ CORRIGIDO) ---
    const eventDataToSend: EventFormData = { ...formData }; 

    if (eventDataToSend.date) {
      try {
        const parsedDate = new Date(eventDataToSend.date);
        if (!isNaN(parsedDate.getTime())) {
          eventDataToSend.date = parsedDate.toISOString(); 
        } else {
          console.error("NewEventPage: Data inválida fornecida:", eventDataToSend.date);
          throw new Error("Por favor, forneça uma data e hora válidas para o evento.");
        }
      } catch (e) {
        console.error("NewEventPage: Erro ao processar a data do evento:", e);
        throw new Error("Ocorreu um erro ao formatar a data do evento. Verifique o formato.");
      }
    }
    // --- FIM DO CÓDIGO DA DATA ---

    const data = new FormData();
    // Envia o 'eventDataToSend' que tem a data já formatada corretamente
    data.append('data', JSON.stringify(eventDataToSend)); 

    if (imageFile) {
      // --- REVERSÃO AQUI: VOLTANDO PARA 'files.image' ---
      // Esta é a forma padrão para um único ficheiro quando o campo no Strapi é "Single media".
      data.append('files.image', imageFile); 
    }

    // DEBUG: Log do FormData antes de enviar para o Strapi
    console.log('NewEventPage: FormData a ser enviado para o Strapi:');
    for (let [key, value] of data.entries()) {
        if (key === 'data') {
            try {
                console.log(`${key}:`, JSON.parse(value as string));
            } catch (e) {
                console.log(`${key}: ${value}`);
            }
        } else {
            console.log(`${key}: ${value}`);
        }
    }

    try {
      const res = await fetch(`${STRAPI_URL}/api/eventos`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${jwt}`,
          // O navegador adiciona automaticamente o Content-Type correto para FormData.
        },
        body: data, // Envia o FormData
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("NewEventPage: Erro completo da API ao criar evento:", errorData);
        // Lança um erro para ser capturado pelo EventForm e exibido
        throw new Error(errorData.error?.message || `Erro HTTP: ${res.status} ${res.statusText}. Verifique a consola para detalhes.`);
      }

      const responseData = await res.json();
      console.log('NewEventPage: Evento criado com sucesso:', responseData);
      router.push('/admin/events'); // Redireciona de volta para a lista de eventos
    } catch (err: any) {
      console.error('NewEventPage: Falha ao criar evento (catch principal):', err);
      throw err; // Re-lança o erro para ser capturado pelo EventForm
    }
  };

  return (
    <div className="admin-new-event-page p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-[var(--foreground)] mb-6">Adicionar Novo Evento</h1>
      <EventForm onSave={handleSaveNewEvent} isEditing={false} />
    </div>
  );
}