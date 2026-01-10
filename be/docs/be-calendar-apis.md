# Calendar Posts API Reference

## Authentication

All endpoints require authentication via HTTP-only cookie. Include cookies in requests.

---

## Endpoints

### Create Post

**POST** `/api/v1/posts`

Creates a new post with optional file attachment.

**Headers:**

- `Content-Type: multipart/form-data` (with file) or `application/json`

**Body (JSON):**

```json
{
  "title": "Product Launch",
  "content": "Exciting news about our new product!",
  "channels": ["twitter", "facebook"],
  "scheduled_time": "2026-01-15T10:00:00Z",
  "status": "scheduled"
}
```

**Body (Form Data):**

- `title` (string, required)
- `content` (string, optional)
- `channels` (JSON array string, required): `["twitter", "facebook"]`
- `scheduled_time` (string, required): ISO 8601 format
- `status` (string, optional): `draft`, `scheduled`, `published`, `failed`
- `file` (file, optional): Image, PDF, Excel, or Word document (max 10MB)

**curl (JSON):**

```bash
curl -X POST http://localhost:5000/api/v1/posts \
  -H "Content-Type: application/json" \
  -b "access_token=YOUR_TOKEN" \
  -d '{
    "title": "Product Launch",
    "content": "Exciting news!",
    "channels": ["twitter", "facebook"],
    "scheduled_time": "2026-01-15T10:00:00Z"
  }'
```

**curl (with file):**

```bash
curl -X POST http://localhost:5000/api/v1/posts \
  -b "access_token=YOUR_TOKEN" \
  -F "title=Product Launch" \
  -F "content=Exciting news!" \
  -F 'channels=["twitter", "facebook"]' \
  -F "scheduled_time=2026-01-15T10:00:00Z" \
  -F "file=@/path/to/image.png"
```

**Response (201):**

```json
{
  "success": true,
  "message": "Post created successfully",
  "data": {
    "post": {
      "id": "uuid",
      "user_id": "uuid",
      "title": "Product Launch",
      "content": "Exciting news!",
      "channels": ["twitter", "facebook"],
      "scheduled_time": "2026-01-15T10:00:00Z",
      "file_url": "https://...",
      "file_name": "image.png",
      "status": "draft",
      "created_at": "2026-01-10T10:00:00Z",
      "updated_at": "2026-01-10T10:00:00Z"
    }
  }
}
```

---

### Get Posts

**GET** `/api/v1/posts`

Retrieves all posts for the authenticated user with optional filters.

**Query Parameters:**

- `channel` (string, optional): Filter by channel (`twitter`, `facebook`, `instagram`, `youtube`, `linkedin`, `tiktok`, `pinterest`)
- `start_date` (string, optional): Filter posts on or after this date (`YYYY-MM-DD`)
- `end_date` (string, optional): Filter posts on or before this date (`YYYY-MM-DD`)

**curl:**

```bash
# All posts
curl http://localhost:5000/api/v1/posts \
  -b "access_token=YOUR_TOKEN"

# Filter by channel
curl "http://localhost:5000/api/v1/posts?channel=twitter" \
  -b "access_token=YOUR_TOKEN"

# Filter by date range
curl "http://localhost:5000/api/v1/posts?start_date=2026-01-01&end_date=2026-01-31" \
  -b "access_token=YOUR_TOKEN"
```

**Response (200):**

```json
{
  "success": true,
  "message": "Posts fetched successfully",
  "data": {
    "posts": [
      {
        "id": "uuid",
        "user_id": "uuid",
        "title": "Product Launch",
        "content": "Exciting news!",
        "channels": ["twitter", "facebook"],
        "scheduled_time": "2026-01-15T10:00:00Z",
        "file_url": null,
        "file_name": null,
        "status": "scheduled",
        "created_at": "2026-01-10T10:00:00Z",
        "updated_at": "2026-01-10T10:00:00Z"
      }
    ]
  }
}
```

---

### Get Post by ID

**GET** `/api/v1/posts/:id`

Retrieves a single post by its ID.

**curl:**

```bash
curl http://localhost:5000/api/v1/posts/POST_UUID \
  -b "access_token=YOUR_TOKEN"
```

**Response (200):**

```json
{
  "success": true,
  "message": "Post fetched successfully",
  "data": {
    "post": {
      "id": "uuid",
      "user_id": "uuid",
      "title": "Product Launch",
      "content": "Exciting news!",
      "channels": ["twitter", "facebook"],
      "scheduled_time": "2026-01-15T10:00:00Z",
      "file_url": "https://...",
      "file_name": "image.png",
      "status": "scheduled",
      "created_at": "2026-01-10T10:00:00Z",
      "updated_at": "2026-01-10T10:00:00Z"
    }
  }
}
```

---

### Update Post

**PUT** `/api/v1/posts/:id`

Updates an existing post. All fields are optional.

**curl (JSON):**

```bash
curl -X PUT http://localhost:5000/api/v1/posts/POST_UUID \
  -H "Content-Type: application/json" \
  -b "access_token=YOUR_TOKEN" \
  -d '{
    "title": "Updated Title",
    "status": "scheduled"
  }'
```

**curl (with file replacement):**

```bash
curl -X PUT http://localhost:5000/api/v1/posts/POST_UUID \
  -b "access_token=YOUR_TOKEN" \
  -F "title=Updated Title" \
  -F "file=@/path/to/new-image.png"
```

**Response (200):**

```json
{
  "success": true,
  "message": "Post updated successfully",
  "data": {
    "post": {
      "id": "uuid",
      "user_id": "uuid",
      "title": "Updated Title",
      "content": "Exciting news!",
      "channels": ["twitter", "facebook"],
      "scheduled_time": "2026-01-15T10:00:00Z",
      "file_url": "https://...",
      "file_name": "new-image.png",
      "status": "scheduled",
      "created_at": "2026-01-10T10:00:00Z",
      "updated_at": "2026-01-10T11:00:00Z"
    }
  }
}
```

---

### Delete Post

**DELETE** `/api/v1/posts/:id`

Soft deletes a post by its ID.

**curl:**

```bash
curl -X DELETE http://localhost:5000/api/v1/posts/POST_UUID \
  -b "access_token=YOUR_TOKEN"
```

**Response (200):**

```json
{
  "success": true,
  "message": "Post deleted successfully"
}
```

---

## Channels

Supported channels:

- `twitter`
- `facebook`
- `instagram`
- `youtube`
- `linkedin`
- `tiktok`
- `pinterest`

---

## Status Values

- `draft` - Post is saved but not scheduled
- `scheduled` - Post is scheduled for publishing
- `published` - Post has been published
- `failed` - Post failed to publish

---

## Error Responses

**401 Unauthorized:**

```json
{
  "success": false,
  "message": "Access token is required",
  "code": "ACCESS_TOKEN_REQUIRED"
}
```

**403 Forbidden:**

```json
{
  "success": false,
  "message": "You do not have permission to access this post",
  "code": "POST_ACCESS_DENIED"
}
```

**404 Not Found:**

```json
{
  "success": false,
  "message": "Post not found",
  "code": "POST_NOT_FOUND"
}
```

**400 Validation Error:**

```json
{
  "success": false,
  "message": "Validation failed",
  "code": "VALIDATION_ERROR",
  "errors": {
    "title": ["Required"],
    "channels": ["At least one channel is required"]
  }
}
```

---

## File Upload

- Max size: 10MB
- Allowed types: Images (jpeg, png, gif, webp, svg), PDF, Excel (.xls, .xlsx), Word (.doc, .docx)
- Files are stored in Supabase Storage bucket: `content-calendar-attachments`
- Path format: `users/{user_id}/posts/{post_id}/{filename}`
