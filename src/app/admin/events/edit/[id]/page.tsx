// src/app/admin/events/edit/[id]/page.tsx
// ... (código anterior) ...

  const handleUpdateEvent = async (formData: EventFormData, imageFile?: File | null) => {
    const jwt = localStorage.getItem('jwt');
    if (!jwt) {
      throw new Error('Não autenticado. Por favor, faça login.');
    }

    const data = new FormData();
    data.append('data', JSON.stringify(formData));

    if (imageFile) {
      data.append('files.image', imageFile);
    }

    try {
      const res = await fetch(`${STRAPI_URL}/api/eventos/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${jwt}`,
          // REMOVE QUALQUER LINA 'Content-Type': 'application/json' AQUI!
        },
        body: data,
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Erro completo da API ao atualizar evento:", errorData);
        throw new Error(errorData.error?.message || `Erro HTTP: ${res.status} ${res.statusText}`);
      }

      const responseData = await res.json();
      console.log('Evento atualizado com sucesso:', responseData);
      router.push('/admin/events');
    } catch (err: any) {
      console.error('Falha ao atualizar evento:', err);
      throw err;
    }
  };

// ... (restante do código) ...