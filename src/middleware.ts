import {
  NextResponse,
  type MiddlewareConfig,
  type NextRequest,
} from "next/server";

const publicRoutes = [
  { path: "/sign-in", whenAuthenticated: "redirect" },
  { path: "/register", whenAuthenticated: "redirect" },
  { path: "/reset-password", whenAuthenticated: "redirect" },
  { path: "/about", whenAuthenticated: "next" },
] as const;

const REDIRECT_WHEN_NOT_AUTHENTICATED = "/sign-in";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const publicRoute = publicRoutes.find((route) => route.path === path);
  const authToken = request.cookies.get("token");

  if (!authToken && publicRoute) {
    return NextResponse.next();
  }

  if (!authToken && !publicRoute) {
    const redirectUrl = request.nextUrl.clone();

    redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED;
    return NextResponse.redirect(redirectUrl);
  }

  if (
    authToken &&
    publicRoute &&
    publicRoute.whenAuthenticated === "redirect"
  ) {
    const redirectUrl = request.nextUrl.clone();

    redirectUrl.pathname = "/";
    return NextResponse.redirect(redirectUrl);
  }

  if (authToken && !publicRoute) {
    // Checar se o JWT está expirado
    // Se sim, remover o cookie e redirecionar para a página de login

    return NextResponse.next();
  }
  return NextResponse.next();
}

export const config: MiddlewareConfig = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
