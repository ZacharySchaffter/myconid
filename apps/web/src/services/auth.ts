"use server-only";

import { getSessionToken } from "@/lib/session.server";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

interface TokenResponse {
  user_id: string;
  username: string;
  token: string;
  expires_at: Date;
}

class Auth {
  constructor() {}

  async login(username: string, password: string): Promise<TokenResponse> {
    throw Error("not implemented");
  }

  async register(username: string, password: string): Promise<TokenResponse> {
    throw Error("not implemented");
  }

  async verifySession(): Promise<
    { userId: string; isValid: true } | { userId?: null; isValid: false }
  > {
    // TODO: verify token via auth service
    const token = await getSessionToken();

    if (!token) {
      return {
        isValid: false,
      };
    }

    return {
      userId: "fake-id-123",
      isValid: true,
    };
  }
}

export default new Auth();
