# CampusConnect - Documentație Oficială

**Hub Voluntariat Universitar**

## Autori

- **Mihai Octavian** - Lead Developer & System Architect
- **Abbasi Pazeyazd Bianca-Maria** - Project Manager & Product Owner

---

## Despre Proiect

CampusConnect este o platformă digitală dedicată coordonării activităților de voluntariat universitar, oferind studenților oportunități de dezvoltare personală și profesională prin implicare în activități extracurriculare.

### Viziune

Crearea unei comunități universitare active și implicate, unde fiecare student are acces egal la oportunități de voluntariat și dezvoltare personală.

### Misiune

Digitalizarea și simplificarea procesului de înscriere, participare și validare a activităților de voluntariat, asigurând transparență și eficiență pentru toți participanții (studenți, profesori, administratori).

---

## Structura Documentației

### 📋 1. Prezentare Generală
- [Specificații de Produs (PRD)](./01-Prezentare-Generala/PRD.md)
- [Arhitectura Sistemului](./01-Prezentare-Generala/Arhitectura-Tehnica.md)
- [Fluxuri Utilizatori](./01-Prezentare-Generala/Fluxuri-Utilizatori.md)

### 👥 2. Roluri și Funcționalități
- [Student](./02-Roluri/Student.md)
- [Profesor](./02-Roluri/Profesor.md)
- [Administrator](./02-Roluri/Administrator.md)

### 🗄️ 3. Baza de Date
- [Schema Bazei de Date](./03-Baza-de-Date/Schema-DB.md)
- [Diagrama ER](./03-Baza-de-Date/Diagrama-ER.md)
- [Politici RLS](./03-Baza-de-Date/Politici-RLS.md)

### 🎨 4. Design și UX
- [Sistem Design](./04-Design/Sistem-Design.md)
- [Ghid de Stil](./04-Design/Ghid-Stil.md)
- [Componente UI](./04-Design/Componente-UI.md)

### 📧 5. Comunicare și Notificări
- [Template-uri Email](./05-Comunicare/Template-Email.md)
- [Sistem Notificări](./05-Comunicare/Sistem-Notificari.md)

### 🔐 6. Securitate și Autentificare
- [Autentificare](./06-Securitate/Autentificare.md)
- [Politici de Acces](./06-Securitate/Politici-Acces.md)
- [Validare Date](./06-Securitate/Validare-Date.md)

### 🚀 7. Deployment și Infrastructură
- [Ghid Deployment](./07-Deployment/Ghid-Deployment.md)
- [Configurare Medii](./07-Deployment/Configurare-Medii.md)
- [Monitorizare](./07-Deployment/Monitorizare.md)

### 🧪 8. Testing
- [Strategie Testing](./08-Testing/Strategie-Testing.md)
- [Test Cases](./08-Testing/Test-Cases.md)

### 📱 9. API și Integrări
- [Documentație API](./09-API/Documentatie-API.md)
- [Endpoint-uri](./09-API/Endpoints.md)

### 📚 10. Ghiduri Utilizare
- [Ghid Student](./10-Ghiduri/Ghid-Student.md)
- [Ghid Profesor](./10-Ghiduri/Ghid-Profesor.md)
- [Ghid Administrator](./10-Ghiduri/Ghid-Administrator.md)

---

## Tehnologii Utilizate

### Frontend
- **Next.js 14** - React framework cu App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling utility-first
- **shadcn/ui** - Componente UI

### Backend
- **Supabase** - Backend-as-a-Service
  - PostgreSQL Database
  - Authentication
  - Storage
  - Real-time subscriptions
  - Row Level Security (RLS)

### Deployment
- **Vercel** - Frontend hosting
- **Supabase Cloud** - Backend infrastructure

---

## Link-uri Importante

- **Website**: [https://campusconnect-scs.work](https://campusconnect-scs.work)
- **Repository GitHub**: [Campus Connect](https://github.com/SCS/campus-connect)
- **Supabase Project**: Dashboard Supabase
- **Vercel Dashboard**: Vercel Deployments

---

## Versiune

**Versiune Curentă**: 0.1.0
**Data Ultimei Actualizări**: Noiembrie 2024
**Status**: 🚧 În Dezvoltare Activă

---

## Contact

Pentru întrebări sau sugestii:
- **Email**: contact@campusconnect-scs.work
- **GitHub Issues**: [Raportează o problemă](https://github.com/SCS/campus-connect/issues)

---

## Licență

© 2024 CampusConnect. Toate drepturile rezervate.

**Autori**: Mihai Octavian & Abbasi Pazeyazd Bianca-Maria
