"use server"

import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function signIn(prevState: any, formData: FormData) {
  // Check if formData is valid
  if (!formData) {
    return { error: "Form data is missing" }
  }

  const email = formData.get("email")
  const password = formData.get("password")

  // Validate required fields
  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.toString(),
      password: password.toString(),
    })

    if (error) {
      return { error: error.message }
    }

    // Return success instead of redirecting directly
    return { success: true }
  } catch (error) {
    console.error("Login error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

export async function signUp(prevState: any, formData: FormData) {
  // Check if formData is valid
  if (!formData) {
    return { error: "Form data is missing" }
  }

  const email = formData.get("email")
  const password = formData.get("password")
  const username = formData.get("username")

  // Validate required fields
  if (!email || !password || !username) {
    return { error: "Email, password, and username are required" }
  }

  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  try {
    const { error } = await supabase.auth.signUp({
      email: email.toString(),
      password: password.toString(),
      options: {
        data: {
          username: username.toString(),
          display_name: username.toString(),
        },
      },
    })

    if (error) {
      return { error: error.message }
    }

    return { success: "Check your email to confirm your account." }
  } catch (error) {
    console.error("Sign up error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

export async function signOut() {
  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  await supabase.auth.signOut()
  redirect("/auth/login")
}

export async function createPost(prevState: any, formData: FormData) {
  return { error: "Feature temporarily unavailable" }
}

export async function updatePost(prevState: any, formData: FormData) {
  return { error: "Feature temporarily unavailable" }
}

export async function deletePost(prevState: any, formData: FormData) {
  return { error: "Feature temporarily unavailable" }
}

export async function updateProfile(prevState: any, formData: FormData) {
  return { error: "Feature temporarily unavailable" }
}

export async function sendFriendRequest(prevState: any, formData: FormData) {
  return { error: "Feature temporarily unavailable" }
}

export async function respondToFriendRequest(prevState: any, formData: FormData) {
  return { error: "Feature temporarily unavailable" }
}

export async function updatePrivacySettings(prevState: any, formData: FormData) {
  return { error: "Feature temporarily unavailable" }
}

export async function blockUser(prevState: any, formData: FormData) {
  return { error: "Feature temporarily unavailable" }
}

export async function unblockUser(prevState: any, formData: FormData) {
  return { error: "Feature temporarily unavailable" }
}
