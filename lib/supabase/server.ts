import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

// Check if Supabase environment variables are available
export const isSupabaseConfigured =
  typeof process.env.NEXT_PUBLIC_SUPABASE_URL === "string" &&
  process.env.NEXT_PUBLIC_SUPABASE_URL.length > 0 &&
  typeof process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === "string" &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length > 0

// Create a singleton instance of the Supabase client for Server Components
export const createClient = () => {
  const cookieStore = cookies()
  return createServerComponentClient({ cookies: () => cookieStore })
}

export const getUser = async () => {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

export const getProfile = async (userId: string) => {
  const supabase = createClient()
  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

  if (error) return null
  return data
}

export const getFriendsCount = async (userId: string) => {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("friendships")
    .select("*")
    .or(`user_id.eq.${userId},friend_id.eq.${userId}`)
    .eq("status", "accepted")

  if (error) return 0
  return data?.length || 0
}

export const getPendingRequestsCount = async (userId: string) => {
  const supabase = createClient()
  const { data, error } = await supabase.from("friendships").select("*").eq("friend_id", userId).eq("status", "pending")

  if (error) return 0
  return data?.length || 0
}
