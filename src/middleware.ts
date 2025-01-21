import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value

  // Daftar path yang membutuhkan autentikasi
  const authRequiredPaths = ['/cart', '/profile']
  const isAuthRequired = authRequiredPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  )

  if (isAuthRequired && !token) {
    // Simpan URL yang dicoba diakses
    const callbackUrl = encodeURIComponent(request.nextUrl.pathname)
    return NextResponse.redirect(
      new URL(`/login?callbackUrl=${callbackUrl}`, request.url)
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/cart/:path*', '/profile/:path*']
}