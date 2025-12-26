"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Calendar, Clock, MapPin, Users, ExternalLink, ArrowLeft, X, Maximize2, Copy, Check } from "lucide-react"
import { Lightbox } from "@/components/lightbox"
import Image from "next/image"
import Link from "next/link"

interface EventDetail {
  id: string
  title: string
  date: string
  time: string
  location?: string
  description: string
  bannerImage: string
  status: "upcoming" | "past"
  participants?: number
  outcomes?: string[]
  stats?: {
    label: string;
    value: string
  }[]
  posterImage?: string
  gallery?: string[]
  registrationLink?: string
  results?: {
    pos: string;
    url: string;
    name: string
  }[]
  socialPosts?: {
    platform: string;
    url: string
  }[]
  slug: string
}

interface EventDetailPageProps {
  eventId: string
  eventSlug: string
}

export function EventDetailPage({ eventId, eventSlug }: EventDetailPageProps) {
  const [event, setEvent] = useState<EventDetail | null>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)
  const [isPosterOpen, setIsPosterOpen] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [isSticky, setIsSticky] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Adjust threshold as needed based on banner height
      setIsSticky(window.scrollY > 150)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const fetchEvent = async () => {
    console.log("Fetching event with ID:", eventId)
    const response = await fetch(`/api/events/fetch-event?id=${eventId}`)
    console.log("Response status:", response)
    const res = await response.json()
    if (response.ok) {
      setEvent(res.data)
      console.log("Cur event: ", event)
    }
    else { console.error("Error fetching event:", res.error) }
  }

  useEffect(() => {
    if (eventId) { fetchEvent() }
  }, [eventId])

  const openGallery = (index: number) => {
    setSelectedImageIndex(index)
    setIsGalleryOpen(true)
  }

  const handleCopyPoster = async () => {
    if (event?.posterImage) {
      try {
        const response = await fetch(event.posterImage)
        const blob = await response.blob()

        // Clipboard API often only supports PNG, so we convert if needed
        const img = document.createElement('img')
        img.src = URL.createObjectURL(blob)

        await new Promise((resolve) => {
          img.onload = resolve
        })

        const canvas = document.createElement('canvas')
        canvas.width = img.naturalWidth
        canvas.height = img.naturalHeight
        const ctx = canvas.getContext('2d')
        ctx?.drawImage(img, 0, 0)

        canvas.toBlob(async (pngBlob) => {
          if (pngBlob) {
            try {
              await navigator.clipboard.write([new ClipboardItem({ 'image/png': pngBlob })])
              setIsCopied(true)
              setTimeout(() => setIsCopied(false), 2000)
            } catch (err) {
              console.error("Failed to write to clipboard:", err)
            }
          }
        }, 'image/png')

      } catch (err) {
        console.error("Failed to copy image:", err)
      }
    }
  }

  if (!event) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Event Not Found</h1>
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const isPast = new Date(`${event.date}T${event.time}`) < new Date()

  return (
    <div className="min-h-screen">
      {/* Banner Section */}
      <div className="relative h-64 md:h-96 overflow-hidden">
        <Image src={event.bannerImage || "/placeholder.svg"} alt={event.title} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        {/* Back Button */}
        <div className="absolute top-24 left-4 z-10">
          <Link href={event.status === "past" ? "/events/past-events" : "/events/upcoming"}>
            <Button variant="outline" size="sm" className="backdrop-panel border-primary/30">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
        </div>

        {/* Event Title Overlay - Moved below to handle sticky */}
      </div>

      {/* Sticky Event Title Bar */}
      <div
        className={`sticky top-0 z-30 w-full -mt-24 md:-mt-32 pb-4 pt-4 md:pt-8 md:pb-8 border-b transition-all duration-500 pointer-events-none
        ${isSticky ? "bg-black/60 backdrop-blur-md border-white/5" : "bg-transparent backdrop-blur-none border-transparent"}`}
      >
        <div className="container mx-auto px-4 md:px-8 pointer-events-auto">
          <Badge
            variant="outline"
            className={`mb-4 shadow-lg bg-black/50 backdrop-blur-md ${event.status === "upcoming" ? "border-green-500 text-green-400" : "border-blue-500 text-blue-400"}`}
          >
            {event.status === "upcoming" ? "Upcoming Event" : "Past Event"}
          </Badge>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">{event.title}</h1>
          <div className="flex flex-wrap gap-4 text-gray-200">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <span>
                {new Date(event.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <span>{event.time}</span>
            </div>
            {event.location && event.location.trim() && (
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <span>{event.location}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <Card className="backdrop-panel border-primary/20">
              <CardContent className="p-6 md:p-8">
                <h2 className="text-2xl font-bold gradient-text mb-4">About This Event</h2>
                <div className="prose prose-invert max-w-none">
                  {event.description.split("\n\n").map((paragraph, index) => (
                    <p key={index} className="text-gray-300 leading-relaxed mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Outcomes (for past events) */}
            {event.outcomes && event.outcomes.filter(outcome => outcome && outcome.trim()).length > 0 && isPast && (
              <Card className="backdrop-panel border-primary/20">
                <CardContent className="p-6 md:p-8">
                  <h2 className="text-2xl font-bold gradient-text mb-4">Event Outcomes</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {event.outcomes.filter(outcome => outcome && outcome.trim()).map((outcome, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span className="text-gray-300">{outcome}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Gallery */}
            {event.gallery && event.gallery.length > 0 && (
              <Card className="backdrop-panel border-primary/20">
                <CardContent className="p-6 md:p-8">
                  <h2 className="text-2xl font-bold gradient-text mb-4">Event Gallery</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {event.gallery.slice(0, 6).map((image, index) => (
                      <div
                        key={index}
                        className="relative aspect-video rounded-lg overflow-hidden cursor-pointer group"
                        onClick={() => openGallery(index)}
                      >
                        <Image
                          src={image || "/placeholder.svg"}
                          alt={`Gallery image ${index + 1}`}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                          <Maximize2 className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                      </div>
                    ))}
                  </div>
                  {event.gallery.length > 6 && (
                    <Button
                      variant="outline"
                      className="mt-4 border-primary text-primary hover:bg-primary/10"
                      onClick={() => openGallery(0)}
                    >
                      View All {event.gallery.length} Photos
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Event Poster */}
            {event.posterImage && (
              <Card className="backdrop-panel border-primary/20">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold gradient-text mb-4">Event Poster</h3>
                  <div
                    className="relative aspect-[3/4] rounded-lg overflow-hidden cursor-pointer group"
                    onClick={() => setIsPosterOpen(true)}
                  >
                    <Image
                      src={event.posterImage}
                      alt="Event Poster"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                      <Maximize2 className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Stats */}
            {event.stats && event.stats.filter(stat => stat.label && stat.label.trim() && stat.value && stat.value.trim()).length > 0 && (
              <Card className="backdrop-panel border-primary/20">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold gradient-text mb-4">Event Stats</h3>
                  <div className="space-y-4">
                    {event.stats.filter(stat => stat.label && stat.label.trim() && stat.value && stat.value.trim()).map((stat, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-gray-300">{stat.label}</span>
                        <span className="text-primary font-bold">{stat.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Participants (for past events) */}
            {event.participants && event.participants > 0 && (
              <Card className="backdrop-panel border-primary/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Users className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-bold text-white">Participants</h3>
                  </div>
                  <p className="text-2xl font-bold text-primary">{event.participants}</p>
                  <p className="text-sm text-gray-400">Total attendees</p>
                </CardContent>
              </Card>
            )}

            {/* Registration (for upcoming events) */}
            {event.registrationLink && event.registrationLink.trim() && (
              <Card className="backdrop-panel border-primary/20">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold gradient-text mb-4">Registration</h3>
                  <Button asChild className="w-full bg-primary hover:bg-primary/90">
                    <a href={event.registrationLink} target="_blank" rel="noopener noreferrer">
                      Register Now
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Resources/Results */}
            {event.results && event.results.filter(r => r.pos && r.name && r.name.trim()).length > 0 && isPast && (
              <Card className="backdrop-panel border-primary/20">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold gradient-text mb-4">Results</h3>

                  <div className="w-full overflow-x-auto">
                    <table className="min-w-full text-sm text-left border-collapse">
                      <thead>
                        <tr className="border-b border-primary/20 text-muted-foreground">
                          <th className="py-2 px-4">Position</th>
                          <th className="py-2 px-4">Name</th>
                          <th className="py-2 px-4">Link</th>
                        </tr>
                      </thead>
                      <tbody>
                        {event.results.filter(r => r.pos && r.name && r.name.trim()).map((result, index) => (
                          <tr key={index} className="border-b border-muted/10">
                            <td className="py-2 px-4 font-medium">{result.pos}</td>
                            <td className="py-2 px-4">{result.name}</td>
                            <td className="py-2 px-4 text-muted-foreground">
                              {result.url ? (
                                <a href={result.url} target="_blank" rel="noopener noreferrer" className="text-primary underline">
                                  View
                                </a>
                              ) : (
                                <span className="italic text-muted-foreground">n/a</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Social Posts */}
            {event.socialPosts && event.socialPosts.filter(p => p.platform && p.platform.trim() && p.url && p.url.trim()).length > 0 && (
              <Card className="backdrop-panel border-primary/20">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold gradient-text mb-4">Social Media</h3>
                  <div className="space-y-2">
                    {event.socialPosts.filter(p => p.platform && p.platform.trim() && p.url && p.url.trim()).map((post, index) => (
                      <Button key={index} variant="outline" className="w-full justify-start" size="sm" asChild>
                        <a href={post.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View on {post.platform}
                        </a>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Gallery Modal */}
      {/* Gallery Modal */}
      {event.gallery && (
        <Lightbox
          open={isGalleryOpen}
          onOpenChange={setIsGalleryOpen}
          images={event.gallery}
          title={event.title}
          date={new Date(event.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
          initialIndex={selectedImageIndex}
        />
      )}

      {/* Poster Modal */}
      {/* Poster Modal */}
      <Dialog open={isPosterOpen} onOpenChange={setIsPosterOpen}>
        <DialogContent className="max-w-5xl w-full h-[90vh] p-0 overflow-hidden bg-black border-none flex flex-col z-[150]" hideCloseButton>
          <DialogTitle className="sr-only">Event Poster</DialogTitle>
          <div className="relative flex-1 min-h-0 w-full bg-black">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-50 text-white hover:bg-white/20 rounded-full"
              onClick={() => setIsPosterOpen(false)}
            >
              <X className="h-6 w-6" />
            </Button>
            {event.posterImage && (
              <div className="relative w-full h-full">
                <Image
                  src={event.posterImage}
                  alt="Event Poster"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            )}
            {/* Info Overlay */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-6 flex justify-center items-end pointer-events-none">
              <div className="pointer-events-auto">
                <Button
                  variant="secondary"
                  size="sm"
                  className="backdrop-blur-md bg-white/10 hover:bg-white/20 text-white border-white/20"
                  onClick={handleCopyPoster}
                >
                  {isCopied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                  {isCopied ? "Copied Image" : "Copy Image"}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
