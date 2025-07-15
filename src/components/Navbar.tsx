// src/components/Navbar.tsx
// Este é o teu Server Component da Navbar
import NavbarClient from './NavbarClient';

const STRAPI_URL = 'http://localhost:1337'; // Definir a URL do Strapi aqui

interface NavLink {
  id: number;
  title: string;
  path: string; // O caminho para o link (ex: "/", "/eventos", "/contactos")
  order?: number; // Para ordenar os links
}

// Função para buscar os links de navegação do Strapi
// Esta função é assíncrona e executa no servidor
async function getNavLinks(): Promise<NavLink[]> {
  try {
    const res = await fetch(`${STRAPI_URL}/api/nav-links?populate=*`, {
      next: { revalidate: 60 } // Revalidar os dados a cada 60 segundos
    });

    if (!res.ok) {
      console.error(`Falha ao buscar nav-links: ${res.status} ${res.statusText}`);
      return []; // Retorna um array vazio em caso de erro na resposta da API
    }

    const data = await res.json();

    // O Strapi geralmente retorna os dados dentro de um objeto 'data'
    // E os campos estão dentro de 'attributes' se for um Collection Type típico.
    // No entanto, para Single Types ou customizações, podem estar diretos.
    // Pelo erro, parece que estão diretos.

    if (data && Array.isArray(data.data)) {
      return data.data.map((item: any) => ({
        id: item.id,
        // CORREÇÃO: Acessar diretamente item.title, item.path, item.order
        // Se no teu Strapi, os campos 'title', 'path', 'order' estão diretos no item (e.g., para um Single Type)
        // ou se o populate não está a retornar os atributos como esperado.
        title: item.title,
        path: item.path,
        order: item.order || 0,
      }));
    }
    return []; // Retorna array vazio se a estrutura dos dados não for a esperada
  } catch (error) {
    console.error("Erro ao buscar nav-links:", error);
    return []; // Retorna um array vazio em caso de erro de rede ou parsing
  }
}

// Este é o teu componente Server principal da Navbar
export default async function Navbar() {
  const navLinks = await getNavLinks(); // Aguarda a obtenção dos links do Strapi

  return <NavbarClient navLinks={navLinks} />; // Passa a prop navLinks para o Client Component
}