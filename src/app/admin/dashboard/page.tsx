// src/app/admin/dashboard/page.tsx
'use client';

export default function AdminDashboardPage() {
  // console.log('AdminDashboardPage: Componente a ser renderizado no navegador!'); // Pode remover este log ou manter para referência

  return (
    <div className="text-[var(--foreground)]"> {/* Revertido para os seus estilos originais */}
      <h1 className="text-4xl font-bold mb-6">Bem-vindo, Administrador!</h1>
      <p className="text-lg mb-4">Use a barra lateral para gerir os seus eventos e inscrições.</p>
      {/* Pode adicionar estatísticas, links rápidos, ou informações relevantes aqui */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        <div className="bg-white p-6 rounded-lg shadow-md"> {/* Assegure-se que o texto aqui será visível em fundo branco */}
          <h3 className="text-xl font-semibold mb-2 text-[var(--accent-color)]">Total de Eventos</h3>
          <p className="text-4xl font-bold text-[var(--accent-color)]">5</p> {/* Valor de exemplo */}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md"> {/* Assegure-se que o texto aqui será visível em fundo branco */}
          <h3 className="text-xl font-semibold mb-2 text-[var(--accent-color)]">Inscrições Pendentes</h3>
          <p className="text-4xl font-bold text-[var(--accent-color)]">12</p> {/* Valor de exemplo */}
        </div>
        {/* Adiciona mais cards ou componentes conforme os requisitos */}
      </div>
    </div>
  );
}
