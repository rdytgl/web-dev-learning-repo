"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2, UserX } from "lucide-react"
import { useEffect } from "react"
import { blockUser } from "@/lib/actions"

function BlockButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending} variant="destructive">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Blocking...
        </>
      ) : (
        <>
          <UserX className="mr-2 h-4 w-4" />
          Block User
        </>
      )}
    </Button>
  )
}

interface BlockUserDialogProps {
  userId: string
  username: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function BlockUserDialog({ userId, username, open, onOpenChange }: BlockUserDialogProps) {
  const [state, formAction] = useActionState(blockUser, null)

  useEffect(() => {
    if (state?.success) {
      onOpenChange(false)
    }
  }, [state, onOpenChange])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Block @{username}?</DialogTitle>
          <DialogDescription>
            Blocking this user will prevent them from seeing your posts, sending you friend requests, or interacting
            with you. You can unblock them later from your privacy settings.
          </DialogDescription>
        </DialogHeader>

        <form action={formAction} className="space-y-4">
          <input type="hidden" name="user_id" value={userId} />

          {state?.error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">{state.error}</div>
          )}

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <BlockButton />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
