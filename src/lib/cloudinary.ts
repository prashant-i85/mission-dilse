export async function uploadImage(file: File): Promise<string> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

  // Fallback for demo preview mode when environment variables are not configured
  if (!cloudName || !preset) {
    console.warn('Cloudinary cloud name or upload preset is missing. Generating a local demo image placeholder URL.')
    return new Promise((resolve) => {
      setTimeout(() => {
        const randomId = Math.floor(Math.random() * 1000)
        resolve(`https://picsum.photos/id/${randomId % 100}/800/600`)
      }, 1500)
    })
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', preset)

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData,
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error?.message || 'Failed to upload image to Cloudinary')
  }

  const data = await res.json()
  return data.secure_url
}

/**
 * Upload a raw video file to Cloudinary.
 * Requires the upload preset resource_type to be "auto" (not just "image").
 */
export async function uploadVideo(file: File): Promise<string> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

  if (!cloudName || !preset) {
    throw new Error('Cloudinary is not configured. Please set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET.')
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', preset)

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/video/upload`, {
    method: 'POST',
    body: formData,
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error?.message || 'Failed to upload video to Cloudinary')
  }

  const data = await res.json()
  return data.secure_url as string
}

/**
 * Given a Cloudinary video URL, returns a lightweight preview version by injecting
 * transformation params: low quality, capped width, auto format.
 * Falls back to the original URL for non-Cloudinary links.
 *
 * This keeps card previews fast — typically 200–400 KB instead of several MB.
 */
export function getCloudinaryVideoPreviewUrl(url: string): string {
  // Match Cloudinary video upload URLs
  const match = url.match(
    /^(https:\/\/res\.cloudinary\.com\/[^/]+\/video\/upload\/)(v\d+\/.*|[^/].*)?$/
  )
  if (!match) return url // not a Cloudinary video — return as-is

  const base = match[1]   // https://res.cloudinary.com/<cloud>/video/upload/
  const rest = match[2] ?? '' // v123.../filename.ext

  // Transformations: quality low, width 480px, auto format (webm/mp4), auto codec
  const transforms = 'q_auto:low,w_480,f_auto'
  return `${base}${transforms}/${rest}`
}
