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
