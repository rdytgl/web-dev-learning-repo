"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Globe } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

interface FeedFiltersProps {
  currentFilter: string
}

export default function FeedFilters({ currentFilter }: FeedFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleFilterChange = (filter: string) => {
    const params = new URLSearchParams(searchParams)
    if (filter === "all") {
      params.delete("filter")
    } else {
      params.set("filter", filter)
    }
    router.push(`/feed?${params.toString()}`)
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex gap-2">
          <Button
            variant={currentFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => handleFilterChange("all")}
            className={currentFilter === "all" ? "bg-slate-900 hover:bg-slate-800" : ""}
          >
            <Globe className="h-4 w-4 mr-2" />
            All Posts
          </Button>
          <Button
            variant={currentFilter === "friends" ? "default" : "outline"}
            size="sm"
            onClick={() => handleFilterChange("friends")}
            className={currentFilter === "friends" ? "bg-slate-900 hover:bg-slate-800" : ""}
          >
            <Users className="h-4 w-4 mr-2" />
            Direct Friends
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
