import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Get token dari cookies
  const token = request.cookies.get("token")?.value;

  // Daftar protected routes yang membutuhkan authentication
  const protectedRoutes = ["/cart", "/profile", "/checkout"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  // Redirect ke login jika mengakses protected route tanpa token
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect ke home jika sudah login tapi mencoba akses login/signup
  const authRoutes = ["/login", "/signup"];
  const isAuthRoute = authRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// Konfigurasi route mana saja yang akan dihandle middleware
export const config = {
  matcher: [
    "/cart/:path*",
    "/profile/:path*",
    "/checkout/:path*",
    "/login",
    "/signup",
  ],
};
