// src/app/api/auth/login/route.ts
import { NextResponse } from 'next/server';

const STRAPI_URL = 'http://localhost:1337'; // Certifica-te que isto é o mesmo que na tua página de login

export async function POST(request: Request) {
  try {
    const { identifier, password } = await request.json();

    // 1. Faz o pedido de login ao Strapi
    const strapiRes = await fetch(`${STRAPI_URL}/api/auth/local`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ identifier, password }),
    });

    // Se o Strapi devolver um erro, passa esse erro de volta ao cliente
    if (!strapiRes.ok) {
      const errorData = await strapiRes.json();
      return NextResponse.json({ error: errorData.error?.message || 'Login falhou no Strapi.' }, { status: strapiRes.status });
    }

    // 2. Login bem-sucedido no Strapi, obtém os dados
    const data = await strapiRes.json();
    const jwt = data.jwt;
    const user = data.user;

    // 3. Cria uma resposta Next.js para definir o cookie
    const response = NextResponse.json({ user }, { status: 200 });

    // 4. Define o cookie JWT
    // Recomenda-se um nome de cookie único e seguro (ex: __Secure-AuthToken)
    response.cookies.set('jwt', jwt, {
      httpOnly: true, // ESSENCIAL: Impede que JavaScript no cliente aceda ao cookie
      secure: process.env.NODE_ENV === 'production', // Usa HTTPS em produção
      maxAge: 60 * 60 * 24 * 7, // 1 semana (ajusta conforme a validade do teu JWT)
      path: '/', // O cookie estará disponível em todo o domínio
      sameSite: 'lax', // Proteção CSRF
    });

    return response;

  } catch (error: any) {
    console.error('Erro na rota de API de login:', error);
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}