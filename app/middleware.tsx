import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;

  const isLoginPage = req.nextUrl.pathname === "/login";

  // ❌ not logged in → force login
  if (!token && !isLoginPage) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // ✅ logged in → prevent going back to login
  if (token && isLoginPage) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}
export const config = {
  matcher: ["/", "/dashboard", "/profiles/:path*", "/search", "/account"],
};
