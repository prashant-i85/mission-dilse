/**
 * Utility functions for video feed handling in Works.
 * Enables zero-database-change fallback by allowing video URLs to be stored
 * either in the native 'video_url' column (if present) or encoded as metadata
 * tag [VIDEO:url] in the 'description' column.
 */

export function parseWorkVideo(work: {
  video_url?: string | null
  description?: string | null
}): {
  video_url: string | null
  description: string
} {
  const rawDesc = work.description || ''

  // 1. If native video_url column is populated
  if (work.video_url && work.video_url.trim().length > 0) {
    // Also clean any stray metadata tag in description just in case
    const cleanDesc = cleanVideoTagFromDescription(rawDesc)
    return {
      video_url: work.video_url.trim(),
      description: cleanDesc,
    }
  }

  // 2. Check if description has embedded video metadata tag: [VIDEO:url] or <!--VIDEO:url-->
  const match = rawDesc.match(
    /(?:\[VIDEO:\s*([^\s\]]+)\s*\]|<!--VIDEO:\s*([^\s>]+)\s*-->|\[video_url\]\s*([^\s\[]+)\s*\[\/video_url\])/i
  )

  if (match) {
    const extractedUrl = match[1] || match[2] || match[3] || null
    const cleanDesc = cleanVideoTagFromDescription(rawDesc)
    return {
      video_url: extractedUrl ? extractedUrl.trim() : null,
      description: cleanDesc,
    }
  }

  return {
    video_url: null,
    description: rawDesc,
  }
}

export function cleanVideoTagFromDescription(description: string): string {
  if (!description) return ''
  return description
    .replace(
      /(?:\r?\n)*\s*(?:\[VIDEO:\s*[^\s\]]+\s*\]|<!--VIDEO:\s*[^\s>]+\s*-->|\[video_url\]\s*[^\s\[]+\s*\[\/video_url\])/gi,
      ''
    )
    .trim()
}

export function encodeVideoInDescription(
  description: string,
  videoUrl?: string | null
): string {
  const cleanDesc = cleanVideoTagFromDescription(description || '')
  if (!videoUrl || videoUrl.trim().length === 0) {
    return cleanDesc
  }
  return `${cleanDesc}\n\n[VIDEO:${videoUrl.trim()}]`
}

export function getYouTubeEmbedUrl(url?: string | null): string | null {
  if (!url) return null
  const cleanUrl = url.trim()
  
  // Matches standard youtube.com/watch?v=, youtu.be/, youtube.com/shorts/, youtube.com/embed/
  const regExp =
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=|shorts\/)|youtu\.be\/)([^"&?/\s]{11})/i
  const match = cleanUrl.match(regExp)
  
  if (match && match[1]) {
    return `https://www.youtube.com/embed/${match[1]}?autoplay=1`
  }
  return null
}
