import { NextResponse } from "next/server";

// TODO: integrate with authentication service

export async function POST(req: Request) {
  const { username, password } = await req.json();

  console.log(`called registration with ${username}, ${password}`);
  // TODO: Set session cookie

  return NextResponse.json({ error: "invalid credentials" }, { status: 401 });
}
