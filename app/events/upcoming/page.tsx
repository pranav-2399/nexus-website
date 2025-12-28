"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, ArrowLeft, ExternalLink } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface UpcomingEvent {
  id: string
  title: string
  date: string
  bannerImage: string
  summary: string
  registrationLink?: string
  status: "upcoming"
  time: string
  slug: string
}

export default function UpcomingEventsPage() {
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([])
  const [countdowns, setCountdowns] = useState<{ [key: string]: { days: number; hours: number; minutes: number } }>({})

  const fetchUpcomingEvents = async () => {
    const response = await fetch("../api/events?status=upcoming")
    const res = await response.json()
    if (response.ok) { setUpcomingEvents(res.data) }
    else { console.error("Error fetching upcoming events:", res.error) }
  }

  useEffect(() => {
    fetchUpcomingEvents()
  }, [])

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      const newCountdowns: { [key: string]: { days: number; hours: number; minutes: number } } = {}

      upcomingEvents.forEach((event) => {
        const eventDate = new Date(`${event.date} ${event.time}`)
        const now = new Date()
        const difference = eventDate.getTime() - now.getTime()

        if (difference > 0) {
          newCountdowns[event.id] = {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
          }
        }
      })

      setCountdowns(newCountdowns)
    }, 60000) // Update every minute

    return () => clearInterval(timer)
  }, [upcomingEvents])

  return (
    <div className="pt-16 min-h-screen">
      <div className="container mx-auto px-4 py-8 lg:py-12">
        {/* Header */}
        <div className="relative mb-8">
          <Link href="/events">
            <Button
              variant="outline"
              size="sm"
              className="backdrop-panel border-primary/30 fixed top-6 left-6 z-50 md:absolute md:left-0 md:top-0"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Events
            </Button>
          </Link>
          <div className="text-center">
            <h1 className="text-3xl lg:text-4xl font-bold gradient-text">Upcoming Events</h1>
            <p className="text-gray-300 mt-2">Don't miss out on our exciting upcoming events</p>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {upcomingEvents.map((event) => (
            <Card key={event.id} className="backdrop-panel border-primary/20 glow-effect overflow-hidden">
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={event.bannerImage || "/placeholder.svg"}
                  alt={event.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute top-4 left-4">
                  <Badge variant="outline" className="border-green-500 text-green-400 bg-black/50">
                    Upcoming
                  </Badge>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-2xl font-bold text-white mb-2">{event.title}</h3>
                  <div className="flex items-center gap-4 text-gray-300 text-sm">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{event.time}</span>
                    </div>
                  </div>
                </div>
              </div>

              <CardContent className="p-6">
                <p className="text-gray-300 mb-4">{event.summary}</p>

                {/* Countdown Timer */}
                {countdowns[event.id] && (
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="backdrop-panel rounded-lg p-3 text-center">
                      <div className="text-lg font-bold text-primary">{countdowns[event.id].days}</div>
                      <div className="text-xs text-gray-400">Days</div>
                    </div>
                    <div className="backdrop-panel rounded-lg p-3 text-center">
                      <div className="text-lg font-bold text-primary">{countdowns[event.id].hours}</div>
                      <div className="text-xs text-gray-400">Hours</div>
                    </div>
                    <div className="backdrop-panel rounded-lg p-3 text-center">
                      <div className="text-lg font-bold text-primary">{countdowns[event.id].minutes}</div>
                      <div className="text-xs text-gray-400">Minutes</div>
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <Link href={`/events/${event.slug}?id=${event.id}`} className="flex-1">
                    <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10">
                      View Details
                    </Button>
                  </Link>
                  {event.registrationLink && (
                    <Button asChild className="flex-1 bg-primary hover:bg-primary/90">
                      <a href={event.registrationLink} target="_blank" rel="noopener noreferrer">
                        Register
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {upcomingEvents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No upcoming events scheduled.</p>
          </div>
        )}
      </div>
    </div>
  )
}
