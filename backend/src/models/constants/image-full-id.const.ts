interface NormalImage {
  id: string;
  ext: string;
  mime: string;
}

interface OriginalImage {
  id: string;
  ext: null;
  mime: null;
}

export type ImageFullId = NormalImage | OriginalImage;
