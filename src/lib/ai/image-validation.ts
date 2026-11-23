export const MAX_CAR_IMAGE_BYTES = 5 * 1024 * 1024;
export const MAX_CAR_IMAGE_DATA_URL_LENGTH = 7_000_000;

const IMAGE_DATA_URL = /^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+/]+={0,2})$/i;

export function getCarImageDataUrlError(value: string): string | null {
  if (value.length > MAX_CAR_IMAGE_DATA_URL_LENGTH) {
    return "Photo is too large. Please use an image under 5 MB.";
  }

  const match = IMAGE_DATA_URL.exec(value);
  if (!match) {
    return "Please choose a valid JPG, PNG, or WebP image.";
  }

  let bytes: string;
  try {
    bytes = atob(match[2]);
  } catch {
    return "Please choose a valid JPG, PNG, or WebP image.";
  }

  if (bytes.length > MAX_CAR_IMAGE_BYTES) {
    return "Photo is too large. Please use an image under 5 MB.";
  }

  const mimeType = match[1].toLowerCase();
  const isJpeg = mimeType === "jpeg" &&
    bytes.length >= 3 &&
    bytes.charCodeAt(0) === 0xff &&
    bytes.charCodeAt(1) === 0xd8 &&
    bytes.charCodeAt(2) === 0xff;
  const isPng = mimeType === "png" &&
    bytes.length >= 8 &&
    [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a].every(
      (byte, index) => bytes.charCodeAt(index) === byte,
    );
  const isWebp = mimeType === "webp" &&
    bytes.length >= 12 &&
    bytes.slice(0, 4) === "RIFF" &&
    bytes.slice(8, 12) === "WEBP";

  return isJpeg || isPng || isWebp
    ? null
    : "Please choose a valid JPG, PNG, or WebP image.";
}
