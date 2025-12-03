# Politici de Acces - CampusConnect

**Autori**: Mihai Octavian & Abbasi Pazeyazd Bianca-Maria  
**Versiune**: 1.0  
**Data**: Decembrie 2024  

---

## 1. Roluri Utilizatori

### 1.1 Definire Roluri

**3 roluri principale**:

| Rol | Enum | Acces Level | Count (estimat) |
|-----|------|-------------|-----------------|
| Student | `STUDENT` | Basic | 90% useri |
| Profesor | `PROFESSOR` | Elevated | 8% useri |
| Administrator | `ADMIN` | Full | 2% useri |

**Storage**: `profiles.role` (TEXT enum)

```sql
CHECK (role IN ('STUDENT', 'PROFESSOR', 'ADMIN'))
```

### 1.2 Matricea de Acces

**Legend**: ✅ Full | 📖 Read-only | ❌ No access

| Resursă | STUDENT | PROFESSOR | ADMIN |
|---------|---------|-----------|-------|
| **Activities** |
| View open activities | ✅ | ✅ | ✅ |
| View all activities | ❌ | 📖 Own | ✅ |
| Create activity | ❌ | ✅ | ✅ |
| Edit activity | ❌ | ✅ Own | ✅ |
| Delete activity | ❌ | ✅ Own | ✅ |
| **Enrollments** |
| Enroll self | ✅ | ❌ | ✅ |
| View enrollments | 📖 Own | 📖 Own activities | ✅ |
| Approve/reject | ❌ | ✅ Own activities | ✅ |
| Cancel enrollment | ✅ Own | ❌ | ✅ |
| **Hours** |
| Submit hours | ✅ | ❌ | ❌ |
| View hours | 📖 Own | 📖 Own students | ✅ |
| Validate hours | ❌ | ✅ Own students | ✅ |
| **Certificates** |
| Generate certificate | ✅ Own | ❌ | ✅ |
| View certificates | 📖 Own | 📖 Own activities | ✅ |
| **Users** |
| View profiles | 📖 Limited | 📖 Enrolled students | ✅ |
| Edit own profile | ✅ | ✅ | ✅ |
| Edit other profiles | ❌ | ❌ | ✅ |
| Change roles | ❌ | ❌ | ✅ |
| **Admin** |
| Platform settings | ❌ | ❌ | ✅ |
| Email templates | ❌ | ❌ | ✅ |
| Audit logs | ❌ | ❌ | ✅ |

---

## 2. Row Level Security (RLS)

### 2.1 Concept

**RLS** = Postgres feature care filtrează automat rândurile bazat pe user context

**Benefits**:
- ✅ Securitate la nivel de database
- ✅ Nu poți bypassa (chiar cu SQL direct)
- ✅ Transparent pentru aplicație
- ✅ Performant (index-abile)

### 2.2 User Context

**auth.uid()** = ID-ul user-ului curent (din JWT)

```sql
-- Example: Get current user ID
SELECT auth.uid();
-- Returns: '550e8400-e29b-41d4-a716-446655440000'

-- Example: Get current user role
SELECT role FROM public.profiles WHERE id = auth.uid();
-- Returns: 'STUDENT'
```

### 2.3 Helper Function

```sql
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;
```

**Usage**:
```sql
SELECT get_user_role();
-- Returns: 'PROFESSOR'
```

---

## 3. Politici RLS pe Tabel

### 3.1 Activities

**Students**: Doar activități OPEN, viitoare, nedelete

```sql
CREATE POLICY "Students can view open activities"
ON public.activities FOR SELECT
USING (
  get_user_role() = 'STUDENT' AND
  status = 'OPEN' AND
  start_date >= CURRENT_DATE AND
  deleted_at IS NULL
);
```

**Professors**: CRUD pe activitățile proprii

```sql
CREATE POLICY "Professors can manage own activities"
ON public.activities FOR ALL
USING (
  get_user_role() = 'PROFESSOR' AND
  created_by = auth.uid()
);
```

**Admins**: Full access

```sql
CREATE POLICY "Admins have full access"
ON public.activities FOR ALL
USING (get_user_role() = 'ADMIN');
```

### 3.2 Enrollments

**Students**: Doar înscrierile proprii

```sql
CREATE POLICY "Students can view own enrollments"
ON public.enrollments FOR SELECT
USING (
  get_user_role() = 'STUDENT' AND
  student_id = auth.uid()
);

CREATE POLICY "Students can enroll themselves"
ON public.enrollments FOR INSERT
WITH CHECK (
  get_user_role() = 'STUDENT' AND
  student_id = auth.uid()
);
```

**Professors**: Înscrieri la activitățile proprii

```sql
CREATE POLICY "Professors can view enrollments in own activities"
ON public.enrollments FOR SELECT
USING (
  get_user_role() = 'PROFESSOR' AND
  activity_id IN (
    SELECT id FROM public.activities WHERE created_by = auth.uid()
  )
);

CREATE POLICY "Professors can update enrollments in own activities"
ON public.enrollments FOR UPDATE
USING (
  get_user_role() = 'PROFESSOR' AND
  activity_id IN (
    SELECT id FROM public.activities WHERE created_by = auth.uid()
  )
);
```

### 3.3 Volunteer Hours

**Students**: Submit + view own

```sql
CREATE POLICY "Students can submit own hours"
ON public.volunteer_hours FOR INSERT
WITH CHECK (
  get_user_role() = 'STUDENT' AND
  student_id = auth.uid()
);

CREATE POLICY "Students can view own hours"
ON public.volunteer_hours FOR SELECT
USING (
  get_user_role() = 'STUDENT' AND
  student_id = auth.uid()
);
```

**Professors**: Validate hours pentru activitățile proprii

```sql
CREATE POLICY "Professors can validate hours for own activities"
ON public.volunteer_hours FOR UPDATE
USING (
  get_user_role() = 'PROFESSOR' AND
  activity_id IN (
    SELECT id FROM public.activities WHERE created_by = auth.uid()
  )
);
```

### 3.4 Profiles

**Everyone**: View own profile

```sql
CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT
USING (id = auth.uid());

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
USING (id = auth.uid())
WITH CHECK (
  -- Cannot change own role
  role = (SELECT role FROM public.profiles WHERE id = auth.uid())
);
```

**Admins**: View all profiles

```sql
CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
USING (get_user_role() = 'ADMIN');

CREATE POLICY "Admins can update any profile"
ON public.profiles FOR UPDATE
USING (get_user_role() = 'ADMIN');
```

---

## 4. API Route Protection

### 4.1 Server-Side Check

**Pattern**: Verify role în Server Action/API Route

```typescript
// app/api/activities/route.ts
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const supabase = await createClient();
  
  // Get session
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Get user role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single();
  
  // Check role
  if (profile?.role !== 'PROFESSOR' && profile?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  
  // ... create activity
}
```

### 4.2 Helper Middleware

```typescript
// lib/auth/check-role.ts
import { createClient } from '@/lib/supabase/server';

export async function requireRole(roles: string[]) {
  const supabase = await createClient();
  
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    throw new Error('Unauthorized');
  }
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single();
  
  if (!profile || !roles.includes(profile.role)) {
    throw new Error('Forbidden');
  }
  
  return profile;
}
```

**Usage**:
```typescript
// app/api/admin/settings/route.ts
import { requireRole } from '@/lib/auth/check-role';

export async function PATCH(request: Request) {
  await requireRole(['ADMIN']); // Throws if not admin
  
  // ... update settings
}
```

---

## 5. Client-Side Protection

### 5.1 Conditional Rendering

```tsx
'use client';

import { useUser } from '@/lib/hooks/useUser';
import { useProfile } from '@/lib/hooks/useProfile';

export function CreateActivityButton() {
  const { user } = useUser();
  const { profile } = useProfile();
  
  // Hide button if not professor/admin
  if (!user || !['PROFESSOR', 'ADMIN'].includes(profile?.role)) {
    return null;
  }
  
  return (
    <Button asChild>
      <Link href="/dashboard/professor/activities/create">
        Create Activity
      </Link>
    </Button>
  );
}
```

### 5.2 Route Guard Component

```tsx
// components/auth/RequireRole.tsx
'use client';

import { useProfile } from '@/lib/hooks/useProfile';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface Props {
  roles: string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RequireRole({ roles, children, fallback }: Props) {
  const { profile, loading } = useProfile();
  const router = useRouter();
  
  useEffect(() => {
    if (!loading && (!profile || !roles.includes(profile.role))) {
      router.push('/dashboard');
    }
  }, [profile, loading, roles, router]);
  
  if (loading) return <div>Loading...</div>;
  
  if (!profile || !roles.includes(profile.role)) {
    return fallback || null;
  }
  
  return <>{children}</>;
}
```

**Usage**:
```tsx
// app/dashboard/professor/layout.tsx
import { RequireRole } from '@/components/auth/RequireRole';

export default function ProfessorLayout({ children }) {
  return (
    <RequireRole roles={['PROFESSOR', 'ADMIN']}>
      {children}
    </RequireRole>
  );
}
```

---

## 6. Ownership Checks

### 6.1 Check Activity Owner

```typescript
// lib/auth/check-ownership.ts
export async function checkActivityOwnership(
  activityId: string,
  userId: string
): Promise<boolean> {
  const supabase = await createClient();
  
  const { data: activity } = await supabase
    .from('activities')
    .select('created_by')
    .eq('id', activityId)
    .single();
  
  return activity?.created_by === userId;
}
```

**Usage**:
```typescript
// app/api/activities/[id]/route.ts
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { session } = await getAuth();
  const { profile } = await getProfile(session.user.id);
  
  // Admins can edit any activity
  if (profile.role === 'ADMIN') {
    // ... update
    return;
  }
  
  // Professors can only edit own
  const isOwner = await checkActivityOwnership(params.id, session.user.id);
  
  if (!isOwner) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  
  // ... update
}
```

---

## 7. Testing RLS Policies

### 7.1 Manual Test

```sql
-- Connect as student user
SET request.jwt.claims = '{"sub": "student-uuid"}';

-- Try to view activities (should work)
SELECT * FROM public.activities;

-- Try to create activity (should fail)
INSERT INTO public.activities (title, created_by) 
VALUES ('Test', 'student-uuid');
-- Error: new row violates row-level security policy
```

### 7.2 Automated Tests

```typescript
// tests/rls/activities.test.ts
import { createClient } from '@supabase/supabase-js';

describe('Activities RLS', () => {
  it('should allow students to view open activities', async () => {
    const supabase = createClient(URL, ANON_KEY);
    
    await supabase.auth.signInWithPassword({
      email: 'student@univ.ro',
      password: 'password'
    });
    
    const { data, error } = await supabase
      .from('activities')
      .select('*');
    
    expect(error).toBeNull();
    expect(data.every(a => a.status === 'OPEN')).toBe(true);
  });
  
  it('should prevent students from creating activities', async () => {
    const supabase = createClient(URL, ANON_KEY);
    
    await supabase.auth.signInWithPassword({
      email: 'student@univ.ro',
      password: 'password'
    });
    
    const { error } = await supabase
      .from('activities')
      .insert({ title: 'Test' });
    
    expect(error).toBeTruthy();
    expect(error?.code).toBe('42501'); // RLS violation
  });
});
```

---

## 8. Audit Logging

### 8.1 Audit Table

```sql
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL, -- 'CREATE', 'UPDATE', 'DELETE'
  resource_type TEXT NOT NULL, -- 'activity', 'enrollment', etc.
  resource_id UUID,
  old_data JSONB,
  new_data JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_resource ON public.audit_logs(resource_type, resource_id);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at DESC);
```

### 8.2 Trigger Audit

```sql
CREATE OR REPLACE FUNCTION public.audit_activity_changes()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.audit_logs (user_id, action, resource_type, resource_id, old_data, new_data)
  VALUES (
    auth.uid(),
    TG_OP,
    'activity',
    COALESCE(NEW.id, OLD.id),
    CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD) ELSE NULL END,
    CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN row_to_json(NEW) ELSE NULL END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER audit_activities
AFTER INSERT OR UPDATE OR DELETE ON public.activities
FOR EACH ROW EXECUTE FUNCTION public.audit_activity_changes();
```

---

**Document creat de**: Mihai Octavian & Abbasi Pazeyazd Bianca-Maria  
**Ultima actualizare**: Decembrie 2024  
**Versiune**: 1.0
