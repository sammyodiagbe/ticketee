import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value,
            ...options,
            // Make sure the cookie can be read by client-side code
            httpOnly: false,
          })
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value: '',
            ...options,
            // Make sure the cookie can be read by client-side code
            httpOnly: false,
          })
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()

  // Check if the request is for an auth page
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth')

  if (!session && !isAuthPage) {
    // Redirect to login if accessing protected route without session
    const redirectUrl = request.nextUrl.pathname + request.nextUrl.search
    return NextResponse.redirect(new URL(`/auth/sign-in?redirect=${encodeURIComponent(redirectUrl)}`, request.url))
  }

  if (session && isAuthPage) {
    // Redirect to home if accessing auth page with session
    return NextResponse.redirect(new URL('/', request.url))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
