import imageCompression from 'browser-image-compression'

const HARD_LIMIT_MB = 15
const HARD_LIMIT_BYTES = HARD_LIMIT_MB * 1024 * 1024
const TARGET_MB = 1

type CompressResult =
  | { file: File; originalMB: number; compressedMB: number; error?: never }
  | { file?: never; originalMB?: never; compressedMB?: never; error: string }

export async function compressImageFile(file: File): Promise<CompressResult> {
  const originalMB = file.size / 1024 / 1024

  if (file.size > HARD_LIMIT_BYTES) {
    return {
      error: `Fichier trop volumineux (${originalMB.toFixed(1)} Mo). La limite est ${HARD_LIMIT_MB} Mo.`,
    }
  }

  // GIF and SVG — skip compression, could corrupt animation or vector data
  if (file.type === 'image/gif' || file.type === 'image/svg+xml') {
    return { file, originalMB, compressedMB: originalMB }
  }

  // Already small enough — skip
  if (file.size <= TARGET_MB * 1024 * 1024) {
    return { file, originalMB, compressedMB: originalMB }
  }

  try {
    const compressed = await imageCompression(file, {
      maxSizeMB: TARGET_MB,
      maxWidthOrHeight: 2560,
      initialQuality: 0.9,
      useWebWorker: true,
    })
    // If compression made the file bigger (rare edge case), use original
    const result = compressed.size < file.size ? compressed : file
    return { file: result, originalMB, compressedMB: result.size / 1024 / 1024 }
  } catch {
    // Compression failed — fall back to original
    return { file, originalMB, compressedMB: originalMB }
  }
}
