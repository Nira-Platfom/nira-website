import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/login", "/register", "/privacy", "/terms"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));

  // Auth lives in localStorage (JWT bearer tokens), which middleware can't read —
  // real route protection happens client-side in AuthContext / (dashboard)/layout.tsx.
  // This just skips static assets so the matcher below stays cheap.
  if (isPublic) return NextResponse.next();

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|brand).*)"],
};
