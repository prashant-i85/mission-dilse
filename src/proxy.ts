import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // If environment variables are missing (e.g. local setup without keys),
  // bypass middleware checks to allow compilation and page layout testing.
  if (!url || !anonKey) {
    return response
  }

  const supabase = createServerClient(
    url,
    anonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session and check active user
  const { data: { user } } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname

  if (path.startsWith('/admin')) {
    if (path !== '/admin/login') {
      if (!user) {
        return NextResponse.redirect(new URL('/admin/login', request.url))
      }
    } else {
      if (user) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url))
      }
    }
  }

  return response
}

export const config = {
  matcher: ['/admin/:path*'],
}
