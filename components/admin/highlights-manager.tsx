"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { Plus, Edit, Trash2, Calendar, Instagram, Linkedin } from "lucide-react"

interface Highlight {
  id: string
  title: string
  description: string
  type: "Event" | "Magazine" | "Update" | "Instagram" | "LinkedIn"
  date: string
  thumbnail?: string
  link?: string
}

export function HighlightsManager() {
  const [highlights, setHighlights] = useState<Highlight[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingHighlight, setEditingHighlight] = useState<Highlight | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "Event" as "Event" | "Magazine" | "Update" | "Instagram" | "LinkedIn",
    date: "",
    thumbnail: "",
    link: "",
  })
  const { toast } = useToast()

  useEffect(() => {
    // Mock data - in real app, fetch from API
    const mockHighlights: Highlight[] = [
      {
        id: "1",
        title: "Web Development Workshop",
        description: "Learn modern web development with React and Next.js in this hands-on workshop.",
        type: "Event",
        date: "2024-01-15",
        thumbnail: "/placeholder.svg?height=200&width=300",
      },
      {
        id: "2",
        title: "Tech Weekly - Issue #12",
        description: "Latest trends in AI and machine learning, featuring interviews with industry experts.",
        type: "Magazine",
        date: "2024-01-10",
        thumbnail: "/placeholder.svg?height=200&width=300",
        link: "https://example.com/magazine-12.pdf",
      },
      {
        id: "3",
        title: "New Partnership Announcement",
        description: "Nexus Club partners with leading tech companies for internship opportunities.",
        type: "Update",
        date: "2024-01-08",
      },
    ]
    setHighlights(mockHighlights)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingHighlight) {
      setHighlights((prev) =>
        prev.map((highlight) => (highlight.id === editingHighlight.id ? { ...highlight, ...formData } : highlight)),
      )
      toast({ title: "Highlight updated successfully" })
    } else {
      const newHighlight: Highlight = {
        id: Date.now().toString(),
        ...formData,
      }
      setHighlights((prev) => [...prev, newHighlight])
      toast({ title: "Highlight created successfully" })
    }

    resetForm()
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      type: "Event",
      date: "",
      thumbnail: "",
      link: "",
    })
    setEditingHighlight(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (highlight: Highlight) => {
    setEditingHighlight(highlight)
    setFormData({
      title: highlight.title,
      description: highlight.description,
      type: highlight.type,
      date: highlight.date,
      thumbnail: highlight.thumbnail || "",
      link: highlight.link || "",
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (highlightId: string) => {
    setHighlights((prev) => prev.filter((highlight) => highlight.id !== highlightId))
    toast({ title: "Highlight deleted successfully" })
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Event":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "Magazine":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "Update":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20"
      case "Instagram":
        return "bg-pink-500/10 text-pink-500 border-pink-500/20"
      case "LinkedIn":
        return "bg-blue-600/10 text-blue-600 border-blue-600/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Instagram":
        return <Instagram className="h-4 w-4" />
      case "LinkedIn":
        return <Linkedin className="h-4 w-4" />
      case "Event":
        return <Calendar className="h-4 w-4" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Highlights Manager</h2>
          <p className="text-muted-foreground">Manage featured content and announcements</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingHighlight(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Highlight
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingHighlight ? "Edit Highlight" : "Create New Highlight"}</DialogTitle>
              <DialogDescription>
                {editingHighlight ? "Update highlight details" : "Add a new highlight to the homepage"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    required
                    placeholder="Highlight title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: "Event" | "Magazine" | "Update" | "Instagram" | "LinkedIn") =>
                      setFormData((prev) => ({ ...prev, type: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="z-50">
                      <SelectItem value="Event">Event</SelectItem>
                      <SelectItem value="Magazine">Magazine</SelectItem>
                      <SelectItem value="Update">Update</SelectItem>
                      <SelectItem value="Instagram">Instagram</SelectItem>
                      <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  required
                  placeholder="Describe the highlight..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <div className="space-y-2">
                  <Label htmlFor="thumbnail">Thumbnail URL</Label>
                  <Input
                    id="thumbnail"
                    value={formData.thumbnail}
                    onChange={(e) => setFormData((prev) => ({ ...prev, thumbnail: e.target.value }))}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="link">Link (optional)</Label>
                <Input
                  id="link"
                  value={formData.link}
                  onChange={(e) => setFormData((prev) => ({ ...prev, link: e.target.value }))}
                  placeholder="https://example.com/resource"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  {editingHighlight ? "Update Highlight" : "Create Highlight"}
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
        {highlights.map((highlight) => (
          <Card key={highlight.id} className="border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className={getTypeColor(highlight.type)}>
                  {getTypeIcon(highlight.type)}
                  {highlight.type}
                </Badge>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(highlight.date).toLocaleDateString()}
                </div>
              </div>
              <CardTitle className="text-lg">{highlight.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4 line-clamp-3">{highlight.description}</CardDescription>
              {highlight.link && <p className="text-xs text-muted-foreground mb-4 truncate">Link: {highlight.link}</p>}
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handleEdit(highlight)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(highlight.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div >
  )
}
