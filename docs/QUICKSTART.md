# Quick Start Guide

Get the NEXUS website up and running in 5 minutes.

## Prerequisites

- Node.js 18+ installed
- Git installed
- Code editor (VS Code recommended)

---

## Installation

```bash
# 1. Clone the repository
git clone <repository-url>
cd nexus-website

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local

# 4. Edit .env.local with your credentials
# (Use placeholder values for local development)

# 5. Run development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## Quick Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run linter

# Git
git add .
git commit -m "message"
git push
```

---

## Project Structure

```
nexus-website/
├── app/              # Pages & API routes
│   ├── page.tsx     # Home page
│   ├── api/         # Backend endpoints
│   ├── events/      # Events pages
│   ├── team/        # Team page
│   └── admin/       # Admin panel
├── components/       # React components
├── lib/             # Utilities & config
├── public/          # Static assets
└── docs/            # Documentation
```

---

## Key Files

| File | Purpose |
|------|---------|
| `app/layout.tsx` | Root layout with navigation |
| `app/page.tsx` | Homepage |
| `lib/supabaseServer.ts` | Database client |
| `lib/emailjs-config.ts` | Email service config |
| `.env.local` | Environment variables |
| `next.config.mjs` | Next.js configuration |

---

## Environment Setup

### Required Variables

Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PROJECT=your-project-id
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Get Supabase Credentials

1. Go to [supabase.com](https://supabase.com)
2. Create project
3. Settings → API
4. Copy credentials

[Detailed Setup →](./SETUP.md)

---

## Common Tasks

### Adding an Event

**Via Admin Panel:**
1. Go to `/admin/dashboard`
2. Click "Events" tab
3. Fill in event details
4. Upload images
5. Save

**Via API:**
```bash
curl -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -d '{"title":"Event","date":"2025-03-15","status":"upcoming"}'
```

### Adding Team Member

1. Navigate to `/admin/dashboard`
2. Click "Team" tab
3. Add member details
4. Upload profile photo
5. Save

### Updating Content

Edit files in `app/` and `components/` directories.
Changes auto-reload in dev mode.

---

## Troubleshooting

### Build Errors

```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

### Environment Variables Not Working

```bash
# Restart dev server after changing .env.local
# Press Ctrl+C then:
npm run dev
```

### Database Connection Issues

- Verify Supabase credentials in `.env.local`
- Check Supabase dashboard for project status
- Ensure tables are created

### Images Not Loading

- Check Supabase storage buckets exist
- Verify bucket permissions (public read)
- Confirm `NEXT_PUBLIC_SUPABASE_PROJECT` is correct

---

## Next Steps

1. ✅ **Setup Complete** - Project running locally
2. 📖 **Read Documentation**:
   - [Full README](./README.md)
   - [Setup Guide](./SETUP.md)
   - [API Reference](./API.md)
   - [Component Guide](./COMPONENTS.md)
   - [Deployment Guide](./DEPLOYMENT.md)
3. 🎨 **Customize**:
   - Update colors in `tailwind.config.ts`
   - Modify content in components
   - Add your branding
4. 🗄️ **Add Content**:
   - Create events via admin panel
   - Add team members
   - Upload gallery images
5. 🚀 **Deploy**:
   - Push to GitHub
   - Deploy to Vercel
   - Configure custom domain

---

## Getting Help

**Documentation:**
- [README](./README.md) - Complete overview
- [Setup Guide](./SETUP.md) - Detailed setup instructions
- [API Docs](./API.md) - API reference
- [Components](./COMPONENTS.md) - Component usage

**Resources:**
- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)

**Common Issues:**
- Check browser console for errors
- Review terminal for build errors
- Verify environment variables
- Check Supabase dashboard

---

## Cheat Sheet

### File Creation

```bash
# New page
touch app/new-page/page.tsx

# New component
touch components/new-component.tsx

# New API route
touch app/api/new-route/route.ts
```

### Import Patterns

```tsx
// UI Components
import { Button } from "@/components/ui/button"

// Custom Components
import { CustomComponent } from "@/components/custom-component"

// Utilities
import { cn } from "@/lib/utils"

// Supabase
import { supabase } from "@/lib/supabaseServer"
```

### Styling

```tsx
// Tailwind classes
<div className="flex items-center gap-4 p-6 bg-slate-900 rounded-lg">

// Conditional classes
<div className={cn(
  "base-class",
  isActive && "active-class"
)}>
```

### Data Fetching

```tsx
// Server component
export default async function Page() {
  const { data } = await supabase.from("events").select("*")
  return <div>{/* render data */}</div>
}

// Client component
"use client"
import { useEffect, useState } from "react"

export default function Page() {
  const [data, setData] = useState([])
  
  useEffect(() => {
    fetch('/api/events')
      .then(res => res.json())
      .then(json => setData(json.data))
  }, [])
  
  return <div>{/* render data */}</div>
}
```

---

## Development Workflow

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/new-feature
   ```

2. **Make Changes**
   - Edit files
   - Test locally
   - Verify functionality

3. **Commit Changes**
   ```bash
   git add .
   git commit -m "Add new feature"
   ```

4. **Push & Deploy**
   ```bash
   git push origin feature/new-feature
   # Create pull request
   # Merge to main
   # Auto-deploys (if configured)
   ```

---

## Quick Tips

- 💡 Use `npm run dev` for hot reload during development
- 💡 Check browser console for client-side errors
- 💡 Check terminal for server-side errors
- 💡 Use TypeScript for type safety
- 💡 Commit often with clear messages
- 💡 Test on mobile devices (responsive design)
- 💡 Optimize images before uploading
- 💡 Keep dependencies updated
- 💡 Use environment variables for sensitive data
- 💡 Never commit `.env.local` to Git

---

**You're all set! Happy coding! 🚀**

For detailed information, see the [complete documentation](./README.md).

---

**Last Updated**: December 22, 2025
