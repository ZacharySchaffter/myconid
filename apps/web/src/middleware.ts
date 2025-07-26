import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionTokenFromRequest } from "./services/auth";

export async function middleware(request: NextRequest) {
  const sessionToken = await getSessionTokenFromRequest(request);

  if (!sessionToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*"], // protect these paths
};
