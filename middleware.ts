import { NextResponse, type NextRequest } from "next/server"

const isSupabaseConfigured =
  typeof process.env.NEXT_PUBLIC_SUPABASE_URL === "string" &&
  process.env.NEXT_PUBLIC_SUPABASE_URL.length > 0 &&
  typeof process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === "string" &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length > 0

async function getSessionFromCookies(request: NextRequest) {
  const sessionCookie = request.cookies.get("sb-access-token")
  if (!sessionCookie) return null

  try {
    return { user: { id: "user-id" } }
  } catch (err) {
    console.error("Error parsing session:", err)
    return null
  }
}

export async function middleware(request: NextRequest) {
  try {
    if (!isSupabaseConfigured) {
      return NextResponse.next({ request })
    }

    const res = NextResponse.next()
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get("code")

    if (code) {
      return NextResponse.redirect(new URL("/", request.url))
    }

    const isAuthRoute =
      request.nextUrl.pathname.startsWith("/auth/login") ||
      request.nextUrl.pathname.startsWith("/auth/sign-up") ||
      request.nextUrl.pathname === "/auth/callback"

    if (!isAuthRoute) {
      const session = await getSessionFromCookies(request)

      if (!session) {
        const redirectUrl = new URL("/auth/login", request.url)
        return NextResponse.redirect(redirectUrl)
      }
    }

    return res
  } catch (err) {
    console.error("🔥 Middleware crashed:", err)
    return new NextResponse(
      JSON.stringify({ error: "Middleware error", details: String(err) }),
      { status: 500, headers: { "content-type": "application/json" } }
    )
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}