interface ImageRecord {
  userId: string;
  mediaPath: string;
  createdAt: Date;
  deletedAt?: Date | null;
}

interface Image extends ImageRecord {
  id: string;
}

class MyconidCoreService {
  baseUrl: string = process.env.NEXT_PUBLIC_CORE_API_BASE_URL!;

  constructor() {
    if (!this.baseUrl) {
      console.error("myconid service base url not set and is required!");
    }
  }

  async getImage(id: string): Promise<Image | null> {
    return fetch(this.baseUrl + `/images${id}`).then(async (res) => {
      let data;
      try {
        data = await res.json();
      } catch (err) {
        console.error("error retrieving image by id: ", err);
        data = await res.text();
      }
      if (!res.ok) {
        throw new Error(data);
      }

      return data;
    });
  }

  // TODO: add exclude option, make userId optional
  async listImages(userId: string): Promise<Image[]> {
    return fetch(this.baseUrl + `/images`).then(async (res) => {
      let data;
      try {
        data = await res.json();
      } catch (err) {
        console.error("error retrieving image by id: ", err);
        data = await res.text();
      }
      if (!res.ok) {
        throw new Error(data);
      }

      return data;
    });
  }

  async createImage(file: File): Promise<Image> {
    const formData = new FormData();
    formData.append("file", file);

    return fetch(this.baseUrl + "/images", {
      method: "POST",
      body: formData,
    }).then(async (res) => {
      if (!res.ok) {
        // Try to parse error body (json or text)
        let errorBody;
        try {
          errorBody = await res.json();
        } catch {
          errorBody = await res.text();
        }
        throw new Error(`Upload failed: ${res.status} ${errorBody}`);
      }

      const image: Image = await res.json();
      return image;
    });
  }
}

export default new MyconidCoreService();
