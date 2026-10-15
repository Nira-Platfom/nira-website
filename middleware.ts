import { NextResponse, type NextRequest } from 'next/server'

// chat.beautynira.com is the "Nira Chat" home-screen app: its own origin, so
// phones treat it as a separate app from "Nira Business" (www — whose
// manifest scope is the whole site). On the chat host, "/" IS the chat, chat
// links (/chat/<code>) keep working, and everything else (dashboard, explore,
// legal pages) is sent to the main site.
const MAIN_ORIGIN = process.env.NEXT_PUBLIC_MAIN_ORIGIN || 'https://www.beautynira.com'

export function middleware(req: NextRequest) {
  const host = (req.headers.get('host') || '').toLowerCase()
  if (!host.startsWith('chat.')) return NextResponse.next()

  const { pathname, search } = req.nextUrl
  if (pathname === '/') {
    const url = req.nextUrl.clone()
    url.pathname = '/chat'
    return NextResponse.rewrite(url)
  }
  if (pathname === '/chat' || pathname.startsWith('/chat/')) return NextResponse.next()

  const mainOrigin = host.endsWith('localhost') || host.includes('localhost:')
    ? `${req.nextUrl.protocol}//${host.replace(/^chat\./, '')}`
    : MAIN_ORIGIN
  return NextResponse.redirect(`${mainOrigin}${pathname}${search}`)
}

export const config = {
  // Static files (anything with a dot: icons, manifests, chat-sw.js) and
  // Next.js internals are served as-is on both hosts.
  matcher: ['/((?!_next/|api/|.*\\..*).*)'],
}
