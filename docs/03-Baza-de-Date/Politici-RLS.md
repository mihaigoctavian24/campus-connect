# Politici Row Level Security (RLS) - CampusConnect

**Autori**: Mihai Octavian & Abbasi Pazeyazd Bianca-Maria  
**Versiune**: 1.0  
**Data**: Decembrie 2024  

---

## 1. Introducere în RLS

**Row Level Security (RLS)** este mecanismul principal de securitate în CampusConnect, aplicat la nivel de PostgreSQL pentru a filtra automat datele bazat pe contextul utilizatorului autentificat.

### 1.1 Avantaje RLS

✅ **Security by Default**: Imposibil de bypass (chiar și cu direct DB access)  
✅ **Zero Trust**: Fiecare query verificat automat  
✅ **Performance**: Index-backed, optimizat de PostgreSQL  
✅ **Auditabil**: Politici vizibile și testabile  
✅ **Centralizat**: Logic în DB, nu scattered în application code  

### 1.2 Funcționare

```sql
-- Utilizatorul autentificat este disponibil în toate query-urile via:
auth.uid() -- Returns UUID al user-ului din Supabase Auth

-- Exemplu politică:
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (id = auth.uid());
```

---

## 2. Politici pe Tabela `profiles`

### 2.1 SELECT Policies

```sql
-- Studenți/Profesori pot vedea propriul profil
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (id = auth.uid());

-- Profesori pot vedea profile studenți înscriși la activitățile lor
CREATE POLICY "Professors can view enrolled students"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM enrollments e
      JOIN activities a ON a.id = e.activity_id
      WHERE e.user_id = profiles.id
        AND a.created_by = auth.uid()
        AND e.deleted_at IS NULL
    )
  );

-- Admins pot vedea toate profilurile
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );
```

### 2.2 UPDATE Policies

```sql
-- Users pot edita propriul profil (dar nu rolul!)
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (
    id = auth.uid() AND
    role = (SELECT role FROM profiles WHERE id = auth.uid()) -- Prevent role self-promotion
  );

-- Admins pot edita orice profil
CREATE POLICY "Admins can update any profile"
  ON public.profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );
```

### 2.3 INSERT Policies

```sql
-- Doar Supabase Auth poate crea profile (via trigger)
-- No direct INSERT policy needed (handled by auth.users trigger)
```

### 2.4 DELETE Policies

```sql
-- Admins pot șterge (soft delete) profile
CREATE POLICY "Admins can delete profiles"
  ON public.profiles FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );
```

---

## 3. Politici pe Tabela `activities`

### 3.1 SELECT Policies

```sql
-- Studenți pot vedea activități OPEN și viitoare
CREATE POLICY "Students can view open activities"
  ON public.activities FOR SELECT
  USING (
    status = 'OPEN' AND
    date >= CURRENT_DATE AND
    deleted_at IS NULL
  );

-- Studenți pot vedea activități la care sunt înscriși (orice status)
CREATE POLICY "Students can view enrolled activities"
  ON public.activities FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM enrollments
      WHERE activity_id = activities.id
        AND user_id = auth.uid()
        AND deleted_at IS NULL
    )
  );

-- Profesori pot vedea propriile activități
CREATE POLICY "Professors can view own activities"
  ON public.activities FOR SELECT
  USING (created_by = auth.uid());

-- Admins pot vedea toate activitățile
CREATE POLICY "Admins can view all activities"
  ON public.activities FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );
```

### 3.2 INSERT Policies

```sql
-- Doar profesori pot crea activități
CREATE POLICY "Professors can create activities"
  ON public.activities FOR INSERT
  WITH CHECK (
    auth.uid() = created_by AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('PROFESSOR', 'ADMIN')
    )
  );
```

### 3.3 UPDATE Policies

```sql
-- Profesori pot edita propriile activități
CREATE POLICY "Professors can update own activities"
  ON public.activities FOR UPDATE
  USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());

-- Admins pot edita orice activitate
CREATE POLICY "Admins can update any activity"
  ON public.activities FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );
```

### 3.4 DELETE Policies

```sql
-- Profesori pot șterge propriile activități
CREATE POLICY "Professors can delete own activities"
  ON public.activities FOR DELETE
  USING (created_by = auth.uid());

-- Admins pot șterge orice activitate
CREATE POLICY "Admins can delete any activity"
  ON public.activities FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );
```

---

## 4. Politici pe Tabela `enrollments`

### 4.1 SELECT Policies

```sql
-- Studenți pot vedea propriile enrollments
CREATE POLICY "Students can view own enrollments"
  ON public.enrollments FOR SELECT
  USING (user_id = auth.uid());

-- Profesori pot vedea enrollments la propriile activități
CREATE POLICY "Professors can view enrollments for own activities"
  ON public.enrollments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM activities
      WHERE id = enrollments.activity_id
        AND created_by = auth.uid()
    )
  );

-- Admins pot vedea toate enrollments
CREATE POLICY "Admins can view all enrollments"
  ON public.enrollments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );
```

### 4.2 INSERT Policies

```sql
-- Studenți pot crea enrollments pentru ei înșiși
CREATE POLICY "Students can enroll themselves"
  ON public.enrollments FOR INSERT
  WITH CHECK (
    user_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'STUDENT'
    ) AND
    EXISTS (
      SELECT 1 FROM activities
      WHERE id = activity_id
        AND status = 'OPEN'
        AND date >= CURRENT_DATE
        AND deleted_at IS NULL
    )
  );
```

### 4.3 UPDATE Policies

```sql
-- Studenți pot anula propriile enrollments
CREATE POLICY "Students can cancel own enrollments"
  ON public.enrollments FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (
    user_id = auth.uid() AND
    status = 'CANCELLED' -- Pot doar anula, nu schimba alte statusuri
  );

-- Profesori pot aproba/respinge enrollments la propriile activități
CREATE POLICY "Professors can manage enrollments for own activities"
  ON public.enrollments FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM activities
      WHERE id = enrollments.activity_id
        AND created_by = auth.uid()
    )
  );

-- Admins pot gestiona toate enrollments
CREATE POLICY "Admins can manage all enrollments"
  ON public.enrollments FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );
```

### 4.4 DELETE Policies

```sql
-- Doar admins pot șterge enrollments
CREATE POLICY "Admins can delete enrollments"
  ON public.enrollments FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );
```

---

## 5. Politici pe Tabela `sessions`

### 5.1 SELECT Policies

```sql
-- Profesori pot vedea sessions pentru propriile activități
CREATE POLICY "Professors can view own activity sessions"
  ON public.sessions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM activities
      WHERE id = sessions.activity_id
        AND created_by = auth.uid()
    )
  );

-- Studenți pot vedea sessions pentru activități la care sunt înscriși
CREATE POLICY "Students can view enrolled activity sessions"
  ON public.sessions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM enrollments e
      WHERE e.activity_id = sessions.activity_id
        AND e.user_id = auth.uid()
        AND e.deleted_at IS NULL
    )
  );

-- Admins pot vedea toate sessions
CREATE POLICY "Admins can view all sessions"
  ON public.sessions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );
```

### 5.2 INSERT/UPDATE/DELETE Policies

```sql
-- Profesori pot gestiona sessions pentru propriile activități
CREATE POLICY "Professors can manage own activity sessions"
  ON public.sessions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM activities
      WHERE id = sessions.activity_id
        AND created_by = auth.uid()
    )
  );

-- Admins pot gestiona toate sessions
CREATE POLICY "Admins can manage all sessions"
  ON public.sessions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );
```

---

## 6. Politici pe Tabela `attendance`

### 6.1 SELECT Policies

```sql
-- Studenți pot vedea propria attendance
CREATE POLICY "Students can view own attendance"
  ON public.attendance FOR SELECT
  USING (user_id = auth.uid());

-- Profesori pot vedea attendance pentru propriile activități
CREATE POLICY "Professors can view attendance for own activities"
  ON public.attendance FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM sessions s
      JOIN activities a ON a.id = s.activity_id
      WHERE s.id = attendance.session_id
        AND a.created_by = auth.uid()
    )
  );

-- Admins pot vedea toată attendance
CREATE POLICY "Admins can view all attendance"
  ON public.attendance FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );
```

### 6.2 INSERT Policies

```sql
-- Studenți pot crea attendance (QR check-in) pentru ei înșiși
CREATE POLICY "Students can check in themselves"
  ON public.attendance FOR INSERT
  WITH CHECK (
    user_id = auth.uid() AND
    check_in_method IN ('QR_CODE', 'GPS') AND
    EXISTS (
      SELECT 1 FROM enrollments
      WHERE id = attendance.enrollment_id
        AND user_id = auth.uid()
        AND status = 'CONFIRMED'
    )
  );

-- Profesori pot crea attendance (manual) pentru studenții lor
CREATE POLICY "Professors can mark attendance for own activities"
  ON public.attendance FOR INSERT
  WITH CHECK (
    check_in_method IN ('MANUAL', 'BULK') AND
    EXISTS (
      SELECT 1 FROM sessions s
      JOIN activities a ON a.id = s.activity_id
      WHERE s.id = attendance.session_id
        AND a.created_by = auth.uid()
    )
  );
```

### 6.3 UPDATE/DELETE Policies

```sql
-- Doar profesori pot edita/șterge attendance
CREATE POLICY "Professors can manage attendance for own activities"
  ON public.attendance FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM sessions s
      JOIN activities a ON a.id = s.activity_id
      WHERE s.id = attendance.session_id
        AND a.created_by = auth.uid()
    )
  );

-- Admins pot gestiona toată attendance
CREATE POLICY "Admins can manage all attendance"
  ON public.attendance FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );
```

---

## 7. Politici pe Tabela `hours_requests`

### 7.1 SELECT Policies

```sql
-- Studenți pot vedea propriile cereri
CREATE POLICY "Students can view own hours requests"
  ON public.hours_requests FOR SELECT
  USING (user_id = auth.uid());

-- Profesori pot vedea cereri pentru activitățile lor
CREATE POLICY "Professors can view hours requests for own activities"
  ON public.hours_requests FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM activities
      WHERE id = hours_requests.activity_id
        AND created_by = auth.uid()
    )
  );

-- Admins pot vedea toate cererile
CREATE POLICY "Admins can view all hours requests"
  ON public.hours_requests FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );
```

### 7.2 INSERT Policies

```sql
-- Studenți pot crea cereri pentru ei înșiși
CREATE POLICY "Students can create own hours requests"
  ON public.hours_requests FOR INSERT
  WITH CHECK (
    user_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'STUDENT'
    )
  );
```

### 7.3 UPDATE Policies

```sql
-- Profesori pot aproba/respinge cereri pentru activitățile lor
CREATE POLICY "Professors can approve hours requests for own activities"
  ON public.hours_requests FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM activities
      WHERE id = hours_requests.activity_id
        AND created_by = auth.uid()
    )
  );

-- Admins pot gestiona toate cererile
CREATE POLICY "Admins can manage all hours requests"
  ON public.hours_requests FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );
```

---

## 8. Politici pe Tabela `notifications`

### 8.1 Politici Simple

```sql
-- Useri pot vedea doar propriile notificări
CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT
  USING (user_id = auth.uid());

-- Useri pot marca ca citite propriile notificări
CREATE POLICY "Users can mark own notifications as read"
  ON public.notifications FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Admins pot vedea toate notificările
CREATE POLICY "Admins can view all notifications"
  ON public.notifications FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );

-- System (via service_role) poate crea notificări pentru oricine
-- No user-facing INSERT policy needed
```

---

## 9. Politici Read-Only Tables

### 9.1 `departments` și `categories`

```sql
-- Toată lumea poate vedea departamente și categorii active
CREATE POLICY "Anyone can view active departments"
  ON public.departments FOR SELECT
  USING (is_active = TRUE);

CREATE POLICY "Anyone can view active categories"
  ON public.categories FOR SELECT
  USING (is_active = TRUE);

-- Doar admins pot gestiona
CREATE POLICY "Admins can manage departments"
  ON public.departments FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );

CREATE POLICY "Admins can manage categories"
  ON public.categories FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );
```

### 9.2 `certificates`

```sql
-- Studenți pot vedea propriile certificate
CREATE POLICY "Students can view own certificates"
  ON public.certificates FOR SELECT
  USING (user_id = auth.uid());

-- Profesori pot vedea certificate pentru activitățile lor
CREATE POLICY "Professors can view certificates for own activities"
  ON public.certificates FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM activities
      WHERE id = certificates.activity_id
        AND created_by = auth.uid()
    )
  );

-- Doar system poate crea certificate (via service_role)
-- Admins pot vedea toate
CREATE POLICY "Admins can view all certificates"
  ON public.certificates FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );
```

### 9.3 `audit_logs`

```sql
-- Doar admins pot vedea audit logs
CREATE POLICY "Admins can view audit logs"
  ON public.audit_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );

-- Users pot vedea propriile acțiuni (planned)
CREATE POLICY "Users can view own audit logs"
  ON public.audit_logs FOR SELECT
  USING (user_id = auth.uid());

-- No INSERT/UPDATE/DELETE policies - append-only via functions
```

---

## 10. Testare Politici RLS

### 10.1 Setup Test Environment

```sql
-- Creează useri de test
INSERT INTO auth.users (id, email) VALUES
  ('student-uuid', 'student@test.com'),
  ('prof-uuid', 'prof@test.com'),
  ('admin-uuid', 'admin@test.com');

INSERT INTO profiles (id, email, first_name, last_name, role) VALUES
  ('student-uuid', 'student@test.com', 'Test', 'Student', 'STUDENT'),
  ('prof-uuid', 'prof@test.com', 'Test', 'Professor', 'PROFESSOR'),
  ('admin-uuid', 'admin@test.com', 'Test', 'Admin', 'ADMIN');
```

### 10.2 Test Cases

```sql
-- Test 1: Student nu poate vedea alte profile
SET LOCAL role TO authenticated;
SET LOCAL request.jwt.claim.sub TO 'student-uuid';

SELECT * FROM profiles WHERE id != 'student-uuid'; -- Should return 0 rows

-- Test 2: Professor poate crea activitate
SET LOCAL role TO authenticated;
SET LOCAL request.jwt.claim.sub TO 'prof-uuid';

INSERT INTO activities (title, description, ..., created_by)
VALUES ('Test Activity', 'Description...', 'prof-uuid');
-- Should succeed

-- Test 3: Student nu poate crea activitate
SET LOCAL role TO authenticated;
SET LOCAL request.jwt.claim.sub TO 'student-uuid';

INSERT INTO activities (title, description, ..., created_by)
VALUES ('Hack Activity', 'Hacked!', 'student-uuid');
-- Should fail with RLS violation

-- Test 4: Admin poate vedea toate profilurile
SET LOCAL role TO authenticated;
SET LOCAL request.jwt.claim.sub TO 'admin-uuid';

SELECT COUNT(*) FROM profiles; -- Should return 3

-- Test 5: Student poate vedea doar activități OPEN
SET LOCAL role TO authenticated;
SET LOCAL request.jwt.claim.sub TO 'student-uuid';

SELECT * FROM activities WHERE status != 'OPEN'; -- Should return 0 (sau enrolled)
```

---

## 11. Performance Considerations

### 11.1 Indecși pentru RLS

**Problema**: RLS policies pot fi lente dacă nu sunt backed by indecși

**Soluție**: Create targeted indexes

```sql
-- Exemplu: Policy verifică created_by frecvent
CREATE INDEX idx_activities_created_by ON activities(created_by)
WHERE deleted_at IS NULL;

-- Policy verifică enrollment exists
CREATE INDEX idx_enrollments_user_activity 
ON enrollments(user_id, activity_id)
WHERE deleted_at IS NULL;
```

### 11.2 Query Optimization

**Bad** (N+1 queries):
```typescript
// Frontend
const activities = await getActivities();
for (const activity of activities) {
  const enrollments = await getEnrollments(activity.id); // RLS check per query!
}
```

**Good** (Single query cu RLS):
```typescript
const activitiesWithEnrollments = await supabase
  .from('activities')
  .select(`
    *,
    enrollments(*)
  `)
  .eq('status', 'OPEN');
// RLS applied once, join optimized
```

---

## 12. Troubleshooting RLS

### 12.1 Debug RLS Policies

```sql
-- Activate detailed logging
SET client_min_messages TO DEBUG1;
SET log_statement TO 'all';

-- Run query and check logs
SELECT * FROM activities;

-- Check which policies are active
SELECT schemaname, tablename, policyname, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'activities';
```

### 12.2 Bypass RLS (Admin Operations)

**Use Case**: Background jobs, migrations, admin scripts

```sql
-- Using service_role key (server-side only!)
const supabase = createClient(url, SERVICE_ROLE_KEY);

// RLS is bypassed - be careful!
await supabase.from('profiles').select('*');
```

**Security**: Never expose `SERVICE_ROLE_KEY` to frontend!

---

**Document creat de**: Mihai Octavian & Abbasi Pazeyazd Bianca-Maria  
**Ultima actualizare**: Decembrie 2024  
**Versiune**: 1.0
