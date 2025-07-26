"use server-only";

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

  async verifySession(
    request: NextRequest
  ): Promise<{ userId: string; isValid: boolean }> {
    // TODO: verify token via auth service

    return {
      userId: "fake-id-123",
      isValid: true,
    };
  }
}

export default new Auth();
