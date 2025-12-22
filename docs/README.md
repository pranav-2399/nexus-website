# NEXUS Website Documentation

> **Tagline:** Innovate. Lead. Build.

Welcome to the NEXUS website documentation. This comprehensive guide will help you understand, set up, and maintain the NEXUS club website.

## Table of Contents

1. [Overview](#overview)
2. [Getting Started](#getting-started)
3. [Project Structure](#project-structure)
4. [Environment Configuration](#environment-configuration)
5. [Features](#features)
6. [API Documentation](#api-documentation)
7. [Component Documentation](#component-documentation)
8. [Database Schema](#database-schema)
9. [Deployment](#deployment)
10. [Troubleshooting](#troubleshooting)

---

## Overview

The NEXUS website is a modern web application built with Next.js 15, featuring:

- **Framework**: Next.js 15.2.4 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom animations
- **UI Components**: Radix UI primitives
- **3D Graphics**: Three.js with React Three Fiber
- **Backend**: Supabase (PostgreSQL database)
- **Email Service**: EmailJS for contact form
- **Animation**: Framer Motion

### Purpose

This website serves as the digital presence for the NEXUS club, showcasing:
- Club events (past and upcoming)
- Team members and leadership
- Featured projects and work
- Gallery of club activities
- Contact and recruitment information

---

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Supabase account (for production features)
- EmailJS account (for contact form)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nexus-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your credentials (see [Environment Configuration](#environment-configuration))

4. **Run the development server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Build for production**
   ```bash
   npm run build
   npm start
   ```

---

## Project Structure

```
nexus-website/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx               # Root layout with navigation
│   ├── page.tsx                 # Home page
│   ├── globals.css              # Global styles
│   ├── admin/                   # Admin dashboard
│   │   ├── dashboard/           # Admin panel for content management
│   │   └── login/               # Admin authentication
│   ├── api/                     # API routes
│   │   ├── events/              # Event management endpoints
│   │   ├── highlights/          # Highlights CRUD endpoints
│   │   └── teams/               # Team member management
│   ├── contact/                 # Contact page
│   ├── events/                  # Events pages
│   │   ├── [slug]/             # Individual event page
│   │   ├── past-events/        # Past events listing
│   │   └── upcoming/           # Upcoming events listing
│   ├── gallery/                 # Gallery pages
│   │   └── [id]/               # Individual gallery page
│   └── team/                    # Team page
├── components/                  # React components
│   ├── ui/                     # Reusable UI components (shadcn/ui)
│   ├── admin/                  # Admin-specific components
│   └── [feature-components].tsx # Feature-specific components
├── lib/                        # Utility libraries
│   ├── supabaseServer.ts       # Supabase client configuration
│   ├── emailjs-config.ts       # EmailJS configuration
│   └── utils.ts                # Utility functions
├── public/                     # Static assets
│   └── images/                 # Image files
├── hooks/                      # Custom React hooks
├── styles/                     # Additional styles
└── docs/                       # Documentation (this folder)
```

### Key Directories

- **`app/`**: Contains all pages and API routes using Next.js 15 App Router
- **`components/`**: Reusable React components, organized by feature
- **`lib/`**: Configuration files and utility functions
- **`public/`**: Static assets served directly

---

## Environment Configuration

### Required Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PROJECT=your-project
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Getting Supabase Credentials

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Create a new project or select existing
3. Navigate to **Settings** → **API**
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **Project Reference ID** → `NEXT_PUBLIC_SUPABASE_PROJECT`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY`

### EmailJS Configuration

EmailJS credentials are configured in `lib/emailjs-config.ts`. Update with your credentials:

```typescript
export const EMAILJS_CONFIG = {
  PUBLIC_KEY: "your-public-key",
  SERVICE_ID: "your-service-id",
  TEMPLATE_ID: "your-template-id",
}
```

---

## Features

### 1. **Home Page**
- Hero section with 3D particle effects
- Featured work grid
- Technology showcase
- Core team display
- "From the Desk" section
- Footer with links

### 2. **Events Management**
- List all events (upcoming/past)
- Individual event detail pages
- Event filtering by status
- Pin important events
- Gallery uploads for events
- Admin CRUD operations

### 3. **Team Section**
- Display team members with roles
- Hierarchical team structure
- Team member profiles with images
- Admin management interface

### 4. **Gallery**
- Event-based photo galleries
- Image uploads and management
- Responsive image grid
- Individual gallery pages

### 5. **Admin Dashboard**
- Secure admin login
- Event management (create, update, delete)
- Team member management
- Highlights management
- Image uploads
- Feedback viewer

### 6. **Contact Form**
- EmailJS integration
- Form validation
- Interest in joining checkbox
- Responsive design

---

## API Documentation

All API routes are located in `app/api/` and follow RESTful conventions.

### Events API

#### GET `/api/events`
Fetch all events with optional filters.

**Query Parameters:**
- `status` (optional): Filter by event status (e.g., "upcoming", "past")
- `isPinned` (optional): Filter pinned events (true/false)

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Event Title",
      "description": "Event description",
      "date": "2025-01-15",
      "status": "upcoming",
      "isPinned": false,
      "image": "url",
      "gallery": ["url1", "url2"]
    }
  ]
}
```

#### POST `/api/events`
Create a new event.

**Request Body:**
```json
{
  "title": "New Event",
  "description": "Event details",
  "date": "2025-01-15",
  "status": "upcoming"
}
```

#### PUT `/api/events?id={eventId}`
Update an existing event.

#### DELETE `/api/events?id={eventId}`
Delete an event.

#### POST `/api/events/upload-image`
Upload event thumbnail image.

#### POST `/api/events/upload-gallery`
Upload gallery images for an event.

---

### Highlights API

#### GET `/api/highlights`
Fetch all highlights.

**Response:**
```json
{
  "highlights": [
    {
      "id": "uuid",
      "title": "Highlight Title",
      "description": "Description",
      "image": "url"
    }
  ]
}
```

#### POST `/api/highlights`
Create a new highlight.

#### PUT `/api/highlights?id={highlightId}`
Update a highlight.

#### DELETE `/api/highlights?id={highlightId}`
Delete a highlight.

---

### Teams API

#### GET `/api/teams`
Fetch all team members.

**Response:**
```json
{
  "teams": [
    {
      "id": "uuid",
      "name": "John Doe",
      "role": "President",
      "image": "url",
      "bio": "Member bio",
      "social": {
        "linkedin": "url",
        "github": "url"
      }
    }
  ]
}
```

#### POST `/api/teams`
Add a new team member.

#### PUT `/api/teams?id={memberId}`
Update team member information.

#### DELETE `/api/teams?id={memberId}`
Remove a team member.

#### POST `/api/teams/upload-image`
Upload team member profile image.

---

## Component Documentation

### Core Components

#### 1. **HeroSectionRedesigned**
- Location: `components/hero-section-redesigned.tsx`
- Purpose: Landing section with animated text and 3D effects
- Features: Particle animations, responsive design

#### 2. **FloatingNav**
- Location: `components/floating-nav.tsx`
- Purpose: Main navigation component
- Features: Sticky navigation, smooth scrolling

#### 3. **GlobalBackground**
- Location: `components/global-background.tsx`
- Purpose: Animated background for the entire site
- Features: Three.js canvas, particle effects

#### 4. **LoadingScreen**
- Location: `components/loading-screen.tsx`
- Purpose: Initial loading animation
- Features: Smooth fade-in/out transitions

#### 5. **EventDetailPage**
- Location: `components/event-detail-page.tsx`
- Purpose: Display individual event details
- Features: Image gallery, event metadata

### Admin Components

#### 1. **EventManager**
- Location: `components/admin/event-manager.tsx`
- Purpose: Admin interface for event CRUD operations
- Features: Form validation, image uploads, status management

#### 2. **TeamManager**
- Location: `components/admin/team-manager.tsx`
- Purpose: Manage team members
- Features: Add/edit/delete members, image uploads

#### 3. **HighlightsManager**
- Location: `components/admin/highlights-manager.tsx`
- Purpose: Manage homepage highlights
- Features: CRUD operations for highlights

### UI Components

All UI components are located in `components/ui/` and are based on shadcn/ui:

- **Button**: Customizable button component
- **Card**: Container component for content
- **Dialog**: Modal dialogs
- **Form**: Form with validation
- **Input**: Text input fields
- **Table**: Data tables
- **Toast**: Notification system
- And many more...

---

## Database Schema

### Required Supabase Tables

#### 1. **events**
```sql
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  date DATE,
  status TEXT, -- 'upcoming', 'past', 'ongoing'
  isPinned BOOLEAN DEFAULT false,
  image TEXT, -- URL to thumbnail
  gallery TEXT[], -- Array of image URLs
  slug TEXT UNIQUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### 2. **highlights**
```sql
CREATE TABLE highlights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  image TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 3. **clubMembers**
```sql
CREATE TABLE "clubMembers" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  image TEXT,
  bio TEXT,
  social JSONB, -- {linkedin: '', github: '', etc}
  order INTEGER, -- Display order
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Storage Buckets

Create these storage buckets in Supabase:

1. **event-images**: For event thumbnails
2. **event-galleries**: For event gallery images
3. **team-images**: For team member photos
4. **highlight-images**: For highlight images

**Storage Policies**: Set appropriate RLS policies for public read and authenticated write access.

---

## Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Import Project"
   - Select your repository
   - Configure environment variables
   - Deploy

3. **Environment Variables**
   
   Add all variables from `.env.local` to Vercel:
   - Settings → Environment Variables
   - Add each variable

4. **Custom Domain** (Optional)
   - Settings → Domains
   - Add your custom domain

### Other Deployment Options

#### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

#### Self-Hosted
```bash
npm run build
pm2 start npm --name "nexus-website" -- start
```

---

## Troubleshooting

### Common Issues

#### 1. **Build fails with "supabaseUrl is required"**

**Solution**: Ensure `.env.local` exists with valid Supabase credentials.

```bash
cp .env.example .env.local
# Edit .env.local with your credentials
```

#### 2. **Images not loading**

**Solution**: 
- Check Supabase storage bucket permissions
- Verify `NEXT_PUBLIC_SUPABASE_PROJECT` matches your project ID
- Ensure image domains are configured in `next.config.mjs`

#### 3. **Contact form not working**

**Solution**: Update EmailJS credentials in `lib/emailjs-config.ts`

#### 4. **3D effects causing performance issues**

**Solution**: The site automatically optimizes for mobile devices. For further optimization:
- Reduce particle count in 3D components
- Disable postprocessing effects
- Use `useMediaQuery` to conditionally render 3D scenes

#### 5. **TypeScript errors**

**Solution**:
```bash
npm run lint
# Fix any TypeScript errors shown
```

### Development Tips

1. **Hot Reload**: Use `npm run dev` for instant updates
2. **Type Safety**: Run `tsc --noEmit` to check types without building
3. **Linting**: Use `npm run lint` before committing
4. **Clear Cache**: Delete `.next` folder if experiencing strange build issues

### Getting Help

- Check the [Next.js Documentation](https://nextjs.org/docs)
- Review [Supabase Documentation](https://supabase.com/docs)
- Check [shadcn/ui Components](https://ui.shadcn.com/)

---

## Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm start`: Start production server
- `npm run lint`: Run ESLint

---

## Technology Stack

- **Next.js 15.2.4**: React framework
- **React 19**: UI library
- **TypeScript 5**: Type safety
- **Tailwind CSS 3.4**: Styling
- **Framer Motion 12**: Animations
- **Three.js 0.177**: 3D graphics
- **Supabase 2.50**: Backend & database
- **EmailJS 4.4**: Email service
- **Radix UI**: Accessible components
- **shadcn/ui**: UI component library

---

## License

This project is proprietary to NEXUS Club.

---

## Maintainers

For questions or issues, contact the NEXUS development team.

---

**Last Updated**: December 22, 2025
