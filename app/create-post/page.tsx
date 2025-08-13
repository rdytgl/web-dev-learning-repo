import { createClient } from "@/lib/database/server"
import { redirect } from "next/navigation"
import CreatePostForm from "@/components/create-post-form"

export default async function CreatePostPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-semibold text-slate-900">Create Post</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <CreatePostForm />
      </main>
    </div>
  )
}
