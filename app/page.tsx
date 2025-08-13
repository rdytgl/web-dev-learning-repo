import { Button } from "@/components/ui/button"
import { LogOut, Users, MessageCircle, User, Search, Plus, Home, Activity } from "lucide-react"
import Link from "next/link"

export default async function HomePage() {
  const demoUser = {
    email: "demo@example.com",
    id: "demo-user-id",
  }

  const demoProfile = {
    display_name: "Demo User",
    username: "demo_user",
    bio: "Welcome to the anti-Instagram experience!",
  }

  const friendsCount = 12
  const postsCount = 8

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-6 w-6 text-slate-700" />
            <h1 className="text-xl font-semibold text-slate-900">Authentic</h1>
          </div>
          <div className="flex items-center gap-4">
            <nav className="flex items-center gap-2">
              <Link href="/feed">
                <Button variant="ghost" size="sm">
                  <Home className="h-4 w-4 mr-2" />
                  Feed
                </Button>
              </Link>
              <Link href="/create-post">
                <Button variant="ghost" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Post
                </Button>
              </Link>
              <Link href="/profile">
                <Button variant="ghost" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Button>
              </Link>
              <Link href="/friends">
                <Button variant="ghost" size="sm">
                  <Users className="h-4 w-4 mr-2" />
                  Friends
                </Button>
              </Link>
              <Link href="/discover">
                <Button variant="ghost" size="sm">
                  <Search className="h-4 w-4 mr-2" />
                  Discover
                </Button>
              </Link>
            </nav>
            <span className="text-sm text-slate-600">Welcome, {demoProfile.display_name}</span>
            <Link href="/auth/login">
              <Button variant="outline" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Welcome Section */}
          <div className="lg:col-span-2">
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-slate-400 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-slate-900 mb-2">Welcome to Authentic</h2>
              <p className="text-slate-600 mb-4">Your private social network focused on real connections</p>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 max-w-2xl mx-auto">
                <p className="text-blue-800 text-sm">
                  <strong>Demo Mode:</strong> This shows your anti-Instagram concept. Deploy to Vercel for full Supabase
                  functionality.
                </p>
              </div>

              <div className="flex gap-4 justify-center mb-8">
                <Link href="/feed">
                  <Button className="bg-slate-900 hover:bg-slate-800 text-white">
                    <Home className="h-4 w-4 mr-2" />
                    View Feed
                  </Button>
                </Link>
                <Link href="/create-post">
                  <Button variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Post
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
                <div className="bg-white p-6 rounded-lg border border-slate-200">
                  <h3 className="font-semibold text-slate-900 mb-2">Friends Only</h3>
                  <p className="text-sm text-slate-600">See posts only from people you're connected with</p>
                </div>
                <div className="bg-white p-6 rounded-lg border border-slate-200">
                  <h3 className="font-semibold text-slate-900 mb-2">No Algorithm</h3>
                  <p className="text-sm text-slate-600">Chronological feed, no recommendations</p>
                </div>
                <div className="bg-white p-6 rounded-lg border border-slate-200">
                  <h3 className="font-semibold text-slate-900 mb-2">Privacy First</h3>
                  <p className="text-sm text-slate-600">Control who sees your content</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg border border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Your Network
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Friends</span>
                  <span className="font-semibold text-slate-900">{friendsCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Available Posts</span>
                  <span className="font-semibold text-slate-900">{postsCount}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link href="/discover" className="block">
                  <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                    <Search className="h-4 w-4 mr-2" />
                    Find Friends
                  </Button>
                </Link>
                <Link href="/privacy" className="block">
                  <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                    <User className="h-4 w-4 mr-2" />
                    Privacy Settings
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
