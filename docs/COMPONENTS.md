# Component Guide

Comprehensive guide to all components in the NEXUS website.

## Table of Contents

1. [Component Architecture](#component-architecture)
2. [Page Components](#page-components)
3. [Feature Components](#feature-components)
4. [Admin Components](#admin-components)
5. [UI Components](#ui-components)
6. [Usage Examples](#usage-examples)

---

## Component Architecture

The NEXUS website follows a modular component architecture:

```
components/
├── ui/                    # Reusable UI primitives (shadcn/ui)
├── admin/                 # Admin-specific components
└── [feature].tsx          # Feature-specific components
```

### Design Principles

- **Reusability**: Components are designed to be reused across pages
- **Composability**: Complex UIs built from simple components
- **Type Safety**: Full TypeScript support
- **Accessibility**: Built on Radix UI primitives
- **Performance**: Optimized with React best practices

---

## Page Components

### HeroSectionRedesigned

**Location**: `components/hero-section-redesigned.tsx`

Main landing section with animated text and 3D particle effects.

**Features:**
- Animated gradient text
- 3D particle background (Three.js)
- Responsive design
- Smooth scroll to next section
- Call-to-action buttons

**Props**: None (self-contained)

**Usage:**
```tsx
import { HeroSectionRedesigned } from "@/components/hero-section-redesigned"

export default function HomePage() {
  return <HeroSectionRedesigned />
}
```

---

### FeaturedWorkGrid

**Location**: `components/featured-work-grid.tsx`

Display grid of featured projects/work.

**Features:**
- Responsive grid layout
- Hover effects
- Project cards with images
- Links to project details

**Props**: None (fetches data internally or uses mock data)

**Usage:**
```tsx
import { FeaturedWorkGrid } from "@/components/featured-work-grid"

<FeaturedWorkGrid />
```

---

### CoreTeamTreeRedesigned

**Location**: `components/core-team-tree-redesigned.tsx`

Displays team members in a hierarchical structure.

**Features:**
- Organizational chart layout
- Team member cards
- Role-based hierarchy
- Responsive design

**Props**: None (fetches from API)

**Usage:**
```tsx
import { CoreTeamTreeRedesigned } from "@/components/core-team-tree-redesigned"

<CoreTeamTreeRedesigned />
```

---

### TechShowcaseSection

**Location**: `components/tech-showcase-section.tsx`

Showcases technologies used by NEXUS.

**Features:**
- Technology icons/logos
- Animated entrance
- Grid/carousel layout
- Tooltips with tech descriptions

**Usage:**
```tsx
import { TechShowcaseSection } from "@/components/tech-showcase-section"

<TechShowcaseSection />
```

---

### FromTheDesk

**Location**: `components/from-the-desk.tsx`

Message from the leadership/founder.

**Features:**
- Rich text content
- Author attribution
- Styled blockquote
- Background effects

**Usage:**
```tsx
import { FromTheDesk } from "@/components/from-the-desk"

<FromTheDesk />
```

---

### FooterRedesigned

**Location**: `components/footer-redesigned.tsx`

Site footer with links and information.

**Features:**
- Multi-column layout
- Social media links
- Navigation links
- Copyright information
- Newsletter signup (optional)

**Usage:**
```tsx
import { FooterRedesigned } from "@/components/footer-redesigned"

<FooterRedesigned />
```

---

## Feature Components

### FloatingNav

**Location**: `components/floating-nav.tsx`

Floating navigation bar that appears on scroll.

**Features:**
- Sticky/floating behavior
- Smooth show/hide animation
- Active link highlighting
- Mobile responsive

**Props**: None

**Usage:**
```tsx
import { FloatingNav } from "@/components/floating-nav"

// In layout.tsx
<FloatingNav />
```

---

### GlobalBackground

**Location**: `components/global-background.tsx`

Animated 3D background for the entire site.

**Features:**
- Three.js canvas
- Particle system
- Performance optimized
- Responds to scroll

**Usage:**
```tsx
import { GlobalBackground } from "@/components/global-background"

// In layout.tsx
<GlobalBackground />
```

---

### LoadingScreen

**Location**: `components/loading-screen.tsx`

Initial loading animation shown on first visit.

**Features:**
- Fade in/out animation
- NEXUS logo animation
- Session-based (shows once)
- Smooth transition

**Usage:**
```tsx
import { LoadingScreen } from "@/components/loading-screen"

// In layout.tsx
<LoadingScreen />
```

---

### EventDetailPage

**Location**: `components/event-detail-page.tsx`

Displays detailed information about a single event.

**Props:**
```typescript
interface EventDetailPageProps {
  event: {
    id: string
    title: string
    description: string
    date: string
    image?: string
    gallery?: string[]
    location?: string
    organizer?: string
    maxParticipants?: number
    tags?: string[]
  }
}
```

**Usage:**
```tsx
import { EventDetailPage } from "@/components/event-detail-page"

<EventDetailPage event={eventData} />
```

---

### GalleryEventPage

**Location**: `components/gallery-event-page.tsx`

Displays image gallery for an event.

**Props:**
```typescript
interface GalleryEventPageProps {
  images: string[]
  eventTitle: string
}
```

**Features:**
- Masonry grid layout
- Lightbox view
- Image lazy loading
- Download option

**Usage:**
```tsx
import { GalleryEventPage } from "@/components/gallery-event-page"

<GalleryEventPage images={imageUrls} eventTitle="Hackathon 2025" />
```

---

### PastEventsSection

**Location**: `components/past-events-section.tsx`

Displays list of past events.

**Features:**
- Chronological listing
- Filter/search
- Pagination
- Event cards with summaries

**Usage:**
```tsx
import { PastEventsSection } from "@/components/past-events-section"

<PastEventsSection />
```

---

### HighlightsSection

**Location**: `components/highlights-section.tsx`

Displays homepage highlights/achievements.

**Features:**
- Carousel/slider
- Auto-play
- Click to expand
- Animated transitions

**Usage:**
```tsx
import { HighlightsSection } from "@/components/highlights-section"

<HighlightsSection />
```

---

### MarqueeGallery

**Location**: `components/marquee-gallery.tsx`

Scrolling marquee of images/logos.

**Props:**
```typescript
interface MarqueeGalleryProps {
  images: string[]
  speed?: number
  direction?: 'left' | 'right'
}
```

**Usage:**
```tsx
import { MarqueeGallery } from "@/components/marquee-gallery"

<MarqueeGallery images={logoUrls} speed={20} direction="left" />
```

---

### MobileRadialNav

**Location**: `components/mobile-radial-nav.tsx`

Radial navigation menu for mobile devices.

**Features:**
- Circular menu layout
- Touch-friendly
- Animated open/close
- Icon-based navigation

**Usage:**
```tsx
import { MobileRadialNav } from "@/components/mobile-radial-nav"

<MobileRadialNav />
```

---

### NexusLogoParticles

**Location**: `components/nexus-logo-particles.tsx`

Animated particle effect forming NEXUS logo.

**Features:**
- Three.js particles
- Morphing animation
- Responsive sizing
- Performance optimized

**Usage:**
```tsx
import { NexusLogoParticles } from "@/components/nexus-logo-particles"

<NexusLogoParticles />
```

---

## Admin Components

### EventManager

**Location**: `components/admin/event-manager.tsx`

Complete event management interface for admins.

**Features:**
- Create, read, update, delete events
- Form validation with Zod
- Image upload (thumbnail + gallery)
- Status management (upcoming/past/ongoing)
- Pin/unpin events
- Date picker
- Rich text editor for descriptions

**Usage:**
```tsx
import { EventManager } from "@/components/admin/event-manager"

// In admin dashboard
<EventManager />
```

**Key Functions:**
- `handleCreateEvent()`: Create new event
- `handleUpdateEvent()`: Update existing event
- `handleDeleteEvent()`: Delete event
- `handleImageUpload()`: Upload event images
- `handleGalleryUpload()`: Upload gallery images

---

### TeamManager

**Location**: `components/admin/team-manager.tsx`

Manage team members and organizational structure.

**Features:**
- Add/edit/remove team members
- Image upload for profiles
- Role assignment
- Display order management
- Social media links
- Active/inactive status

**Usage:**
```tsx
import { TeamManager } from "@/components/admin/team-manager"

<TeamManager />
```

---

### HighlightsManager

**Location**: `components/admin/highlights-manager.tsx`

Manage homepage highlights.

**Features:**
- CRUD operations for highlights
- Image upload
- Order management
- Link management
- Preview mode

**Usage:**
```tsx
import { HighlightsManager } from "@/components/admin/highlights-manager"

<HighlightsManager />
```

---

### FeedbackViewer

**Location**: `components/admin/feedback-viewer.tsx`

View and manage user feedback/contact form submissions.

**Features:**
- List all feedback
- Filter by status
- Mark as read/unread
- Delete feedback
- Export to CSV

**Usage:**
```tsx
import { FeedbackViewer } from "@/components/admin/feedback-viewer"

<FeedbackViewer />
```

---

## UI Components

All UI components are located in `components/ui/` and are based on [shadcn/ui](https://ui.shadcn.com/).

### Button

**File**: `components/ui/button.tsx`

**Variants:**
- `default`: Primary button
- `destructive`: Danger/delete actions
- `outline`: Secondary button
- `ghost`: Minimal button
- `link`: Text link style

**Sizes:**
- `default`: Standard size
- `sm`: Small
- `lg`: Large
- `icon`: Square icon button

**Usage:**
```tsx
import { Button } from "@/components/ui/button"

<Button variant="default" size="lg">Click Me</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Cancel</Button>
```

---

### Card

**File**: `components/ui/card.tsx`

Container component with header, content, and footer sections.

**Sub-components:**
- `Card`: Main container
- `CardHeader`: Top section
- `CardTitle`: Title text
- `CardDescription`: Subtitle text
- `CardContent`: Main content area
- `CardFooter`: Bottom section

**Usage:**
```tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

<Card>
  <CardHeader>
    <CardTitle>Event Title</CardTitle>
  </CardHeader>
  <CardContent>
    Event details go here
  </CardContent>
</Card>
```

---

### Dialog

**File**: `components/ui/dialog.tsx`

Modal dialog component.

**Sub-components:**
- `Dialog`: Root
- `DialogTrigger`: Opens dialog
- `DialogContent`: Dialog content
- `DialogHeader`: Header section
- `DialogTitle`: Title
- `DialogDescription`: Description
- `DialogFooter`: Footer with actions

**Usage:**
```tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

<Dialog>
  <DialogTrigger asChild>
    <Button>Open</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
    </DialogHeader>
    <p>Dialog content</p>
  </DialogContent>
</Dialog>
```

---

### Form

**File**: `components/ui/form.tsx`

Form component with validation (React Hook Form + Zod).

**Sub-components:**
- `Form`: Form provider
- `FormField`: Individual field
- `FormItem`: Field container
- `FormLabel`: Field label
- `FormControl`: Input wrapper
- `FormMessage`: Error message
- `FormDescription`: Help text

**Usage:**
```tsx
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import * as z from "zod"

const formSchema = z.object({
  username: z.string().min(3),
})

function MyForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
  })

  return (
    <Form {...form}>
      <FormField
        control={form.control}
        name="username"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Username</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
          </FormItem>
        )}
      />
    </Form>
  )
}
```

---

### Input

**File**: `components/ui/input.tsx`

Text input component.

**Usage:**
```tsx
import { Input } from "@/components/ui/input"

<Input type="text" placeholder="Enter name" />
<Input type="email" placeholder="email@example.com" />
```

---

### Table

**File**: `components/ui/table.tsx`

Data table component.

**Sub-components:**
- `Table`: Root
- `TableHeader`: Header row container
- `TableBody`: Body rows container
- `TableRow`: Table row
- `TableHead`: Header cell
- `TableCell`: Data cell

**Usage:**
```tsx
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Email</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>John Doe</TableCell>
      <TableCell>john@example.com</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

---

### Toast

**File**: `components/ui/toast.tsx` + `components/ui/toaster.tsx`

Notification toast system.

**Usage:**
```tsx
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

function MyComponent() {
  const { toast } = useToast()

  return (
    <>
      <Button onClick={() => {
        toast({
          title: "Success!",
          description: "Operation completed.",
        })
      }}>
        Show Toast
      </Button>
      <Toaster />
    </>
  )
}
```

**Toast Options:**
- `title`: Toast title
- `description`: Toast description
- `variant`: `default` | `destructive`
- `duration`: Auto-dismiss time (ms)

---

### Select

**File**: `components/ui/select.tsx`

Dropdown select component.

**Usage:**
```tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
  </SelectContent>
</Select>
```

---

### Other UI Components

The following components are also available:

- **Accordion**: Collapsible content sections
- **Alert**: Notification messages
- **AlertDialog**: Confirmation dialogs
- **Avatar**: User profile images
- **Badge**: Labels and tags
- **Checkbox**: Checkbox input
- **Command**: Command palette
- **ContextMenu**: Right-click menu
- **DatePicker**: Date selection (via Calendar)
- **DropdownMenu**: Dropdown menus
- **HoverCard**: Hover popover
- **Label**: Form labels
- **Popover**: Floating content
- **Progress**: Progress bars
- **RadioGroup**: Radio button groups
- **ScrollArea**: Custom scrollbars
- **Separator**: Divider lines
- **Sheet**: Side panel
- **Skeleton**: Loading placeholders
- **Slider**: Range slider
- **Switch**: Toggle switch
- **Tabs**: Tabbed interface
- **Textarea**: Multi-line text input
- **Tooltip**: Hover tooltips

See [shadcn/ui documentation](https://ui.shadcn.com/) for detailed usage of each.

---

## Usage Examples

### Creating a New Page with Components

```tsx
// app/new-page/page.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FloatingNav } from "@/components/floating-nav"

export default function NewPage() {
  return (
    <>
      <FloatingNav />
      <div className="container mx-auto py-20">
        <h1 className="text-4xl font-bold mb-8">New Page</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Section Title</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Content goes here</p>
            <Button className="mt-4">Action Button</Button>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
```

### Creating a Custom Component

```tsx
// components/custom-component.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface CustomComponentProps {
  title: string
  onAction?: () => void
}

export function CustomComponent({ title, onAction }: CustomComponentProps) {
  const [count, setCount] = useState(0)

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p>Count: {count}</p>
        <div className="flex gap-2 mt-4">
          <Button onClick={() => setCount(count + 1)}>
            Increment
          </Button>
          {onAction && (
            <Button variant="outline" onClick={onAction}>
              Custom Action
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
```

### Composing Complex UIs

```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { EventManager } from "@/components/admin/event-manager"
import { TeamManager } from "@/components/admin/team-manager"

export default function AdminDashboard() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <Tabs defaultValue="events">
        <TabsList>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="highlights">Highlights</TabsTrigger>
        </TabsList>
        
        <TabsContent value="events">
          <EventManager />
        </TabsContent>
        
        <TabsContent value="team">
          <TeamManager />
        </TabsContent>
        
        <TabsContent value="highlights">
          {/* Highlights content */}
        </TabsContent>
      </Tabs>
    </div>
  )
}
```

---

## Best Practices

### 1. Component Organization

- Keep components focused and single-purpose
- Use meaningful names
- Group related components in folders
- Export from index files for cleaner imports

### 2. Props Interface

Always define TypeScript interfaces for props:

```tsx
interface MyComponentProps {
  title: string
  optional?: boolean
  onAction: () => void
}

export function MyComponent({ title, optional = false, onAction }: MyComponentProps) {
  // Component logic
}
```

### 3. Client vs Server Components

- Use `"use client"` directive only when needed (hooks, events, browser APIs)
- Keep components server-side by default for better performance
- Data fetching should happen in server components when possible

### 4. Styling

- Use Tailwind CSS classes
- Follow the design system (colors, spacing, typography)
- Use `className` prop for custom styles
- Utilize `cn()` utility for conditional classes:

```tsx
import { cn } from "@/lib/utils"

<div className={cn(
  "base-classes",
  isActive && "active-classes",
  variant === "special" && "special-classes"
)} />
```

### 5. Accessibility

- Always include proper ARIA labels
- Ensure keyboard navigation works
- Use semantic HTML elements
- Test with screen readers

---

## Creating New Components

### Using shadcn/ui CLI

Add new UI components:

```bash
npx shadcn-ui@latest add [component-name]
```

Example:
```bash
npx shadcn-ui@latest add calendar
```

### Manual Component Creation

1. Create file in appropriate directory
2. Define TypeScript interface
3. Implement component logic
4. Export from index (if needed)
5. Document usage

---

**Last Updated**: December 22, 2025
