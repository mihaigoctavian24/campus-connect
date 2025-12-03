# Test Cases - CampusConnect

**Autori**: Mihai Octavian & Abbasi Pazeyazd Bianca-Maria  
**Versiune**: 1.0  
**Data**: Decembrie 2024  

---

## 1. Authentication

### TC-AUTH-001: Sign Up Success
**Given**: User pe pagina `/sign-up`  
**When**: User completează form cu date valide  
**Then**: User redirecționat către `/auth/verify-email`

### TC-AUTH-002: Login Success  
**Given**: User cu cont verificat  
**When**: User introduce email + password corect  
**Then**: User redirecționat către `/dashboard`

### TC-AUTH-003: Login Fail
**Given**: User pe pagina `/login`  
**When**: User introduce password greșit  
**Then**: Error message "Invalid credentials"

---

## 2. Student - Enrollment

### TC-ENROLL-001: Enroll Success
**Given**: Student autentificat + activitate OPEN  
**When**: Student click "Enroll"  
**Then**: Enrollment creat cu status PENDING sau APPROVED

### TC-ENROLL-002: Enroll Full Capacity
**Given**: Activitate cu capacity=20, enrolled=20  
**When**: Student încearcă enroll  
**Then**: Error "Activity at full capacity"

### TC-ENROLL-003: Already Enrolled
**Given**: Student deja înscris  
**When**: Student încearcă re-enroll  
**Then**: Error "Already enrolled"

---

## 3. Professor - Activity Creation

### TC-ACT-001: Create Activity Success
**Given**: Professor autentificat  
**When**: Professor completează form valid  
**Then**: Activitate creată cu status OPEN

### TC-ACT-002: Invalid Capacity
**Given**: Professor pe form create  
**When**: Professor setează capacity=0  
**Then**: Validation error "Min capacity 1"

### TC-ACT-003: Past Date
**Given**: Professor pe form create  
**When**: Professor setează start_date în trecut  
**Then**: Error "Start date must be in future"

---

## 4. Professor - Hours Validation

### TC-HOURS-001: Approve Hours
**Given**: Professor + cerere ore PENDING  
**When**: Professor click "Approve"  
**Then**: Hours status=APPROVED + student notificat

### TC-HOURS-002: Reject Hours
**Given**: Professor + cerere ore  
**When**: Professor click "Reject" cu motiv  
**Then**: Hours status=REJECTED + student notificat cu motiv

---

## 5. Admin - User Management

### TC-ADMIN-001: Change User Role
**Given**: Admin autentificat  
**When**: Admin schimbă role student → professor  
**Then**: User role updated + audit log entry

### TC-ADMIN-002: Bulk Delete Users
**Given**: Admin selectează 5 users  
**When**: Admin click "Delete selected"  
**Then**: Confirmation dialog → users șterse

---

## 6. Real-time Notifications

### TC-NOTIF-001: New Notification
**Given**: Student autentificat  
**When**: Professor aprobă enrollment  
**Then**: Toast notification + bell badge increment

### TC-NOTIF-002: Mark as Read
**Given**: Student cu 3 notificări unread  
**When**: Student click pe notificare  
**Then**: Notification marked read + badge decrement

---

## 7. File Upload

### TC-FILE-001: Upload Activity Image
**Given**: Professor creează activitate  
**When**: Professor uploadează imagine 2MB  
**Then**: Image uploaded + preview afișat

### TC-FILE-002: File Too Large
**Given**: Professor pe form  
**When**: Upload imagine 15MB  
**Then**: Error "Max file size 10MB"

---

## 8. QR Code Check-in

### TC-QR-001: Generate QR
**Given**: Professor + sesiune activă  
**When**: Professor click "Generate QR"  
**Then**: QR code generat + expires_at set

### TC-QR-002: Scan Valid QR
**Given**: Student + QR valid  
**When**: Student scanează QR  
**Then**: Attendance marcat + success message

### TC-QR-003: Scan Expired QR
**Given**: Student + QR expirat  
**When**: Student scanează  
**Then**: Error "QR code expired"

---

## 9. Certificate Generation

### TC-CERT-001: Generate Certificate
**Given**: Student cu 10h validate  
**When**: Student click "Generate certificate"  
**Then**: PDF generat + download link

### TC-CERT-002: Insufficient Hours
**Given**: Student cu 3h  
**When**: Student click "Generate"  
**Then**: Error "Minimum 10h required"

---

## 10. Search & Filters

### TC-SEARCH-001: Search by Title
**Given**: Student pe `/explore`  
**When**: Student caută "STEM"  
**Then**: Doar activități cu "STEM" în title afișate

### TC-FILTER-001: Filter by Category
**Given**: Student pe explore  
**When**: Select category "Community Service"  
**Then**: Doar activități category=COMMUNITY_SERVICE

---

**Document creat de**: Mihai Octavian & Abbasi Pazeyazd Bianca-Maria  
**Ultima actualizare**: Decembrie 2024  
**Versiune**: 1.0
