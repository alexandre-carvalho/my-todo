// src/app/api/sign-out/route.ts
import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json(
    { message: "Signed out" },
    { status: 200 }
  );

  // Define o cookie com um valor vazio e data de expiração no passado
  response.cookies.set({
    name: "token",
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    maxAge: 0, // Define a idade máxima como 0 para expirar imediatamente
    path: "/",
  });

  return response;
}
