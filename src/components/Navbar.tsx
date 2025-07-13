// src/components/Navbar.tsx
// Este é o teu Server Component da Navbar
import NavbarClient from './NavbarClient'; // O caminho para o NavbarClient está correto para a tua estrutura

interface NavLink {
  id: number;
  title: string;
  path: string;
  order?: number;
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
      return []; // Retorna um array vazio em caso de erro na resposta
    }

    const data = await res.json();
    // O Strapi geralmente retorna os dados dentro de um objeto 'data'
    // Mapeia para a estrutura NavLink[]
    if (data && Array.isArray(data.data)) {
      return data.data.map((item: any) => ({
        id: item.id,
        // CORREÇÃO AQUI: Aceder diretamente aos campos, não via item.attributes
        title: item.title, 
        path: item.path,
        order: item.order || 0, // Garante que order é sempre um número
      }));
    }
    return []; // Retorna array vazio se a estrutura não for a esperada
  } catch (error) {
    console.error("Erro ao buscar nav-links:", error);
    return []; // Retorna um array vazio em caso de erro de rede ou parsing
  }
}

// Este é o teu componente Server principal da Navbar
export default async function Navbar() {
  const navLinks = await getNavLinks(); // Aguarda a obtenção dos links

  return <NavbarClient navLinks={navLinks} />; // Passa a prop navLinks para o Client Component
}