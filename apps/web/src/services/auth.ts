"use server-only";

import { getSessionToken } from "@/lib/session.server";

interface TokenResponse {
  user_id: string;
  username: string;
  token: string;
  expires_at: Date;
}

class Auth {
  baseUrl = process.env.NEXT_PUBLIC_AUTH_SERVICE_BASE_URL;
  constructor() {
    if (!this.baseUrl) {
      console.error("AUTH_SERVICE_BASE_URL unset and required!");
    }
  }

  async _fetch<T>(path: string, options?: RequestInit): Promise<T> {
    return fetch(this.baseUrl + path, options).then(async (res) => {
      let data;
      try {
        data = await res.clone().json();
      } catch {
        data = await res.text();
      }

      if (!res.ok) {
        throw new Error(data || `${res.status} - ${res.statusText}`);
      }

      return data;
    });
  }

  async login(username: string, password: string): Promise<TokenResponse> {
    return this._fetch("/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
  }

  async register(username: string, password: string): Promise<TokenResponse> {
    return this._fetch("/register", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
  }

  async verifySession(
    token?: string
  ): Promise<{ userId: string; isValid: true }> {
    if (!token) {
      token = (await getSessionToken()) || "";
    }

    if (!token) {
      return Promise.reject("no session found");
    }

    return this._fetch("/validate", {
      method: "POST",
      body: JSON.stringify({ token: token }),
    });
  }
}

export default new Auth();
