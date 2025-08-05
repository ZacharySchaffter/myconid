"use server-only";

import { getSession } from "@/lib/session.server";
import { type Image } from "@myconid/store/types";

type APIResponse<T> = {
  data: T;
  success: boolean;
};

class MyconidCoreService {
  baseUrl: string = process.env.NEXT_PUBLIC_CORE_API_BASE_URL!;

  constructor() {
    if (!this.baseUrl) {
      console.error("core api service base url not set and is required!");
    }
  }

  async _fetch<T>(
    path: string,
    options?: RequestInit
  ): Promise<APIResponse<T>> {
    const session = await getSession();

    return fetch(this.baseUrl + path, {
      ...(options || {}),
      headers: {
        ...(options?.headers || {}),
        Authorization: `Bearer ${session?.token}`,
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

  async listImages(userId: string, exclude?: boolean): Promise<Image[]> {
    const params = new URLSearchParams();
    params.set("user", userId);
    if (!!exclude) {
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

export default new MyconidCoreService();
