import { Resend } from "resend";
import { CONFIG } from "./config";

/**
 * Sends the daily report via Resend (same provider already used elsewhere in this repo
 * for the leasing site's contact/maintenance emails). Requires RESEND_API_KEY; skips
 * gracefully and logs a warning when it's unset, so a run without email configured
 * still produces the markdown report file.
 */
export async function sendReportEmail(params: { subject: string; html: string; text: string }): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[sam-gov] RESEND_API_KEY not set — skipping email delivery.");
    return false;
  }
  const recipients: readonly string[] = CONFIG.reportRecipients;
  if (recipients.length === 0) {
    console.warn("[sam-gov] No report recipients configured in config.ts — skipping email delivery.");
    return false;
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: CONFIG.reportFromAddress,
    to: [...recipients],
    subject: params.subject,
    html: params.html,
    text: params.text,
  });

  if (error) {
    console.error("[sam-gov] Failed to send report email:", error);
    return false;
  }

  console.log(`[sam-gov] Report emailed to ${recipients.join(", ")}`);
  return true;
}
