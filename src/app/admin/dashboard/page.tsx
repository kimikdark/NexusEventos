// src/app/admin/dashboard/page.tsx
// Este pode ser um Server Component (padrão no Next.js 13+)
// O acesso a ele será controlado pelo `admin/layout.tsx` (Client Component)

export default function AdminDashboardPage() {
  return (
    <div className="text-[var(--foreground)]">
      <h1 className="text-4xl font-bold mb-6">Bem-vindo, Administrador!</h1>
      <p className="text-lg mb-4">Use a barra lateral para gerir os seus eventos e inscrições.</p>
      {/* Pode adicionar estatísticas, links rápidos, ou informações relevantes aqui */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-2 text-[var(--foreground)]">Total de Eventos</h3>
          <p className="text-4xl font-bold text-[var(--accent-color)]">5</p> {/* Valor de exemplo */}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-2 text-[var(--foreground)]">Inscrições Pendentes</h3>
          <p className="text-4xl font-bold text-[var(--accent-color)]">12</p> {/* Valor de exemplo */}
        </div>
        {/* Adiciona mais cards ou componentes conforme os requisitos */}
      </div>
    </div>
  );
}