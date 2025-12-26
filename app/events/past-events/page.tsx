"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

interface PastEvent {
  id: string
  title: string
  date: string
  bannerImage: string
  participants?: number
  summary: string
  status: "past"
  slug: string
}

export default function PastEventsPage() {
  const [pastEvents, setPastEvents] = useState<PastEvent[]>([])

  const fetchPastEvents = async () => {
    const response = await fetch("../api/events?status=past")
    const res = await response.json()
    if (response.ok) { setPastEvents(res.data.sort((a: PastEvent, b: PastEvent) => new Date(b.date).getTime() - new Date(a.date).getTime())) }
    else { console.error("Error fetching past events:", res.error) }
  }

  useEffect(() => {
    fetchPastEvents()
  }, [])

  return (
    <div className="pt-16 min-h-screen">
      <div className="container mx-auto px-4 py-8 lg:py-12">
        {/* Header */}
        <div className="relative mb-8">
          <Link href="/events">
            <Button
              variant="outline"
              size="sm"
              className="backdrop-panel border-primary/30 absolute left-0 top-0"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Events
            </Button>
          </Link>
          <div className="text-center">
            <h1 className="text-3xl lg:text-4xl font-bold gradient-text">Past Events</h1>
            <p className="text-gray-300 mt-2">Explore our successful events and their impact</p>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pastEvents.map((event) => (
            <Link key={event.id} href={`/events/${event.slug}?id=${event.id}`}>
              <Card className="backdrop-panel border-primary/20 glow-hover cursor-pointer transition-all duration-300 h-full">
                <div className="relative h-48 overflow-hidden rounded-t-lg">
                  <Image
                    src={event.bannerImage || "/placeholder.svg"}
                    alt={event.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <Badge variant="outline" className="border-blue-500 text-blue-400 bg-black/50">
                      Past Event
                    </Badge>
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <Badge variant="outline" className="border-primary text-primary bg-black/50">
                      {new Date(event.date).toLocaleDateString()}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-3 hover:text-primary transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-gray-300 text-sm mb-4 line-clamp-2">{event.summary}</p>
                  {event.participants && (
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Users className="h-4 w-4" />
                      <span>{event.participants} participants</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {pastEvents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No past events found.</p>
          </div>
        )}
      </div>
    </div>
  )
}
