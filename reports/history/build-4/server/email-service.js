/**
 * CAREER AI (ARJ) — PRODUCTION-GRADE EMAIL SERVICE
 * Centralized email service supporting SMTP live delivery, timeout protection,
 * professional HTML templates, and safe fallback for development.
 */

import nodemailer from 'nodemailer';

const getSmtpConfig = () => {
  const host = process.env.SMTP_HOST || 'smtp-relay.brevo.com';
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER || process.env.EMAIL_USER || '';
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS || '';
  const secure = process.env.SMTP_SECURE === 'true';
  const from = process.env.SMTP_FROM || process.env.MAIL_FROM || `"ARJ Career AI" <${user || 'support@career-ai.com'}>`;
  return { host, port, user, pass, secure, from };
};

const CLIENT_URL = (process.env.CLIENT_URL || 'http://localhost:5173').split(',')[0].trim();
const TIMEOUT_MS = 10000;

export function isSmtpConfigured() {
  const cfg = getSmtpConfig();
  return Boolean(cfg.host && cfg.user && cfg.pass);
}

export function getEmailServiceStatus() {
  const cfg = getSmtpConfig();
  return {
    mode: isSmtpConfigured() ? 'SMTP Live Delivery (Brevo)' : 'Development Fallback (Local)',
    configured: isSmtpConfigured(),
    smtpHost: cfg.host,
    smtpPort: cfg.port,
    fromAddress: cfg.from
  };
}

/**
 * Renders professional Career AI password reset HTML template
 */
export function renderPasswordResetHtml({ resetLink, recipientEmail }) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Career AI Password</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0f172a; color: #f8fafc;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0f172a; padding: 40px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" max-width="560" cellspacing="0" cellpadding="0" style="background-color: #1e293b; border-radius: 12px; border: 1px solid #334155; padding: 32px; max-width: 560px;">
          <!-- Header Logo -->
          <tr>
            <td align="center" style="padding-bottom: 24px; border-bottom: 1px solid #334155;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #38bdf8; letter-spacing: -0.5px;">
                CAREER AI <span style="font-size: 14px; font-weight: 500; color: #94a3b8; background: #0f172a; padding: 4px 8px; border-radius: 4px; margin-left: 6px;">ARJ ENGINE</span>
              </h1>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding-top: 24px; padding-bottom: 24px; color: #cbd5e1; font-size: 15px; line-height: 1.6;">
              <p style="margin-top: 0; color: #f8fafc; font-size: 18px; font-weight: 600;">Password Reset Request</p>
              <p>We received a request to reset the password for your Career AI account (<strong>${recipientEmail}</strong>).</p>
              <p>Click the button below to choose a new secure password. This link is valid for <strong>30 minutes</strong> and can only be used once.</p>
              
              <!-- CTA Button -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 28px 0;">
                <tr>
                  <td align="center">
                    <a href="${resetLink}" target="_blank" style="display: inline-block; background-color: #0284c7; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 14px 28px; border-radius: 8px; box-shadow: 0 4px 12px rgba(2, 132, 199, 0.3);">
                      Reset My Password &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <p style="font-size: 13px; color: #94a3b8;">If the button above does not work, copy and paste this link into your web browser:</p>
              <p style="font-size: 12px; word-break: break-all; color: #38bdf8; background: #0f172a; padding: 10px; border-radius: 6px; margin-top: 4px;">
                ${resetLink}
              </p>
            </td>
          </tr>

          <!-- Security Disclaimer -->
          <tr>
            <td style="padding-top: 20px; border-top: 1px solid #334155; color: #64748b; font-size: 12px; line-height: 1.5;">
              <p style="margin: 0;"><strong>Didn't request this?</strong> You can safely ignore this email; your password will remain unchanged.</p>
              <p style="margin-top: 8px; margin-bottom: 0;">&copy; ${new Date().getFullYear()} Career AI Acceleration Platform. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

/**
 * Renders professional Career AI Registration OTP HTML template
 */
export function renderRegistrationOtpHtml({ code, recipientEmail, recipientName }) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your ARJ Verification Code</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0f172a; color: #f8fafc;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0f172a; padding: 40px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" max-width="560" cellspacing="0" cellpadding="0" style="background-color: #1e293b; border-radius: 12px; border: 1px solid #334155; padding: 32px; max-width: 560px;">
          <!-- Header Logo -->
          <tr>
            <td align="center" style="padding-bottom: 24px; border-bottom: 1px solid #334155;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #38bdf8; letter-spacing: -0.5px;">
                CAREER AI <span style="font-size: 14px; font-weight: 500; color: #94a3b8; background: #0f172a; padding: 4px 8px; border-radius: 4px; margin-left: 6px;">ARJ ENGINE</span>
              </h1>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding-top: 24px; padding-bottom: 24px; color: #cbd5e1; font-size: 15px; line-height: 1.6;">
              <p style="margin-top: 0; color: #f8fafc; font-size: 18px; font-weight: 600;">Welcome to ARJ, ${recipientName || 'Job Seeker'}!</p>
              <p>Your 6-digit email verification code is:</p>
              
              <!-- OTP Box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 24px 0;">
                <tr>
                  <td align="center">
                    <div style="display: inline-block; background-color: #0f172a; color: #38bdf8; font-size: 36px; font-weight: 800; letter-spacing: 8px; padding: 16px 36px; border-radius: 10px; border: 2px dashed #0284c7;">
                      ${code}
                    </div>
                  </td>
                </tr>
              </table>

              <p style="font-size: 13px; color: #94a3b8;">Enter this verification code in the mobile application to complete your account registration. This code is valid for <strong>10 minutes</strong>.</p>
            </td>
          </tr>

          <!-- Security Disclaimer -->
          <tr>
            <td style="padding-top: 20px; border-top: 1px solid #334155; color: #64748b; font-size: 12px; line-height: 1.5;">
              <p style="margin: 0;"><strong>Didn't request this code?</strong> You can safely ignore this email.</p>
              <p style="margin-top: 8px; margin-bottom: 0;">&copy; ${new Date().getFullYear()} Career AI Acceleration Platform. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

/**
 * Registration OTP Delivery Function
 */
export async function sendRegistrationOtpEmail({ to, name, code }) {
  const brevoApiKey = process.env.BREVO_API_KEY || '';
  if (brevoApiKey) {
    try {
      const htmlContent = renderRegistrationOtpHtml({ code, recipientEmail: to, recipientName: name });
      const senderEmail = process.env.SENDER_EMAIL || 'dilliprasannanov@gmail.com';
      const senderName = process.env.SENDER_NAME || 'ARJ Career AI';

      const res = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': brevoApiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sender: { name: senderName, email: senderEmail },
          to: [{ email: to }],
          subject: `ARJ Verification Code: ${code}`,
          htmlContent
        })
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.message || JSON.stringify(resData));
      }

      console.log(`✅ [BREVO API DISPATCH] Verification code email sent to ${to}! ID: ${resData.messageId}`);
      return {
        sent: true,
        mode: 'brevo_api',
        messageId: resData.messageId
      };
    } catch (err) {
      console.error(`⚠️ Brevo API Delivery Failed for ${to}:`, err.message);
    }
  }

  const cfg = getSmtpConfig();
  if (!isSmtpConfigured()) {
    return {
      sent: false,
      mode: 'development',
      code
    };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: cfg.host,
      port: cfg.port,
      secure: cfg.secure,
      auth: {
        user: cfg.user,
        pass: cfg.pass
      },
      connectionTimeout: TIMEOUT_MS,
      greetingTimeout: TIMEOUT_MS,
      socketTimeout: TIMEOUT_MS
    });

    const htmlContent = renderRegistrationOtpHtml({ code, recipientEmail: to, recipientName: name });
    const textContent = `Your ARJ verification code is: ${code}\n\nValid for 10 minutes.`;

    const info = await transporter.sendMail({
      from: cfg.from,
      to,
      subject: `ARJ Verification Code: ${code}`,
      text: textContent,
      html: htmlContent
    });

    console.log(`✅ [BREVO DISPATCH] Verification code email sent to ${to}! Message ID: ${info.messageId}`);
    return {
      sent: true,
      mode: 'smtp',
      messageId: info.messageId
    };
  } catch (err) {
    console.error(`⚠️ Brevo SMTP Email Delivery Failed for ${to}:`, err.message);
    return {
      sent: false,
      mode: 'error',
      error: err.message,
      code
    };
  }
}

/**
 * Primary Email Delivery Function
 */
export async function sendPasswordResetEmail({ to, token }) {
  const resetLink = `${CLIENT_URL}/reset-password?token=${token}`;

  if (!isSmtpConfigured()) {
    return {
      sent: false,
      mode: 'development',
      resetLink
    };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_SECURE,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS
      },
      connectionTimeout: TIMEOUT_MS,
      greetingTimeout: TIMEOUT_MS,
      socketTimeout: TIMEOUT_MS
    });

    const htmlContent = renderPasswordResetHtml({ resetLink, recipientEmail: to });
    const textContent = `Reset your Career AI password:\n\n${resetLink}\n\nThis link expires in 30 minutes. If you did not request this, please ignore.`;

    const info = await transporter.sendMail({
      from: SMTP_FROM,
      to,
      subject: 'ARJ Career AI - Reset Your Password',
      text: textContent,
      html: htmlContent
    });

    return {
      sent: true,
      mode: 'smtp',
      messageId: info.messageId
    };
  } catch (err) {
    console.error(`⚠️ SMTP Email Delivery Failed for ${to}:`, err.message);
    return {
      sent: false,
      mode: 'error',
      error: err.message,
      resetLink
    };
  }
}
