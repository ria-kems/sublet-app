const MAX_IMAGE_BYTES = Math.floor(4.5 * 1024 * 1024);
const MAX_DIMENSION = 1600;

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function compressImage(file: File): Promise<File> {
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error("Images must be JPEG, PNG, or WebP.");
  }

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(
    1,
    MAX_DIMENSION / Math.max(bitmap.width, bitmap.height),
  );
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Could not compress this image.");
  }

  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const outputType = file.type === "image/png" ? "image/png" : file.type;
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) => {
        if (result) {
          resolve(result);
          return;
        }
        reject(new Error("Could not compress this image."));
      },
      outputType,
      0.82,
    );
  });

  if (blob.size > MAX_IMAGE_BYTES) {
    throw new Error("Each image must be 4.5 MB or smaller after compression.");
  }

  const extension =
    outputType === "image/png" ? "png" : outputType === "image/webp" ? "webp" : "jpg";

  return new File([blob], file.name.replace(/\.[^.]+$/, `.${extension}`), {
    type: outputType,
  });
}
