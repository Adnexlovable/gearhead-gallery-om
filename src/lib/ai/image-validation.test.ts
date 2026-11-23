import { describe, expect, it } from "vitest";
import {
  getCarImageDataUrlError,
  MAX_CAR_IMAGE_BYTES,
} from "./image-validation";

function dataUrl(mime: string, bytes: Uint8Array) {
  return `data:image/${mime};base64,${Buffer.from(bytes).toString("base64")}`;
}

describe("getCarImageDataUrlError", () => {
  it.each([
    { mime: "jpeg", signature: [0xff, 0xd8, 0xff, 0x00] },
    { mime: "png", signature: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] },
    { mime: "webp", signature: [0x52, 0x49, 0x46, 0x46, 0x00, 0x00, 0x00, 0x00, 0x57, 0x45, 0x42, 0x50] },
  ])("accepts a correctly signed $mime image", ({ mime, signature }) => {
    expect(getCarImageDataUrlError(dataUrl(mime, Uint8Array.from(signature)))).toBeNull();
  });

  it("rejects unsupported MIME types and mismatched image signatures", () => {
    expect(getCarImageDataUrlError("data:image/svg+xml;base64,PHN2Zz4="))
      .toContain("JPG, PNG, or WebP");
    expect(getCarImageDataUrlError(dataUrl("png", Uint8Array.from([1, 2, 3, 4, 5, 6, 7, 8]))))
      .toContain("JPG, PNG, or WebP");
  });

  it("rejects images larger than five megabytes", () => {
    const oversized = new Uint8Array(MAX_CAR_IMAGE_BYTES + 1);
    oversized.set([0xff, 0xd8, 0xff]);
    expect(getCarImageDataUrlError(dataUrl("jpeg", oversized))).toContain("under 5 MB");
  });
});
