interface MyconidImageRecord {
  userId: string;
  mediaPath: string;
  createdAt: Date;
  deletedAt?: Date | null;
}

export interface MyconidImage extends MyconidImageRecord {
  id: string;
}

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
    return fetch(this.baseUrl + path, options).then(async (res) => {
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

  async getImage(id: string): Promise<MyconidImage | null> {
    return this._fetch<MyconidImage>(`/images/${id}`).then((res) => {
      return res?.data;
    });
  }

  // TODO: add exclude option, make userId optional
  async listImages(userId: string): Promise<MyconidImage[]> {
    return this._fetch<MyconidImage[]>(`/images`).then((res) => {
      return res?.data;
    });
  }

  async createImage(file: File): Promise<MyconidImage> {
    const formData = new FormData();
    formData.append("file", file);

    return this._fetch<MyconidImage>("/images", {
      method: "POST",
      body: formData,
    }).then(async (res) => {
      return res?.data;
    });
  }
}

export default new MyconidCoreService();
