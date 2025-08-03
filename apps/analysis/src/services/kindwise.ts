export type KindwiseIdentificationResponse = {
  classification: {
    suggestions: Array<{
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
      };
    }>;
  };
  is_mushroom: {
    probability: number;
    threshold: number;
    binary: boolean;
  };
};

class KindwiseMushroomAnalysis {
  private baseUrl = "https://mushroom.kindwise.com/api/v1";

  constructor(private apiKey: string) {
    if (!apiKey) {
      console.error("kindwise api key is required and unset!");
      process.exit(1);
    }
  }

  /**
   * Requests identification from kindwise's API
   *
   * Docs: https://documenter.getpostman.com/view/3802128/2s93kz55EY#3a736736-324a-4468-a943-84b54bd2ed21
   */
  async requestIdentificationSync(file: Express.Multer.File) {
    try {
      const arrayBuffer = file.buffer.buffer.slice(
        file.buffer.byteOffset,
        file.buffer.byteOffset + file.buffer.byteLength
      ) as ArrayBuffer;

      const blob = new Blob([arrayBuffer], { type: file.mimetype });
      const formData = new FormData();

      formData.append("image1", blob, file.originalname);

      const res = await fetch(
        this.baseUrl +
          "/identification?details=taxonomy,common_names,url,description,edibility,psychoactive,url,look_alike&async=false",
        {
          headers: {
            "Api-Key": this.apiKey,
          },
          body: formData,
        }
      );
      if (!res.ok) {
        throw new Error("identification failed");
      }

      const data = await res.json();
      return data?.result;
    } catch (err) {
      console.error("error requesting identification:", err);
    }
  }
}

export default KindwiseMushroomAnalysis;
