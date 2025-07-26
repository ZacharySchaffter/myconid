import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import Auth from "@/services/auth";

export async function middleware(request: NextRequest) {
  const { isValid } = await Auth.verifySession();

  if (!isValid) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*", "/images/:path*"], // protect these paths
};
