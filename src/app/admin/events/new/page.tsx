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
            router.push('/admin/login');
            return;
        }

        const data = new FormData();

        const eventDataPayload: any = { ...formData };
        delete eventDataPayload.imageUrl;

        // O Strapi espera a data no formato ISO 8601 completo para update/create
        eventDataPayload.date = new Date(eventDataPayload.date).toISOString();

        data.append('data', JSON.stringify(eventDataPayload));

        if (imageFile) {
            data.append('files.image', imageFile);
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
            <h1 className="text-3xl font-bold text-[var(--accent-color)] mb-6">Adicionar Novo Evento</h1>
            <EventForm onSave={handleSaveNewEvent} isEditing={false} />
        </div>
    );
}