# API Reference

Complete API documentation for the NEXUS website backend.

## Base URL

- **Development**: `http://localhost:3000/api`
- **Production**: `https://your-domain.com/api`

## Authentication

Currently, the API does not implement authentication. All endpoints are publicly accessible. 

⚠️ **Security Note**: In production, you should implement authentication for POST, PUT, and DELETE operations.

---

## Events API

### GET `/api/events`

Retrieve all events with optional filtering.

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | string | Filter by status: `upcoming`, `past`, `ongoing` |
| `isPinned` | boolean | Filter pinned events: `true` or `false` |

**Example Request:**
```bash
# Get all upcoming events
curl http://localhost:3000/api/events?status=upcoming

# Get pinned events
curl http://localhost:3000/api/events?isPinned=true
```

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Annual Hackathon 2025",
      "description": "Join us for 24 hours of innovation",
      "date": "2025-03-15",
      "status": "upcoming",
      "isPinned": true,
      "image": "https://project.supabase.co/storage/v1/object/public/event-images/hackathon.jpg",
      "gallery": [
        "https://project.supabase.co/storage/v1/object/public/event-galleries/img1.jpg"
      ],
      "slug": "annual-hackathon-2025",
      "location": "Tech Hub",
      "organizer": "NEXUS Team",
      "maxParticipants": 100,
      "tags": ["hackathon", "coding"],
      "created_at": "2024-12-01T10:00:00Z",
      "updated_at": "2024-12-01T10:00:00Z"
    }
  ]
}
```

---

### POST `/api/events`

Create a new event.

**Request Body:**
```json
{
  "title": "Workshop: Web Development",
  "description": "Learn modern web development",
  "date": "2025-02-20",
  "status": "upcoming",
  "isPinned": false,
  "location": "Room 101",
  "organizer": "Tech Lead",
  "maxParticipants": 50,
  "tags": ["workshop", "web development"]
}
```

**Response (201 Created):**
```json
{
  "message": "Event created",
  "data": [
    {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "title": "Workshop: Web Development",
      // ... other fields
    }
  ]
}
```

**Error Response (500):**
```json
{
  "error": "Database error message"
}
```

---

### PUT `/api/events?id={eventId}`

Update an existing event.

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | UUID | Yes | Event ID to update |

**Request Body:**
```json
{
  "title": "Updated Event Title",
  "status": "ongoing",
  "isPinned": true
}
```

**Response (200 OK):**
```json
{
  "message": "Event updated",
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      // ... updated fields
    }
  ]
}
```

**Error Response (400):**
```json
{
  "error": "Missing id"
}
```

---

### DELETE `/api/events?id={eventId}`

Delete an event.

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | UUID | Yes | Event ID to delete |

**Response (200 OK):**
```json
{
  "message": "Event deleted",
  "data": []
}
```

---

### POST `/api/events/upload-image`

Upload event thumbnail image.

**Request:** `multipart/form-data`

| Field | Type | Description |
|-------|------|-------------|
| `file` | File | Image file (JPEG, PNG, WebP) |
| `eventId` | string | Event ID for the image |

**Response (200 OK):**
```json
{
  "url": "https://project.supabase.co/storage/v1/object/public/event-images/filename.jpg"
}
```

---

### POST `/api/events/upload-gallery`

Upload multiple images to event gallery.

**Request:** `multipart/form-data`

| Field | Type | Description |
|-------|------|-------------|
| `files` | File[] | Array of image files |
| `eventId` | string | Event ID for gallery |

**Response (200 OK):**
```json
{
  "urls": [
    "https://project.supabase.co/storage/v1/object/public/event-galleries/img1.jpg",
    "https://project.supabase.co/storage/v1/object/public/event-galleries/img2.jpg"
  ]
}
```

---

### GET `/api/events/fetch-event?slug={slug}`

Fetch a single event by slug.

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `slug` | string | Yes | Event slug |

**Response (200 OK):**
```json
{
  "event": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Annual Hackathon 2025",
    // ... all event fields
  }
}
```

---

### DELETE `/api/events/delete-image?url={imageUrl}`

Delete an event image from storage.

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `url` | string | Yes | Full URL of image to delete |

**Response (200 OK):**
```json
{
  "message": "Image deleted successfully"
}
```

---

## Highlights API

### GET `/api/highlights`

Retrieve all highlights.

**Response (200 OK):**
```json
{
  "highlights": [
    {
      "id": "770e8400-e29b-41d4-a716-446655440000",
      "title": "Best Projects 2024",
      "description": "Showcasing our members' achievements",
      "image": "https://project.supabase.co/storage/v1/object/public/highlight-images/projects.jpg",
      "link": "https://example.com",
      "order_index": 1,
      "created_at": "2024-12-01T10:00:00Z"
    }
  ]
}
```

---

### POST `/api/highlights`

Create a new highlight.

**Request Body:**
```json
{
  "title": "New Achievement",
  "description": "Description of the highlight",
  "image": "image-url",
  "link": "https://example.com",
  "order_index": 2
}
```

**Response (201 Created):**
```json
{
  "message": "Highlight added",
  "data": [
    {
      "id": "880e8400-e29b-41d4-a716-446655440001",
      // ... all fields
    }
  ]
}
```

---

### PUT `/api/highlights?id={highlightId}`

Update a highlight.

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | UUID | Yes | Highlight ID to update |

**Request Body:**
```json
{
  "title": "Updated Title",
  "order_index": 3
}
```

**Response (200 OK):**
```json
{
  "message": "Highlight updated",
  "data": [...]
}
```

---

### DELETE `/api/highlights?id={highlightId}`

Delete a highlight.

**Response (200 OK):**
```json
{
  "message": "Highlight deleted",
  "data": []
}
```

---

## Teams API

### GET `/api/teams`

Retrieve all team members.

**Response (200 OK):**
```json
{
  "teams": [
    {
      "id": "990e8400-e29b-41d4-a716-446655440000",
      "name": "John Doe",
      "role": "President",
      "image": "https://project.supabase.co/storage/v1/object/public/team-images/john.jpg",
      "bio": "Leading NEXUS to innovation",
      "email": "john@nexus.com",
      "social": {
        "linkedin": "https://linkedin.com/in/johndoe",
        "github": "https://github.com/johndoe",
        "twitter": "https://twitter.com/johndoe"
      },
      "displayOrder": 1,
      "isActive": true,
      "created_at": "2024-12-01T10:00:00Z",
      "updated_at": "2024-12-01T10:00:00Z"
    }
  ]
}
```

---

### POST `/api/teams`

Add a new team member.

**Request Body:**
```json
{
  "name": "Jane Smith",
  "role": "Vice President",
  "bio": "Passionate about technology",
  "email": "jane@nexus.com",
  "social": {
    "linkedin": "https://linkedin.com/in/janesmith"
  },
  "displayOrder": 2
}
```

**Response (201 Created):**
```json
{
  "message": "Team member added",
  "data": [
    {
      "id": "aa0e8400-e29b-41d4-a716-446655440002",
      // ... all fields
    }
  ]
}
```

---

### PUT `/api/teams?id={memberId}`

Update team member information.

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | UUID | Yes | Team member ID to update |

**Request Body:**
```json
{
  "role": "President",
  "isActive": false
}
```

**Response (200 OK):**
```json
{
  "message": "Team member updated",
  "data": [...]
}
```

---

### DELETE `/api/teams?id={memberId}`

Remove a team member.

**Response (200 OK):**
```json
{
  "message": "Team member deleted",
  "data": []
}
```

---

### POST `/api/teams/upload-image`

Upload team member profile image.

**Request:** `multipart/form-data`

| Field | Type | Description |
|-------|------|-------------|
| `file` | File | Image file (JPEG, PNG, WebP) |
| `memberId` | string | Team member ID |

**Response (200 OK):**
```json
{
  "url": "https://project.supabase.co/storage/v1/object/public/team-images/member.jpg"
}
```

---

### DELETE `/api/teams/delete-image?url={imageUrl}`

Delete a team member image from storage.

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `url` | string | Yes | Full URL of image to delete |

**Response (200 OK):**
```json
{
  "message": "Image deleted successfully"
}
```

---

## Error Responses

All API endpoints follow consistent error response format:

**Error (400 - Bad Request):**
```json
{
  "error": "Missing required field: title"
}
```

**Error (500 - Internal Server Error):**
```json
{
  "error": "Database connection failed"
}
```

---

## Rate Limiting

Currently, there are no rate limits implemented. Consider adding rate limiting in production using middleware or services like Vercel Edge Config.

---

## CORS

CORS is handled automatically by Next.js. For custom CORS configuration, modify `next.config.mjs`.

---

## Data Validation

While basic validation exists, consider implementing:
- Zod schemas for request validation
- File type and size validation for uploads
- SQL injection prevention (already handled by Supabase client)

---

## Testing the API

### Using cURL

```bash
# Get all events
curl http://localhost:3000/api/events

# Create an event
curl -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Event","date":"2025-03-01","status":"upcoming"}'

# Update an event
curl -X PUT "http://localhost:3000/api/events?id=YOUR-EVENT-ID" \
  -H "Content-Type: application/json" \
  -d '{"status":"past"}'

# Delete an event
curl -X DELETE "http://localhost:3000/api/events?id=YOUR-EVENT-ID"
```

### Using JavaScript/Fetch

```javascript
// Get events
const response = await fetch('/api/events?status=upcoming');
const { data } = await response.json();

// Create event
const response = await fetch('/api/events', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'New Event',
    date: '2025-03-15',
    status: 'upcoming'
  })
});

// Upload image
const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('eventId', eventId);

const response = await fetch('/api/events/upload-image', {
  method: 'POST',
  body: formData
});
```

---

## Future Enhancements

Consider implementing:
- Authentication & authorization
- Request validation with Zod
- Rate limiting
- API versioning (`/api/v1/...`)
- Pagination for large datasets
- Search and filtering improvements
- Webhooks for event notifications

---

**Last Updated**: December 22, 2025
