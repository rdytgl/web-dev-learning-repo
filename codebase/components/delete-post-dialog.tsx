"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useEffect } from "react"
import { deletePost } from "@/lib/actions"

function DeleteButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending} variant="destructive">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Deleting...
        </>
      ) : (
        "Delete Post"
      )}
    </Button>
  )
}

interface DeletePostDialogProps {
  postId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function DeletePostDialog({ postId, open, onOpenChange }: DeletePostDialogProps) {
  const [state, formAction] = useActionState(deletePost, null)

  useEffect(() => {
    if (state?.success) {
      onOpenChange(false)
    }
  }, [state, onOpenChange])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Post</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this post? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <form action={formAction} className="space-y-4">
          <input type="hidden" name="post_id" value={postId} />

          {state?.error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">{state.error}</div>
          )}

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <DeleteButton />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
