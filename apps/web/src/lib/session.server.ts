"use server-only";

import { cookies } from "next/headers";
import type { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE_KEY = "session";

export type SessionToken = string;

export async function getSessionToken(): Promise<SessionToken | null> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE_KEY)?.value ?? null;
}

export function getSessionTokenFromRequest(
  request: NextRequest
): SessionToken | null {
  return request.cookies.get(SESSION_COOKIE_KEY)?.value ?? null;
}

export function setSessionTokenForResponse(
  response: NextResponse,
  token: SessionToken,
  maxAgeSeconds = 60 * 60 * 24
): void {
  response.cookies.set(SESSION_COOKIE_KEY, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: maxAgeSeconds,
  });
}

export function clearSessionCookieForResponse(response: NextResponse): void {
  response.cookies.set(SESSION_COOKIE_KEY, "", {
    httpOnly: true,
    path: "/",
    expires: new Date(0),
  });
}
