# Database Seed Data

Mock data pentru testarea aplicației Campus Connect.

## 🎯 Regula Importantă

**Mock data DOAR la nivel de Supabase, NICIODATĂ hardcodat în frontend!**

Frontend-ul trebuie să funcționeze cu date reale din Supabase, nu cu mock data hardcodat.

## 📋 Structura Seed Files

1. **01_cleanup.sql** - Șterge toate datele existente
2. **02_seed_categories.sql** - Categorii de activități (6 categorii)
3. **03_seed_test_users.sql** - Utilizatori de test (2 studenți, 1 profesor)
4. **04_seed_activities.sql** - Activități de voluntariat (5 activități)
5. **05_seed_enrollments.sql** - Înscrieri studenți (6 înregistrări)

## 🚀 Cum să Rulezi Seeding

### Opțiunea 1: Script Automat (Recomandat)

```bash
bash scripts/seed-database.sh
```

### Opțiunea 2: Manual (fiecare fișier)

```bash
supabase db execute --file supabase/seed/01_cleanup.sql
supabase db execute --file supabase/seed/02_seed_categories.sql
supabase db execute --file supabase/seed/03_seed_test_users.sql
supabase db execute --file supabase/seed/04_seed_activities.sql
supabase db execute --file supabase/seed/05_seed_enrollments.sql
```

## 👤 Test Accounts

### Student 1
- **Email**: student1@stud.rau.ro
- **Nume**: Ana Popescu
- **UUID**: 11111111-1111-1111-1111-111111111111
- **Facultate**: Engineering Sciences
- **An**: 2

### Student 2
- **Email**: student2@stud.rau.ro
- **Nume**: Mihai Ionescu
- **UUID**: 22222222-2222-2222-2222-222222222222
- **Facultate**: Computer Science & Information Engineering
- **An**: 3

### Profesor
- **Email**: prof.smith@rau.ro
- **Nume**: John Smith
- **UUID**: 33333333-3333-3333-3333-333333333333

## 📊 Date Generate

### Categorii (6)
- STEM Education
- Community Service
- Environmental
- Cultural
- Health & Wellness
- Education Support

### Activități (5)
1. **STEM Mentorship Program** (IN_PROGRESS) - 23 Nov 2025
2. **Community Outreach Initiative** (OPEN) - 20 Nov 2025
3. **River Cleanup Initiative** (OPEN) - 7 Dec 2025
4. **Math & Science Tutoring** (IN_PROGRESS) - 22 Nov 2025
5. **International Cultural Festival** (COMPLETED) - 15 Oct 2025

### Enrollments (6)
Student 1 (Ana) are:
- 2 activități active (STEM Mentorship, Community Outreach)
- 1 activitate completată (Cultural Festival)
- 1 aplicație pending (River Cleanup)

## 🧪 Ce Poți Testa

După seeding, student dashboard-ul va afișa:

✅ **Stats Cards**:
- Total Hours: 4 hrs (2h STEM + 2h Tutoring)
- Active Opportunities: 2
- Completed: 1

✅ **Active Opportunities**:
- STEM Mentorship Program (30% progress)
- Community Outreach Initiative (65% progress)

✅ **Toate componentele populate cu date reale din Supabase**

## ⚠️ Important

**Notă**: Pentru a vedea datele în frontend, trebuie să:
1. Creezi utilizatorii în Supabase Auth (sau să te loghezi cu contul tău)
2. UUID-ul utilizatorului autentificat trebuie să se potrivească cu unul din seed data
3. Sau modifici seed data să folosească UUID-ul tău real

## 🔄 Re-seeding

Pentru a reîncărca datele de la zero:

```bash
bash scripts/seed-database.sh
```

Script-ul va șterge toate datele existente și va reîncărca seed data.
