import { createClient } from "@/lib/database/server"
import { redirect } from "next/navigation"
import PrivacySettingsForm from "@/components/privacy-settings-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Users, Eye, UserX } from "lucide-react"
import Link from "next/link"

export default async function PrivacyPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get user profile with privacy settings
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Get blocked users count
  const { count: blockedCount } = await supabase
    .from("friendships")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("status", "blocked")

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/profile" className="text-slate-600 hover:text-slate-900">
            ← Back to Profile
          </Link>
          <h1 className="text-xl font-semibold text-slate-900">Privacy Settings</h1>
          <div></div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Privacy Settings Form */}
          <div className="lg:col-span-2">
            <PrivacySettingsForm profile={profile} />
          </div>

          {/* Privacy Info & Stats */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Privacy Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-slate-500" />
                    <span className="text-sm text-slate-600">Post Visibility</span>
                  </div>
                  <span className="text-sm font-medium">
                    {profile?.allow_mutuals_to_see_posts ? "Friends + Mutuals" : "Friends Only"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <UserX className="h-4 w-4 text-slate-500" />
                    <span className="text-sm text-slate-600">Blocked Users</span>
                  </div>
                  <span className="text-sm font-medium">{blockedCount || 0}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Privacy Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-600">
                <div className="flex items-start gap-2">
                  <Eye className="h-4 w-4 mt-0.5 text-slate-400" />
                  <p>Only accepted friends can see your posts by default</p>
                </div>
                <div className="flex items-start gap-2">
                  <Users className="h-4 w-4 mt-0.5 text-slate-400" />
                  <p>Enable "mutuals" to let friends of friends see your posts</p>
                </div>
                <div className="flex items-start gap-2">
                  <Shield className="h-4 w-4 mt-0.5 text-slate-400" />
                  <p>You can block users to prevent all interactions</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
