import { createClient } from "@/lib/database/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UserX } from "lucide-react"
import Link from "next/link"
import UnblockUserForm from "@/components/unblock-user-form"

export default async function BlockedUsersPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get blocked users
  const { data: blockedUsers } = await supabase
    .from("friendships")
    .select(`
      id,
      friend_id,
      profiles!friendships_friend_id_fkey(id, username, display_name)
    `)
    .eq("user_id", user.id)
    .eq("status", "blocked")

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/privacy" className="text-slate-600 hover:text-slate-900">
            ← Back to Privacy
          </Link>
          <h1 className="text-xl font-semibold text-slate-900">Blocked Users</h1>
          <div></div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserX className="h-5 w-5" />
              Blocked Users ({blockedUsers?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {blockedUsers && blockedUsers.length > 0 ? (
              <div className="space-y-4">
                {blockedUsers.map((blocked) => (
                  <div key={blocked.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-slate-600">
                          {blocked.profiles?.display_name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">{blocked.profiles?.display_name}</h3>
                        <p className="text-sm text-slate-600">@{blocked.profiles?.username}</p>
                      </div>
                    </div>
                    <UnblockUserForm friendshipId={blocked.id} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <UserX className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600">You haven't blocked any users yet.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
