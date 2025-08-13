"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Loader2, Shield, Users, Eye } from "lucide-react"
import { updatePrivacySettings } from "@/lib/auth/actions"

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
        "Save Privacy Settings"
      )}
    </Button>
  )
}

interface PrivacySettingsFormProps {
  profile: any
}

export default function PrivacySettingsForm({ profile }: PrivacySettingsFormProps) {
  const [state, formAction] = useActionState(updatePrivacySettings, null)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Privacy Settings
        </CardTitle>
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

          {/* Post Visibility Settings */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-slate-600" />
              <h3 className="font-semibold text-slate-900">Post Visibility</h3>
            </div>

            <div className="space-y-4 pl-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="allow_mutuals" className="text-sm font-medium">
                    Allow friends of friends to see my posts
                  </Label>
                  <p className="text-xs text-slate-600">
                    When enabled, people who are friends with your friends can see your posts (if they also have this
                    setting enabled)
                  </p>
                </div>
                <Switch
                  id="allow_mutuals"
                  name="allow_mutuals_to_see_posts"
                  defaultChecked={profile?.allow_mutuals_to_see_posts || false}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Future Privacy Settings */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-slate-600" />
              <h3 className="font-semibold text-slate-900">Profile Visibility</h3>
            </div>

            <div className="space-y-4 pl-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="profile_discoverable" className="text-sm font-medium">
                    Make my profile discoverable in search
                  </Label>
                  <p className="text-xs text-slate-600">Allow others to find your profile when searching by username</p>
                </div>
                <Switch id="profile_discoverable" name="profile_discoverable" defaultChecked={true} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="show_friend_count" className="text-sm font-medium">
                    Show friend count on profile
                  </Label>
                  <p className="text-xs text-slate-600">Display how many friends you have on your profile</p>
                </div>
                <Switch id="show_friend_count" name="show_friend_count" defaultChecked={true} />
              </div>
            </div>
          </div>

          <Separator />

          <SubmitButton />
        </form>
      </CardContent>
    </Card>
  )
}
