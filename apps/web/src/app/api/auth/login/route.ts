import { setSessionTokenForResponse } from "@/lib/session.server";
import { NextResponse } from "next/server";

// TODO: integrate with authentication service

export async function POST(req: Request) {
  const { username, password } = await req.json();

  if (username === "admin" && password === "password") {
    const response = NextResponse.json({
      user_id: "fake-user-123",
      username: "admin",
    });

    const token = "fake-jwt-token";

    setSessionTokenForResponse(response, token);

    return response;
  }

  return NextResponse.json({ error: "invalid credentials" }, { status: 401 });
}
