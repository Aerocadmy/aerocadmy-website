import "server-only";
import { Resend } from "resend";

function requiredEnvironment(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not configured.`);
  return value;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character] as string);
}

export async function sendEnrollmentConfirmation(input: { id: string; reference: string; name: string; email: string }) {
  const resend = new Resend(requiredEnvironment("RESEND_API_KEY"));
  const from = process.env.RESEND_FROM_EMAIL || "enrollment@aerocadmy.com";
  const name = escapeHtml(input.name);
  const reference = escapeHtml(input.reference);

  const { error } = await resend.emails.send({
    from,
    to: input.email,
    subject: "You’re enrolled — Drone Technology Internship | Aerocadmy",
    text: `Hi ${input.name},\n\nYour payment is confirmed and your place in the six-week Drone Technology Internship is reserved.\n\nENROLLMENT REFERENCE\n${input.reference}\n\nProgram fee paid: INR 6,999\nNext batch: 15 November 2026\nIncludes: ESP32 drone kit to keep\n\nOur admissions team will contact you with the next steps and batch details. Keep this email and your enrollment reference for support.\n\nWelcome aboard,\nAerocadmy`,
    html: `<!doctype html>
<html lang="en">
  <head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>Enrollment confirmed</title></head>
  <body style="margin:0;padding:0;background:#f2f7f4;font-family:Arial,Helvetica,sans-serif;color:#132636;-webkit-font-smoothing:antialiased;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">Your payment is confirmed and your place in the Drone Technology Internship is reserved.</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f2f7f4;padding:36px 14px;">
      <tr><td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:620px;background:#ffffff;border:1px solid #dce9e2;border-radius:18px;overflow:hidden;">
          <tr><td style="padding:22px 32px;background:#102a35;color:#ffffff;">
            <div style="font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#9ce8c7;">Aerocadmy</div>
            <div style="margin-top:7px;font-size:13px;line-height:20px;color:#d9e8e2;">Drone technology education</div>
          </td></tr>
          <tr><td style="padding:36px 32px 18px;">
            <div style="display:inline-block;padding:7px 11px;border-radius:99px;background:#e8f6ee;color:#087957;font-size:11px;font-weight:700;letter-spacing:.8px;text-transform:uppercase;">Payment confirmed</div>
            <h1 style="margin:18px 0 10px;font-size:30px;line-height:1.2;letter-spacing:-.7px;font-weight:700;color:#132636;">You’re enrolled, ${name}.</h1>
            <p style="margin:0;color:#61747e;font-size:15px;line-height:25px;">Your place in the six-week Drone Technology Internship is reserved. We’re glad to have you with us.</p>
          </td></tr>
          <tr><td style="padding:12px 32px 10px;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f1f8f3;border:1px solid #d6e9dd;border-radius:12px;">
              <tr><td style="padding:20px 22px 9px;color:#71837b;font-size:10px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;">Your enrollment reference</td></tr>
              <tr><td style="padding:0 22px 20px;color:#087957;font-family:Consolas,Monaco,monospace;font-size:22px;font-weight:700;letter-spacing:1.4px;">${reference}</td></tr>
            </table>
          </td></tr>
          <tr><td style="padding:18px 32px 8px;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
              <tr><td style="padding:12px 0;border-bottom:1px solid #e8efea;color:#71837b;font-size:13px;">Program</td><td align="right" style="padding:12px 0;border-bottom:1px solid #e8efea;color:#132636;font-size:13px;font-weight:700;">Drone Technology Internship</td></tr>
              <tr><td style="padding:12px 0;border-bottom:1px solid #e8efea;color:#71837b;font-size:13px;">Duration</td><td align="right" style="padding:12px 0;border-bottom:1px solid #e8efea;color:#132636;font-size:13px;font-weight:700;">6 weeks · Live online</td></tr>
              <tr><td style="padding:12px 0;border-bottom:1px solid #e8efea;color:#71837b;font-size:13px;">Next batch</td><td align="right" style="padding:12px 0;border-bottom:1px solid #e8efea;color:#132636;font-size:13px;font-weight:700;">15 November 2026</td></tr>
              <tr><td style="padding:12px 0;color:#71837b;font-size:13px;">Payment received</td><td align="right" style="padding:12px 0;color:#132636;font-size:13px;font-weight:700;">₹6,999 · ESP32 kit included</td></tr>
            </table>
          </td></tr>
          <tr><td style="padding:20px 32px 30px;">
            <p style="margin:0;padding:16px 18px;border-left:3px solid #18cb96;background:#f7faf8;color:#52685f;font-size:13px;line-height:22px;">Our admissions team will contact you with the next steps and batch details. Keep this email and your enrollment reference for support.</p>
            <p style="margin:24px 0 0;color:#52685f;font-size:14px;line-height:23px;">Welcome aboard,<br><strong style="color:#132636;">Aerocadmy Admissions</strong></p>
          </td></tr>
          <tr><td style="padding:16px 32px;background:#f7faf8;border-top:1px solid #e6eee8;color:#82918a;font-size:11px;line-height:18px;">This is an automatic confirmation of your internship enrollment and payment.</td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`,
  }, { idempotencyKey: `enrollment-confirmation/${input.id}` });
  if (error) throw new Error("Enrollment confirmation email could not be sent.");
}
