import { setSessionTokenForResponse } from "@/lib/session.server";
import auth from "@/services/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // get credentials
  const { username, password } = await req.json();

  try {
    const session = await auth.register(username, password);
    console.log("GOT SESSION: ", session);
    const response = NextResponse.json({
      userId: session.user_id,
      username: session?.username,
    });

    setSessionTokenForResponse(response, session.token);
    return response;
  } catch (err) {
    console.log("REGISTRATION ERROR:");
    console.error(err);
    return NextResponse.json({ error: "invalid credentials" }, { status: 401 });
  }
}
