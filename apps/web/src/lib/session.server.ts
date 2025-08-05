"use server-only";

import { cookies } from "next/headers";
import type { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE_KEY = "session";

export type SessionToken = string;

export type Session = {
  user_id: string;
  username: string;
  token: string;
};

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(SESSION_COOKIE_KEY)?.value;
  if (!cookieValue) return null;
  try {
    return JSON.parse(cookieValue);
  } catch {
    return null;
  }
}

export function getSessionTokenFromRequest(
  request: NextRequest
): SessionToken | null {
  return request.cookies.get(SESSION_COOKIE_KEY)?.value ?? null;
}

export function setSessionTokenForResponse(
  response: NextResponse,
  session: Session,
  maxAgeSeconds = 60 * 60 * 24
): void {
  response.cookies.set(SESSION_COOKIE_KEY, JSON.stringify(session), {
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
