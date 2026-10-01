// The Worker in front of the site. Every request comes here first:
//   GET  /api/content       all site content as JSON (public)
//   *    /api/admin/...     edits from the admin dashboard (Cloudflare Access login required)
//   GET  /media/<key>       uploaded files from R2
//   anything else           the built React app, with the content added to HTML pages
import {
  collectionSchemas,
  formatIssues,
  settingsSchemas,
  type CollectionKey,
  type SettingsKey,
} from '../src/shared/schema.ts'
import { isAdmin } from './auth.ts'
import { collectionStatements, loadContent, settingStatement, write } from './db.ts'
import { injectContent } from './inject.ts'
import { deleteMedia, listMedia, serveMedia, uploadMedia } from './media.ts'

const json = (body: unknown, status = 200) =>
  Response.json(body, { status, headers: { 'cache-control': 'no-store' } })
const error = (message: string, status: number) => json({ error: message }, status)

export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    // One address for the site: www.mauriceneme.com → mauriceneme.com (Access guards the latter).
    if (url.hostname.startsWith('www.')) {
      url.hostname = url.hostname.slice(4)
      return Response.redirect(url.toString(), 301)
    }

    if (url.pathname === '/api/content' && request.method === 'GET') {
      return json(await loadContent(env.DB))
    }

    if (url.pathname.startsWith('/api/admin/')) {
      if (!(await isAdmin(request, env))) return error('Not signed in as the site admin', 403)
      try {
        return await handleAdmin(request, env, url.pathname.slice('/api/admin/'.length))
      } catch (err) {
        console.error(err)
        return error(err instanceof Error ? err.message : 'Something went wrong', 500)
      }
    }

    if (url.pathname.startsWith('/api/')) return error('Not found', 404)

    if (url.pathname.startsWith('/media/') && request.method === 'GET') {
      return serveMedia(decodeURIComponent(url.pathname.slice('/media/'.length)), env, request)
    }

    return servePage(request, env)
  },
} satisfies ExportedHandler<Env>

async function handleAdmin(request: Request, env: Env, path: string): Promise<Response> {
  const [resource, key] = path.split('/', 2)
  const method = request.method

  // PUT /api/admin/settings/<key>   e.g. settings/hero
  if (resource === 'settings' && key && method === 'PUT') {
    if (!(key in settingsSchemas)) return error(`Unknown settings: ${key}`, 404)
    const settingsKey = key as SettingsKey
    const result = settingsSchemas[settingsKey].safeParse(await request.json())
    if (!result.success) return error(formatIssues(result.error), 400)
    await write(env.DB, [settingStatement(settingsKey, result.data)])
    return json(await loadContent(env.DB))
  }

  // PUT /api/admin/projects | experience | themes   (the whole list, in order)
  if (resource in collectionSchemas && !key && method === 'PUT') {
    const collection = resource as CollectionKey
    const result = collectionSchemas[collection].safeParse(await request.json())
    if (!result.success) return error(formatIssues(result.error), 400)
    await write(env.DB, collectionStatements(collection, result.data))
    return json(await loadContent(env.DB))
  }

  if (resource === 'media') {
    if (!key && method === 'GET') return json(await listMedia(env))
    if (!key && method === 'POST') {
      const result = await uploadMedia(request, env)
      return typeof result === 'string' ? error(result, 400) : json(result, 201)
    }
    if (key && method === 'DELETE') {
      await deleteMedia(decodeURIComponent(path.slice('media/'.length)), env)
      return json({ ok: true })
    }
  }

  return error('Not found', 404)
}

async function servePage(request: Request, env: Env): Promise<Response> {
  const wantsHtml = request.headers.get('accept')?.includes('text/html')
  if (!wantsHtml) return env.ASSETS.fetch(request)

  // Ask for the full page (no "304 Not Modified"): the content inside it can change at any time.
  const headers = new Headers(request.headers)
  headers.delete('if-none-match')
  headers.delete('if-modified-since')
  const page = await env.ASSETS.fetch(new Request(request, { headers }))
  if (!page.headers.get('content-type')?.includes('text/html')) return page

  let content
  try {
    content = await loadContent(env.DB)
  } catch (err) {
    // The app will try GET /api/content itself and show an error if that fails too.
    console.error('Could not load content for the page', err)
    return page
  }

  const { pathname } = new URL(request.url)
  const area = pathname === '/admin' || pathname.startsWith('/admin/') ? 'admin' : 'site'
  const response = injectContent(page, content, area)
  const out = new Response(response.body, response)
  out.headers.delete('etag')
  out.headers.delete('last-modified')
  out.headers.set('cache-control', 'no-store')
  return out
}
