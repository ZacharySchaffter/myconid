export type LookAlike = {
  url?: string;
  name?: string;
};
export interface ImageAnalysis {
  confidence: number;
  name: string | null;
  commonNames: string[] | null;
  lookAlikes: LookAlike[] | null;
  description: {
    content?: string;
    citation?: string;
  } | null;
  taxonomy: {
    class: string | null;
    genus: string | null;
    order: string | null;
    family: string | null;
    phylum: string | null;
    kingdom: string | null;
  } | null;
  traits: {
    psychoactive: boolean | null;
    edibility: string | null;
  };
}

export interface ImageRecord {
  userId: string;
  mediaPath: string;
  createdAt: Date;
  deletedAt?: Date | null;
  analysis?: ImageAnalysis | null;
}

export interface Image extends ImageRecord {
  id: string;
}
