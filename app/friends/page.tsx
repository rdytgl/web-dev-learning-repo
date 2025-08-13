import { createClient } from "@/lib/database/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import FriendRequestCard from "@/components/friend-request-card"
import FriendCard from "@/components/friend-card"

export default async function FriendsPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get pending friend requests (received)
  const { data: pendingRequests } = await supabase
    .from("friendships")
    .select(`
      id,
      user_id,
      created_at,
      profiles!friendships_user_id_fkey(id, username, display_name)
    `)
    .eq("friend_id", user.id)
    .eq("status", "pending")

  // Get accepted friends
  const { data: friends } = await supabase
    .from("friendships")
    .select(`
      id,
      user_id,
      friend_id,
      profiles!friendships_user_id_fkey(id, username, display_name),
      friend_profiles:profiles!friendships_friend_id_fkey(id, username, display_name)
    `)
    .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`)
    .eq("status", "accepted")

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-semibold text-slate-900">Friends</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Pending Requests */}
          {pendingRequests && pendingRequests.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Friend Requests
                  <Badge variant="outline">{pendingRequests.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingRequests.map((request) => (
                    <FriendRequestCard key={request.id} request={request} />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Friends List */}
          <Card>
            <CardHeader>
              <CardTitle>Your Friends ({friends?.length || 0})</CardTitle>
            </CardHeader>
            <CardContent>
              {friends && friends.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {friends.map((friendship) => {
                    const friend = friendship.user_id === user.id ? friendship.friend_profiles : friendship.profiles
                    return <FriendCard key={friendship.id} friend={friend} friendshipId={friendship.id} />
                  })}
                </div>
              ) : (
                <p className="text-slate-600 text-center py-8">
                  No friends yet.{" "}
                  <a href="/discover" className="text-slate-900 hover:underline">
                    Discover people
                  </a>{" "}
                  to connect with.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
