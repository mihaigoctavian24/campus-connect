# Rol: Student

**Autori**: Mihai Octavian & Abbasi Pazeyazd Bianca-Maria
**Versiune**: 1.0
**Data**: Noiembrie 2025

---

## Prezentare Generală

Rolul de **Student** reprezintă utilizatorul principal al platformei CampusConnect, având acces la funcționalități dedicate descoperirii, înscrierii și participării la activități de voluntariat universitar.

---

## Funcționalități Principale

### 1. 🔍 Descoperire Oportunități

#### Pagina "Explore"
- **Catalog vizual** cu toate activitățile disponibile
- **Card-uri informative** pentru fiecare activitate:
  - Titlu și descriere scurtă
  - Departament organizator
  - Categorie (Academic Support, Community Service, etc.)
  - Locație (On-Campus, Remote, Hybrid)
  - Ore de voluntariat alocate
  - Data și ora desfășurării
  - Locuri disponibile (ex: "15/20 occupied")

#### Filtrare Avansată
Studenții pot filtra activitățile după:
- **Categorie**:
  - Academic Support
  - Community Service
  - Event Assistance
  - Mentorship
  - Research
  - Technical
- **Locație**:
  - On-Campus
  - Remote
  - Hybrid
- **Căutare text**: Titlu, descriere, locație

#### Salvare Oportunități
- Click pe pictograma 📌 pentru a salva o activitate
- Activitățile salvate apar în secțiunea "Saved Opportunities" din dashboard
- Notificare când o activitate salvată se apropie de termen

---

### 2. ✅ Înscriere la Activități

#### Process de Înscriere
1. Student găsește activitate de interes
2. Click pe "View Details" pentru informații complete
3. Click pe "Enroll Now"
4. **Validări automate**:
   - Verificare locuri disponibile
   - Verificare criterii de eligibilitate
   - Verificare conflict de program
5. Confirmare instant sau plasare pe listă de așteptare

#### Notificări Primite
După înscriere, studentul primește:
- ✉️ **Email de confirmare** cu:
  - Detalii activitate (dată, oră, locație)
  - Link calendar (.ics pentru Google/Outlook)
  - Instrucțiuni speciale (dacă există)
  - Informații contact organizator
- 📱 **Notificare in-app**: "Enrollment confirmed!"

#### Reminder-uri Automate
- **24 ore înainte**: "Don't forget! [Activity Name] starts tomorrow"
- **1 oră înainte**: "Reminder: [Activity Name] starts in 1 hour"

---

### 3. 📊 Dashboard Personal

#### Secțiune: Welcome
- Mesaj personalizat: "Welcome back, [Prenume]!"
- Data și ora curentă
- Sfaturi motivaționale

#### Statistici Vizuale (Stats Cards)
Trei card-uri principale:
1. **Total Hours**: Total ore acumulate de voluntariat
2. **Active Opportunities**: Număr activități în desfășurare
3. **Completed**: Număr activități finalizate

#### Quick Actions
Butoane rapide pentru acțiuni frecvente:
- 🔍 **Browse Opportunities**: Link la pagina Explore
- 📝 **Log Hours**: Înregistrare ore externe
- 👤 **View Profile**: Accesare profil personal
- 📜 **View Certificates**: Vizualizare certificate

#### Active Opportunities
Listă activități la care studentul este înscris:
- Titlu activitate
- Dată și oră
- Locație
- Status: "Enrolled" / "In Progress" / "Completed"
- Link "View Details"

#### Upcoming Sessions
Calendar vizual cu sesiunile viitoare:
- Data și ora exactă
- Locație desfășurare
- Instrucțiuni check-in (QR code sau manual)
- Countdown timer până la start

#### My Applications
Tracking status înscrieri:
- **Pending**: Așteptare aprobare profesor
- **Confirmed**: Înscriere confirmată
- **Waitlisted**: Pe listă de așteptare
- **Cancelled**: Anulată (de student sau profesor)

Status vizual cu culori:
- 🟡 Pending (galben)
- 🟢 Confirmed (verde)
- 🔵 Waitlisted (albastru)
- 🔴 Cancelled (roșu)

#### Saved Opportunities
Activități salvate pentru consultare ulterioară:
- Card-uri compacte cu informații esențiale
- Click pentru a vedea detalii complete
- Buton "Remove" pentru ștergere din salvate
- Sortare după dată salvare (cele mai recente primele)

---

### 4. ✓ Validare Prezență

#### Metoda 1: QR Code Scanning (Recomandată)
1. Student ajunge la locația activității
2. Profesorul afișează QR code pe ecran/proiector
3. Student scanează QR code cu camera telefonului
4. **Validări automate**:
   - QR code valid și neexpirat
   - GPS location matching (±15m de locație declarată)
   - Student înscris la activitate
   - Nu a mai scanat deja
5. Prezența se marchează instant
6. Notificare: "Attendance confirmed!"

#### Metoda 2: Validare Manuală
- Profesorul marchează prezența manual în sistem
- Student primește notificare după validare
- Apare în istoric de prezență

#### Validare GPS (Opțional)
- Sistemul verifică automat locația studentului
- Precizie ±15 metri
- Funcționează doar dacă studentul permite accesul la locație
- Previne fraude (scanare QR de la distanță)

---

### 5. 📝 Logging Ore Externe

#### Când se folosește?
Pentru ore de voluntariat desfășurate în afara platformei:
- Activități externe neinregistrate în sistem
- Proiecte personale de voluntariat
- Colaborări cu ONG-uri externe

#### Process
1. Student accesează "Log Hours" din Quick Actions
2. Completează formular:
   - **Activitate**: Titlu activitate externă
   - **Ore**: Număr ore (1-24)
   - **Dată**: Când a avut loc activitatea
   - **Descriere**: Detalii despre ce a făcut
   - **Upload dovezi**: Poze, documente (max 10 fișiere, 5MB/fișier)
3. Trimite cerere
4. **Așteptare aprobare profesor**

#### Status Cerere
- **Pending**: În așteptare revizie profesor
- **Approved**: Aprobată - orele se adaugă la total
- **Rejected**: Respinsă - cu motiv de respingere

#### Notificări
- Email și notificare in-app când profesorul procesează cererea
- Dacă aprobată: "5 hours approved for [Activity Name]!"
- Dacă respinsă: "Request rejected: [Reason]"

---

### 6. 🎓 Certificare

#### Generare Automată
După completarea unei activități și validarea prezenței:
- Sistemul generează automat certificatul
- Notificare: "Certificate ready for [Activity Name]!"
- Link download în dashboard

#### Conținut Certificat
- Nume complet student
- Titlu activitate
- Dată desfășurare
- Număr ore voluntariat
- Număr unic certificat (pentru verificare)
- Semnături digitale (profesor + admin)
- QR code pentru verificare autenticitate

#### Acces Certificat
- Secțiunea "My Certificates" din dashboard
- Download PDF
- Share pe LinkedIn/rețele sociale
- Print pentru portofoliu fizic

---

### 7. 📱 Notificări

#### Tipuri Notificări In-App
- 🎉 **Enrollment Confirmed**: Înscriere confirmată
- ⏰ **Session Reminder**: Reminder 24h/1h înainte
- ✅ **Attendance Validated**: Prezența confirmată
- 📜 **Certificate Ready**: Certificat disponibil pentru download
- ✓ **Hours Approved**: Ore externe aprobate
- ❌ **Activity Cancelled**: Activitate anulată
- 📢 **Activity Updated**: Modificări în activitate înscrisă

#### Preferințe Notificări
Studenții pot controla:
- Email: ON/OFF pentru fiecare tip
- In-App: Vizualizare în header (pictograma clopoțel)
- Frecvență reminder-uri

---

### 8. 👤 Profil Personal

#### Informații Afișate
- **Date personale**:
  - Nume complet
  - Email universitar
  - Telefon
  - Poză profil
- **Informații academice**:
  - Facultate
  - Specializare
  - An de studiu
  - Tip program (Licență/Master/Doctorat)
- **Statistici activitate**:
  - Total ore voluntariat
  - Număr activități completate
  - Badge-uri câștigate
  - Nivel participare

#### Editare Profil
- Upload/Change poză profil
- Update telefon
- Modificare preferințe notificări
- Schimbare parolă

---

### 9. 🏆 Gamification (Viitor)

#### Badge-uri
Câștigate automat pentru:
- **First Timer**: Prima activitate completată
- **Committed**: 10 ore acumulate
- **Dedicated**: 25 ore acumulate
- **Champion**: 50 ore acumulate
- **Category Expert**: 5 activități în aceeași categorie
- **Department Friend**: Participare la activități din 3 departamente
- **Early Bird**: Check-in cu 15 min înainte de start
- **Streak Master**: 5 activități consecutive fără absențe

#### Leaderboard (Viitor)
- Top studenți pe facultate
- Top studenți pe universitate
- Ranking categorie activitate
- Cele mai active luni

---

## Restricții și Limitări

### Ce NU poate face un Student?

❌ **Nu poate crea activități** - Doar profesorii pot crea
❌ **Nu poate valida alte persoane** - Doar propriul check-in
❌ **Nu poate edita activități** - Doar înscriere/anulare
❌ **Nu poate vedea datele altor studenți** - Privacy protejată
❌ **Nu poate aproba ore externe** - Doar profesori pot aproba
❌ **Nu poate modera feedback** - Administrat de echipă

### Politici de Anulare

- **Anulare înscriere**: Posibilă până cu 24h înainte de activitate
- **Penalități**: Anulări repetate (>3) pot duce la restricții temporare
- **Force Majeure**: Anulări justificate medicală nu sunt penalizate

---

## Best Practices pentru Studenți

### 🎯 Maximizarea Experienței

1. **Explorează Diverse Categorii**: Nu te limita la un singur tip de activitate
2. **Citește Descrierea Completă**: Înțelege cerințele înainte de înscriere
3. **Respectă Termenele**: Prezintă-te la timp sau anulează cu 24h înainte
4. **Upload Dovezi Clare**: Pentru ore externe, folosește poze de calitate
5. **Dă Feedback Constructiv**: Ajută la îmbunătățirea activităților viitoare

### ⚠️ De Evitat

1. **Înscrieri Multiple Conflictuale**: Verifică calendarul înainte
2. **No-Show Fără Anulare**: Afectează alți studenți pe waitlist
3. **Dovezi Neclare**: Crește șansele de respingere ore externe
4. **Ignorare Notificări**: Poți pierde informații importante

---

## FAQ Studenți

**Î: Câte activități pot avea simultan?**
R: Nu există limită, dar recomandăm max 3-4 active pentru a le gestiona eficient.

**Î: Pot anula o înscriere?**
R: Da, până cu 24h înainte de activitate, fără penalități.

**Î: Ce se întâmplă dacă lipsesc?**
R: Prezența nu se validează, orele nu se acordă. Absențe repetate pot duce la restricții.

**Î: Cum verific autenticitatea certificatului?**
R: Fiecare certificat are QR code și număr unic verificabil în sistem.

**Î: Pot transfera ore între semestre?**
R: Da, orele acumulate rămân în cont permanent.

**Î: Cum raportez o problemă tehnică?**
R: Contactează suportul la contact@campusconnect-scs.work

---

**Document creat de**: Mihai Octavian & Abbasi Pazeyazd Bianca-Maria
**Ultima actualizare**: Noiembrie 2025
