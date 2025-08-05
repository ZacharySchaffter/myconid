import { setSessionTokenForResponse } from "@/lib/session.server";
import auth from "@/services/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // get credentials
  const { username, password } = await req.json();

  try {
    const session = await auth.login(username, password);
    const response = NextResponse.json({
      user_id: session.user_id,
      username: session?.username,
      token: session?.token,
    });
    setSessionTokenForResponse(response, session);
    return response;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "invalid credentials" }, { status: 401 });
  }
}
