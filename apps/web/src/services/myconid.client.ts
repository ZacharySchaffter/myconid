"use client";

import { type Image } from "@myconid/store/types";

type APIResponse<T> = {
  data: T;
  success: boolean;
};

export class MyconidCoreService {
  baseUrl: string = process.env.NEXT_PUBLIC_CORE_API_BASE_URL!;

  constructor(private sessionToken: string) {
    if (!this.baseUrl) {
      console.error("core api service base url not set and is required!");
    }
  }

  async _fetch<T>(
    path: string,
    options?: RequestInit
  ): Promise<APIResponse<T>> {
    return fetch(this.baseUrl + path, {
      ...(options || {}),
      headers: {
        Authorization: `Bearer ${this.sessionToken}`,
      },
    }).then(async (res) => {
      let data;
      try {
        data = await res.json();
      } catch (err) {
        console.error("response was not json encoded, parsing as text: ", err);
        data = await res.text();
      }

      if (!res.ok) {
        throw new Error(data);
      }

      if (!data?.success) {
        console.error("api response indicates error:", data);
        throw new Error("request failed");
      }

      return data as APIResponse<T>;
    });
  }

  async getImage(id: string): Promise<Image> {
    return this._fetch<Image>(`/images/${id}`).then((res) => {
      return res?.data;
    });
  }

  // TODO: add exclude option, make userId optional
  async listImages(userId: string, exclude?: boolean): Promise<Image[]> {
    const params = new URLSearchParams();
    params.set("user", userId);
    if (typeof exclude != undefined) {
      params.set("exclude", String(exclude));
    }

    return this._fetch<Image[]>(
      `/images${params.size > 0 ? `?${params.toString()}` : ""}`
    ).then((res) => {
      return res?.data;
    });
  }

  async createImage(file: File): Promise<Image> {
    const formData = new FormData();
    formData.append("file", file);

    return this._fetch<Image>("/images", {
      method: "POST",
      body: formData,
    }).then(async (res) => {
      return res?.data;
    });
  }
}
