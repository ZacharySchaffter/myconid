import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionTokenFromRequest } from "./lib/session";

export async function middleware(request: NextRequest) {
  const sessionToken = getSessionTokenFromRequest(request);

  if (!sessionToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*"], // protect these paths
};
