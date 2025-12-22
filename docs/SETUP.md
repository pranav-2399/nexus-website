# Setup Guide

This guide will walk you through setting up the NEXUS website from scratch.

## Table of Contents

1. [Initial Setup](#initial-setup)
2. [Supabase Configuration](#supabase-configuration)
3. [EmailJS Configuration](#emailjs-configuration)
4. [Running Locally](#running-locally)
5. [Admin Access Setup](#admin-access-setup)

---

## Initial Setup

### Step 1: Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd nexus-website

# Install dependencies
npm install
```

### Step 2: Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

You'll need to fill in the following variables (we'll get these in the next steps):

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PROJECT=
SUPABASE_SERVICE_ROLE_KEY=
```

---

## Supabase Configuration

### Step 1: Create a Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Click "New Project"
3. Fill in:
   - **Name**: nexus-website (or your preferred name)
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free tier is sufficient to start

### Step 2: Get API Credentials

1. Once project is created, go to **Settings** → **API**
2. Copy the following:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → (not needed for server-side)
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` ⚠️ **Keep this secret!**

3. Get your project reference ID:
   - Look at your Project URL: `https://[PROJECT-ID].supabase.co`
   - The PROJECT-ID part → `NEXT_PUBLIC_SUPABASE_PROJECT`

### Step 3: Create Database Tables

Run these SQL commands in the Supabase SQL Editor (Database → SQL Editor):

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Events Table
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  date DATE,
  status TEXT CHECK (status IN ('upcoming', 'past', 'ongoing')),
  "isPinned" BOOLEAN DEFAULT false,
  image TEXT,
  gallery TEXT[],
  slug TEXT UNIQUE,
  location TEXT,
  organizer TEXT,
  "maxParticipants" INTEGER,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Highlights Table
CREATE TABLE highlights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  image TEXT,
  link TEXT,
  order_index INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Club Members Table
CREATE TABLE "clubMembers" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  image TEXT,
  bio TEXT,
  email TEXT,
  social JSONB DEFAULT '{}'::jsonb,
  "displayOrder" INTEGER DEFAULT 0,
  "isActive" BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_date ON events(date DESC);
CREATE INDEX idx_events_pinned ON events("isPinned");
CREATE INDEX idx_club_members_role ON "clubMembers"(role);
CREATE INDEX idx_club_members_order ON "clubMembers"("displayOrder");

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_club_members_updated_at BEFORE UPDATE ON "clubMembers"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Step 4: Create Storage Buckets

1. Go to **Storage** in Supabase dashboard
2. Create the following buckets (click "New Bucket"):

   - **Name**: `event-images`
     - Public: ✅ Yes
     - File size limit: 5 MB
     - Allowed MIME types: image/jpeg, image/png, image/webp

   - **Name**: `event-galleries`
     - Public: ✅ Yes
     - File size limit: 5 MB
     - Allowed MIME types: image/jpeg, image/png, image/webp

   - **Name**: `team-images`
     - Public: ✅ Yes
     - File size limit: 5 MB
     - Allowed MIME types: image/jpeg, image/png, image/webp

   - **Name**: `highlight-images`
     - Public: ✅ Yes
     - File size limit: 5 MB
     - Allowed MIME types: image/jpeg, image/png, image/webp

### Step 5: Set Storage Policies

For each bucket, add these policies (Storage → Policies):

```sql
-- Allow public read access
CREATE POLICY "Public read access" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'event-images');

-- Allow authenticated uploads (for admin)
CREATE POLICY "Authenticated upload" ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'event-images' AND auth.role() = 'authenticated');

-- Allow authenticated updates
CREATE POLICY "Authenticated update" ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'event-images' AND auth.role() = 'authenticated');

-- Allow authenticated deletes
CREATE POLICY "Authenticated delete" ON storage.objects
  FOR DELETE
  USING (bucket_id = 'event-images' AND auth.role() = 'authenticated');
```

Repeat for all buckets (replace 'event-images' with bucket name).

### Step 6: Update .env.local

Update your `.env.local` file with the credentials from Step 2:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PROJECT=your-project-id
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

---

## EmailJS Configuration

The contact form uses EmailJS to send emails.

### Step 1: Create EmailJS Account

1. Go to [https://www.emailjs.com](https://www.emailjs.com)
2. Sign up for a free account
3. Confirm your email

### Step 2: Add Email Service

1. Go to **Email Services**
2. Click "Add New Service"
3. Choose your email provider (Gmail recommended)
4. Follow the setup instructions
5. Copy your **Service ID**

### Step 3: Create Email Template

1. Go to **Email Templates**
2. Click "Create New Template"
3. Use this template:

**Subject**: `New Contact from {{from_name}}`

**Body**:
```
New message from NEXUS website:

From: {{from_name}}
Email: {{from_email}}
Interested in joining: {{interested_in_joining}}

Message:
{{message}}

---
Reply to: {{reply_to}}
```

4. Save and copy your **Template ID**

### Step 4: Get Public Key

1. Go to **Account** → **General**
2. Copy your **Public Key**

### Step 5: Update Configuration

Edit `lib/emailjs-config.ts`:

```typescript
export const EMAILJS_CONFIG = {
  PUBLIC_KEY: "your-public-key-here",
  SERVICE_ID: "your-service-id-here",
  TEMPLATE_ID: "your-template-id-here",
}
```

---

## Running Locally

### Development Mode

```bash
npm run dev
```

Visit: [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
# Build
npm run build

# Start
npm start
```

### Verify Everything Works

1. **Home Page**: Should load with animations
2. **Events**: Navigate to /events (may be empty initially)
3. **Team**: Navigate to /team (may be empty initially)
4. **Gallery**: Navigate to /gallery (may be empty initially)
5. **Contact**: Try submitting the contact form

---

## Admin Access Setup

### Option 1: Direct Database Access (Temporary)

Since there's no authentication system yet, access the admin dashboard directly:

1. Navigate to [http://localhost:3000/admin/dashboard](http://localhost:3000/admin/dashboard)
2. Use the admin panel to add content

### Option 2: Add Sample Data

You can insert sample data directly via Supabase:

```sql
-- Sample Event
INSERT INTO events (title, description, date, status, "isPinned")
VALUES (
  'Hackathon 2025',
  'Annual coding competition',
  '2025-03-15',
  'upcoming',
  true
);

-- Sample Highlight
INSERT INTO highlights (title, description, image)
VALUES (
  'Project Showcase',
  'Best projects from our members',
  'https://via.placeholder.com/400x300'
);

-- Sample Team Member
INSERT INTO "clubMembers" (name, role, bio)
VALUES (
  'John Doe',
  'President',
  'Leading the tech innovation at NEXUS'
);
```

---

## Verification Checklist

- [ ] Project runs without errors (`npm run dev`)
- [ ] Supabase connection works (check browser console for errors)
- [ ] Can create events via admin panel
- [ ] Can upload images
- [ ] Contact form sends emails
- [ ] All pages load correctly

---

## Next Steps

1. **Add Content**: Use the admin dashboard to add events, team members, and highlights
2. **Customize**: Update colors, fonts, and content to match your branding
3. **Deploy**: See [Deployment Guide](./DEPLOYMENT.md) for production deployment
4. **Security**: Set up proper authentication for the admin panel

---

## Troubleshooting

### "supabaseUrl is required" Error

**Problem**: Missing environment variables

**Solution**:
```bash
# Verify .env.local exists
ls -la .env.local

# Check contents
cat .env.local

# Restart dev server
npm run dev
```

### Images Not Showing

**Problem**: Storage bucket policies or incorrect URL

**Solution**:
1. Check bucket is public
2. Verify policies are set correctly
3. Check `NEXT_PUBLIC_SUPABASE_PROJECT` matches your project

### Contact Form Not Sending

**Problem**: EmailJS misconfiguration

**Solution**:
1. Verify all three IDs in `lib/emailjs-config.ts`
2. Check EmailJS dashboard for rate limits
3. Check browser console for errors

---

## Getting Help

If you encounter issues:

1. Check the browser console for errors
2. Check the terminal for build errors
3. Verify all environment variables are set
4. Review Supabase dashboard for database errors
5. Check the main [README](./README.md) documentation

---

**Last Updated**: December 22, 2025
