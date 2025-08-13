"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { unblockUser } from "@/lib/auth/actions"

function UnblockButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending} variant="outline" size="sm">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Unblocking...
        </>
      ) : (
        "Unblock"
      )}
    </Button>
  )
}

interface UnblockUserFormProps {
  friendshipId: string
}

export default function UnblockUserForm({ friendshipId }: UnblockUserFormProps) {
  const [state, formAction] = useActionState(unblockUser, null)

  return (
    <form action={formAction}>
      <input type="hidden" name="friendship_id" value={friendshipId} />
      <UnblockButton />
      {state?.error && <p className="text-xs text-red-600 mt-1">{state.error}</p>}
    </form>
  )
}
