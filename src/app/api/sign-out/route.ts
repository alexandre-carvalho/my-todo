import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json(
    { message: "Signed out" },
    { status: 200 }
  );

  response.cookies.set({
    name: "token",
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    maxAge: 0,
    path: "/",
  });

  return response;
}
