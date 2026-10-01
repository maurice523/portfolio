// Checks that an /api/admin request comes from you, signed in through Cloudflare Access.
//
// Access sits in front of /admin and /api/admin and only lets mauricenemee@gmail.com through.
// When it does, it adds a signed token (a JWT) to the request. We verify that token here too,
// so the API stays locked even if a request somehow reaches the Worker without passing Access.
import { createRemoteJWKSet, jwtVerify } from 'jose'

// Access's public signing keys. jose caches them between requests.
let keys: ReturnType<typeof createRemoteJWKSet> | undefined

export async function isAdmin(request: Request, env: Env): Promise<boolean> {
  // `npm run dev` has no Access in front of it, so local development skips the check.
  // Vite replaces import.meta.env.DEV with false in production builds.
  if (import.meta.env.DEV) return true

  const token = request.headers.get('Cf-Access-Jwt-Assertion')
  if (!token) return false

  const issuer = `https://${env.ACCESS_TEAM_DOMAIN}`
  keys ??= createRemoteJWKSet(new URL(`${issuer}/cdn-cgi/access/certs`))

  try {
    const { payload } = await jwtVerify(token, keys, { issuer, audience: env.ACCESS_AUD })
    return typeof payload.email === 'string' && payload.email.toLowerCase() === env.ADMIN_EMAIL
  } catch {
    return false
  }
}
