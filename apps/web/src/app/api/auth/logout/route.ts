import { clearSessionCookieForResponse } from "@/lib/session.server";
import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });
  await clearSessionCookieForResponse(response);
  return response;
}
