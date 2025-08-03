import dotenv from "dotenv";

// parse env
dotenv.config();
export class MediaService {
  baseUrl: string = process.env.MEDIA_SERVICE_BASE_URL!;
  constructor() {
    if (!this.baseUrl) {
      console.error("MEDIA_SERVICE_BASE_URL is required and unset");
    }
  }

  async _fetch<T>(path?: string, options?: RequestInit) {
    return fetch(this.baseUrl + (path || ""), options).then(async (res) => {
      let data;
      try {
        data = await res.clone().json();
      } catch (err) {
        console.error("response was not json encoded, parsing as text: ", err);
        data = await res.text();
      }

      if (!res.ok) {
        throw new Error(data);
      }

      return data as T;
    });
  }

  async saveMedia(userId: string, file: Express.Multer.File): Promise<string> {
    const formData = new FormData();
    const blob = new Blob([file.buffer], { type: file.mimetype });
    formData.append("file", blob, file.originalname);
    formData.append("user_id", userId);

    return this._fetch<string>("", {
      method: "POST",
      body: formData,
    });
  }
}

export default new MediaService();
