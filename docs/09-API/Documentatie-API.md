# Documentație API - CampusConnect

**Autori**: Mihai Octavian & Abbasi Pazeyazd Bianca-Maria  
**Versiune**: 1.0  
**Data**: Decembrie 2024  

---

## 1. Overview API

### 1.1 Base URL

**Production**: `https://campusconnect.ro/api`  
**Development**: `http://localhost:3000/api`

### 1.2 Authentication

**Method**: Session cookies (HTTP-only)  
**Flow**: Supabase Auth → JWT token → Cookie

**Headers**:
```
Cookie: sb-access-token=eyJ...
Cookie: sb-refresh-token=eyJ...
```

---

## 2. Activities Endpoints

### GET `/api/activities`

**Description**: List all open activities

**Query Parameters**:
- `category` (optional): Filter by category
- `search` (optional): Search în title/description
- `limit` (default: 20): Items per page
- `offset` (default: 0): Pagination offset

**Response 200**:
```json
{
  "activities": [
    {
      "id": "uuid",
      "title": "STEM Mentorship",
      "description": "...",
      "category": "ACADEMIC_SUPPORT",
      "start_date": "2025-01-15T10:00:00Z",
      "capacity": 20,
      "enrolled_count": 5,
      "status": "OPEN"
    }
  ],
  "total": 42
}
```

### POST `/api/activities`

**Description**: Create new activity (Professor/Admin only)

**Request Body**:
```json
{
  "title": "STEM Mentorship",
  "description": "Help first-year students...",
  "category": "ACADEMIC_SUPPORT",
  "start_date": "2025-01-15T10:00:00Z",
  "location": "Corp A, Sala 101",
  "capacity": 20,
  "hours_awarded": 2
}
```

**Response 201**:
```json
{
  "id": "uuid",
  "title": "STEM Mentorship",
  "status": "OPEN",
  "created_at": "2024-12-02T12:00:00Z"
}
```

---

## 3. Enrollments Endpoints

### POST `/api/enrollments`

**Description**: Enroll in activity

**Request Body**:
```json
{
  "activity_id": "uuid",
  "motivation": "I want to help because..."
}
```

**Response 201**:
```json
{
  "id": "uuid",
  "status": "PENDING",
  "created_at": "2024-12-02T12:00:00Z"
}
```

### PATCH `/api/enrollments/[id]/approve`

**Description**: Approve enrollment (Professor/Admin)

**Response 200**:
```json
{
  "id": "uuid",
  "status": "APPROVED"
}
```

---

## 4. Volunteer Hours Endpoints

### POST `/api/hours`

**Description**: Submit hours for validation

**Request Body**:
```json
{
  "activity_id": "uuid",
  "hours": 2.5,
  "date": "2025-01-15",
  "description": "Mentored 3 students..."
}
```

### PATCH `/api/hours/[id]/validate`

**Description**: Validate hours (Professor)

**Request Body**:
```json
{
  "status": "APPROVED",
  "notes": "Great work!"
}
```

---

## 5. Notifications Endpoints

### GET `/api/notifications`

**Query Parameters**:
- `limit` (default: 20)
- `offset` (default: 0)
- `unread_only` (default: false)

**Response 200**:
```json
{
  "notifications": [
    {
      "id": "uuid",
      "title": "Enrollment confirmed",
      "message": "Your enrollment was approved",
      "is_read": false,
      "created_at": "2024-12-02T12:00:00Z"
    }
  ],
  "unread_count": 3,
  "total": 15
}
```

### PATCH `/api/notifications/[id]/read`

**Description**: Mark notification as read

---

## 6. Error Responses

### 400 Bad Request
```json
{
  "error": "Validation failed",
  "details": {
    "title": ["Minim 10 caractere"]
  }
}
```

### 401 Unauthorized
```json
{
  "error": "Authentication required"
}
```

### 403 Forbidden
```json
{
  "error": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error",
  "message": "An unexpected error occurred"
}
```

---

**Document creat de**: Mihai Octavian & Abbasi Pazeyazd Bianca-Maria  
**Ultima actualizare**: Decembrie 2024  
**Versiune**: 1.0
