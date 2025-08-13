import { createClient } from "@/lib/database/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, TrendingUp, UserPlus } from "lucide-react"
import UserSearchForm from "@/components/user-search-form"
import UserCard from "@/components/user-card"

export default async function DiscoverPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get suggested users (users not already friends with)
  const { data: suggestions } = await supabase
    .from("profiles")
    .select("*")
    .neq("id", user.id)
    .not(
      "id",
      "in",
      `(
      SELECT CASE 
        WHEN user_id = '${user.id}' THEN friend_id 
        ELSE user_id 
      END 
      FROM friendships 
      WHERE (user_id = '${user.id}' OR friend_id = '${user.id}')
    )`,
    )
    .limit(12)

  // Get mutual friends suggestions (friends of friends)
  const { data: mutualSuggestions } = await supabase.rpc("get_mutual_friends_suggestions", {
    current_user_id: user.id,
  })

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserPlus className="h-6 w-6 text-slate-700" />
            <h1 className="text-xl font-semibold text-slate-900">Discover People</h1>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            <UserSearchForm />

            {/* Mutual Friends Suggestions */}
            {mutualSuggestions && mutualSuggestions.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="h-5 w-5 text-slate-600" />
                  <h2 className="text-lg font-semibold text-slate-900">People you may know</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mutualSuggestions.slice(0, 6).map((profile: any) => (
                    <UserCard key={profile.id} profile={profile} currentUserId={user.id} />
                  ))}
                </div>
              </div>
            )}

            {/* General Suggestions */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Users className="h-5 w-5 text-slate-600" />
                <h2 className="text-lg font-semibold text-slate-900">Suggested for you</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {suggestions?.map((profile) => (
                  <UserCard key={profile.id} profile={profile} currentUserId={user.id} />
                ))}
              </div>
              {!suggestions?.length && (
                <p className="text-slate-600 text-center py-8">No suggestions available right now.</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Discovery Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-600">
                <div className="flex items-start gap-2">
                  <UserPlus className="h-4 w-4 mt-0.5 text-slate-400" />
                  <p>Search for people by username or display name</p>
                </div>
                <div className="flex items-start gap-2">
                  <TrendingUp className="h-4 w-4 mt-0.5 text-slate-400" />
                  <p>Check out friends of friends in the suggestions</p>
                </div>
                <div className="flex items-start gap-2">
                  <Users className="h-4 w-4 mt-0.5 text-slate-400" />
                  <p>Build authentic connections with people you know</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Privacy Reminder</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-600">
                <p>
                  Only people you accept as friends will be able to see your posts. You can also allow friends of
                  friends to see your content in your privacy settings.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
