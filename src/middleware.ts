import { createRemoteJWKSet, jwtVerify } from "jose";
import {
  NextResponse,
  type MiddlewareConfig,
  type NextRequest,
} from "next/server";

const publicRoutes = [
  { path: "/sign-in", whenAuthenticated: "redirect" },
  { path: "/register", whenAuthenticated: "redirect" },
  { path: "/reset-password", whenAuthenticated: "redirect" },
] as const;

const REDIRECT_WHEN_NOT_AUTHENTICATED = "/sign-in";

const FIREBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

if (!FIREBASE_PROJECT_ID) {
  throw new Error("NEXT_PUBLIC_FIREBASE_PROJECT_ID is not set");
}

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

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const publicRoute = publicRoutes.find((route) => route.path === path);
  const authToken = request.cookies.get("token")?.value;

  if (!authToken) {
    if (publicRoute) {
      return NextResponse.next();
    } else {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED;
      return NextResponse.redirect(redirectUrl);
    }
  }

  if (authToken) {
    const decodedToken = await verifyFirebaseJwt(authToken);

    if (!decodedToken) {
      const response = NextResponse.redirect(
        new URL(REDIRECT_WHEN_NOT_AUTHENTICATED, request.url)
      );
      response.cookies.delete("token");
      return response;
    }

    if (publicRoute && publicRoute.whenAuthenticated === "redirect") {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/";
      return NextResponse.redirect(redirectUrl);
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config: MiddlewareConfig = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
