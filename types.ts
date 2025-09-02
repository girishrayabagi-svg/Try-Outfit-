
export interface ImageState {
  base64: string;
  mimeType: string;
}

export interface TryOnResult {
  image: string | null;
  text: string | null;
}
