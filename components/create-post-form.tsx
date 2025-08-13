"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Send } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { createPost } from "@/lib/auth/actions"

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending} className="bg-slate-900 hover:bg-slate-800 text-white">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Posting...
        </>
      ) : (
        <>
          <Send className="mr-2 h-4 w-4" />
          Share Post
        </>
      )}
    </Button>
  )
}

export default function CreatePostForm() {
  const router = useRouter()
  const [state, formAction] = useActionState(createPost, null)

  // Redirect to feed after successful post creation
  useEffect(() => {
    if (state?.success) {
      router.push("/feed")
    }
  }, [state, router])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Share something with your friends</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          {state?.error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">{state.error}</div>
          )}

          <div className="space-y-2">
            <Textarea
              name="content"
              placeholder="What's on your mind?"
              rows={4}
              className="resize-none"
              required
              maxLength={500}
            />
            <p className="text-xs text-slate-500">Maximum 500 characters</p>
          </div>

          <div className="flex gap-4">
            <SubmitButton />
            <Link href="/feed">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
