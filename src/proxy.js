import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

function logado(token) {
    try {
        // 1. RETORNAR jwt VERIFICAR token COM a JWT_SECRET do .env, CONVERTIDO PARA booleano
    } catch {
        return false;
    }
}

export function proxy(request) {
    // 2. temSessao = logado(PEGAR o cookie 'token' da request E, SE EXISTIR, o valor dele)

    // 3. ehPaginaLogin = CAMINHO da URL da request É IGUAL A '/'

    if (/* escreva aqui a condição do passo 4 */) {
        // 4. SE NÃO temSessao E NÃO ehPaginaLogin   (está deslogado fora do login → vai para o login)
        return NextResponse.redirect(new URL('/', request.url));
    }

    if (/* escreva aqui a condição do passo 5 */) {
        // 5. SE temSessao E ehPaginaLogin   (já está logado e abriu o login → vai para o início)
        return NextResponse.redirect(new URL('/inicio', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
