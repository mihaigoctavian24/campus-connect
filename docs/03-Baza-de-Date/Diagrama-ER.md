# Campus Connect - Database Schema Diagram

## Entity Relationship Diagram

```mermaid
erDiagram
    %% Core User System
    AUTH_USERS ||--|| PROFILES : "extends"
    PROFILES ||--o{ ACTIVITIES : "creates"
    PROFILES ||--o{ ENROLLMENTS : "enrolls"
    PROFILES ||--o{ NOTIFICATIONS : "receives"
    PROFILES ||--o{ CERTIFICATES : "earns"
    PROFILES ||--o{ SAVED_OPPORTUNITIES : "saves"
    PROFILES ||--o{ HOURS_REQUESTS : "submits"
    PROFILES ||--o{ AUDIT_LOGS : "performs"
    PROFILES }o--|| DEPARTMENTS : "belongs to"

    %% Activity Organization
    DEPARTMENTS ||--o{ ACTIVITIES : "organizes"
    DEPARTMENTS ||--o{ EMAIL_TEMPLATES : "customizes"
    CATEGORIES ||--o{ ACTIVITIES : "categorizes"

    %% Activities and Sessions
    ACTIVITIES ||--o{ SESSIONS : "contains"
    ACTIVITIES ||--o{ ENROLLMENTS : "has"
    ACTIVITIES ||--o{ SAVED_OPPORTUNITIES : "bookmarked as"
    ACTIVITIES ||--o{ HOURS_REQUESTS : "logs hours for"
    ACTIVITIES ||--o{ CERTIFICATES : "awards"
    ACTIVITIES ||--o{ NOTIFICATIONS : "triggers"

    %% Enrollments and Attendance
    ENROLLMENTS ||--|| ATTENDANCE : "tracked by"
    ENROLLMENTS ||--o| FEEDBACK : "receives"
    ENROLLMENTS ||--o| CERTIFICATES : "generates"
    ENROLLMENTS ||--o{ HOURS_REQUESTS : "requests hours"
    SESSIONS ||--o{ ATTENDANCE : "records"

    %% Validation and Approval
    PROFILES ||--o{ ATTENDANCE : "validates (professor)"
    PROFILES ||--o{ HOURS_REQUESTS : "approves (professor)"
    PROFILES ||--o{ CERTIFICATES : "issues (admin)"
    PROFILES ||--o{ FEEDBACK : "moderates (admin)"
    PROFILES ||--o{ EMAIL_TEMPLATES : "creates (admin)"
    PROFILES ||--o{ PLATFORM_SETTINGS : "updates (admin)"
    PROFILES ||--o{ ENROLLMENTS : "validates attendance"

    %% Table Definitions

    AUTH_USERS {
        uuid id PK
        text email
        text encrypted_password
        timestamptz created_at
    }

    PROFILES {
        uuid id PK,FK
        text email UK
        text first_name
        text last_name
        text phone
        text profile_picture_url
        text faculty
        text specialization
        int year
        text program_type
        text role "STUDENT|PROFESSOR|ADMIN"
        boolean is_active
        boolean email_verified
        uuid department_id FK
        timestamptz last_login
        timestamptz created_at
        timestamptz updated_at
        timestamptz deleted_at
    }

    DEPARTMENTS {
        uuid id PK
        text name UK
        text short_code UK
        text description
        text contact_name
        text contact_email
        text logo_url
        boolean is_active
        timestamptz created_at
        timestamptz updated_at
    }

    CATEGORIES {
        uuid id PK
        text name UK
        text description
        text color
        text icon
        boolean is_active
        timestamptz created_at
        timestamptz updated_at
    }

    ACTIVITIES {
        uuid id PK
        text title
        text description
        text image_url
        date date
        time start_time
        time end_time
        text location
        int max_participants
        int current_participants
        text eligibility_criteria
        text status "OPEN|IN_PROGRESS|COMPLETED|CANCELLED"
        uuid category_id FK
        uuid department_id FK
        uuid created_by FK
        tsvector search_vector
        timestamptz created_at
        timestamptz updated_at
        timestamptz deleted_at
    }

    SESSIONS {
        uuid id PK
        uuid activity_id FK
        date date
        time start_time
        time end_time
        text location
        text status "SCHEDULED|IN_PROGRESS|COMPLETED|CANCELLED"
        int max_participants
        text qr_code_data "Encrypted QR payload"
        timestamptz qr_expires_at
        text location_hash "Geohash for GPS ±15m"
        boolean reminder_sent
        timestamptz created_at
        timestamptz updated_at
    }

    ENROLLMENTS {
        uuid id PK
        uuid activity_id FK
        uuid user_id FK
        text status "PENDING|CONFIRMED|CANCELLED|WAITLISTED"
        timestamptz enrolled_at
        timestamptz cancelled_at
        text attendance_status "PENDING|PRESENT|ABSENT"
        timestamptz attendance_validated_at
        uuid validated_by FK
        boolean feedback_submitted
        timestamptz created_at
        timestamptz updated_at
        timestamptz deleted_at
    }

    ATTENDANCE {
        uuid id PK
        uuid session_id FK
        uuid enrollment_id FK
        uuid user_id FK
        text status "PRESENT|ABSENT|EXCUSED|LATE"
        text check_in_method "QR_CODE|MANUAL|GPS|BULK"
        timestamptz checked_in_at
        uuid checked_in_by FK
        numeric hours_credited
        numeric gps_latitude
        numeric gps_longitude
        numeric gps_accuracy
        text notes
        timestamptz created_at
        timestamptz updated_at
    }

    HOURS_REQUESTS {
        uuid id PK
        uuid enrollment_id FK
        uuid user_id FK
        uuid activity_id FK
        numeric hours "1-24"
        date date
        text description
        text[] evidence_urls
        text status "PENDING|APPROVED|REJECTED"
        text professor_notes
        uuid approved_by FK
        timestamptz approved_at
        text rejection_reason
        timestamptz created_at
        timestamptz updated_at
    }

    SAVED_OPPORTUNITIES {
        uuid id PK
        uuid user_id FK
        uuid activity_id FK
        timestamptz saved_at
    }

    NOTIFICATIONS {
        uuid id PK
        uuid user_id FK
        uuid related_activity_id FK
        text type
        text title
        text message
        boolean is_read
        timestamptz read_at
        boolean email_sent
        timestamptz email_sent_at
        timestamptz created_at
    }

    CERTIFICATES {
        uuid id PK
        uuid user_id FK
        uuid activity_id FK
        uuid enrollment_id FK,UK
        text certificate_url
        text certificate_number UK
        timestamptz issued_at
        uuid issued_by FK
        timestamptz created_at
    }

    FEEDBACK {
        uuid id PK
        uuid enrollment_id FK,UK
        int rating "1-5"
        text comment
        boolean is_moderated
        boolean is_approved
        uuid moderated_by FK
        timestamptz moderated_at
        timestamptz created_at
        timestamptz updated_at
    }

    EMAIL_TEMPLATES {
        uuid id PK
        text template_type UK
        text subject
        text body
        jsonb variables
        uuid department_id FK
        uuid created_by FK
        timestamptz updated_at
    }

    AUDIT_LOGS {
        uuid id PK
        uuid user_id FK
        text action
        text entity_type
        uuid entity_id
        jsonb details
        text ip_address
        text user_agent
        timestamptz created_at
    }

    PLATFORM_SETTINGS {
        uuid id PK
        text key UK
        jsonb value
        text description
        uuid updated_by FK
        timestamptz updated_at
    }
```

## Database Statistics

| Table | Rows | RLS Enabled | Purpose |
|-------|------|-------------|---------|
| **profiles** | 1 | ✅ | User accounts (students, professors, admins) |
| **departments** | 6 | ✅ | University departments |
| **categories** | 6 | ✅ | Activity categorization |
| **activities** | 5 | ✅ | Volunteer opportunities |
| **sessions** | 0 | ✅ | Activity sessions with QR/GPS validation |
| **enrollments** | 5 | ✅ | Student enrollments in activities |
| **attendance** | 0 | ✅ | Session attendance tracking |
| **hours_requests** | 0 | ✅ | Hours logging with validation |
| **saved_opportunities** | 0 | ✅ | Student bookmarks |
| **notifications** | 4 | ✅ | In-app and email notifications |
| **certificates** | 0 | ✅ | Generated participation certificates |
| **feedback** | 0 | ✅ | Student activity feedback |
| **email_templates** | 6 | ✅ | Customizable email templates |
| **audit_logs** | 14 | ✅ | System audit trail |
| **platform_settings** | 11 | ✅ | Global configuration |

## Key Relationships

### 1️⃣ User Management
- **auth.users** → **profiles** (1:1) - Extends Supabase Auth
- **profiles** ← **departments** (N:1) - Department affiliation

### 2️⃣ Activity Organization
- **activities** ← **categories** (N:1) - Activity categorization
- **activities** ← **departments** (N:1) - Department ownership
- **activities** ← **profiles** (N:1 via created_by) - Creator tracking
- **activities** → **sessions** (1:N) - Multi-session activities

### 3️⃣ Enrollment Flow
```
STUDENT → enrolls in → ACTIVITY
       ↓
  ENROLLMENT (status: PENDING → CONFIRMED)
       ↓
  SESSIONS → ATTENDANCE (QR/GPS validation)
       ↓
  HOURS_REQUESTS (professor approval)
       ↓
  CERTIFICATE (if approved)
```

### 4️⃣ Attendance Validation
- **Manual**: Professor marks attendance directly
- **QR Code**: Student scans QR at session location
- **GPS**: Location-based automatic check-in (±15m accuracy)
- **Bulk**: Professor uploads attendance list

### 5️⃣ Hours Workflow
```
STUDENT → creates HOURS_REQUEST
       ↓
PROFESSOR → reviews evidence → APPROVES/REJECTS
       ↓
APPROVED → hours added to student total
```

### 6️⃣ Notification System
- Activity updates → enrolled students
- Enrollment confirmations → student
- Attendance validation → student
- Certificate ready → student
- Hours approved/rejected → student
- Session reminders → 24h and 1h before

## Security Features

### Row Level Security (RLS)
✅ All tables have RLS enabled

### Soft Deletes
- `profiles.deleted_at`
- `activities.deleted_at`
- `enrollments.deleted_at`

### Audit Trail
- `audit_logs` tracks all critical actions
- Records: user, action, entity, IP, user agent

### Data Validation
- Check constraints on enums (status fields)
- Numeric ranges (hours: 1-24, rating: 1-5, year: 1-6)
- Unique constraints (emails, certificate numbers)

## Performance Optimizations

### Indexes
- **profiles**: email, role, faculty
- **activities**: date, status, category, created_by, date+status composite
- **enrollments**: activity, user, status, attendance_status
- **notifications**: user, unread (filtered), created_at DESC
- **audit_logs**: user, action, created_at DESC, entity composite

### Full-Text Search
- **activities.search_vector**: Weighted search on title (A), description (B), location (C)

### Geospatial
- **sessions.location_hash**: Geohash for efficient proximity queries (±15m)

## Data Flow Examples

### Student Enrolls in Activity
```
1. Student browses /explore
2. Clicks "Enroll" → creates ENROLLMENT (status: CONFIRMED)
3. activities.current_participants += 1
4. NOTIFICATION created for student
5. EMAIL sent to student (enrollment_confirmed template)
```

### Professor Validates Attendance (QR Code)
```
1. Professor starts session → generates QR code
2. sessions.qr_code_data = encrypted payload
3. sessions.qr_expires_at = session end time
4. Student scans QR → validates payload + GPS (optional)
5. ATTENDANCE created (check_in_method: QR_CODE)
6. enrollments.attendance_status = PRESENT
7. NOTIFICATION sent to student
```

### Student Requests Hours
```
1. Student completes activity
2. Creates HOURS_REQUEST with evidence (photos, docs)
3. Professor receives notification
4. Professor reviews → APPROVES or REJECTS
5. If approved: hours added to student total
6. NOTIFICATION + EMAIL sent to student
7. If all hours complete → CERTIFICATE generated
```

## Notes

- **UUID Primary Keys**: All tables use UUID for distributed system compatibility
- **Timestamps**: All tables have created_at, many have updated_at
- **Foreign Key Constraints**: Maintain referential integrity with CASCADE/SET NULL
- **JSONB Fields**: Flexible storage for details, variables, platform settings
- **Array Fields**: hours_requests.evidence_urls for multiple file uploads
- **Generated Columns**: activities.search_vector auto-updated on title/description changes
