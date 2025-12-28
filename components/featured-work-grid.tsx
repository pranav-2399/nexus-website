"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, ImageIcon, FileText } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Lightbox } from "@/components/lightbox"

interface Event {
  id: string
  title: string
  date: string
  status: "past" | "upcoming"
  bannerImage?: string
  slug: string
  gallery?: string[]
}

interface Magazine {
  id: string
  title: string
  issue: string
  date: string
  thumbnail?: string
}

interface GalleryItem {
  id: string
  title: string
  coverImage: string
  photoCount: number
  gallery: string[]
  date: string
}

export function FeaturedWorkGrid() {
  const [pastEvents, setPastEvents] = useState<Event[]>([])
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([])
  const [magazines, setMagazines] = useState<Magazine[]>([])
  const [galleries, setGalleries] = useState<GalleryItem[]>([])
  const [selectedGallery, setSelectedGallery] = useState<GalleryItem | null>(null)

  const openLightbox = (gallery: GalleryItem) => {
    setSelectedGallery(gallery)
  }

  const closeLightbox = () => {
    setSelectedGallery(null)
  }

  const fetchEvents = async () => {
    const response = await fetch("/api/events/")
    const res = await response.json()
    if (response.ok) {
      const data: Event[] = res.data
      setPastEvents(data.filter(event => event.status === "past").sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()))
      setUpcomingEvents(data.filter(event => event.status === "upcoming").sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()))

      const galleryData = data
        .filter(event => event.gallery && event.gallery.length > 0)
        .map(event => ({
          id: event.id,
          title: event.title,
          coverImage: event.gallery![0],
          photoCount: event.gallery!.length,
          gallery: event.gallery!,
          date: event.date
        }))
      setGalleries(galleryData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()))
    }
    else { console.error("Error fetching events:", res.error) }
  }

  useEffect(() => {
    fetchEvents()

    setMagazines([
      { id: "1", title: "Tech Weekly", issue: "#15", date: "2024-01-15" },
      { id: "2", title: "Innovation Digest", issue: "#12", date: "2024-01-08" },
      { id: "3", title: "Code Chronicles", issue: "#8", date: "2024-01-01" },
      { id: "4", title: "Code Chronicles", issue: "#8", date: "2024-01-01" },
      { id: "5", title: "Code Chronicles", issue: "#10", date: "2024-01-01" },
    ])
  }, [])

  const EventCard = ({ event }: { event: Event }) => (
    <Link href={`/events/${event.slug}?id=${event.id}`}>
      <Card className="backdrop-panel border-primary/20 glow-hover cursor-pointer mb-4 transition-all duration-300">
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
    <section className="py-12 md:py-20 relative">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 h-auto lg:h-[600px] min-h-0">
          {/* Past Events Box */}
          <div className="backdrop-panel rounded-2xl p-4 md:p-6 glow-effect h-[400px] lg:h-auto max-h-[60vh] lg:max-h-none">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h2 className="text-xl md:text-2xl font-bold gradient-text">🕰 Past Events</h2>
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80" asChild>
                <Link href="/events/past-events">
                  View All <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>
            <div className="overflow-y-auto h-[300px] lg:h-[480px] max-h-[calc(60vh-80px)] lg:max-h-none px-6 py-6 space-y-3 md:space-y-4 custom-scrollbar">
              {pastEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>

          {/* Upcoming Events Box */}
          <div className="backdrop-panel rounded-2xl p-4 md:p-6 glow-effect h-[400px] lg:h-auto max-h-[60vh] lg:max-h-none">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h2 className="text-xl md:text-2xl font-bold gradient-text">🔮 What's Coming Up?</h2>
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80" asChild>
                <Link href="/events/upcoming">
                  View All <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>
            <div className="overflow-y-auto h-[300px] lg:h-[480px] max-h-[calc(60vh-80px)] lg:max-h-none px-6 py-6 space-y-3 md:space-y-4 custom-scrollbar">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-gray-400 text-sm font-medium">There are no events planned... yet.</p>
                </div>
              )}
            </div>
          </div>

          {/* Split Box - Magazines & Gallery */}
          <div className="flex flex-col gap-4 lg:h-full">
            {/* Magazines Section */}
            <div className="backdrop-panel rounded-2xl p-4 md:p-6 glow-effect h-[280px] flex flex-col overflow-hidden">
              <div className="flex items-center justify-between mb-3 md:mb-4 flex-shrink-0">
                <h2 className="text-lg md:text-xl font-bold gradient-text">📚 Magazines & Publications</h2>
                <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80" asChild>
                  <Link href="/publications">
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <div className="overflow-y-auto flex-1 min-h-0 px-6 py-6 space-y-2 custom-scrollbar">
                {magazines.map((magazine) => (
                  <Card key={magazine.id} className="backdrop-panel border-primary/20 glow-hover cursor-pointer p-2 md:p-3">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                        <FileText className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-white text-xs md:text-sm truncate">{magazine.title}</h4>
                        <p className="text-xs text-gray-400 truncate">
                          {magazine.issue} • {new Date(magazine.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Gallery Section */}
            <div className="backdrop-panel rounded-2xl p-4 md:p-6 glow-effect h-[200px] md:h-[280px] max-h-[50vh] md:max-h-none lg:h-auto lg:flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-3 md:mb-4 flex-shrink-0">
                <h2 className="text-lg md:text-xl font-bold gradient-text">📸 Explore Gallery</h2>
                <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80" asChild>
                  <Link href="/gallery">
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <div className="overflow-y-auto flex-1 min-h-0 px-6 py-6 space-y-2 custom-scrollbar">
                {galleries.map((gallery) => (
                  <Card
                    key={gallery.id}
                    className="backdrop-panel border-primary/20 glow-hover cursor-pointer p-2 md:p-3"
                    onClick={() => openLightbox(gallery)}
                  >
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="relative w-8 h-8 md:w-10 md:h-10 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={gallery.coverImage || "/placeholder.svg"}
                          alt={gallery.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-white text-xs md:text-sm truncate">{gallery.title}</h4>
                        <p className="text-xs text-gray-400 truncate">{gallery.photoCount} photos</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Lightbox Modal */}
        <Lightbox
          open={!!selectedGallery}
          onOpenChange={(open) => !open && closeLightbox()}
          images={selectedGallery?.gallery || []}
          title={selectedGallery?.title}
          date={selectedGallery?.date ? new Date(selectedGallery.date).toLocaleDateString() : undefined}
        />
      </div>
    </section>
  )
}