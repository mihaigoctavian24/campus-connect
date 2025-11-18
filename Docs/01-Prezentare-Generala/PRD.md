# Specificații de Produs (PRD)
# CampusConnect - Hub Voluntariat Universitar

**Autori**: Mihai Octavian & Abbasi Pazeyazd Bianca-Maria
**Versiune**: 2.0
**Data**: Noiembrie 2024
**Status**: 🚧 În Dezvoltare Activă

---

## 1. Prezentare Generală

### 1.1 Viziune Produs

CampusConnect este o platformă digitală dedicată coordonării activităților de voluntariat universitar, oferind studenților oportunități de dezvoltare personală și profesională prin implicare în activități extracurriculare.

### 1.2 Obiective Principale

1. **Centralizare**: Un singur punct de acces pentru toate activitățile de voluntariat din universitate
2. **Automatizare**: Reducerea sarcinilor administrative pentru profesori și administratori
3. **Transparență**: Tracking vizibil al orelor de voluntariat și progresului pentru fiecare student
4. **Gamification**: Încurajarea participării prin sistem de badge-uri și realizări
5. **Validare Digitală**: Verificare automată a prezenței prin QR code și GPS

### 1.3 Utilizatori Țintă

- **Studenți** (95% din utilizatori): Participanți la activități de voluntariat
- **Profesori** (4% din utilizatori): Organizatori și coordonatori de activități
- **Administratori** (1% din utilizatori): Management sistem și monitorizare

---

## 2. Funcționalități Principale

### 2.1 Pentru Studenți

#### Descoperire Oportunități
- **Catalog vizual** de activități disponibile
- **Filtrare avansată** după:
  - Categorie (Academic Support, Community Service, Event Assistance, etc.)
  - Locație (On-Campus, Remote, Hybrid)
  - Dată și perioadă
  - Departament organizator
  - Număr de ore alocate
- **Salvare oportunități** pentru consultare ulterioară
- **Sistem de recomandări** bazat pe istoric și interese

#### Înscriere și Participare
- **Înscriere simplă** cu un click
- **Confirmare instant** sau listă de așteptare
- **Notificări** pentru:
  - Confirmare înscriere
  - Reminder 24h și 1h înainte de activitate
  - Actualizări sau anulări
- **Calendar personal** cu toate activitățile înscrise

#### Validare Prezență
- **QR Code Scanning** la locul desfășurării activității
- **Validare GPS** (opțional, ±15m precizie)
- **Confirmare instant** a prezenței
- **Tracking ore** în timp real

#### Dashboard Personal
- **Statistici vizuale**:
  - Total ore acumulate
  - Activități în desfășurare
  - Activități completate
  - Progres față de obiective
- **Certificare automată** după completare
- **Badge-uri și realizări** pentru activități speciale
- **Istoric complet** de participare

#### Logging Ore Suplimentare
- **Formular simplu** pentru ore neinregistrate automat
- **Upload dovezi** (poze, documente)
- **Tracking status** (Pending, Approved, Rejected)
- **Notificare** la aprobare/respingere

### 2.2 Pentru Profesori

#### Creare Activități
- **Formular intuitiv** cu toate detaliile necesare:
  - Titlu și descriere
  - Dată, oră, locație
  - Capacitate maximă
  - Criterii de eligibilitate
  - Categorie și departament
  - Imagine reprezentativă
- **Activități recurente** (sesiuni multiple)
- **Publicare imediată** sau programată

#### Management Înscrieri
- **Lista participanților** în timp real
- **Aprobare/Respingere** înscrieri
- **Comunicare directă** cu participanții
- **Export listă** pentru evidență

#### Validare Prezență
- **Opțiuni multiple**:
  - **Generare QR Code** pentru sesiune (criptare AES-256)
  - **Marcare manuală** prezență/absent
  - **Upload listă** (bulk attendance)
- **Timp limitat** pentru QR (expiră la sfârșit sesiune)
- **Validare GPS automată** (opțional)

#### Aprobare Ore
- **Listă cereri** studenți pentru ore suplimentare
- **Vizualizare dovezi** uploadate
- **Aprobare/Respingere** cu note
- **Notificare automată** către student

#### Rapoarte
- **Statistici activitate**:
  - Participanți totali
  - Rata de prezență
  - Feedback mediu
  - Ore totale acordate
- **Export date** (CSV, PDF)
- **Grafice vizuale** pentru raportare

### 2.3 Pentru Administratori

#### Management Utilizatori
- **Creare/Editare/Dezactivare** conturi
- **Atribuire roluri** (Student, Profesor, Admin)
- **Aprobare profesori** (workflow de verificare)
- **Vizualizare profil complet** utilizatori

#### Management Activități
- **Vizualizare toate** activitățile (indiferent de departament)
- **Editare/Anulare** activități
- **Moderare conținut** și descrieri

#### Departamente și Categorii
- **CRUD departamente** universitare
- **CRUD categorii** activități
- **Atribuire contacte** pe departament

#### Template-uri Email
- **Personalizare mesaje** pentru:
  - Confirmare înscriere
  - Reminder-uri sesiuni
  - Aprobare/Respingere ore
  - Certificat disponibil
- **Variabile dinamice** (nume student, titlu activitate, etc.)
- **Preview înainte** de trimitere

#### Rapoarte Avansate
- **Dashboard executiv** cu KPI-uri:
  - Total utilizatori activi
  - Total activități organizate
  - Total ore voluntariat
  - Participare pe departament
- **Grafice comparative** între departamente
- **Export rapoarte** complete

#### Audit și Securitate
- **Audit logs** pentru toate acțiunile critice:
  - Modificări utilizatori
  - Ștergeri activități
  - Schimbări configurații
- **Tracking IP și User Agent**
- **Vizualizare activitate** suspectă

---

## 3. User Flows Principale

### 3.1 Student - Înscriere la Activitate

```
1. Student accesează pagina "Explore"
2. Filtrează după categorie "Community Service"
3. Găsește activitate "Cleaning Campus Green Spaces"
4. Click "View Details" → Citește descriere completă
5. Click "Enroll Now"
6. Primește notificare in-app: "Enrollment confirmed!"
7. Primește email de confirmare cu detalii
8. Activitatea apare în "My Activities" din dashboard
```

### 3.2 Profesor - Creare și Validare Activitate

```
1. Profesor accesează "Create Opportunity"
2. Completează formular:
   - Titlu: "STEM Mentorship Program"
   - Dată: 2024-12-15
   - Locație: Campus Building A
   - Capacitate: 20 studenți
   - Categorie: Mentorship
3. Upload imagine reprezentativă
4. Click "Publish"
5. Activitatea devine vizibilă în "Explore"
6. Studenți încep să se înscrie
7. La data activității:
   - Profesor generează QR Code
   - Studenți scanează la intrare
   - Prezența se marchează automat
8. După activitate:
   - Profesor revizuiește lista prezență
   - Aprobă ore pentru fiecare participant
```

### 3.3 Student - Logging Ore Externe

```
1. Student participă la activitate externă (nu prin platformă)
2. Accesează "Log Hours"
3. Completează formular:
   - Activitate: "Community Outreach"
   - Ore: 5
   - Dată: 2024-11-10
   - Descriere: "Helped at local shelter"
   - Upload poze dovadă (3 imagini)
4. Trimite cerere
5. Profesorul coordonator primește notificare
6. Profesor revizuiește:
   - Verifică dovezile
   - Adaugă note: "Verified with shelter coordinator"
   - Aprobă cererea
7. Student primește notificare: "5 hours approved!"
8. Orele apar în total acumulat
```

---

## 4. Arhitectură Tehnică

### 4.1 Stack Tehnologic

**Frontend**:
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- shadcn/ui components

**Backend**:
- Supabase (PostgreSQL)
- Row Level Security (RLS)
- Edge Functions
- Realtime subscriptions

**Deployment**:
- Vercel (Frontend)
- Supabase Cloud (Backend)

**Domain**: https://campusconnect-scs.work

### 4.2 Baza de Date

15 tabele principale:
- `profiles` - Utilizatori (extinde auth.users)
- `departments` - Departamente universitare
- `categories` - Categorii activități
- `activities` - Activități de voluntariat
- `sessions` - Sesiuni multiple per activitate
- `enrollments` - Înscrieri studenți
- `attendance` - Tracking prezență (QR/GPS/Manual)
- `hours_requests` - Cereri ore externe
- `saved_opportunities` - Activități salvate
- `notifications` - Notificări in-app
- `certificates` - Certificate generate
- `feedback` - Evaluări activități
- `email_templates` - Template-uri email
- `audit_logs` - Audit trail
- `platform_settings` - Configurări globale

### 4.3 Securitate

- **Autentificare**: Supabase Auth (Email + Password)
- **RLS**: Row Level Security pe toate tabelele
- **Validare**: Zod schemas pentru input validation
- **Criptare**: QR codes criptate AES-256
- **HTTPS**: SSL/TLS obligatoriu
- **Audit**: Tracking toate acțiunile critice

---

## 5. Design și UX

### 5.1 Design System

**Culori Principale**:
- **Navy Blue**: `#001f3f` - Header, butoane primareș acțiuni importante
- **Gold**: `#FFD700` - Accente, hover states, active links
- **White**: `#FFFFFF` - Fundal principal
- **Gray**: `#F9FAFB` - Fundal secundar

**Tipografie**:
- Font: System fonts (Inter fallback)
- Heading: Bold, Navy Blue
- Body: Regular, Gray 700

**Componente**:
- shadcn/ui (Radix UI + Tailwind)
- Consistență pe toate paginile
- Mobile-first responsive design

### 5.2 Principii UX

1. **Simplicitate**: Maximum 3 click-uri până la orice funcționalitate
2. **Feedback Vizual**: Loading states, success/error messages clare
3. **Consistență**: Același layout și navigare pe toate paginile
4. **Accesibilitate**: WCAG 2.1 AA compliant
5. **Performance**: < 2s First Contentful Paint

---

## 6. Success Metrics

### 6.1 KPI-uri Principale

**Adoptare**:
- Număr utilizatori activi lunar (MAU)
- Rata de activare (users care completează profilul)
- Rata de retenție (7-day, 30-day)

**Engagement**:
- Număr mediu activități/student/semestru
- Rata de participare (enrolled vs attended)
- Timp mediu pe platformă

**Eficiență**:
- Timp mediu creare activitate (target: < 5 min)
- Timp mediu validare prezență (target: < 30 sec/student)
- Reducere timp administrativ vs metodă tradițională

**Satisfacție**:
- Net Promoter Score (NPS) target: > 8
- Rating mediu activități (target: > 4/5)
- Feedback pozitiv în sondaje

---

## 7. Roadmap

### Faza 1: MVP (Curent - Noiembrie 2024)
- ✅ Autentificare și profile utilizatori
- ✅ CRUD activități (profesor)
- ✅ Browse și înscriere (student)
- ✅ Dashboard-uri role-based
- ✅ Notificări in-app și email
- 🚧 Validare prezență (QR + Manual)
- 🚧 Logging ore externe
- 🚧 Certificare automată

### Faza 2: Enhancement (Decembrie 2024)
- ⏳ Gamification (badges, achievements)
- ⏳ Sistem recomandări
- ⏳ Rapoarte avansate
- ⏳ Export date (CSV, PDF)
- ⏳ Template-uri email personalizate

### Faza 3: Scale (Ianuarie-Februarie 2025)
- ⏳ Mobile app (React Native)
- ⏳ Integrare calendar extern (Google Calendar)
- ⏳ API public pentru integrări terțe
- ⏳ Multi-language support
- ⏳ Advanced analytics dashboard

---

## 8. Limitări Cunoscute

### 8.1 Limitări Tehnice

- GPS accuracy ±15 metri (poate varia în funcție de dispozitiv)
- QR code expirare la sfârșit sesiune (nu poate fi folosit după)
- Upload limite: 5MB per fișier, max 10 fișiere
- Realtime updates: lag de până la 2 secunde

### 8.2 Limitări Funcționale

- Nu suportă plăți sau donații
- Nu include chat între utilizatori
- Nu permite peer-to-peer activități (doar professor-created)
- Feedback moderat manual de admin (nu automat)

---

## 9. Dependențe Externe

### 9.1 Servicii Cloud

- **Supabase**: Database, Auth, Storage, Realtime
- **Vercel**: Frontend hosting, edge functions
- **Resend**: Email delivery service

### 9.2 Librării Critice

- Next.js 14
- React 18
- Supabase JS Client
- Radix UI primitives
- Zod validation

---

## 10. Contact și Suport

**Echipa Dezvoltare**:
- Mihai Octavian - Lead Developer
- Abbasi Pazeyazd Bianca-Maria - Project Manager

**Email**: contact@campusconnect-scs.work
**GitHub**: [Repository Issues](https://github.com/SCS/campus-connect/issues)

---

**Versiune Document**: 2.0
**Ultima Actualizare**: Noiembrie 2025
**Autori**: Mihai Octavian & Abbasi Pazeyazd Bianca-Maria
