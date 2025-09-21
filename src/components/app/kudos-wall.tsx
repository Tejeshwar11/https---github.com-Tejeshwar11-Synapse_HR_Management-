"use client"

import type { Kudos } from "@/lib/types"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"
import { Award } from "lucide-react"

interface KudosWallProps {
  kudos: Kudos[]
}

export function KudosWall({ kudos }: KudosWallProps) {
  if (kudos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        {/* In a real app, you might use an SVG illustration here */}
        <Award className="h-24 w-24 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold text-charcoal">The Kudos Wall is Empty</h2>
        <p className="text-muted-foreground mt-2">Be the first to recognize a colleague's great work!</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
       <header>
        <h1 className="text-3xl font-bold">Kudos Wall</h1>
        <p className="text-muted-foreground">
          A live feed of recognition and appreciation across Synapse.
        </p>
      </header>
      <div className="masonry-grid">
        {kudos.map((item) => (
          <div key={item.id} className="masonry-grid-item">
            <Card>
              <CardContent className="p-4">
                <p className="text-slate-gray">"{item.message}"</p>
              </CardContent>
              <CardFooter className="p-4 bg-muted/50 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={item.fromAvatar} alt={item.from} />
                    <AvatarFallback>{item.from.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-semibold text-charcoal">{item.from}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
                </p>
              </CardFooter>
            </Card>
          </div>
        ))}
      </div>
       <style jsx>{`
        .masonry-grid {
          column-count: 1;
          column-gap: 1.5rem;
        }
        @media (min-width: 768px) {
          .masonry-grid {
            column-count: 2;
          }
        }
        @media (min-width: 1024px) {
          .masonry-grid {
            column-count: 3;
          }
        }
        .masonry-grid-item {
          display: inline-block;
          width: 100%;
          margin-bottom: 1.5rem;
        }
      `}</style>
    </div>
  )
}
