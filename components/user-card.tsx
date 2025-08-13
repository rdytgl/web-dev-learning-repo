"use client"

import { useActionState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UserPlus } from "lucide-react"
import { sendFriendRequest } from "@/lib/auth/actions"

interface UserCardProps {
  profile: {
    id: string
    username: string
    display_name: string
    bio?: string
  }
  currentUserId: string
}

export default function UserCard({ profile, currentUserId }: UserCardProps) {
  const [state, formAction] = useActionState(sendFriendRequest, null)

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center">
            <span className="text-lg font-semibold text-slate-600">
              {profile.display_name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-slate-900 truncate">{profile.display_name}</h3>
            <p className="text-sm text-slate-600 truncate">@{profile.username}</p>
          </div>
        </div>

        {profile.bio && <p className="text-sm text-slate-700 mb-3 line-clamp-2">{profile.bio}</p>}

        <form action={formAction}>
          <input type="hidden" name="friend_id" value={profile.id} />
          <Button
            type="submit"
            size="sm"
            className="w-full bg-slate-900 hover:bg-slate-800 text-white"
            disabled={state?.success}
          >
            {state?.success ? (
              "Request Sent"
            ) : (
              <>
                <UserPlus className="h-4 w-4 mr-2" />
                Add Friend
              </>
            )}
          </Button>
        </form>

        {state?.error && <p className="text-xs text-red-600 mt-2">{state.error}</p>}
      </CardContent>
    </Card>
  )
}
