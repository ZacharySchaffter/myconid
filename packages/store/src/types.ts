export type LookAlike = {
  url?: string;
  name?: string;
};
export interface ImageAnalysis {
  isMushroom?: {
    confidence: number;
    binary: boolean;
  };
  name?: string;
  commonNames?: string[];
  lookAlikes?: LookAlike[];
  description?: {
    content?: string;
    citation?: string;
  };
  taxonomy?: {
    class?: string;
    genus?: string;
    order?: string;
    family?: string;
    phylum?: string;
    kingdom?: string;
  };
  traits: {
    psychoactive?: boolean;
    edibility?: string;
  };
}

export interface ImageRecord {
  userId: string;
  mediaPath: string;
  createdAt: Date;
  deletedAt?: Date | null;
  analysis?: ImageAnalysis;
}

export interface Image extends ImageRecord {
  id: string;
}
