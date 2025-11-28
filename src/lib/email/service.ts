/**
 * Email Service
 *
 * Handles sending transactional emails via Resend API directly.
 * Supports application acceptance, rejection, and waitlist notifications.
 */

// Email configuration from environment
const EMAIL_CONFIG = {
  resendApiKey: process.env.SMTP_PASSWORD!, // Resend API key
  fromEmail: process.env.SMTP_FROM_EMAIL || 'noreply@campusconnect-scs.work',
  fromName: process.env.SMTP_FROM_NAME || 'Campus Connect',
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
};

/**
 * Rate limiter to prevent email abuse
 * Tracks email sends per user (max 5 per hour)
 */
const emailRateLimits = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(email: string): boolean {
  const now = Date.now();
  const limit = emailRateLimits.get(email);

  if (!limit || now > limit.resetAt) {
    // New entry or expired - reset
    emailRateLimits.set(email, { count: 1, resetAt: now + 3600000 }); // 1 hour
    return true;
  }

  if (limit.count >= 5) {
    console.warn(`[Email] Rate limit exceeded for ${email}`);
    return false;
  }

  // Increment count
  limit.count++;
  emailRateLimits.set(email, limit);
  return true;
}

/**
 * Send email via Resend API
 */
async function sendEmail(params: {
  to: string;
  subject: string;
  html: string;
}): Promise<{ success: boolean; error?: string }> {
  const { to, subject, html } = params;

  // Check rate limit
  if (!checkRateLimit(to)) {
    return {
      success: false,
      error: 'Rate limit exceeded. Maximum 5 emails per hour.',
    };
  }

  try {
    // Send email using Resend API
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${EMAIL_CONFIG.resendApiKey}`,
      },
      body: JSON.stringify({
        from: `${EMAIL_CONFIG.fromName} <${EMAIL_CONFIG.fromEmail}>`,
        to: [to],
        subject,
        html,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('[Email] Send failed:', data);
      return { success: false, error: data.message || 'Failed to send email' };
    }

    console.log(`[Email] Sent successfully to ${to} (ID: ${data.id})`);
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Email] Exception:', message);
    return { success: false, error: message };
  }
}

/**
 * Send application accepted email
 */
export async function sendApplicationAcceptedEmail(params: {
  studentEmail: string;
  studentName: string;
  activityTitle: string;
  professorName: string;
  customMessage?: string;
  activityId: string;
}): Promise<{ success: boolean; error?: string }> {
  const { studentEmail, studentName, activityTitle, professorName, customMessage, activityId } =
    params;

  const subject = `Aplicația ta a fost acceptată - ${activityTitle}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1f2937; background-color: #ffffff; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff !important; padding: 30px; border-radius: 8px 8px 0 0; }
    .header h1 { color: #ffffff !important; margin: 0; font-size: 28px; }
    .header p { color: #ffffff !important; margin: 10px 0 0 0; opacity: 0.95; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
    .content p { color: #374151 !important; }
    .message-box { background: #e0e7ff; border-left: 4px solid #667eea; padding: 15px; margin: 20px 0; border-radius: 4px; color: #1e40af !important; }
    .message-box strong { color: #1e40af !important; }
    .message-box p { color: #1e40af !important; }
    .details { background: #ffffff; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e5e7eb; }
    .details h3 { color: #667eea !important; margin-top: 0; }
    .detail-row { padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #1f2937 !important; }
    .detail-row:last-child { border-bottom: none; }
    .detail-label { font-weight: 600; color: #6b7280 !important; }
    .detail-row strong { color: #111827 !important; }
    .button { display: inline-block; background: #667eea !important; color: #ffffff !important; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: 600; }
    .footer { text-align: center; padding: 20px; color: #6b7280 !important; font-size: 14px; background-color: #ffffff; }
    .footer strong { color: #374151 !important; }
    .footer a { color: #667eea !important; text-decoration: underline; }
  </style>
</head>
<body style="background-color: #ffffff; color: #1f2937;">
  <div class="container" style="background-color: #ffffff;">
    <div class="header" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff;">
      <h1 style="margin: 0; font-size: 28px; color: #ffffff;">🎉 Felicitări!</h1>
      <p style="margin: 10px 0 0 0; opacity: 0.95; color: #ffffff;">Aplicația ta a fost acceptată</p>
    </div>

    <div class="content" style="background: #f9fafb;">
      <p style="color: #374151;">Bună <strong style="color: #111827;">${studentName}</strong>,</p>

      ${
        customMessage
          ? `
        <div class="message-box" style="background: #e0e7ff; color: #1e40af;">
          <strong style="color: #1e40af;">Mesaj de la profesor:</strong>
          <p style="margin: 10px 0 0 0; color: #1e40af;">${customMessage}</p>
        </div>
      `
          : ''
      }

      <div class="details" style="background: #ffffff; border: 1px solid #e5e7eb;">
        <h3 style="margin-top: 0; color: #667eea;">Detalii Activitate</h3>
        <div class="detail-row" style="color: #1f2937;">
          <span class="detail-label" style="color: #6b7280;">Titlu:</span><br>
          <strong style="color: #111827;">${activityTitle}</strong>
        </div>
        <div class="detail-row" style="color: #1f2937;">
          <span class="detail-label" style="color: #6b7280;">Profesor:</span><br>
          <span style="color: #374151;">${professorName}</span>
        </div>
      </div>

      <a href="${EMAIL_CONFIG.appUrl}/opportunities/${activityId}" class="button" style="background: #667eea; color: #ffffff; text-decoration: none;">
        Vezi Detalii Complete
      </a>

      <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
        Poți accesa toate detaliile despre activitate și următorii pași în dashboard-ul tău.
      </p>
    </div>

    <div class="footer" style="background-color: #ffffff; color: #6b7280;">
      <p style="color: #6b7280;">Cu drag,<br><strong style="color: #374151;">Echipa Campus Connect</strong></p>
      <p style="font-size: 12px; margin-top: 20px; color: #6b7280;">
        <a href="${EMAIL_CONFIG.appUrl}" style="color: #667eea; text-decoration: underline;">Campus Connect</a> •
        <a href="${EMAIL_CONFIG.appUrl}/dashboard" style="color: #667eea; text-decoration: underline;">Dashboard</a>
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();

  return sendEmail({ to: studentEmail, subject, html });
}

/**
 * Send application rejected email
 */
export async function sendApplicationRejectedEmail(params: {
  studentEmail: string;
  studentName: string;
  activityTitle: string;
  professorName: string;
  rejectionReason: string;
  customMessage?: string;
  isWaitlisted?: boolean;
}): Promise<{ success: boolean; error?: string }> {
  const {
    studentEmail,
    studentName,
    activityTitle,
    professorName,
    rejectionReason,
    customMessage,
    isWaitlisted = false,
  } = params;

  const subject = isWaitlisted
    ? `Lista de așteptare - ${activityTitle}`
    : `Actualizare aplicație - ${activityTitle}`;

  const statusLabel = isWaitlisted ? 'Listă de Așteptare' : 'Respinsă';
  const statusColor = isWaitlisted ? '#f59e0b' : '#ef4444';
  const statusEmoji = isWaitlisted ? '⏳' : '📋';

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1f2937; background-color: #ffffff; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff !important; padding: 30px; border-radius: 8px 8px 0 0; }
    .header h1 { color: #ffffff !important; margin: 0; font-size: 28px; }
    .header p { color: #ffffff !important; margin: 10px 0 0 0; opacity: 0.95; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
    .content p { color: #374151 !important; }
    .message-box { background: #fef3c7; border-left: 4px solid ${statusColor}; padding: 15px; margin: 20px 0; border-radius: 4px; color: #92400e !important; }
    .message-box strong { color: #78350f !important; }
    .message-box p { color: #92400e !important; }
    .details { background: #ffffff; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e5e7eb; }
    .detail-row { padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #1f2937 !important; }
    .detail-row:last-child { border-bottom: none; }
    .detail-label { font-weight: 600; color: #6b7280 !important; }
    .detail-row strong { color: #111827 !important; }
    .status-badge { display: inline-block; background: ${statusColor}; color: #ffffff !important; padding: 6px 12px; border-radius: 4px; font-size: 14px; font-weight: 600; }
    .button { display: inline-block; background: #667eea !important; color: #ffffff !important; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: 600; }
    .footer { text-align: center; padding: 20px; color: #6b7280 !important; font-size: 14px; background-color: #ffffff; }
    .footer strong { color: #374151 !important; }
    .footer a { color: #667eea !important; text-decoration: underline; }
    .info-box { background: #fef3c7; padding: 15px; border-radius: 6px; border-left: 4px solid #f59e0b; color: #92400e !important; }
    .info-box strong { color: #78350f !important; }
  </style>
</head>
<body style="background-color: #ffffff; color: #1f2937;">
  <div class="container" style="background-color: #ffffff;">
    <div class="header" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff;">
      <h1 style="margin: 0; font-size: 28px; color: #ffffff;">${statusEmoji} Actualizare Aplicație</h1>
      <p style="margin: 10px 0 0 0; opacity: 0.95; color: #ffffff;">${activityTitle}</p>
    </div>

    <div class="content" style="background: #f9fafb;">
      <p style="color: #374151;">Bună <strong style="color: #111827;">${studentName}</strong>,</p>

      ${
        customMessage
          ? `
        <div class="message-box" style="background: #fef3c7; color: #92400e;">
          <strong style="color: #78350f;">Mesaj de la profesor:</strong>
          <p style="margin: 10px 0 0 0; color: #92400e;">${customMessage}</p>
        </div>
      `
          : ''
      }

      <div class="details" style="background: #ffffff; border: 1px solid #e5e7eb;">
        <div class="detail-row" style="color: #1f2937;">
          <span class="detail-label" style="color: #6b7280;">Activitate:</span><br>
          <strong style="color: #111827;">${activityTitle}</strong>
        </div>
        <div class="detail-row" style="color: #1f2937;">
          <span class="detail-label" style="color: #6b7280;">Profesor:</span><br>
          <span style="color: #374151;">${professorName}</span>
        </div>
        <div class="detail-row" style="color: #1f2937;">
          <span class="detail-label" style="color: #6b7280;">Motiv:</span><br>
          <span style="color: #374151;">${rejectionReason}</span>
        </div>
        <div class="detail-row" style="color: #1f2937;">
          <span class="detail-label" style="color: #6b7280;">Status:</span><br>
          <span class="status-badge" style="background: ${statusColor}; color: #ffffff;">${statusLabel}</span>
        </div>
      </div>

      ${
        isWaitlisted
          ? `
        <p class="info-box" style="background: #fef3c7; padding: 15px; border-radius: 6px; border-left: 4px solid #f59e0b; color: #92400e;">
          <strong style="color: #78350f;">📌 Listă de așteptare:</strong><br>
          <span style="color: #92400e;">Te-am adăugat în lista de așteptare. Dacă se eliberează un loc, te vom contacta imediat prin email.</span>
        </p>
      `
          : `
        <p style="color: #6b7280;">
          Te încurajăm să explorezi alte oportunități de voluntariat disponibile pe platformă.
        </p>
      `
      }

      <a href="${EMAIL_CONFIG.appUrl}/opportunities" class="button" style="background: #667eea; color: #ffffff; text-decoration: none;">
        ${isWaitlisted ? 'Alte Oportunități' : 'Explorează Oportunități'}
      </a>
    </div>

    <div class="footer" style="background-color: #ffffff; color: #6b7280;">
      <p style="color: #6b7280;">Cu drag,<br><strong style="color: #374151;">Echipa Campus Connect</strong></p>
      <p style="font-size: 12px; margin-top: 20px; color: #6b7280;">
        <a href="${EMAIL_CONFIG.appUrl}" style="color: #667eea; text-decoration: underline;">Campus Connect</a> •
        <a href="${EMAIL_CONFIG.appUrl}/dashboard" style="color: #667eea; text-decoration: underline;">Dashboard</a>
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();

  return sendEmail({ to: studentEmail, subject, html });
}

/**
 * Send hours approved email
 */
export async function sendHoursApprovedEmail(params: {
  studentEmail: string;
  studentName: string;
  activityTitle: string;
  professorName: string;
  hours: number;
  date: string;
  notes?: string;
}): Promise<{ success: boolean; error?: string }> {
  const { studentEmail, studentName, activityTitle, professorName, hours, date, notes } = params;

  const subject = `Orele tale au fost aprobate - ${activityTitle}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1f2937; background-color: #ffffff; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; }
    .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff !important; padding: 30px; border-radius: 8px 8px 0 0; }
    .header h1 { color: #ffffff !important; margin: 0; font-size: 28px; }
    .header p { color: #ffffff !important; margin: 10px 0 0 0; opacity: 0.95; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
    .content p { color: #374151 !important; }
    .success-box { background: #d1fae5; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0; border-radius: 4px; color: #065f46 !important; }
    .success-box strong { color: #065f46 !important; }
    .details { background: #ffffff; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e5e7eb; }
    .detail-row { padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #1f2937 !important; }
    .detail-row:last-child { border-bottom: none; }
    .detail-label { font-weight: 600; color: #6b7280 !important; }
    .detail-row strong { color: #111827 !important; }
    .hours-badge { display: inline-block; background: #10b981; color: #ffffff !important; padding: 8px 16px; border-radius: 6px; font-size: 18px; font-weight: 700; }
    .button { display: inline-block; background: #10b981 !important; color: #ffffff !important; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: 600; }
    .footer { text-align: center; padding: 20px; color: #6b7280 !important; font-size: 14px; background-color: #ffffff; }
    .footer strong { color: #374151 !important; }
    .footer a { color: #10b981 !important; text-decoration: underline; }
  </style>
</head>
<body style="background-color: #ffffff; color: #1f2937;">
  <div class="container" style="background-color: #ffffff;">
    <div class="header" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff;">
      <h1 style="margin: 0; font-size: 28px; color: #ffffff;">✅ Ore Aprobate!</h1>
      <p style="margin: 10px 0 0 0; opacity: 0.95; color: #ffffff;">Cererea ta a fost validată</p>
    </div>

    <div class="content" style="background: #f9fafb;">
      <p style="color: #374151;">Bună <strong style="color: #111827;">${studentName}</strong>,</p>

      <div class="success-box" style="background: #d1fae5; color: #065f46;">
        <strong style="color: #065f46;">Vestea bună:</strong> Profesorul <strong>${professorName}</strong> a aprobat <span class="hours-badge" style="background: #10b981; color: #ffffff;">${hours} ore</span> pentru activitatea <strong>${activityTitle}</strong>.
      </div>

      ${
        notes
          ? `
      <div class="details" style="background: #ffffff; border: 1px solid #e5e7eb;">
        <strong style="color: #10b981;">💬 Notițe de la profesor:</strong>
        <p style="margin: 10px 0 0 0; color: #374151;">${notes}</p>
      </div>
      `
          : ''
      }

      <div class="details" style="background: #ffffff; border: 1px solid #e5e7eb;">
        <h3 style="margin-top: 0; color: #10b981;">Detalii Cerere</h3>
        <div class="detail-row" style="color: #1f2937;">
          <span class="detail-label" style="color: #6b7280;">Activitate:</span><br>
          <strong style="color: #111827;">${activityTitle}</strong>
        </div>
        <div class="detail-row" style="color: #1f2937;">
          <span class="detail-label" style="color: #6b7280;">Data:</span><br>
          <span style="color: #374151;">${date}</span>
        </div>
        <div class="detail-row" style="color: #1f2937;">
          <span class="detail-label" style="color: #6b7280;">Ore aprobate:</span><br>
          <strong style="color: #10b981; font-size: 18px;">${hours} ore</strong>
        </div>
      </div>

      <a href="${EMAIL_CONFIG.appUrl}/dashboard" class="button" style="background: #10b981; color: #ffffff; text-decoration: none;">
        Vezi Dashboard
      </a>

      <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
        Orele au fost adăugate la totalul tău de ore validate. Le poți vedea în dashboard-ul tău.
      </p>
    </div>

    <div class="footer" style="background-color: #ffffff; color: #6b7280;">
      <p style="color: #6b7280;">Cu drag,<br><strong style="color: #374151;">Echipa Campus Connect</strong></p>
      <p style="font-size: 12px; margin-top: 20px; color: #6b7280;">
        <a href="${EMAIL_CONFIG.appUrl}" style="color: #10b981; text-decoration: underline;">Campus Connect</a> •
        <a href="${EMAIL_CONFIG.appUrl}/dashboard" style="color: #10b981; text-decoration: underline;">Dashboard</a>
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();

  return sendEmail({ to: studentEmail, subject, html });
}

/**
 * Send hours rejected email
 */
export async function sendHoursRejectedEmail(params: {
  studentEmail: string;
  studentName: string;
  activityTitle: string;
  professorName: string;
  hours: number;
  date: string;
  reason: string;
}): Promise<{ success: boolean; error?: string }> {
  const { studentEmail, studentName, activityTitle, professorName, hours, date, reason } = params;

  const subject = `Cerere ore respinsă - ${activityTitle}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1f2937; background-color: #ffffff; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; }
    .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: #ffffff !important; padding: 30px; border-radius: 8px 8px 0 0; }
    .header h1 { color: #ffffff !important; margin: 0; font-size: 28px; }
    .header p { color: #ffffff !important; margin: 10px 0 0 0; opacity: 0.95; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
    .content p { color: #374151 !important; }
    .warning-box { background: #fee2e2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; border-radius: 4px; color: #991b1b !important; }
    .warning-box strong { color: #7f1d1d !important; }
    .details { background: #ffffff; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e5e7eb; }
    .detail-row { padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #1f2937 !important; }
    .detail-row:last-child { border-bottom: none; }
    .detail-label { font-weight: 600; color: #6b7280 !important; }
    .detail-row strong { color: #111827 !important; }
    .reason-box { background: #fef3c7; padding: 15px; border-radius: 6px; border-left: 4px solid #f59e0b; color: #92400e !important; margin: 20px 0; }
    .reason-box strong { color: #78350f !important; }
    .button { display: inline-block; background: #667eea !important; color: #ffffff !important; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: 600; }
    .footer { text-align: center; padding: 20px; color: #6b7280 !important; font-size: 14px; background-color: #ffffff; }
    .footer strong { color: #374151 !important; }
    .footer a { color: #667eea !important; text-decoration: underline; }
  </style>
</head>
<body style="background-color: #ffffff; color: #1f2937;">
  <div class="container" style="background-color: #ffffff;">
    <div class="header" style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: #ffffff;">
      <h1 style="margin: 0; font-size: 28px; color: #ffffff;">📋 Actualizare Cerere Ore</h1>
      <p style="margin: 10px 0 0 0; opacity: 0.95; color: #ffffff;">${activityTitle}</p>
    </div>

    <div class="content" style="background: #f9fafb;">
      <p style="color: #374151;">Bună <strong style="color: #111827;">${studentName}</strong>,</p>

      <div class="warning-box" style="background: #fee2e2; color: #991b1b;">
        Profesorul <strong style="color: #7f1d1d;">${professorName}</strong> a analizat cererea ta pentru <strong>${hours} ore</strong> la data de ${date} și a decis să o respingă.
      </div>

      <div class="reason-box" style="background: #fef3c7; color: #92400e;">
        <strong style="color: #78350f;">📌 Motivul respingerii:</strong>
        <p style="margin: 10px 0 0 0; color: #92400e;">${reason}</p>
      </div>

      <div class="details" style="background: #ffffff; border: 1px solid #e5e7eb;">
        <h3 style="margin-top: 0; color: #ef4444;">Detalii Cerere</h3>
        <div class="detail-row" style="color: #1f2937;">
          <span class="detail-label" style="color: #6b7280;">Activitate:</span><br>
          <strong style="color: #111827;">${activityTitle}</strong>
        </div>
        <div class="detail-row" style="color: #1f2937;">
          <span class="detail-label" style="color: #6b7280;">Data:</span><br>
          <span style="color: #374151;">${date}</span>
        </div>
        <div class="detail-row" style="color: #1f2937;">
          <span class="detail-label" style="color: #6b7280;">Ore solicitate:</span><br>
          <span style="color: #374151;">${hours} ore</span>
        </div>
      </div>

      <p style="color: #374151;">
        Dacă ai întrebări despre decizia profesorului sau vrei să discuți despre cererea ta, te rugăm să contactezi direct profesorul.
      </p>

      <a href="${EMAIL_CONFIG.appUrl}/dashboard" class="button" style="background: #667eea; color: #ffffff; text-decoration: none;">
        Vezi Dashboard
      </a>
    </div>

    <div class="footer" style="background-color: #ffffff; color: #6b7280;">
      <p style="color: #6b7280;">Cu drag,<br><strong style="color: #374151;">Echipa Campus Connect</strong></p>
      <p style="font-size: 12px; margin-top: 20px; color: #6b7280;">
        <a href="${EMAIL_CONFIG.appUrl}" style="color: #667eea; text-decoration: underline;">Campus Connect</a> •
        <a href="${EMAIL_CONFIG.appUrl}/dashboard" style="color: #667eea; text-decoration: underline;">Dashboard</a>
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();

  return sendEmail({ to: studentEmail, subject, html });
}

/**
 * Send hours info requested email
 */
export async function sendHoursInfoRequestedEmail(params: {
  studentEmail: string;
  studentName: string;
  activityTitle: string;
  professorName: string;
  hours: number;
  date: string;
  message: string;
}): Promise<{ success: boolean; error?: string }> {
  const { studentEmail, studentName, activityTitle, professorName, hours, date, message } = params;

  const subject = `Profesor solicită informații suplimentare - ${activityTitle}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1f2937; background-color: #ffffff; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; }
    .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: #ffffff !important; padding: 30px; border-radius: 8px 8px 0 0; }
    .header h1 { color: #ffffff !important; margin: 0; font-size: 28px; }
    .header p { color: #ffffff !important; margin: 10px 0 0 0; opacity: 0.95; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
    .content p { color: #374151 !important; }
    .info-box { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px; color: #92400e !important; }
    .info-box strong { color: #78350f !important; }
    .message-box { background: #ffffff; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px solid #f59e0b; }
    .message-box h3 { margin-top: 0; color: #f59e0b !important; }
    .message-box p { color: #374151 !important; }
    .details { background: #ffffff; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e5e7eb; }
    .detail-row { padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #1f2937 !important; }
    .detail-row:last-child { border-bottom: none; }
    .detail-label { font-weight: 600; color: #6b7280 !important; }
    .detail-row strong { color: #111827 !important; }
    .button { display: inline-block; background: #f59e0b !important; color: #ffffff !important; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: 600; }
    .footer { text-align: center; padding: 20px; color: #6b7280 !important; font-size: 14px; background-color: #ffffff; }
    .footer strong { color: #374151 !important; }
    .footer a { color: #f59e0b !important; text-decoration: underline; }
  </style>
</head>
<body style="background-color: #ffffff; color: #1f2937;">
  <div class="container" style="background-color: #ffffff;">
    <div class="header" style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: #ffffff;">
      <h1 style="margin: 0; font-size: 28px; color: #ffffff;">💬 Mesaj de la Profesor</h1>
      <p style="margin: 10px 0 0 0; opacity: 0.95; color: #ffffff;">Cerere informații suplimentare</p>
    </div>

    <div class="content" style="background: #f9fafb;">
      <p style="color: #374151;">Bună <strong style="color: #111827;">${studentName}</strong>,</p>

      <div class="info-box" style="background: #fef3c7; color: #92400e;">
        <strong style="color: #78350f;">📌 Acțiune necesară:</strong> Profesorul <strong>${professorName}</strong> solicită informații suplimentare despre cererea ta de ore pentru activitatea <strong>${activityTitle}</strong>.
      </div>

      <div class="message-box" style="background: #ffffff; border: 2px solid #f59e0b;">
        <h3 style="margin-top: 0; color: #f59e0b;">💬 Mesaj de la ${professorName}:</h3>
        <p style="color: #374151;">${message}</p>
      </div>

      <div class="details" style="background: #ffffff; border: 1px solid #e5e7eb;">
        <h3 style="margin-top: 0; color: #f59e0b;">Detalii Cerere</h3>
        <div class="detail-row" style="color: #1f2937;">
          <span class="detail-label" style="color: #6b7280;">Activitate:</span><br>
          <strong style="color: #111827;">${activityTitle}</strong>
        </div>
        <div class="detail-row" style="color: #1f2937;">
          <span class="detail-label" style="color: #6b7280;">Data:</span><br>
          <span style="color: #374151;">${date}</span>
        </div>
        <div class="detail-row" style="color: #1f2937;">
          <span class="detail-label" style="color: #6b7280;">Ore solicitate:</span><br>
          <span style="color: #374151;">${hours} ore</span>
        </div>
      </div>

      <p style="color: #374151;">
        Te rugăm să contactezi profesorul pentru a clarifica aspectele menționate. Cererea ta va rămâne în așteptare până la rezolvarea situației.
      </p>

      <a href="${EMAIL_CONFIG.appUrl}/dashboard" class="button" style="background: #f59e0b; color: #ffffff; text-decoration: none;">
        Vezi Dashboard
      </a>
    </div>

    <div class="footer" style="background-color: #ffffff; color: #6b7280;">
      <p style="color: #6b7280;">Cu drag,<br><strong style="color: #374151;">Echipa Campus Connect</strong></p>
      <p style="font-size: 12px; margin-top: 20px; color: #6b7280;">
        <a href="${EMAIL_CONFIG.appUrl}" style="color: #f59e0b; text-decoration: underline;">Campus Connect</a> •
        <a href="${EMAIL_CONFIG.appUrl}/dashboard" style="color: #f59e0b; text-decoration: underline;">Dashboard</a>
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();

  return sendEmail({ to: studentEmail, subject, html });
}

/**
 * Type exports for external usage
 */
export type EmailSendResult = {
  success: boolean;
  error?: string;
};
