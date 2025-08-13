"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { updateProfile } from "@/lib/actions"

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending} className="bg-slate-900 hover:bg-slate-800 text-white">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Saving...
        </>
      ) : (
        "Save Changes"
      )}
    </Button>
  )
}

interface EditProfileFormProps {
  profile: any
}

export default function EditProfileForm({ profile }: EditProfileFormProps) {
  const [state, formAction] = useActionState(updateProfile, null)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Your Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          {state?.error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">{state.error}</div>
          )}

          {state?.success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded text-sm">
              {state.success}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="display_name">Display Name</Label>
            <Input
              id="display_name"
              name="display_name"
              defaultValue={profile?.display_name || ""}
              placeholder="Your display name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              defaultValue={profile?.username || ""}
              placeholder="your_username"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              name="bio"
              defaultValue={profile?.bio || ""}
              placeholder="Tell people about yourself..."
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="allow_mutuals"
              name="allow_mutuals_to_see_posts"
              defaultChecked={profile?.allow_mutuals_to_see_posts || false}
            />
            <Label htmlFor="allow_mutuals" className="text-sm">
              Allow friends of friends to see my posts
            </Label>
          </div>

          <div className="flex gap-4">
            <SubmitButton />
            <Link href="/profile">
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
