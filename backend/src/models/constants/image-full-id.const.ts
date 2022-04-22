interface NormalImage {
  type: 'normal';
  id: string;
  ext: string;
  mime: string;
}

interface OriginalImage {
  type: 'original';
  id: string;
  ext: null;
  mime: null;
}

export type ImageFullId = NormalImage | OriginalImage;
