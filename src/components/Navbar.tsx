// src/components/Navbar.tsx
// Este é o teu Server Component da Navbar
import NavbarClient from './NavbarClient'; // Caminho correto e importação padrão (default import)

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
    const res = await fetch('http://localhost:1337/api/nav-links?populate=*', {
      next: { revalidate: 60 } // Revalidar os dados a cada 60 segundos
    });

    if (!res.ok) {
      console.error(`Falha ao buscar nav-links: ${res.status} ${res.statusText}`);
      return []; // Retorna um array vazio em caso de erro na resposta da API
    }

    const data = await res.json();
    
    // O Strapi geralmente retorna os dados dentro de um objeto 'data'
    // Mapeia para a estrutura NavLink[]
    if (data && Array.isArray(data.data)) {
      return data.data.map((item: any) => ({
        id: item.id,
        // *** PONTO CHAVE A VERIFICAR: ***
        // Acede aos campos 'title' e 'path' diretamente do 'item'.
        // Se no Strapi, 'title' e 'path' estão dentro de 'attributes', precisas de 'item.attributes.title' etc.
        // Se estão diretos, como este código assume, 'item.title' está correto.
        title: item.title, // Certifica-te que este 'title' corresponde ao que queres mostrar no botão
        path: item.path,   // Certifica-te que este 'path' é o URL correto para onde o botão deve levar
        order: item.order || 0, // Garante que order é sempre um número, usado para ordenar
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