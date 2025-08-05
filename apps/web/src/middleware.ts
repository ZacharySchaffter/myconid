import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import Auth from "@/services/auth";
import { clearSessionCookieForResponse } from "./lib/session.server";

export async function middleware(request: NextRequest) {
  try {
    const { isValid } = await Auth.verifySession();

    const response = NextResponse.redirect(new URL("/login", request.url));
    if (!isValid) {
      console.log("middleware - invalid session, redirecting to login");
      clearSessionCookieForResponse(response);
      return response;
    }
  } catch (err) {
    console.error("middleware error:", err);
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*", "/images/:path*"], // protect these paths
};
