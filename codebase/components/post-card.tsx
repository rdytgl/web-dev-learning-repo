"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Trash2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import EditPostDialog from "./edit-post-dialog"
import DeletePostDialog from "./delete-post-dialog"

interface PostCardProps {
  post: {
    id: string
    content: string
    image_url?: string
    created_at: string
    user_id: string
    profiles: {
      id: string
      username: string
      display_name: string
    }
  }
  currentUserId: string
}

export default function PostCard({ post, currentUserId }: PostCardProps) {
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const isOwnPost = post.user_id === currentUserId
  const timeAgo = formatDistanceToNow(new Date(post.created_at), { addSuffix: true })

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-slate-600">
                  {post.profiles.display_name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">{post.profiles.display_name}</h3>
                <p className="text-sm text-slate-600">
                  @{post.profiles.username} • {timeAgo}
                </p>
              </div>
            </div>

            {isOwnPost && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="text-red-600">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-slate-900 whitespace-pre-wrap">{post.content}</p>
          {post.image_url && (
            <div className="mt-4">
              <img
                src={post.image_url || "/placeholder.svg"}
                alt="Post image"
                className="rounded-lg max-w-full h-auto"
                loading="lazy"
              />
            </div>
          )}
        </CardContent>
      </Card>

      <EditPostDialog post={post} open={showEditDialog} onOpenChange={setShowEditDialog} />

      <DeletePostDialog postId={post.id} open={showDeleteDialog} onOpenChange={setShowDeleteDialog} />
    </>
  )
}
