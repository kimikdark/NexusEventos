// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('jwt'); // Assumindo que guardas o JWT num cookie

  const { pathname } = request.nextUrl;

  // Lista de rotas que são acessíveis a todos (públicas)
  // Certifica-te de que '/admin/login' está aqui!
  const publicPaths = ['/', '/contactos', '/eventos', '/admin/login'];

  // Verifica se o caminho atual está na lista de caminhos públicos
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  // Se a rota começa com /admin E não está logado, redireciona para a página de login
  // Esta condição cobre todas as rotas /admin/* exceto /admin/login (já tratada acima)
  if (pathname.startsWith('/admin') && !token) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  // Se o utilizador está na página de login (/admin/login) E já tem um token,
  // redireciona para o dashboard (para evitar que um utilizador logado veja o form de login)
  // Esta condição só será atingida se o pathname for /admin/login E houver um token.
  // Já foi tratada pela lógica publicPaths.includes(pathname), mas serve como uma validação extra
  // se a ordem das condições for alterada. Podes até ponderar removê-la se confias no publicPaths.
  if (pathname === '/admin/login' && token) {
     return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  // Permite o acesso a qualquer rota /admin/* se houver um token
  if (pathname.startsWith('/admin') && token) {
    return NextResponse.next();
  }

  // Para todas as outras rotas não cobertas acima (rotas não-admin e não-públicas explícitas)
  // Podes adicionar mais lógica aqui se tiveres outras áreas protegidas.
  return NextResponse.next();
}

export const config = {
  // CORREÇÃO AQUI: Remove '/login' do matcher.
  // Agora, o middleware só vai intercetar rotas que comecem com /admin e a rota raiz.
  // Se a tua rota raiz também tem proteção, podes removê-la daqui, mas geralmente '/' é pública.
  matcher: ['/admin/:path*', '/'],
};