// src/app/api/set-cookie/route.ts

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { token } = await request.json();

  if (!token) {
    return NextResponse.json({ error: "Token is required" }, { status: 400 });
  }

  const response = NextResponse.json(
    { message: "Cookie set" },
    { status: 200 }
  );

  response.cookies.set({
    name: "token", // Este nome deve bater com o nome usado no middleware ("token")
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development", // Use secure em produção
    maxAge: 60 * 60 * 24 * 5, // 5 dias
    path: "/",
  });

  return response;
}
