// Uploaded images and files, stored in the R2 bucket and served at /media/<key>.

export type MediaItem = { key: string; url: string; size: number; type: string; uploaded: string }

const MAX_BYTES = 10 * 1024 * 1024
const ALLOWED_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
  'image/avif',
  'image/svg+xml',
  'image/x-icon',
  'image/vnd.microsoft.icon',
  'application/pdf',
])

export async function serveMedia(key: string, env: Env, request: Request): Promise<Response> {
  const object = await env.MEDIA.get(key, { onlyIf: request.headers })
  if (!object) return new Response('Not found', { status: 404 })

  const headers = new Headers()
  object.writeHttpMetadata(headers)
  headers.set('etag', object.httpEtag)
  // Keys never change (each upload gets a new one), so browsers can cache forever.
  headers.set('cache-control', 'public, max-age=31536000, immutable')
  // An SVG can contain scripts; this stops them from running if the file is opened directly.
  headers.set('content-security-policy', "default-src 'none'; style-src 'unsafe-inline'")
  headers.set('x-content-type-options', 'nosniff')

  // No body means the browser's cached copy is still current.
  if (!('body' in object)) return new Response(null, { status: 304, headers })
  return new Response(object.body, { headers })
}

export async function uploadMedia(request: Request, env: Env): Promise<MediaItem | string> {
  const form = await request.formData()
  const file = form.get('file')
  if (!(file instanceof File)) return 'No file in the upload'
  if (!ALLOWED_TYPES.has(file.type)) return `File type not allowed: ${file.type || 'unknown'}`
  if (file.size > MAX_BYTES) return 'File is larger than 10 MB'

  // e.g. "1727800000000-boston-trees.webp"
  const safeName = file.name
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, '-')
    .replace(/^-+|-+$/g, '')
  const key = `${Date.now()}-${safeName || 'file'}`
  const object = await env.MEDIA.put(key, await file.arrayBuffer(), {
    httpMetadata: { contentType: file.type },
  })
  return toItem(object)
}

export async function listMedia(env: Env): Promise<MediaItem[]> {
  const items: MediaItem[] = []
  let cursor: string | undefined
  do {
    const page = await env.MEDIA.list({ cursor, include: ['httpMetadata'] })
    items.push(...page.objects.map(toItem))
    cursor = page.truncated ? page.cursor : undefined
  } while (cursor)
  return items.sort((a, b) => b.uploaded.localeCompare(a.uploaded))
}

export async function deleteMedia(key: string, env: Env) {
  await env.MEDIA.delete(key)
}

function toItem(object: R2Object): MediaItem {
  return {
    key: object.key,
    url: `/media/${object.key}`,
    size: object.size,
    type: object.httpMetadata?.contentType ?? '',
    uploaded: object.uploaded.toISOString(),
  }
}
