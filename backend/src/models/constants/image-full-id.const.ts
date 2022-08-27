interface NormalImage {
  variant: 'normal';
  id: string;
  ext: string;
  filetype: string;
}

interface OriginalImage {
  variant: 'original';
  id: string;
  ext: null;
  filetype: null;
}

export type ImageFullId = NormalImage | OriginalImage;
