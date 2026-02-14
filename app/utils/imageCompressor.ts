/**
 * Image Compression Utility
 * Compress image files using Canvas API
 */

interface CompressionOptions {
  maxSize?: number // Max file size in MB (default: 1)
  quality?: number // JPEG quality 0-1 (default: 0.8)
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

  // If file is already smaller than max size, return as is
  if (file.size <= maxSizeBytes) {
    console.log(`File size ${(file.size / 1024 / 1024).toFixed(2)}MB is within limit`)
    return file
  }

  console.log(`Compressing image from ${(file.size / 1024 / 1024).toFixed(2)}MB...`)

  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (event) => {
      const img = new Image()

      img.onload = () => {
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

        // Convert to blob with compression
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to compress image'))
              return
            }

            // If still too large, recursively compress with lower quality
            if (blob.size > maxSizeBytes && quality > 0.1) {
              const newQuality = quality - 0.1
              console.log(`Still too large (${(blob.size / 1024 / 1024).toFixed(2)}MB), retrying with quality ${newQuality}...`)

              canvas.toBlob(
                (retryBlob) => {
                  if (!retryBlob) {
                    reject(new Error('Failed to compress image on retry'))
                    return
                  }

                  const compressedFile = new File([retryBlob], file.name, {
                    type: 'image/jpeg',
                    lastModified: file.lastModified,
                  })

                  console.log(`Compression successful: ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`)
                  resolve(compressedFile)
                },
                'image/jpeg',
                newQuality
              )
            } else {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: file.lastModified,
              })

              console.log(`Compression successful: ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`)
              resolve(compressedFile)
            }
          },
          'image/jpeg',
          quality
        )
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
 * Get human-readable file size
 * @param bytes - File size in bytes
 * @returns Formatted size string
 */
export function getFileSizeInMB(bytes: number): string {
  return (bytes / 1024 / 1024).toFixed(2)
}
