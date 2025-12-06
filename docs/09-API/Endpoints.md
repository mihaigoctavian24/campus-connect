# Endpoints - CampusConnect

**Autori**: Mihai Octavian & Abbasi Pazeyazd Bianca-Maria  
**Versiune**: 1.0  
**Data**: Decembrie 2024  

---

## Lista Completă Endpoints

### Authentication
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/signup` | Public | Create account |
| POST | `/api/auth/login` | Public | Login |
| POST | `/api/auth/logout` | Auth | Logout |
| POST | `/api/auth/reset-password` | Public | Request password reset |

### Activities
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/activities` | Public | List activities |
| GET | `/api/activities/[id]` | Public | Get activity details |
| POST | `/api/activities` | Professor/Admin | Create activity |
| PATCH | `/api/activities/[id]` | Professor/Admin | Update activity |
| DELETE | `/api/activities/[id]` | Professor/Admin | Delete activity |

### Enrollments
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/enrollments` | Auth | List user enrollments |
| POST | `/api/enrollments` | Student | Enroll in activity |
| PATCH | `/api/enrollments/[id]/approve` | Professor | Approve enrollment |
| PATCH | `/api/enrollments/[id]/reject` | Professor | Reject enrollment |
| DELETE | `/api/enrollments/[id]` | Student | Cancel enrollment |

### Volunteer Hours
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/hours` | Auth | List user hours |
| POST | `/api/hours` | Student | Submit hours |
| PATCH | `/api/hours/[id]/validate` | Professor | Validate hours |

### Notifications
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/notifications` | Auth | List notifications |
| PATCH | `/api/notifications/[id]/read` | Auth | Mark as read |
| PATCH | `/api/notifications/read-all` | Auth | Mark all as read |
| DELETE | `/api/notifications/[id]` | Auth | Delete notification |

### Certificates
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/certificates` | Auth | List user certificates |
| POST | `/api/certificates/generate` | Student | Generate certificate |

### Admin
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/admin/users` | Admin | List all users |
| PATCH | `/api/admin/users/[id]/role` | Admin | Change user role |
| DELETE | `/api/admin/users/[id]` | Admin | Delete user |

---

**Document creat de**: Mihai Octavian & Abbasi Pazeyazd Bianca-Maria  
**Ultima actualizare**: Decembrie 2024  
**Versiune**: 1.0
