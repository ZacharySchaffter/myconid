export type AnalysisResponse = {
  classification: {
    suggestions: {
      id: string;
      name: string;
      probability: number;
      details: {
        common_names: string[];
        url: string;
        edibility: string;
        look_alike: Array<{
          url: string;
          entity_id: string;
          name: string;
        }>;
        psychoactive: boolean;
        description: {
          value: string;
          citation: string;
          license_name: string;
          license_url: string;
        };
        language: string;
        entity_id: string;
        taxonomy: {
          class: string;
          genus: string;
          order: string;
          family: string;
          phylum: string;
          kingdom: string;
        };
      };
    }[];
  };
  is_mushroom: {
    probability: number;
    threshold: number;
    binary: boolean;
  };
};

export class AnalysisService {
  constructor(public baseUrl: string) {
    if (!this.baseUrl) {
      console.error("ANALYSIS_SERVICE_BASE_URL is required and unset");
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

  async analyzeImage(file: Express.Multer.File): Promise<AnalysisResponse> {
    const arrayBuffer = file.buffer.buffer.slice(
      file.buffer.byteOffset,
      file.buffer.byteOffset + file.buffer.byteLength
    ) as ArrayBuffer;
    const blob = new Blob([arrayBuffer], { type: file.mimetype });

    const formData = new FormData();
    formData.append("file", blob, file.originalname);

    return this._fetch<AnalysisResponse>("", {
      method: "POST",
      body: formData,
    });
  }
}
