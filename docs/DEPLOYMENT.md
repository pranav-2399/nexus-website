# Deployment Guide

This guide covers deploying the NEXUS website to various platforms.

## Table of Contents

1. [Deployment Overview](#deployment-overview)
2. [Vercel Deployment](#vercel-deployment-recommended)
3. [Netlify Deployment](#netlify-deployment)
4. [Self-Hosted Deployment](#self-hosted-deployment)
5. [Docker Deployment](#docker-deployment)
6. [Environment Variables](#environment-variables)
7. [Post-Deployment Checklist](#post-deployment-checklist)

---

## Deployment Overview

The NEXUS website is a Next.js application that can be deployed to various platforms. The recommended option is Vercel for its seamless Next.js integration.

### Requirements

- Git repository (GitHub, GitLab, or Bitbucket)
- Supabase project configured
- Environment variables ready

---

## Vercel Deployment (Recommended)

Vercel is the recommended platform as it's created by the Next.js team and offers the best integration.

### Step 1: Prepare Your Repository

```bash
# Ensure your code is committed
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Import to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New..."** → **"Project"**
3. Import your Git repository
4. Vercel will auto-detect Next.js settings

### Step 3: Configure Project

Vercel should auto-detect these settings (verify they're correct):

- **Framework Preset**: Next.js
- **Root Directory**: `./`
- **Build Command**: `npm run build` or `next build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### Step 4: Add Environment Variables

In the Vercel dashboard:

1. Go to **Settings** → **Environment Variables**
2. Add the following:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PROJECT=your-project-id
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

⚠️ **Important**: Add these to all environments (Production, Preview, Development)

### Step 5: Deploy

1. Click **Deploy**
2. Wait for build to complete (2-5 minutes)
3. Visit your deployment URL

### Step 6: Custom Domain (Optional)

1. Go to **Settings** → **Domains**
2. Add your domain: `yourdomain.com`
3. Follow DNS configuration instructions
4. Add `www.yourdomain.com` if desired

**DNS Configuration Example:**

For `yourdomain.com`:
- Type: A
- Name: @
- Value: 76.76.21.21

For `www.yourdomain.com`:
- Type: CNAME
- Name: www
- Value: cname.vercel-dns.com

### Continuous Deployment

Vercel automatically deploys:
- **Production**: When you push to `main` branch
- **Preview**: For pull requests and other branches

---

## Netlify Deployment

### Step 1: Connect Repository

1. Go to [netlify.com](https://netlify.com)
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect your Git provider
4. Select your repository

### Step 2: Build Settings

Configure these settings:

- **Base directory**: (leave empty)
- **Build command**: `npm run build`
- **Publish directory**: `.next`
- **Functions directory**: (leave empty)

### Step 3: Environment Variables

Go to **Site settings** → **Environment variables**:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PROJECT=your-project-id
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Step 4: Deploy

Click **Deploy site**

### Additional Configuration

Create `netlify.toml` in your project root:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## Self-Hosted Deployment

### Prerequisites

- Ubuntu/Debian server (or similar)
- Node.js 18+ installed
- nginx (for reverse proxy)
- PM2 (process manager)

### Step 1: Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install nginx
sudo apt install -y nginx
```

### Step 2: Clone and Build

```bash
# Clone repository
git clone <your-repo-url>
cd nexus-website

# Install dependencies
npm install

# Create .env.local
nano .env.local
# Add your environment variables

# Build
npm run build
```

### Step 3: Configure PM2

Create `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'nexus-website',
    script: 'npm',
    args: 'start',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    instances: 'max',
    exec_mode: 'cluster'
  }]
}
```

Start the application:

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Step 4: Configure nginx

Create `/etc/nginx/sites-available/nexus`:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/nexus /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 5: SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal test
sudo certbot renew --dry-run
```

---

## Docker Deployment

### Step 1: Create Dockerfile

Create `Dockerfile` in project root:

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source
COPY . .

# Build application
RUN npm run build

# Production stage
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy necessary files
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["npm", "start"]
```

### Step 2: Create .dockerignore

```
node_modules
.next
.git
.env.local
.env*.local
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.DS_Store
*.pem
```

### Step 3: Build and Run

```bash
# Build image
docker build -t nexus-website .

# Run container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=your-url \
  -e NEXT_PUBLIC_SUPABASE_PROJECT=your-project \
  -e SUPABASE_SERVICE_ROLE_KEY=your-key \
  nexus-website
```

### Step 4: Docker Compose (Optional)

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
      - NEXT_PUBLIC_SUPABASE_PROJECT=${NEXT_PUBLIC_SUPABASE_PROJECT}
      - SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
    restart: unless-stopped
```

Run with:

```bash
docker-compose up -d
```

---

## Environment Variables

### Required Variables

All deployment platforms need these:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PROJECT=your-project-id
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Platform-Specific Notes

**Vercel:**
- Variables are added in dashboard
- Support for different environments (Production/Preview/Development)

**Netlify:**
- Variables in Site Settings → Environment Variables
- Same variables for all branches

**Self-Hosted:**
- Use `.env.local` file (never commit to Git)
- Or use environment variables in PM2 config

**Docker:**
- Pass via `-e` flag or `.env` file with Docker Compose
- Can use secrets for sensitive data

---

## Post-Deployment Checklist

After deploying, verify:

### ✅ Functionality Check

- [ ] Homepage loads correctly
- [ ] Navigation works
- [ ] Events page displays
- [ ] Team page displays
- [ ] Gallery page displays
- [ ] Contact form sends emails
- [ ] Admin dashboard accessible
- [ ] Images load properly
- [ ] 3D animations work (if enabled)

### ✅ Performance Check

- [ ] Lighthouse score > 90
- [ ] Images optimized
- [ ] First Contentful Paint < 2s
- [ ] Time to Interactive < 4s

### ✅ SEO Check

- [ ] Meta tags present
- [ ] Open Graph tags configured
- [ ] Sitemap generated
- [ ] robots.txt configured

### ✅ Security Check

- [ ] HTTPS enabled
- [ ] Environment variables secure
- [ ] No sensitive data exposed
- [ ] Admin routes protected (if implemented)
- [ ] Content Security Policy configured

### ✅ Monitoring Setup

- [ ] Error tracking (Sentry, etc.)
- [ ] Analytics (Google Analytics, Plausible, etc.)
- [ ] Uptime monitoring
- [ ] Performance monitoring

---

## Updating Deployment

### Vercel/Netlify
Simply push to your repository:
```bash
git push origin main
```

### Self-Hosted
```bash
# SSH to server
ssh user@your-server

# Navigate to project
cd nexus-website

# Pull changes
git pull origin main

# Install new dependencies (if any)
npm install

# Rebuild
npm run build

# Restart PM2
pm2 restart nexus-website
```

### Docker
```bash
# Pull latest code
git pull origin main

# Rebuild image
docker build -t nexus-website .

# Stop old container
docker stop nexus-website

# Start new container
docker run -d --name nexus-website -p 3000:3000 \
  --env-file .env nexus-website
```

---

## Rollback Strategy

### Vercel
1. Go to Deployments
2. Find previous working deployment
3. Click **"Promote to Production"**

### Netlify
1. Go to Deploys
2. Find previous deployment
3. Click **"Publish deploy"**

### Self-Hosted
```bash
git revert HEAD
npm run build
pm2 restart nexus-website
```

---

## Troubleshooting Deployment

### Build Fails

**Issue**: TypeScript errors

**Solution**:
```bash
npm run lint
npm run build
# Fix any errors shown
```

### Runtime Errors

**Issue**: "Module not found"

**Solution**: Ensure all dependencies are in `dependencies`, not `devDependencies`

### Environment Variables Not Working

**Issue**: Variables undefined at runtime

**Solution**: 
- Prefix client-side variables with `NEXT_PUBLIC_`
- Restart deployment after adding variables
- Clear build cache

### Images Not Loading

**Issue**: 403 or 404 on images

**Solution**:
- Verify Supabase bucket permissions
- Check `next.config.mjs` image domains
- Ensure correct bucket names

---

## Support

For deployment issues:
- Check platform status pages
- Review build logs
- Check environment variables
- Verify database connections

---

**Last Updated**: December 22, 2025
