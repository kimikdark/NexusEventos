// src/app/contact/page.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contacto - Nexus Eventos',
  description: 'Entre em contacto connosco para mais informações sobre eventos.',
};

export default function ContactPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] py-8">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">Entre em Contacto</h1>
      <p className="text-lg text-gray-700 dark:text-gray-300 text-center mb-4">
        Tens alguma questão ou sugestão? Envia-nos uma mensagem!
      </p>
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <p className="text-gray-900 dark:text-white mb-2">Email: info@nexuseventos.com</p>
        <p className="text-gray-900 dark:text-white">Telefone: +351 912 345 678</p>
        {/* Aqui podes adicionar um formulário de contacto, morada, etc. */}
      </div>
    </div>
  );
}