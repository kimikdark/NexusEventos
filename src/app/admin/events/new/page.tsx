// src/app/admin/events/new/page.tsx
'use client';

import EventForm, { EventFormData } from '@/components/EventForm';
import { useRouter } from 'next/navigation';

const STRAPI_URL = 'http://localhost:1337'; // URL do teu Strapi

export default function NewEventPage() {
    const router = useRouter();

    const handleSaveNewEvent = async (formData: EventFormData, imageFile?: File | null) => {
        const jwt = localStorage.getItem('jwt'); 
        if (!jwt) {
            router.push('/admin/login');
            return; 
        }

        const data = new FormData();
        data.append('data', JSON.stringify(formData)); 

        if (imageFile) { // Só anexa se um arquivo for selecionado (não é null ou undefined)
            data.append('files.image', imageFile); 
        }

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
                },
                body: data, 
            });

            if (!res.ok) {
                if (res.status === 401 || res.status === 403) {
                    localStorage.removeItem('jwt'); 
                    router.push('/admin/login'); 
                    return; 
                }
                const errorData = await res.json();
                console.error("NewEventPage: Erro completo da API ao criar evento:", errorData);
                throw new Error(errorData.error?.message || `Erro HTTP: ${res.status} ${res.statusText}. Verifique a consola para detalhes.`);
            }

            const responseData = await res.json();
            console.log('NewEventPage: Evento criado com sucesso:', responseData);
            router.push('/admin/events'); 
        } catch (err: any) {
            console.error('NewEventPage: Falha ao criar evento (catch principal):', err);
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