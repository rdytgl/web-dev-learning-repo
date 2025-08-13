import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Settings, Users, UserPlus, Shield } from "lucide-react"
import Link from "next/link"

export default async function ProfilePage() {
  const demoUser = {
    id: "demo-user-id",
    email: "demo@example.com",
  }

  const demoProfile = {
    display_name: "Demo User",
    username: "demo_user",
    bio: "Welcome to the anti-Instagram experience! This is a demo showing how your private social network would work.",
    allow_mutuals_to_see_posts: true,
  }

  const friendsCount = 12
  const pendingCount = 3

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-slate-600 hover:text-slate-900">
            ← Back to Home
          </Link>
          <h1 className="text-xl font-semibold text-slate-900">Your Profile</h1>
          <Link href="/profile/edit">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-blue-800 text-sm">
            <strong>Demo Mode:</strong> This shows your profile concept. Deploy to Vercel for full Supabase
            functionality.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-semibold text-slate-600">
                      {demoProfile.display_name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <CardTitle className="text-2xl">{demoProfile.display_name}</CardTitle>
                    <p className="text-slate-600">@{demoProfile.username}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant={demoProfile.allow_mutuals_to_see_posts ? "default" : "secondary"}>
                        {demoProfile.allow_mutuals_to_see_posts ? "Mutuals can see posts" : "Friends only"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700">{demoProfile.bio}</p>
              </CardContent>
            </Card>
          </div>

          {/* Stats & Actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Friends</span>
                  <span className="font-semibold">{friendsCount}</span>
                </div>
                {pendingCount > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Pending requests</span>
                    <Badge variant="outline">{pendingCount}</Badge>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/friends" className="block">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Users className="h-4 w-4 mr-2" />
                    Manage Friends
                  </Button>
                </Link>
                <Link href="/discover" className="block">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Find Friends
                  </Button>
                </Link>
                <Link href="/privacy" className="block">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Shield className="h-4 w-4 mr-2" />
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
