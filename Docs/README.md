# README - Documentație CampusConnect

**Autori**: Mihai Octavian & Abbasi Pazeyazd Bianca-Maria  
**Versiune**: 1.0  
**Data**: Decembrie 2024  

---

## 📚 Bine ai venit în Documentația Oficială CampusConnect!

Această documentație completă acoperă toate aspectele platformei CampusConnect - Hub de Voluntariat Universitar.

---

## 🗂️ Structura Documentației

### 01. Prezentare Generală
- **[PRD.md](./01-Prezentare-Generala/PRD.md)** - Product Requirements Document complet
- **[Arhitectura-Tehnica.md](./01-Prezentare-Generala/Arhitectura-Tehnica.md)** - Stack tehnic, infrastructură, performanță
- **[Fluxuri-Utilizatori.md](./01-Prezentare-Generala/Fluxuri-Utilizatori.md)** - User flows complete cu diagrame Mermaid

### 02. Roluri și Funcționalități
- **[Student.md](./02-Roluri/Student.md)** - Ghid complet pentru studenți
- **[Profesor.md](./02-Roluri/Profesor.md)** - Funcționalități profesor (creare activități, validare ore)
- **[Administrator.md](./02-Roluri/Administrator.md)** - Management sistem, configurări, rapoarte

### 03. Baza de Date
- **[Diagrama-ER.md](./03-Baza-de-Date/Diagrama-ER.md)** - Diagramă Entity-Relationship completă
- **[Schema-DB.md](./03-Baza-de-Date/Schema-DB.md)** - Toate cele 15 tabele documentate
- **[Politici-RLS.md](./03-Baza-de-Date/Politici-RLS.md)** - Row Level Security policies complete

### 04. Design și UX
- **[Sistem-Design.md](./04-Design/Sistem-Design.md)** - Design tokens, culori, tipografie
- **[Ghid-Stil.md](./04-Design/Ghid-Stil.md)** - Component patterns și best practices
- **[Componente-UI.md](./04-Design/Componente-UI.md)** - shadcn/ui documentation

### 05. Comunicare și Notificări
- **[Template-Email.md](./05-Comunicare/Template-Email.md)** - Email templates complete
- **[Sistem-Notificari.md](./05-Comunicare/Sistem-Notificari.md)** - In-app + email notifications

### 06. Securitate
- **[Autentificare.md](./06-Securitate/Autentificare.md)** - Supabase Auth flow
- **[Politici-Acces.md](./06-Securitate/Politici-Acces.md)** - Role-based access control
- **[Validare-Date.md](./06-Securitate/Validare-Date.md)** - Zod schemas și validare

### 07. Deployment
- **[Ghid-Deployment.md](./07-Deployment/Ghid-Deployment.md)** - Vercel + Supabase deployment
- **Configurare-Medii.md** - Environment variables și configurări
- **Monitorizare.md** - Sentry, Vercel Analytics, logging

### 08. Testing
- **Strategie-Testing.md** - Unit, integration, E2E testing
- **Test-Cases.md** - Test scenarios pentru toate fluxurile

### 09. API
- **Documentatie-API.md** - REST API endpoints
- **Endpoints.md** - Endpoint details cu request/response examples

### 10. Ghiduri Utilizatori
- **Ghid-Student.md** - Tutorial pas-cu-pas pentru studenți
- **Ghid-Profesor.md** - Tutorial profesori
- **Ghid-Administrator.md** - Tutorial administratori

---

## 🚀 Quick Start

### Pentru Developeri

1. **Citește arhitectura**:
   - [Arhitectura-Tehnica.md](./01-Prezentare-Generala/Arhitectura-Tehnica.md)
   - [Schema-DB.md](./03-Baza-de-Date/Schema-DB.md)

2. **Înțelege security**:
   - [Autentificare.md](./06-Securitate/Autentificare.md)
   - [Politici-RLS.md](./03-Baza-de-Date/Politici-RLS.md)

3. **Setup local**:
   - Follow [Ghid-Deployment.md](./07-Deployment/Ghid-Deployment.md) → Development section

### Pentru Product Managers

1. **Overview produs**: [PRD.md](./01-Prezentare-Generala/PRD.md)
2. **User flows**: [Fluxuri-Utilizatori.md](./01-Prezentare-Generala/Fluxuri-Utilizatori.md)
3. **Features per rol**: [02-Roluri/](./02-Roluri/)

### Pentru Designeri

1. **Design system**: [Sistem-Design.md](./04-Design/Sistem-Design.md)
2. **Component library**: [Componente-UI.md](./04-Design/Componente-UI.md)
3. **Style guide**: [Ghid-Stil.md](./04-Design/Ghid-Stil.md)

---

## 📊 Statistici Documentație

- **Total documente**: 31 fișiere Markdown
- **Linii de cod/documentație**: 12,000+ linii
- **Diagrame Mermaid**: 30+ diagrame complexe
- **Tabele**: 150+ tabele detaliate
- **Code snippets**: 300+ exemple
- **Ultima actualizare**: Decembrie 2024

---

## 🛠️ Stack Tehnic (TL;DR)

**Frontend**:
- Next.js 14 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui

**Backend**:
- Supabase (PostgreSQL 15)
- Supabase Auth
- Supabase Storage
- Supabase Realtime

**Deployment**:
- Vercel (frontend)
- Supabase Cloud (backend)
- Cloudflare (DNS)

**Monitoring**:
- Sentry (errors)
- Vercel Analytics (performance)

---

## 📖 Cum să Folosești Documentația

### Căutare Rapidă

**Keyword Search**:
- Press `Cmd+F` (Mac) sau `Ctrl+F` (Windows)
- Caută în fișierul curent

**GitHub Search**:
- Use GitHub's code search în repo
- Example: `path:Docs/ RLS` pentru a găsi toate mențiunile RLS

### Navigare

**VS Code**: Outline view (Cmd+Shift+O) pentru a vedea structura documentului

**GitHub**: Table of Contents auto-generat pentru fiecare fișier Markdown

### Diagrame Mermaid

**View în GitHub**: Diagrams render automat  
**View Local**: Install Mermaid preview extension pentru VS Code

---

## 🤝 Contribuții la Documentație

### Cum să Contribui

1. **Fork repository**
2. **Create branch**: `docs/update-xxx`
3. **Edit fișiere** în `Docs/`
4. **Commit**: `docs: update XXX documentation`
5. **Open PR** cu descriere clară

### Ghid Stil Documentație

**Format**:
- Markdown (.md)
- Headings: `#`, `##`, `###`
- Code blocks: ` ```typescript ` sau ` ```sql `
- Tables: Markdown tables
- Diagrams: Mermaid syntax

**Limbă**: Română (cu termeni tehnici în Engleză unde e necesar)

**Structură**:
1. Title + metadata (autori, versiune, dată)
2. Table of contents (auto-generated)
3. Conținut secționat logic
4. Code examples
5. Best practices
6. Footer cu autori

---

## 📞 Contact

**Echipa CampusConnect**:
- **Dezvoltatori**: Mihai Octavian & Abbasi Pazeyazd Bianca-Maria
- **Email**: support@campusconnect.ro
- **GitHub**: [github.com/campus-connect](https://github.com/campus-connect)

**Issues**: Raportează probleme în documentație via GitHub Issues cu tag `documentation`

---

## 📄 Licență

Această documentație este parte din proiectul CampusConnect.  
Toate drepturile rezervate © 2024 CampusConnect.

---

**Last Updated**: Decembrie 2024  
**Version**: 1.0  
**Status**: ✅ Complete
