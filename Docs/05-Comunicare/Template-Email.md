# Template-uri Email - CampusConnect

**Autori**: Mihai Octavian & Abbasi Pazeyazd Bianca-Maria  
**Versiune**: 1.0  
**Data**: Decembrie 2024  

---

## 1. Overview Sistem Email

### 1.1 Provider Email

**Current Setup**: În proces de integrare  
**Planned**: Resend / SendGrid  
**Development**: Console logging  

**Locație**: `src/lib/services/email-notifications.ts`

### 1.2 Design Email

**Brand Colors**:
- Navy (#001f3f) - Header, buttons
- Gold (#FFD700) - Accents, CTA text
- Burgundy (#800020) - Highlights

**Typography**: Sans-serif stack (Arial, system fonts)

---

## 2. Template-uri Standard

### 2.1 ENROLLMENT_CONFIRMED

**Trigger**: Student înscris la activitate (aprobare automată sau de la profesor)

**Subject**: `Înscriere confirmată: {{activity_title}}`

**Variabile**:
- `{{studentName}}` - Nume student
- `{{activityTitle}}` - Titlu activitate
- `{{startDate}}` - Data început
- `{{location}}` - Locație
- `{{link}}` - Link către activitate

**HTML Template**:
```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <!-- Header -->
  <div style="background: #001f3f; padding: 20px; text-align: center;">
    <h1 style="color: #FFD700; margin: 0;">Campus Connect</h1>
  </div>
  
  <!-- Content -->
  <div style="padding: 30px; background: #f9f9f9;">
    <h2 style="color: #001f3f;">Felicitări, {{studentName}}!</h2>
    <p>Înscrierea ta la activitatea <strong>{{activityTitle}}</strong> a fost confirmată.</p>
    
    <p>Detalii activitate:</p>
    <ul>
      <li>Data început: {{startDate}}</li>
      <li>Locație: {{location}}</li>
    </ul>
    
    <a href="{{link}}" 
       style="display: inline-block; 
              background: #001f3f; 
              color: #FFD700; 
              padding: 12px 24px; 
              text-decoration: none; 
              border-radius: 6px; 
              margin-top: 20px;">
      Vezi detalii activitate
    </a>
  </div>
  
  <!-- Footer -->
  <div style="padding: 20px; text-align: center; color: #666; font-size: 12px;">
    © 2024 Campus Connect - Hub de Voluntariat Universitar
  </div>
</div>
```

**Exemplu Final**:
> **Subject**: Înscriere confirmată: STEM Mentorship Program  
> **Body**: "Felicitări, Ana! Înscrierea ta la activitatea STEM Mentorship Program a fost confirmată..."

---

### 2.2 ENROLLMENT_REJECTED

**Trigger**: Profesor respinge înscriere sau capacitate completă

**Subject**: `Înscriere respinsă: {{activity_title}}`

**Variabile**:
- `{{studentName}}`
- `{{activityTitle}}`
- `{{reason}}` - Motiv respingere (optional)
- `{{exploreLink}}` - Link către pagina Explore

**HTML Template**:
```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: #001f3f; padding: 20px; text-align: center;">
    <h1 style="color: #FFD700; margin: 0;">Campus Connect</h1>
  </div>
  
  <div style="padding: 30px; background: #f9f9f9;">
    <h2 style="color: #001f3f;">Bună, {{studentName}}</h2>
    <p>Din păcate, înscrierea ta la activitatea <strong>{{activityTitle}}</strong> nu a putut fi acceptată.</p>
    
    {{#if reason}}
    <p style="background: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; border-radius: 4px;">
      <strong>Motiv:</strong> {{reason}}
    </p>
    {{/if}}
    
    <p>Te încurajăm să explorezi alte oportunități de voluntariat disponibile pe platformă.</p>
    
    <a href="{{exploreLink}}" 
       style="display: inline-block; 
              background: #001f3f; 
              color: #FFD700; 
              padding: 12px 24px; 
              text-decoration: none; 
              border-radius: 6px; 
              margin-top: 20px;">
      Explorează alte activități
    </a>
  </div>
  
  <div style="padding: 20px; text-align: center; color: #666; font-size: 12px;">
    © 2024 Campus Connect - Hub de Voluntariat Universitar
  </div>
</div>
```

---

### 2.3 HOURS_APPROVED

**Trigger**: Profesor aprobă orele pentru un student

**Subject**: `✅ Ore aprobate: {{hours}}h - {{activity_title}}`

**Variabile**:
- `{{studentName}}`
- `{{activityTitle}}`
- `{{hours}}` - Număr ore aprobate
- `{{professorName}}`
- `{{dashboardLink}}`

**HTML Template**:
```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: #001f3f; padding: 20px; text-align: center;">
    <h1 style="color: #FFD700; margin: 0;">Campus Connect</h1>
  </div>
  
  <div style="padding: 30px; background: #f9f9f9;">
    <h2 style="color: #10b981;">✅ Ore aprobate!</h2>
    <p>Felicitări, <strong>{{studentName}}</strong>!</p>
    
    <div style="background: #d1fae5; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981; margin: 20px 0;">
      <p style="margin: 0; color: #047857;">
        <strong>{{hours}} ore</strong> de voluntariat au fost validate pentru activitatea 
        <strong>{{activityTitle}}</strong>
      </p>
      <p style="margin: 10px 0 0; color: #047857; font-size: 14px;">
        Validat de: {{professorName}}
      </p>
    </div>
    
    <p>Orele au fost adăugate în portofoliul tău. Poți vizualiza totalul în dashboard.</p>
    
    <a href="{{dashboardLink}}" 
       style="display: inline-block; 
              background: #10b981; 
              color: white; 
              padding: 12px 24px; 
              text-decoration: none; 
              border-radius: 6px; 
              margin-top: 20px;">
      Vezi Dashboard
    </a>
  </div>
  
  <div style="padding: 20px; text-align: center; color: #666; font-size: 12px;">
    © 2024 Campus Connect
  </div>
</div>
```

---

### 2.4 HOURS_REJECTED

**Trigger**: Profesor respinge cererea de ore

**Subject**: `Cerere ore - {{activity_title}}: Mai multe informații necesare`

**Variabile**:
- `{{studentName}}`
- `{{activityTitle}}`
- `{{hours}}`
- `{{reason}}` - Motiv respingere
- `{{contactLink}}`

**HTML Template**:
```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: #001f3f; padding: 20px; text-align: center;">
    <h1 style="color: #FFD700; margin: 0;">Campus Connect</h1>
  </div>
  
  <div style="padding: 30px; background: #f9f9f9;">
    <h2 style="color: #001f3f;">Bună, {{studentName}}</h2>
    <p>Cererea ta de validare a {{hours}}h pentru activitatea <strong>{{activityTitle}}</strong> necesită informații suplimentare.</p>
    
    <div style="background: #fff3cd; padding: 20px; border-radius: 8px; border-left: 4px solid #ffc107; margin: 20px 0;">
      <p style="margin: 0; color: #856404;">
        <strong>Feedback de la profesor:</strong><br>
        {{reason}}
      </p>
    </div>
    
    <p>Te rugăm să contactezi profesorul pentru clarificări și să reîncerci submisia.</p>
    
    <a href="{{contactLink}}" 
       style="display: inline-block; 
              background: #001f3f; 
              color: #FFD700; 
              padding: 12px 24px; 
              text-decoration: none; 
              border-radius: 6px; 
              margin-top: 20px;">
      Vezi detalii complete
    </a>
  </div>
  
  <div style="padding: 20px; text-align: center; color: #666; font-size: 12px;">
    © 2024 Campus Connect
  </div>
</div>
```

---

### 2.5 CERTIFICATE_READY

**Trigger**: Certificat generat de sistem

**Subject**: `🎓 Certificatul tău este gata - {{activity_title}}`

**Variabile**:
- `{{studentName}}`
- `{{activityTitle}}`
- `{{totalHours}}`
- `{{downloadLink}}`

**HTML Template**:
```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: #001f3f; padding: 20px; text-align: center;">
    <h1 style="color: #FFD700; margin: 0;">Campus Connect</h1>
  </div>
  
  <div style="padding: 30px; background: #f9f9f9; text-align: center;">
    <div style="font-size: 48px; margin-bottom: 20px;">🎓</div>
    <h2 style="color: #001f3f;">Certificatul tău este gata!</h2>
    <p>Felicitări, <strong>{{studentName}}</strong>!</p>
    
    <div style="background: white; padding: 30px; border-radius: 12px; margin: 20px 0; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
      <p style="color: #666; margin: 0;">Certificat pentru</p>
      <h3 style="color: #001f3f; margin: 10px 0;">{{activityTitle}}</h3>
      <p style="color: #FFD700; font-size: 24px; font-weight: bold; margin: 10px 0;">
        {{totalHours}} ore
      </p>
      <p style="color: #666; font-size: 14px; margin: 0;">
        de voluntariat completate cu succes
      </p>
    </div>
    
    <a href="{{downloadLink}}" 
       style="display: inline-block; 
              background: #10b981; 
              color: white; 
              padding: 15px 30px; 
              text-decoration: none; 
              border-radius: 8px; 
              font-size: 16px; 
              font-weight: bold; 
              margin-top: 10px;">
      📥 Descarcă Certificatul (PDF)
    </a>
    
    <p style="color: #666; font-size: 14px; margin-top: 30px;">
      Certificatul este semnat digital și poate fi verificat de către angajatori.
    </p>
  </div>
  
  <div style="padding: 20px; text-align: center; color: #666; font-size: 12px;">
    © 2024 Campus Connect
  </div>
</div>
```

---

### 2.6 NEW_ENROLLMENT (Pentru Profesori)

**Trigger**: Student se înscrie la activitatea profesorului

**Subject**: `📋 Înscriere nouă: {{student_name}} - {{activity_title}}`

**Variabile**:
- `{{professorName}}`
- `{{studentName}}`
- `{{studentEmail}}`
- `{{activityTitle}}`
- `{{reviewLink}}`

**HTML Template**:
```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: #001f3f; padding: 20px; text-align: center;">
    <h1 style="color: #FFD700; margin: 0;">Campus Connect</h1>
  </div>
  
  <div style="padding: 30px; background: #f9f9f9;">
    <h2 style="color: #001f3f;">📋 Înscriere nouă</h2>
    <p>Bună, <strong>{{professorName}}</strong>!</p>
    
    <p>Un student s-a înscris la activitatea ta:</p>
    
    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e5e7eb;">
      <p style="margin: 5px 0;"><strong>Student:</strong> {{studentName}}</p>
      <p style="margin: 5px 0;"><strong>Email:</strong> {{studentEmail}}</p>
      <p style="margin: 5px 0;"><strong>Activitate:</strong> {{activityTitle}}</p>
    </div>
    
    <p style="color: #666; font-size: 14px;">
      Te rugăm să verifici înscrierea și să o aprobi sau să ceri informații suplimentare.
    </p>
    
    <a href="{{reviewLink}}" 
       style="display: inline-block; 
              background: #001f3f; 
              color: #FFD700; 
              padding: 12px 24px; 
              text-decoration: none; 
              border-radius: 6px; 
              margin-top: 10px;">
      Verifică înscrierea
    </a>
  </div>
  
  <div style="padding: 20px; text-align: center; color: #666; font-size: 12px;">
    © 2024 Campus Connect
  </div>
</div>
```

---

## 3. Template-uri Custom

### 3.1 Editor Template Email

**Locație**: `/dashboard/email-templates`

**Acces**: Doar ADMIN

**Funcționalități**:
- ✅ Editor HTML vizual
- ✅ Preview în timp real
- ✅ Variabile predefinite: `{{student_name}}`, `{{activity_title}}`, etc.
- ✅ Multiple tipuri template
- ✅ Versioning (active/inactive)

**Tipuri Template Custom**:
- `application_accepted` - Aplicație acceptată
- `application_rejected` - Aplicație respinsă
- `application_waitlisted` - Listă așteptare
- `hours_approved` - Ore aprobate
- `hours_rejected` - Ore respinse
- `hours_info_requested` - Informații suplimentare necesare
- `certificate_generated` - Certificat generat
- `session_reminder` - Reminder sesiune
- `welcome_email` - Email bun venit

### 3.2 Variabile Template

**Globale** (disponibile în toate template-urile):
```
{{app_url}} - https://campus-connect.vercel.app
{{current_year}} - 2024
{{support_email}} - support@campusconnect.ro
```

**Student-specifice**:
```
{{student_name}} - Nume complet student
{{student_email}} - Email student
{{student_id}} - UUID student
```

**Profesor-specifice**:
```
{{professor_name}} - Nume profesor
{{professor_email}} - Email profesor
```

**Activitate-specifice**:
```
{{activity_title}} - Titlu activitate
{{activity_date}} - Data activitate
{{activity_location}} - Locație
{{activity_hours}} - Număr ore
{{activity_category}} - Categorie
```

**Link-uri**:
```
{{dashboard_link}} - Link către dashboard
{{activity_link}} - Link către pagina activității
{{profile_link}} - Link către profil
{{explore_link}} - Link către Explore
```

---

## 4. Best Practices

### 4.1 Design Guidelines

✅ **Do's**:
- Max width: 600px pentru compatibilitate
- Inline CSS (mail clients nu suportă `<style>`)
- Folosește tabele pentru layout complex
- Testează pe multiple mail clients (Gmail, Outlook, Apple Mail)
- Include fallback fonts
- ALT text pentru imagini

❌ **Don'ts**:
- Nu folosi JavaScript
- Nu folosi `<video>` sau `<audio>`
- Evită background images (suport limitat)
- Nu folosi grid/flexbox
- Nu include forme (`<form>`)

### 4.2 Accessibility

- **Contrast**: Minimum 4.5:1 pentru text
- **Font size**: Minimum 14px pentru body text
- **Alt text**: Mandatory pentru toate imaginile
- **Semantic HTML**: Folosește `<h1>`, `<h2>`, `<p>`, `<ul>`
- **Link text**: Descriptiv ("Vezi activitatea" nu "Click aici")

### 4.3 Spam Prevention

✅ **Include**:
- Adresa fizică în footer
- Unsubscribe link (pentru bulk emails)
- Autentificare SPF/DKIM/DMARC

❌ **Evită**:
- ALL CAPS în subject
- Prea multe exclamation marks!!!
- Cuvinte spam ("FREE", "URGENT", "ACT NOW")
- Atașamente (link către descărcare)

---

## 5. Testing Templates

### 5.1 Development Testing

```typescript
// Test email logging
import { sendEmail } from '@/lib/services/email-notifications';

const testData = {
  email: 'test@example.com',
  studentName: 'Ana Popescu',
  activityTitle: 'STEM Mentorship',
  startDate: '15 Ianuarie 2025',
  location: 'Corp A, Sala 101',
  link: 'https://campus-connect.vercel.app/activity/123'
};

await sendEmail('ENROLLMENT_CONFIRMED', testData);
// Check console for logged email
```

### 5.2 Mail Clients Testing

**Servicii recomandate**:
- [Litmus](https://litmus.com) - €99/month
- [Email on Acid](https://www.emailonacid.com) - €45/month
- [Mailtrap](https://mailtrap.io) - Free tier disponibil

**Mail clients de testat**:
- Gmail (Web, Android, iOS)
- Outlook (Desktop, Web, Mobile)
- Apple Mail (macOS, iOS)
- Yahoo Mail
- ProtonMail

---

## 6. Email Service Integration

### 6.1 Resend (Recomandat)

```typescript
// lib/email/resend-client.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmailViaResend({
  to,
  subject,
  html
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const { data, error } = await resend.emails.send({
    from: 'Campus Connect <noreply@campusconnect.ro>',
    to,
    subject,
    html,
  });

  if (error) {
    console.error('Resend error:', error);
    return { success: false, error };
  }

  return { success: true, data };
}
```

**Setup**:
1. Create account pe [resend.com](https://resend.com)
2. Verify domain (campusconnect.ro)
3. Get API key
4. Add `RESEND_API_KEY` în `.env`

### 6.2 Alternative: SendGrid

```typescript
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function sendEmailViaSendGrid({
  to,
  subject,
  html
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const msg = {
    to,
    from: 'noreply@campusconnect.ro',
    subject,
    html,
  };

  try {
    await sgMail.send(msg);
    return { success: true };
  } catch (error) {
    console.error('SendGrid error:', error);
    return { success: false, error };
  }
}
```

---

## 7. Metrici și Analytics

### 7.1 Email Stats

**Recommended Tracking**:
- **Open rate**: % emails deschise
- **Click rate**: % link-uri click-uite
- **Bounce rate**: % emails nelivrate
- **Unsubscribe rate**: % dezabonări

**Tools**:
- Resend Dashboard (built-in analytics)
- SendGrid Analytics
- Custom tracking cu UTM parameters

### 7.2 UTM Parameters

```
{{dashboardLink}}?utm_source=email&utm_medium=email&utm_campaign=enrollment_confirmed
```

Tracking în Google Analytics pentru a vedea conversii din emails.

---

**Document creat de**: Mihai Octavian & Abbasi Pazeyazd Bianca-Maria  
**Ultima actualizare**: Decembrie 2024  
**Versiune**: 1.0
