"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Plus, Edit, Trash2, Calendar, Pin, MapPinned } from "lucide-react"

interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  bannerImage?: string
  posterImage?: string
  isPinned: boolean
  status: "upcoming" | "past"
  gallery?: string[]
  stats?: { label: string; value: string }[]
  participants?: string
  outcomes?: string[]
  socialPosts?: { platform: string; url: string }[]
  results?: { pos: string; name: string; url: string }[]
  registrationLink?: string
}

export function EventManager() {
  const [events, setEvents] = useState<Event[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [formData, setFormData] = useState<{
    title: string
    description: string
    date: string
    time: string
    location: string
    bannerImage?: string
    posterImage?: string
    isPinned: boolean
    gallery?: string[]
    stats?: { label: string; value: string }[]
    participants?: string
    outcomes?: string[]
    socialPosts?: { platform: string; url: string }[]
    results?: { pos: string; name: string; url: string }[]
    registrationLink?: string
  }>({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    bannerImage: "",
    posterImage: "",
    isPinned: false,
    gallery: [],
    stats: [],
    participants: "",
    outcomes: [],
    socialPosts: [],
    results: [],
    registrationLink: ""
  })
  const { toast } = useToast()
  const fetchEvents = async () => {
    const response = await fetch("/api/events")
    const res = await response.json()

    if (response.ok) {
      setEvents(res.data.sort((a: Event, b: Event) => new Date(b.date).getTime() - new Date(a.date).getTime()))
    } else {
      console.error("Error fetching events:", res.error)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const payload = {
      title: formData.title,
      description: formData.description,
      date: formData.date,
      time: formData.time,
      location: formData.location,
      bannerImage: formData.bannerImage || null,
      posterImage: formData.posterImage || null,
      isPinned: formData.isPinned,
      status: new Date(`${formData.date} ${formData.time}`) > new Date() ? "upcoming" : "past",
      gallery: formData.gallery ?? [],
      stats: formData.stats ?? [],
      participants: formData.participants,
      outcomes: formData.outcomes ?? [],
      socialPosts: formData.socialPosts ?? [],
      results: formData.results ?? [],
      slug: formData.title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w\-]+/g, ""),
      registrationLink: formData.registrationLink || null
    }

    try {
      const response = await fetch(
        editingEvent ? `/api/events/update?id=${editingEvent.id}` : "/api/events/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      )

      const res = await response.json()
      if (!response.ok) throw new Error(res.message || "Failed")

      toast({ title: editingEvent ? "Event updated successfully" : "Event created successfully" })
      await fetchEvents()
      resetForm()
    } catch (err) {
      console.error(err)
      toast({ title: "Failed to save event", variant: "destructive" })
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      date: "",
      time: "",
      location: "",
      bannerImage: "",
      posterImage: "",
      isPinned: false,
      gallery: [],
      stats: [],
      participants: "",
      outcomes: [],
      socialPosts: [],
      results: [],
      registrationLink: ""
    })
    setEditingEvent(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (event: Event) => {
    setEditingEvent(event)
    setFormData({
      title: event.title || "",
      description: event.description || "",
      date: event.date || "",
      time: event.time || "",
      location: event.location || "",
      bannerImage: event.bannerImage || "",
      posterImage: event.posterImage || "",
      isPinned: event.isPinned || false,
      gallery: event.gallery ?? [],
      stats: event.stats ?? [],
      participants: event.participants || "",
      outcomes: event.outcomes ?? [],
      socialPosts: event.socialPosts ?? [],
      results: event.results ?? [],
      registrationLink: event.registrationLink || ""
    })
    setIsDialogOpen(true)
  }

  const deleteImage = async (url: string | undefined) => {
    if (!url) return
    const filePath = url.split("/").pop()
    try {
      await fetch(`/api/events/delete-image?file=${filePath}`, {
        method: "DELETE",
      })
    } catch (err) {
      console.error("Failed to delete image", err)
    }
  }

  const handleDelete = async (event: Event) => {

    if (event.bannerImage) { await deleteImage(event.bannerImage) }
    if (event.gallery) { await Promise.all(event.gallery.map((img) => deleteImage(img))) }

    const response = await fetch(`/api/events/delete?id=${event.id}`, {
      method: "DELETE",
    })

    const data = await response.json()

    if (!response.ok) {
      toast({ title: "Failed to delete event", variant: "destructive" })
      console.error(data)
    } else {
      toast({ title: "Event deleted successfully" })
      await fetchEvents()
    }
  }

  type ImageType = "banner" | "poster"

  const handleImageChange = (type: ImageType) => async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const imageKey = type === "banner" ? "bannerImage" : "posterImage"

    try {
      await deleteImage(formData[imageKey])
    } catch (error) {
      console.error("failed to delete existing image", error)
    }
    /* await deleteImage(formData.bannerImage) */

    const formDataUpload = new FormData()
    formDataUpload.append("file", file)
    formDataUpload.append("type", type)

    try {
      const response = await fetch("/api/events/upload-image", {
        method: "POST",
        body: formDataUpload,
      })
      const data = await response.json()
      if (data.url) {
        setFormData((prev) => ({ ...prev, [imageKey]: data.url }))
      }
    } catch (error) {
      console.error("Image upload failed:", error)
      toast({ title: "Failed to upload image", variant: "destructive" })
    }
  }

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const formData = new FormData()
    for (const file of files) formData.append("file", file)

    try {
      const res = await fetch("/api/events/upload-gallery", {
        method: "POST",
        body: formData,
      })
      const data = await res.json()
      console.log(data)
      if (data.urls) { setFormData(prev => ({ ...prev, gallery: [...(prev.gallery ?? []), ...data.urls] })) }
      console.log(formData)
    } catch (err) {
      console.error("Gallery upload failed:", err)
      toast({ title: "Failed to upload images", variant: "destructive" })
    }
  }

  const togglePin = async (eventId: string, currentState: boolean) => {
    console.log("Entering in togglePin")
    try {
      console.log("isPinned: ", currentState)
      const res = await fetch(`/api/events/update?id=${eventId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          updates: { isPinned: !currentState }
        }),
      })
      console.log("Response: ", res)
      if (res.ok) {
        toast({ title: "Event pin status updated" })
        await fetchEvents()
      } else {
        toast({ title: "Failed to update pin status", variant: "destructive" })
      }
    } catch (error) {
      console.error("Failed to update pin status:", error)
    }
  }


  const isPast = new Date(`${formData.date}T${formData.time}`) < new Date()
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Event Manager</h2>
          <p className="text-muted-foreground">Create and manage club events</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingEvent(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Event
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>{editingEvent ? "Edit Event" : "Create New Event"}</DialogTitle>
              <DialogDescription>
                {editingEvent ? "Update event details" : "Add a new event to the club calendar"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="flex flex-col flex-grow overflow-hidden">
              <div className="space-y-4 overflow-y-auto pr-4 pl-2 scrollbar-gutter-stable custom-scroll flex-grow">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Event Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title">Event Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                      required
                      placeholder="Enter event title"
                    />
                  </div>
                  {!isPast && (
                    <>
                      {/* Pin to Hero Section */}
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="pinned"
                          checked={formData.isPinned}
                          onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isPinned: checked as boolean }))}
                        />
                        <Label htmlFor="pinned" className="text-sm">
                          Pin to Hero Section
                        </Label>
                      </div>
                    </>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    required
                    placeholder="Describe the event..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Date */}
                  <div className="space-y-2">
                    <Label htmlFor="date">Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                      required
                    />
                  </div>
                  {/* Time */}
                  <div className="space-y-2">
                    <Label htmlFor="time">Time *</Label>
                    <Input
                      id="time"
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData((prev) => ({ ...prev, time: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                    required
                    placeholder="Where is it held?"
                  />
                </div>

                {/* Stats */}
                <div className="space-y-2">
                  <Label>Stats</Label>
                  {formData.stats?.map((stat, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <Input
                        placeholder="Label"
                        value={stat.label}
                        onChange={(e) =>
                          setFormData((prev) => {
                            const updated = [...(prev.stats ?? [])]
                            updated[index].label = e.target.value
                            return { ...prev, stats: updated }
                          })
                        }
                      />
                      <Input
                        placeholder="Value"
                        value={stat.value}
                        onChange={(e) =>
                          setFormData((prev) => {
                            const updated = [...(prev.stats ?? [])]
                            updated[index].value = e.target.value
                            return { ...prev, stats: updated }
                          })
                        }
                      />
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            stats: (prev.stats ?? []).filter((_, i) => i !== index),
                          }))
                        }
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ))}

                  <br></br>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        stats: [...(prev.stats ?? []), { label: "", value: "" }],
                      }))
                    }
                  >
                    + Add Stat
                  </Button>
                </div>

                {/* Banner Image */}
                <div className="space-y-2">
                  <Label htmlFor="upload">Upload Banner Image</Label>
                  {formData.bannerImage && (
                    <div className="relative w-full max-w-sm">
                      <img
                        src={formData.bannerImage}
                        alt="Banner Preview"
                        className="w-full rounded shadow"
                      />
                      <button
                        type="button"
                        onClick={async () => {
                          await deleteImage(formData.bannerImage)
                          setFormData((prev) => ({ ...prev, bannerImage: "" }))
                        }}
                        className="absolute top-2 right-2 bg-white p-1 rounded-full shadow hover:bg-red-100"
                        title="Delete Image"
                      >
                        <Trash2 className="w-5 h-5 text-red-500" />
                      </button>
                    </div>
                  )}
                  <Input
                    id="upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange("banner")}
                  />
                </div>

                {/* Poster Image */}
                <div className="space-y-2">
                  <Label htmlFor="upload">Upload Poster Image</Label>
                  {formData.posterImage && (
                    <div className="relative w-full max-w-sm">
                      <img
                        src={formData.posterImage}
                        alt="Poster Preview"
                        className="w-full rounded shadow"
                      />
                      <button
                        type="button"
                        onClick={async () => {
                          await deleteImage(formData.posterImage)
                          setFormData((prev) => ({ ...prev, posterImage: "" }))
                        }}
                        className="absolute top-2 right-2 bg-white p-1 rounded-full shadow hover:bg-red-100"
                        title="Delete Image"
                      >
                        <Trash2 className="w-5 h-5 text-red-500" />
                      </button>
                    </div>
                  )}
                  <Input
                    id="upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange("poster")}
                  />
                </div>

                {isPast && (
                  <>
                    {/* Participants */}
                    <div className="space-y-2">
                      <Label htmlFor="participants">Participants</Label>
                      <Input
                        id="participants"
                        value={formData.participants}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, participants: e.target.value }))
                        }
                        placeholder="Number or names of participants"
                      />
                    </div>

                    {/* Outcomes */}
                    <div className="space-y-2">
                      <Label htmlFor="outcomes">Outcomes</Label>
                      <Textarea
                        id="outcomes"
                        value={formData.outcomes?.join("\n") || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            outcomes: e.target.value.split("\n"),
                          }))
                        }
                        placeholder="List outcomes line by line"
                        rows={3}
                      />
                    </div>

                    {/* Social Posts */}
                    <div className="space-y-2">
                      <Label>Social Posts</Label>
                      {formData.socialPosts?.map((stat, index) => (
                        <div key={index} className="flex gap-2 items-center">
                          <Input
                            placeholder="Platform"
                            value={stat.platform}
                            onChange={(e) =>
                              setFormData((prev) => {
                                const updated = [...(prev.socialPosts ?? [])]
                                updated[index].platform = e.target.value
                                return { ...prev, socialPosts: updated }
                              })
                            }
                          />
                          <Input
                            placeholder="URL"
                            value={stat.url}
                            onChange={(e) =>
                              setFormData((prev) => {
                                const updated = [...(prev.socialPosts ?? [])]
                                updated[index].url = e.target.value
                                return { ...prev, socialPosts: updated }
                              })
                            }
                          />
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                socialPosts: (prev.socialPosts ?? []).filter((_, i) => i !== index),
                              }))
                            }
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      ))}

                      <br></br>
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            socialPosts: [...(prev.socialPosts ?? []), { platform: "", url: "" }],
                          }))
                        }
                      >
                        + Add Platform
                      </Button>
                    </div>

                    {/* Results */}
                    <div className="space-y-2">
                      <Label>Results</Label>
                      {formData.results?.map((result, index) => (
                        <div key={index} className="flex gap-2 items-center">
                          <Input
                            placeholder="Position"
                            value={result.pos}
                            onChange={(e) =>
                              setFormData((prev) => {
                                const updated = [...(prev.results ?? [])]
                                updated[index].pos = e.target.value
                                return { ...prev, results: updated }
                              })
                            }
                          />
                          <Input
                            placeholder="Name"
                            value={result.name}
                            onChange={(e) =>
                              setFormData((prev) => {
                                const updated = [...(prev.results ?? [])]
                                updated[index].name = e.target.value
                                return { ...prev, results: updated }
                              })
                            }
                          />
                          <Input
                            placeholder="URL"
                            value={result.url}
                            onChange={(e) =>
                              setFormData((prev) => {
                                const updated = [...(prev.results ?? [])]
                                updated[index].url = e.target.value
                                return { ...prev, results: updated }
                              })
                            }
                          />
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                results: (prev.results ?? []).filter((_, i) => i !== index),
                              }))
                            }
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      ))}

                      <br></br>
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            results: [...(prev.results ?? []), { pos: "", name: "", url: "" }],
                          }))
                        }
                      >
                        + Add Result
                      </Button>
                    </div>

                    {/* Gallery Upload */}
                    <div className="space-y-2">
                      <Label htmlFor="upload">Upload Gallery</Label>
                      <div className="flex flex-wrap gap-3">
                        {formData.gallery?.map((img, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={img}
                              alt={`Gallery ${index}`}
                              className="h-24 w-24 object-cover rounded-md"
                            />
                            <button
                              type="button"
                              onClick={async () => {
                                await deleteImage(img)
                                console.log(img)
                                setFormData((prev) => ({ ...prev, gallery: prev.gallery?.filter((image) => image !== img) }))
                              }}
                              className="absolute top-1 right-1 bg-black bg-opacity-60 p-1 rounded-full hidden group-hover:block"
                            >
                              <Trash2 className="w-5 h-5 text-red-500" />
                            </button>
                          </div>
                        ))}
                      </div>
                      <Input
                        id="upload-gallery"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleGalleryUpload}
                      />
                    </div>

                  </>
                )}

                {!isPast && (
                  <>
                    {/* Registration Link */}
                    <div className="space-y-2">
                      <Label htmlFor="participants">Registration Link</Label>
                      <Input
                        id="registrationLink"
                        value={formData.registrationLink}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, registrationLink: e.target.value }))
                        }
                        placeholder="Enter registration link (optional)"
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Save, Update and Cancel */}
              <div className="flex gap-2 pt-4 border-t mt-4 pt-4">
                <Button type="submit" className="flex-1">
                  {editingEvent ? "Update Event" : "Create Event"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <Card key={event.id} className="border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <Badge variant={event.status === "upcoming" ? "default" : "secondary"}>{event.status}</Badge>
                {event.isPinned && (
                  <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                    <Pin className="h-3 w-3 mr-1" />
                    Pinned
                  </Badge>
                )}
              </div>
              <CardTitle className="text-lg">{event.title}</CardTitle>
              <CardDescription>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4" />
                  {new Date(event.date).toLocaleDateString()} at {event.time}
                </div>
                <br></br>
                <div className="flex items-center gap-2 text-sm">
                  <MapPinned className="h-4 w-4" />
                  Venue: {event.location}
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{event.description}</p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handleEdit(event)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => togglePin(event.id, event.isPinned)}
                  className={event.isPinned ? "bg-yellow-500/10" : ""}
                >
                  <Pin className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(event)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
