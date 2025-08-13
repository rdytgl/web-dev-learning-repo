"use client"

import { useActionState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"
import { respondToFriendRequest } from "@/lib/actions"

interface FriendRequestCardProps {
  request: {
    id: string
    user_id: string
    created_at: string
    profiles: {
      id: string
      username: string
      display_name: string
    }
  }
}

export default function FriendRequestCard({ request }: FriendRequestCardProps) {
  const [acceptState, acceptAction] = useActionState(respondToFriendRequest, null)
  const [declineState, declineAction] = useActionState(respondToFriendRequest, null)

  const isProcessed = acceptState?.success || declineState?.success

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold text-slate-600">
                {request.profiles.display_name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900">{request.profiles.display_name}</h4>
              <p className="text-sm text-slate-600">@{request.profiles.username}</p>
            </div>
          </div>

          {!isProcessed && (
            <div className="flex gap-2">
              <form action={acceptAction}>
                <input type="hidden" name="request_id" value={request.id} />
                <input type="hidden" name="action" value="accept" />
                <Button type="submit" size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                  <Check className="h-4 w-4" />
                </Button>
              </form>
              <form action={declineAction}>
                <input type="hidden" name="request_id" value={request.id} />
                <input type="hidden" name="action" value="decline" />
                <Button type="submit" size="sm" variant="outline">
                  <X className="h-4 w-4" />
                </Button>
              </form>
            </div>
          )}

          {isProcessed && (
            <div className="text-sm text-slate-600">{acceptState?.success ? "Accepted" : "Declined"}</div>
          )}
        </div>

        {(acceptState?.error || declineState?.error) && (
          <p className="text-xs text-red-600 mt-2">{acceptState?.error || declineState?.error}</p>
        )}
      </CardContent>
    </Card>
  )
}
