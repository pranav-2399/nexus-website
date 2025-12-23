"use client"

import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Lightbox } from "@/components/lightbox"

interface GalleryEvent {
  id: string
  title: string
  date: string
  bannerImage?: string
  gallery?: string[]
}

export default function GalleryPage() {
  const [galleryEvents, setGalleryEvents] = useState<GalleryEvent[]>([])
  const [selectedEvent, setSelectedEvent] = useState<GalleryEvent | null>(null)

  const fetchEvents = async () => {
    try {
      const response = await fetch('api/events')
      const res = await response.json()
      if (response.ok) {
        console.log("Fetched gallery events:", res.data)
        // Filter to only show events with images in gallery
        const eventsWithGallery = res.data.filter((event: GalleryEvent) =>
          event.gallery && event.gallery.length > 0
        )
        setGalleryEvents(eventsWithGallery)
      }
    } catch (error) {
      console.error("Error fetching gallery events:", error)
    }
  }

  useEffect(() => {
    fetchEvents()
    console.log("Updated gallery events:", galleryEvents)
  }, [])

  const openLightbox = (event: GalleryEvent) => {
    setSelectedEvent(event)
    console.log("Opening lightbox for event:", selectedEvent)
  }

  const closeLightbox = () => {
    setSelectedEvent(null)
  }

  return (
    <div className="pt-16 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Gallery</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore moments captured from our events and activities
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {galleryEvents.map((event) => (
            <Card
              key={event.id}
              className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-border overflow-hidden"
            >
              <div
                className="relative h-64 overflow-hidden cursor-pointer"
                onClick={() => {
                  openLightbox(event)
                  console.log("Clicked on event:", event)
                }}
              >
                <Image
                  src={event.bannerImage || "/placeholder.svg"}
                  alt={event.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button variant="secondary" size="sm">
                      View Gallery ({event.gallery?.length} photos)
                    </Button>
                  </div>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="group-hover:text-primary transition-colors">{event.title}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {new Date(event.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Lightbox Modal */}
        <Lightbox
          open={!!selectedEvent}
          onOpenChange={(open) => !open && closeLightbox()}
          images={selectedEvent?.gallery || []}
          title={selectedEvent?.title}
          date={selectedEvent?.date ? new Date(selectedEvent.date).toLocaleDateString() : undefined}
        />
      </div>
    </div>
  )
}
