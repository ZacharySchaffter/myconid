export interface ImageRecord {
  userId: string;
  mediaPath: string;
  createdAt: Date;
  deletedAt?: Date | null;
}

export interface Image extends ImageRecord {
  id: string;
}
