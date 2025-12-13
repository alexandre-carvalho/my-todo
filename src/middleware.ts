// middleware.ts

import {
  NextResponse,
  type MiddlewareConfig,
  type NextRequest,
} from "next/server";
// Importa a biblioteca JOSE para verificação no Edge
import { createRemoteJWKSet, jwtVerify } from "jose";

const publicRoutes = [
  { path: "/sign-in", whenAuthenticated: "redirect" },
  { path: "/register", whenAuthenticated: "redirect" },
  { path: "/reset-password", whenAuthenticated: "redirect" },
] as const;

const REDIRECT_WHEN_NOT_AUTHENTICATED = "/sign-in";

// --- Função de Verificação JWT (Edge Compatible) ---
// Busca as chaves públicas do Firebase dinamicamente
// src/middleware.ts - SUBSTITUA A FUNÇÃO verifyFirebaseJwt COMPLETA

// --- Função de Verificação JWT (Edge Compatible) ---
// Busca as chaves públicas do Firebase dinamicamente

const FIREBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

if (!FIREBASE_PROJECT_ID) {
  throw new Error("NEXT_PUBLIC_FIREBASE_PROJECT_ID is not set");
}

// Endpoint oficial do Firebase para JWKS
const JWKS = createRemoteJWKSet(
  new URL(
    "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com"
  )
);

export const verifyFirebaseJwt = async (token: string) => {
  try {
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: `https://securetoken.google.com/${FIREBASE_PROJECT_ID}`,
      audience: FIREBASE_PROJECT_ID,
    });

    return payload;
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
};

// ----------------------------------------------------

// ... (O restante do middleware permanece o mesmo) ...

// Torne a função middleware assíncrona
export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const publicRoute = publicRoutes.find((route) => route.path === path);
  const authToken = request.cookies.get("token")?.value;

  // Caso 1 e 2: Sem Token
  if (!authToken) {
    if (publicRoute) {
      return NextResponse.next();
    } else {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED;
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Caso 3 e 4: Com Token (requer verificação assíncrona)
  if (authToken) {
    const decodedToken = await verifyFirebaseJwt(authToken); // Aguarda a verificação

    if (!decodedToken) {
      // Token inválido/expirado: redireciona para o login e limpa o cookie
      const response = NextResponse.redirect(
        new URL(REDIRECT_WHEN_NOT_AUTHENTICATED, request.url)
      );
      response.cookies.delete("token");
      return response;
    }

    // Token válido:
    if (publicRoute && publicRoute.whenAuthenticated === "redirect") {
      // Se estiver logado e tentando acessar login/registro, redireciona para home
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/";
      return NextResponse.redirect(redirectUrl);
    }

    // Token válido e rota privada: prosseguir normalmente
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config: MiddlewareConfig = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
