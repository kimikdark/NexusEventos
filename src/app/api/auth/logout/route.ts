// src/app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const response = NextResponse.json({ message: 'Logout bem-sucedido.' }, { status: 200 });

    // Remove o cookie JWT definindo sua data de expiração para o passado
    response.cookies.set('jwt', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 0, // Define a idade máxima para 0 para expirá-lo imediatamente
      path: '/',
      sameSite: 'lax',
    });

    return response;

  } catch (error: any) {
    console.error('Erro na rota de API de logout:', error);
    return NextResponse.json({ error: 'Erro interno do servidor ao fazer logout.' }, { status: 500 });
  }
}