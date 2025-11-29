import { createClient } from '@/lib/supabase/server';

export type NotificationType =
  | 'ENROLLMENT_CONFIRMED'
  | 'ENROLLMENT_REJECTED'
  | 'HOURS_APPROVED'
  | 'HOURS_REJECTED'
  | 'SESSION_REMINDER'
  | 'PROFESSOR_REQUEST_APPROVED'
  | 'PROFESSOR_REQUEST_REJECTED'
  | 'NEW_ENROLLMENT'
  | 'HOURS_REQUEST'
  | 'ACTIVITY_CREATED';

interface EmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

interface NotificationPayload {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  metadata?: Record<string, unknown>;
}

// Email templates
const EMAIL_TEMPLATES: Record<NotificationType, (data: Record<string, unknown>) => EmailData> = {
  ENROLLMENT_CONFIRMED: (data) => ({
    to: data.email as string,
    subject: `Înscriere confirmată: ${data.activityTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #001f3f; padding: 20px; text-align: center;">
          <h1 style="color: #FFD700; margin: 0;">Campus Connect</h1>
        </div>
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #001f3f;">Felicitări, ${data.studentName}!</h2>
          <p>Înscrierea ta la activitatea <strong>${data.activityTitle}</strong> a fost confirmată.</p>
          <p>Detalii activitate:</p>
          <ul>
            <li>Data început: ${data.startDate}</li>
            <li>Locație: ${data.location || 'Va fi anunțată'}</li>
          </ul>
          <a href="${data.link}" style="display: inline-block; background: #001f3f; color: #FFD700; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px;">
            Vezi detalii activitate
          </a>
        </div>
        <div style="padding: 20px; text-align: center; color: #666; font-size: 12px;">
          © ${new Date().getFullYear()} Campus Connect - Hub de Voluntariat Universitar
        </div>
      </div>
    `,
  }),

  ENROLLMENT_REJECTED: (data) => ({
    to: data.email as string,
    subject: `Înscriere respinsă: ${data.activityTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #001f3f; padding: 20px; text-align: center;">
          <h1 style="color: #FFD700; margin: 0;">Campus Connect</h1>
        </div>
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #001f3f;">Bună, ${data.studentName}</h2>
          <p>Din păcate, înscrierea ta la activitatea <strong>${data.activityTitle}</strong> nu a putut fi acceptată.</p>
          ${data.reason ? `<p><strong>Motiv:</strong> ${data.reason}</p>` : ''}
          <p>Te încurajăm să explorezi alte oportunități de voluntariat disponibile pe platformă.</p>
          <a href="${data.exploreLink}" style="display: inline-block; background: #001f3f; color: #FFD700; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px;">
            Explorează alte activități
          </a>
        </div>
        <div style="padding: 20px; text-align: center; color: #666; font-size: 12px;">
          © ${new Date().getFullYear()} Campus Connect - Hub de Voluntariat Universitar
        </div>
      </div>
    `,
  }),

  HOURS_APPROVED: (data) => ({
    to: data.email as string,
    subject: `Ore aprobate: ${data.hours}h pentru ${data.activityTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #001f3f; padding: 20px; text-align: center;">
          <h1 style="color: #FFD700; margin: 0;">Campus Connect</h1>
        </div>
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #22c55e;">✓ Ore aprobate!</h2>
          <p>Bună, ${data.studentName}!</p>
          <p>Cererea ta de <strong>${data.hours} ore</strong> pentru activitatea <strong>${data.activityTitle}</strong> a fost aprobată.</p>
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; font-size: 24px; color: #001f3f; font-weight: bold;">
              Total ore acumulate: ${data.totalHours}h
            </p>
          </div>
          <a href="${data.link}" style="display: inline-block; background: #001f3f; color: #FFD700; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
            Vezi istoricul orelor
          </a>
        </div>
        <div style="padding: 20px; text-align: center; color: #666; font-size: 12px;">
          © ${new Date().getFullYear()} Campus Connect - Hub de Voluntariat Universitar
        </div>
      </div>
    `,
  }),

  HOURS_REJECTED: (data) => ({
    to: data.email as string,
    subject: `Ore respinse: ${data.activityTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #001f3f; padding: 20px; text-align: center;">
          <h1 style="color: #FFD700; margin: 0;">Campus Connect</h1>
        </div>
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #ef4444;">Cerere ore respinsă</h2>
          <p>Bună, ${data.studentName}</p>
          <p>Cererea ta de ore pentru activitatea <strong>${data.activityTitle}</strong> a fost respinsă.</p>
          ${data.reason ? `<p><strong>Motiv:</strong> ${data.reason}</p>` : ''}
          <p>Dacă ai întrebări, contactează profesorul coordonator.</p>
        </div>
        <div style="padding: 20px; text-align: center; color: #666; font-size: 12px;">
          © ${new Date().getFullYear()} Campus Connect - Hub de Voluntariat Universitar
        </div>
      </div>
    `,
  }),

  SESSION_REMINDER: (data) => ({
    to: data.email as string,
    subject: `Reminder: Sesiune mâine - ${data.activityTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #001f3f; padding: 20px; text-align: center;">
          <h1 style="color: #FFD700; margin: 0;">Campus Connect</h1>
        </div>
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #001f3f;">🔔 Reminder sesiune</h2>
          <p>Bună, ${data.studentName}!</p>
          <p>Mâine ai o sesiune programată:</p>
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #FFD700;">
            <h3 style="margin: 0 0 10px;">${data.activityTitle}</h3>
            <p style="margin: 5px 0;">📅 ${data.date}</p>
            <p style="margin: 5px 0;">🕐 ${data.time}</p>
            <p style="margin: 5px 0;">📍 ${data.location}</p>
          </div>
          <p>Nu uita să faci check-in prin scanarea codului QR!</p>
        </div>
        <div style="padding: 20px; text-align: center; color: #666; font-size: 12px;">
          © ${new Date().getFullYear()} Campus Connect - Hub de Voluntariat Universitar
        </div>
      </div>
    `,
  }),

  PROFESSOR_REQUEST_APPROVED: (data) => ({
    to: data.email as string,
    subject: 'Cerere rol profesor aprobată',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #001f3f; padding: 20px; text-align: center;">
          <h1 style="color: #FFD700; margin: 0;">Campus Connect</h1>
        </div>
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #22c55e;">✓ Cerere aprobată!</h2>
          <p>Bună, ${data.professorName}!</p>
          <p>Cererea ta pentru rolul de profesor a fost aprobată. Acum poți:</p>
          <ul>
            <li>Crea și gestiona activități de voluntariat</li>
            <li>Valida prezența studenților</li>
            <li>Aproba cererile de ore</li>
            <li>Genera rapoarte</li>
          </ul>
          <a href="${data.dashboardLink}" style="display: inline-block; background: #001f3f; color: #FFD700; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px;">
            Accesează dashboard profesor
          </a>
        </div>
        <div style="padding: 20px; text-align: center; color: #666; font-size: 12px;">
          © ${new Date().getFullYear()} Campus Connect - Hub de Voluntariat Universitar
        </div>
      </div>
    `,
  }),

  PROFESSOR_REQUEST_REJECTED: (data) => ({
    to: data.email as string,
    subject: 'Cerere rol profesor respinsă',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #001f3f; padding: 20px; text-align: center;">
          <h1 style="color: #FFD700; margin: 0;">Campus Connect</h1>
        </div>
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #ef4444;">Cerere respinsă</h2>
          <p>Bună, ${data.professorName}</p>
          <p>Din păcate, cererea ta pentru rolul de profesor nu a fost aprobată.</p>
          ${data.reason ? `<p><strong>Motiv:</strong> ${data.reason}</p>` : ''}
          <p>Dacă consideri că a fost o eroare, te rugăm să contactezi administratorul platformei.</p>
        </div>
        <div style="padding: 20px; text-align: center; color: #666; font-size: 12px;">
          © ${new Date().getFullYear()} Campus Connect - Hub de Voluntariat Universitar
        </div>
      </div>
    `,
  }),

  NEW_ENROLLMENT: (data) => ({
    to: data.email as string,
    subject: `Înscriere nouă: ${data.studentName} - ${data.activityTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #001f3f; padding: 20px; text-align: center;">
          <h1 style="color: #FFD700; margin: 0;">Campus Connect</h1>
        </div>
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #001f3f;">📋 Înscriere nouă</h2>
          <p>Un student s-a înscris la activitatea ta:</p>
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Student:</strong> ${data.studentName}</p>
            <p><strong>Email:</strong> ${data.studentEmail}</p>
            <p><strong>Activitate:</strong> ${data.activityTitle}</p>
          </div>
          <a href="${data.reviewLink}" style="display: inline-block; background: #001f3f; color: #FFD700; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
            Verifică înscrierea
          </a>
        </div>
        <div style="padding: 20px; text-align: center; color: #666; font-size: 12px;">
          © ${new Date().getFullYear()} Campus Connect - Hub de Voluntariat Universitar
        </div>
      </div>
    `,
  }),

  HOURS_REQUEST: (data) => ({
    to: data.email as string,
    subject: `Cerere ore nouă: ${data.studentName} - ${data.hours}h`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #001f3f; padding: 20px; text-align: center;">
          <h1 style="color: #FFD700; margin: 0;">Campus Connect</h1>
        </div>
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #001f3f;">⏱️ Cerere ore nouă</h2>
          <p>Un student a trimis o cerere de validare ore:</p>
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Student:</strong> ${data.studentName}</p>
            <p><strong>Activitate:</strong> ${data.activityTitle}</p>
            <p><strong>Ore solicitate:</strong> ${data.hours}h</p>
          </div>
          <a href="${data.reviewLink}" style="display: inline-block; background: #001f3f; color: #FFD700; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
            Verifică cererea
          </a>
        </div>
        <div style="padding: 20px; text-align: center; color: #666; font-size: 12px;">
          © ${new Date().getFullYear()} Campus Connect - Hub de Voluntariat Universitar
        </div>
      </div>
    `,
  }),

  ACTIVITY_CREATED: (data) => ({
    to: data.email as string,
    subject: `Activitate nouă: ${data.activityTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #001f3f; padding: 20px; text-align: center;">
          <h1 style="color: #FFD700; margin: 0;">Campus Connect</h1>
        </div>
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #001f3f;">🌟 Activitate nouă disponibilă!</h2>
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #001f3f; margin-top: 0;">${data.activityTitle}</h3>
            <p>${data.description}</p>
            <p><strong>Categorie:</strong> ${data.category}</p>
            <p><strong>Locuri disponibile:</strong> ${data.spots}</p>
          </div>
          <a href="${data.link}" style="display: inline-block; background: #001f3f; color: #FFD700; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
            Vezi detalii și înscrie-te
          </a>
        </div>
        <div style="padding: 20px; text-align: center; color: #666; font-size: 12px;">
          © ${new Date().getFullYear()} Campus Connect - Hub de Voluntariat Universitar
        </div>
      </div>
    `,
  }),
};

/**
 * Send an in-app notification
 */
export async function sendNotification(payload: NotificationPayload): Promise<boolean> {
  try {
    const supabase = await createClient();

    const { error } = await supabase.from('notifications').insert({
      user_id: payload.userId,
      type: payload.type,
      title: payload.title,
      message: payload.message,
      link: payload.link,
      metadata: payload.metadata,
      read: false,
    });

    if (error) {
      console.error('Error sending notification:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in sendNotification:', error);
    return false;
  }
}

/**
 * Send an email notification (uses Supabase Edge Function or SMTP)
 * For now, this logs the email - integrate with actual email service
 */
export async function sendEmail(
  type: NotificationType,
  data: Record<string, unknown>
): Promise<boolean> {
  try {
    const template = EMAIL_TEMPLATES[type];
    if (!template) {
      console.error(`No email template for type: ${type}`);
      return false;
    }

    const emailData = template(data);

    // Log email for development
    console.log('📧 Email to be sent:', {
      to: emailData.to,
      subject: emailData.subject,
      // html: emailData.html // Uncomment to see full HTML
    });

    // TODO: Integrate with actual email service (Resend, SendGrid, etc.)
    // Example with Resend:
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: 'Campus Connect <noreply@campusconnect.ro>',
    //   to: emailData.to,
    //   subject: emailData.subject,
    //   html: emailData.html,
    // });

    return true;
  } catch (error) {
    console.error('Error in sendEmail:', error);
    return false;
  }
}

/**
 * Send both in-app and email notifications
 */
export async function notifyUser(
  type: NotificationType,
  userId: string,
  data: Record<string, unknown> & { email: string; title: string; message: string; link?: string }
): Promise<void> {
  // Send in-app notification
  await sendNotification({
    userId,
    type,
    title: data.title,
    message: data.message,
    link: data.link,
    metadata: data,
  });

  // Send email notification
  await sendEmail(type, data);
}
