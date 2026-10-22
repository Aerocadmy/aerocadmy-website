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

export async function sendEnrollmentConfirmation(input: { id: string; name: string; email: string }) {
  const resend = new Resend(requiredEnvironment("RESEND_API_KEY"));
  const from = process.env.RESEND_FROM_EMAIL || "enrollment@aerocadmy.com";
  const name = escapeHtml(input.name);
  const reference = escapeHtml(input.id);

  const { error } = await resend.emails.send({
    from,
    to: input.email,
    subject: "Your Aerocadmy internship enrollment is confirmed",
    text: `Hi ${input.name},\n\nYour enrollment in the six-week Drone Technology Internship is confirmed.\n\nEnrollment reference: ${input.id}\nProgram fee paid: INR 6,999\n\nOur team will contact you with the next steps and batch details.\n\nAerocadmy`,
    html: `<p>Hi ${name},</p>
      <p>Your enrollment in the six-week <strong>Drone Technology Internship</strong> is confirmed.</p>
      <p><strong>Enrollment reference:</strong> ${reference}<br>
      <strong>Program fee paid:</strong> INR 6,999</p>
      <p>Our team will contact you with the next steps and batch details.</p>
      <p>Regards,<br>Aerocadmy</p>`,
  }, { idempotencyKey: `enrollment-confirmation/${input.id}` });
  if (error) throw new Error("Enrollment confirmation email could not be sent.");
}
