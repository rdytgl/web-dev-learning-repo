import { NextResponse, type NextRequest } from "next/server"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"

const isSupabaseConfigured =
  typeof process.env.NEXT_PUBLIC_SUPABASE_URL === "string" &&
  process.env.NEXT_PUBLIC_SUPABASE_URL.length > 0 &&
  typeof process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === "string" &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length > 0

  async function getSessionFromCookies(request: NextRequest) {
    const supabase = createServerComponentClient({ cookies: () => request.cookies })

    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error || !session) return null
      return session
    } catch (err) {
      console.error("Error fetching Supabase session:", err)
      return null
    }
  }


export async function middleware(request: NextRequest) {
  if (!isSupabaseConfigured) return NextResponse.next({ request })

  const requestUrl = new URL(request.url)

  // Skip auth routes
  const isAuthRoute =
    request.nextUrl.pathname.startsWith("/auth/login") ||
    request.nextUrl.pathname.startsWith("/auth/sign-up") ||
    request.nextUrl.pathname === "/auth/callback"

  if (!isAuthRoute) {
    const session = await getSessionFromCookies(request)
    if (!session) {
      return NextResponse.redirect(new URL("/auth/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}