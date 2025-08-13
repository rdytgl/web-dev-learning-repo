import { Card, CardContent } from "@/components/ui/card"

interface FriendCardProps {
  friend: {
    id: string
    username: string
    display_name: string
  }
  friendshipId: string
}

export default function FriendCard({ friend }: FriendCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center">
            <span className="text-lg font-semibold text-slate-600">
              {friend?.display_name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-slate-900 truncate">{friend?.display_name}</h3>
            <p className="text-sm text-slate-600 truncate">@{friend?.username}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
