import { createClient } from "@/lib/database/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, MessageCircle, Users, Clock } from "lucide-react"
import Link from "next/link"
import PostCard from "@/components/post-card"
import FeedFilters from "@/components/feed-filters"

interface SearchParams {
  filter?: string
}

export default async function FeedPage({ searchParams }: { searchParams: SearchParams }) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const filter = searchParams.filter || "all"

  // Get posts from friends (using the RLS policy we created)
  let postsQuery = supabase
    .from("posts")
    .select(`
      id,
      content,
      image_url,
      created_at,
      user_id,
      profiles!posts_user_id_fkey(id, username, display_name)
    `)
    .order("created_at", { ascending: false })

  // Apply filters
  if (filter === "friends") {
    // Only direct friends' posts
    postsQuery = postsQuery.in(
      "user_id",
      supabase
        .from("friendships")
        .select("friend_id")
        .eq("user_id", user.id)
        .eq("status", "accepted")
        .union(supabase.from("friendships").select("user_id").eq("friend_id", user.id).eq("status", "accepted")),
    )
  }

  const { data: posts } = await postsQuery.limit(20)

  // Get friend statistics for sidebar
  const { count: friendsCount } = await supabase
    .from("friendships")
    .select("*", { count: "exact", head: true })
    .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`)
    .eq("status", "accepted")

  // Get recent activity (new friends)
  const { data: recentFriends } = await supabase
    .from("friendships")
    .select(`
      created_at,
      profiles!friendships_friend_id_fkey(id, username, display_name),
      friend_profiles:profiles!friendships_user_id_fkey(id, username, display_name)
    `)
    .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`)
    .eq("status", "accepted")
    .order("created_at", { ascending: false })
    .limit(3)

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-6 w-6 text-slate-700" />
            <h1 className="text-xl font-semibold text-slate-900">Your Feed</h1>
          </div>
          <Link href="/create-post">
            <Button className="bg-slate-900 hover:bg-slate-800 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Create Post
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-3 space-y-6">
            <FeedFilters currentFilter={filter} />

            {posts && posts.length > 0 ? (
              <div className="space-y-6">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} currentUserId={user.id} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <MessageCircle className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-slate-900 mb-2">
                  {filter === "friends" ? "No posts from direct friends" : "No posts yet"}
                </h2>
                <p className="text-slate-600 mb-6">
                  {filter === "friends"
                    ? "Your direct friends haven't posted anything yet."
                    : "Connect with friends to see their posts, or create your first post to get started."}
                </p>
                <div className="flex gap-4 justify-center">
                  <Link href="/create-post">
                    <Button className="bg-slate-900 hover:bg-slate-800 text-white">Create Post</Button>
                  </Link>
                  <Link href="/discover">
                    <Button variant="outline">Find Friends</Button>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Your Network
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Friends</span>
                  <span className="font-semibold">{friendsCount || 0}</span>
                </div>
                <Link href="/friends" className="block">
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    Manage Friends
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            {recentFriends && recentFriends.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Recent Connections
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentFriends.map((friendship, index) => {
                      const friend = friendship.profiles || friendship.friend_profiles
                      return (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <div className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center">
                            <span className="text-xs font-semibold text-slate-600">
                              {friend?.display_name?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="text-slate-900">{friend?.display_name}</span>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/discover" className="block">
                  <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                    Find New Friends
                  </Button>
                </Link>
                <Link href="/privacy" className="block">
                  <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                    Privacy Settings
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
