# Ghid Administrator - CampusConnect

**Autori**: Mihai Octavian & Abbasi Pazeyazd Bianca-Maria  
**Versiune**: 1.0  
**Data**: Decembrie 2024  

---

## 1. User Management

### 1.1 Listă Utilizatori

**Pas 1**: Admin Dashboard → "Users"

**Vezi**:
- Total users (Students, Professors, Admins)
- Recent registrations
- User activity status

### 1.2 Schimbare Rol

**Pas 1**: Users → Search user

**Pas 2**: Click user → "Change Role"

**Pas 3**: Select new role (STUDENT → PROFESSOR)

**Pas 4**: Confirm → User notificat

**Pas 5**: Audit log entry creat

### 1.3 Bulk Operations

**Pas 1**: Select multiple users (checkbox)

**Pas 2**: Actions dropdown:
- Bulk delete
- Export to CSV
- Send announcement

---

## 2. Activity Moderation

### 2.1 Pending Activities

**Pas 1**: Dashboard → "Pending Approvals"

**Pas 2**: Review activity details

**Pas 3**:
- **Approve**: Activity devine OPEN
- **Request Changes**: Professor notificat
- **Reject**: Activity ștearsă + profesor notificat

### 2.2 Activity Monitoring

**Pas 1**: "All Activities" → Filter by status

**Vezi**:
- Activities by category
- Enrollment trends
- Completion rates

**Acțiuni**:
- Force close activity
- Extend deadline
- Edit any activity

---

## 3. Platform Configuration

### 3.1 General Settings

**Pas 1**: Settings → "General"

**Configurări**:
- Platform name
- University name
- Support email
- Terms & conditions URL

### 3.2 Capacity Limits

**Pas 1**: Settings → "Limits"

**Setări**:
- Max activity participants: 100
- Max file size: 10MB
- Max activities per professor: 20
- Min hours for certificate: 10

### 3.3 Email Templates

**Pas 1**: Settings → "Email Templates"

**Pas 2**: Select template type (enrollment_confirmed, hours_approved, etc.)

**Pas 3**: Edit HTML content

**Pas 4**: Preview → Save

**Variables**: Use `{{student_name}}`, `{{activity_title}}`, etc.

---

## 4. Reports & Analytics

### 4.1 Platform Overview

**Dashboard** arată:
- Total users (breakdown by role)
- Total activities (by status)
- Total volunteer hours logged
- Growth metrics (week-over-week)

### 4.2 Custom Reports

**Pas 1**: Reports → "Create Custom Report"

**Pas 2**: Select:
- Date range
- Metrics (users, activities, hours)
- Group by (category, date, location)

**Pas 3**: Generate → Export CSV/PDF

### 4.3 Popular Reports

- **Monthly Activity**: New users, activities, hours per month
- **Category Breakdown**: Activities per category
- **Professor Leaderboard**: Most active professors
- **Student Engagement**: Students by total hours

---

## 5. Audit Logs

**Pas 1**: Admin → "Audit Logs"

**Vezi istoric**:
- User actions (create, update, delete)
- Resource affected (activity, enrollment, user)
- Timestamp
- IP address
- User agent

**Filtre**:
- By user
- By action type
- By date range

**Export**: CSV pentru compliance

---

## 6. System Monitoring

### 6.1 Health Checks

**Dashboard** arată:
- Database status: ✅ Healthy
- Auth service: ✅ Operational
- Storage: ✅ Available (500MB used / 500MB limit)

### 6.2 Performance

**Metrics**:
- Average API response time: 120ms
- Slow queries (>1s): 0 last 24h
- Error rate: 0.1%

### 6.3 Alerts

**Configure alerts pentru**:
- Database capacity >80%
- Error rate >5%
- Failed auth attempts >100/hour

---

## 7. Certificate Management

**Pas 1**: Admin → "Certificates"

**Pas 2**: Vezi toate certificatele generate

**Acțiuni**:
- Revoke certificate (dacă ore invalidate)
- Regenerate certificate (dacă template updated)
- Bulk export

---

## 8. Emergency Actions

### 8.1 Force Logout All Users

**Uz**: Security breach

**Pas 1**: Settings → "Security"

**Pas 2**: Click "Force Logout All"

**Pas 3**: Confirm → Toate sesiunile invalidate

### 8.2 Disable Signups

**Uz**: Mentenanță sau incident

**Pas 1**: Settings → "General"

**Pas 2**: Toggle "Allow New Signups" → OFF

**Pas 3**: Message afișat pe signup page

### 8.3 Maintenance Mode

**Pas 1**: Settings → "Maintenance Mode"

**Pas 2**: Enable → Platform read-only

**Pas 3**: Custom message pentru users

---

## 9. Best Practices

✅ **Do**:
- Review pending activities daily
- Monitor audit logs weekly
- Backup data monthly (Supabase auto-backup enabled)
- Respond to user reports <24h

❌ **Don't**:
- Nu șterge users fără backup
- Nu schimba settings critice fără testing
- Nu ignora audit log anomalies

---

## 10. FAQ

**Q: Cum restaurez un user șters?**  
A: Supabase Dashboard → Database → Backups → Restore to point before deletion

**Q: Cum schimb logo-ul platformei?**  
A: Settings → Branding → Upload new logo (max 1MB)

**Q: Pot vedea mesajele private între users?**  
A: Nu, din motive de privacy. Doar metadata (sender, recipient, timestamp).

---

**Document creat de**: Mihai Octavian & Abbasi Pazeyazd Bianca-Maria  
**Ultima actualizare**: Decembrie 2024  
**Versiune**: 1.0
