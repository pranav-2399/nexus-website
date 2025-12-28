"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, ArrowLeft, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

interface Event {
  id: string
  title: string
  date: string
  bannerImage: string
  participants?: number
  summary: string
  status: string
  slug: string
}

export default function EventPage() {
  const [pastEvents, setPastEvents] = useState<Event[]>([])
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([])

  const fetchEvents = async () => {
    const response = await fetch('/api/events')
    const res = await response.json()

    if (response.ok) {
      const data: Event[] = res.data
      setPastEvents(data.filter(event => event.status.toLowerCase() === 'past').sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()))
      setUpcomingEvents(data.filter(event => event.status.toLowerCase() === 'upcoming').sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()))
    }
    else { console.error("Error fetching events: ", res.error) }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  const EventCard = ({ event }: { event: Event }) => (
    <Link href={`/events/${event.slug}?id=${event.id}`}>
      <Card className="backdrop-panel border-primary/20 glow-hover cursor-pointer transition-all duration-300 h-full">
        <div className="relative h-32 overflow-hidden rounded-t-lg">
          <Image src={event.bannerImage || "/placeholder.svg"} alt={event.title} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-2 left-2">
            <Badge variant="outline" className="border-primary text-primary bg-black/50">
              {new Date(event.date).toLocaleDateString()}
            </Badge>
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-white line-clamp-2 hover:text-primary transition-colors">{event.title}</h3>
        </CardContent>
      </Card>
    </Link>
  )

  return (
    <div className="pt-16 min-h-screen">
      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div className="flex flex-col gap-8">
          {/* Make scrollable */}
          {/* Upcoming Events Box */}
          <div className="backdrop-panel rounded-2xl p-6 glow-effect flex flex-col min-h-[280px] max-h-[600px]">
            <div className="flex items-center justify-between mb-6 flex-shrink-0">
              <h2 className="text-2xl font-bold gradient-text">🔮 What's Coming Up?</h2>
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80" asChild>
                <Link href="/events/upcoming">
                  View All <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>
            <div className="overflow-y-auto pr-2 flex-1 min-h-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {upcomingEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </div>
          </div>

          {/* Past Events Box */}
          <div className="backdrop-panel rounded-2xl p-6 glow-effect flex flex-col min-h-[280px] max-h-[600px]">
            <div className="flex items-center justify-between mb-6 flex-shrink-0">
              <h2 className="text-2xl font-bold gradient-text">🕰 Past Events</h2>
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80" asChild>
                <Link href="/events/past-events">
                  View All <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>
            <div className="overflow-y-auto pr-2 flex-1 min-h-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {pastEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}