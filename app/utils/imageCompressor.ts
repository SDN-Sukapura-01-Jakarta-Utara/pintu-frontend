/**
 * Image Compression Utility
 * Compress image files using Canvas API to target size
 */

interface CompressionOptions {
  maxSize?: number // Max file size in MB (default: 1)
  quality?: number // Starting JPEG quality 0-1 (default: 0.8)
  maxWidth?: number // Max width in pixels (default: 2000)
  maxHeight?: number // Max height in pixels (default: 2000)
}

/**
 * Compress image file to specified size
 * @param file - Image file to compress
 * @param options - Compression options
 * @returns Compressed file
 */
export async function compressImage(
  file: File,
  options: CompressionOptions = {}
): Promise<File> {
  const {
    maxSize = 1, // Default 1MB
    quality = 0.8,
    maxWidth = 2000,
    maxHeight = 2000,
  } = options

  // Convert MB to bytes
  const maxSizeBytes = maxSize * 1024 * 1024

  console.log(`Starting compression: ${(file.size / 1024).toFixed(2)}KB target size: ${(maxSizeBytes / 1024).toFixed(2)}KB`)

  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (event) => {
      const img = new Image()

      img.onload = () => {
        try {
          const canvas = document.createElement('canvas')
          let width = img.width
          let height = img.height

          // Calculate new dimensions while maintaining aspect ratio
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height)
            width = Math.floor(width * ratio)
            height = Math.floor(height * ratio)
          }

          canvas.width = width
          canvas.height = height

          const ctx = canvas.getContext('2d')
          if (!ctx) {
            reject(new Error('Failed to get canvas context'))
            return
          }

          ctx.drawImage(img, 0, 0, width, height)

          // Start compression with progressive quality reduction
          compressWithQuality(canvas, file, maxSizeBytes, quality, 0, resolve, reject)
        } catch (error) {
          reject(error)
        }
      }

      img.onerror = () => {
        reject(new Error('Failed to load image'))
      }

      const result = event.target?.result as string
      img.src = result
    }

    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }

    reader.readAsDataURL(file)
  })
}

/**
 * Recursively compress canvas with decreasing quality until target size is reached
 */
function compressWithQuality(
  canvas: HTMLCanvasElement,
  originalFile: File,
  maxSizeBytes: number,
  quality: number,
  attempts: number,
  resolve: (file: File) => void,
  reject: (error: Error) => void
): void {
  // Prevent infinite recursion
  if (attempts > 50) {
    reject(new Error('Failed to compress image to target size'))
    return
  }

  canvas.toBlob(
    (blob) => {
      if (!blob) {
        reject(new Error('Failed to compress image'))
        return
      }

      const currentSize = blob.size
      const currentSizeKB = currentSize / 1024
      const targetSizeKB = maxSizeBytes / 1024

      console.log(
        `Attempt ${attempts}: Quality ${(quality * 100).toFixed(0)}% = ${currentSizeKB.toFixed(2)}KB (target: ${targetSizeKB.toFixed(2)}KB)`
      )

      // If we're within target size, we're done
      if (currentSize <= maxSizeBytes) {
        const compressedFile = new File([blob], originalFile.name, {
          type: 'image/jpeg',
          lastModified: originalFile.lastModified,
        })

        console.log(
          `✓ Compression successful: ${(compressedFile.size / 1024).toFixed(2)}KB`
        )
        resolve(compressedFile)
        return
      }

      // If quality is too low, we can't compress further
      if (quality <= 0.05) {
        console.warn(
          `⚠ Reached minimum quality but still ${(currentSize / 1024).toFixed(2)}KB. Returning current compression.`
        )
        const compressedFile = new File([blob], originalFile.name, {
          type: 'image/jpeg',
          lastModified: originalFile.lastModified,
        })
        resolve(compressedFile)
        return
      }

      // Calculate next quality based on size ratio
      // If current size is 2x target, quality should be ~half
      const sizeRatio = currentSize / maxSizeBytes
      let nextQuality = quality / Math.pow(sizeRatio, 0.5)

      // Ensure quality doesn't drop too fast or too slow
      nextQuality = Math.max(0.05, Math.min(nextQuality, quality - 0.05))

      // Try again with lower quality
      compressWithQuality(
        canvas,
        originalFile,
        maxSizeBytes,
        nextQuality,
        attempts + 1,
        resolve,
        reject
      )
    },
    'image/jpeg',
    quality
  )
}

/**
 * Get human-readable file size
 * @param bytes - File size in bytes
 * @returns Formatted size string
 */
export function getFileSizeInMB(bytes: number): string {
  return (bytes / 1024 / 1024).toFixed(2)
}

/**
 * Get human-readable file size in KB
 * @param bytes - File size in bytes
 * @returns Formatted size string
 */
export function getFileSizeInKB(bytes: number): string {
  return (bytes / 1024).toFixed(2)
}
