import { Resend } from "resend";
import { NextResponse } from "next/server";

const RECIPIENTS = ["zanefarah@wssastatewilliamlofts.com", "adonisfarah@wssastatewilliamlofts.com"];

function buildTranscriptHtml(transcript: { role: string; content: string }[]): string {
  if (!transcript || transcript.length === 0) return "";
  const rows = transcript
    .map((m) => {
      const isUser = m.role === "user";
      return `<div style="margin-bottom:12px">
        <p style="margin:0 0 2px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:${isUser ? "#1a6fb5" : "#555"}">${isUser ? "Resident" : "Assistant"}</p>
        <p style="margin:0;color:#1a1a1a;background:${isUser ? "#eef4fb" : "#f5f5f5"};padding:10px 14px;border-radius:8px;white-space:pre-wrap;font-size:14px">${m.content}</p>
      </div>`;
    })
    .join("");
  return `
    <hr style="border:none;border-top:1px solid #e5e5e5;margin:24px 0">
    <p style="color:#666;margin-bottom:12px;font-size:14px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em">Full conversation</p>
    ${rows}
  `;
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { unit, description, category, firstName, lastName, email, phone, transcript } = body as Record<string, string | { role: string; content: string }[]>;

  if (!unit || !description) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const transcriptHtml = buildTranscriptHtml(Array.isArray(transcript) ? transcript : []);

  const contactRows = [
    firstName && lastName
      ? `<tr><td style="padding:8px 0;color:#666;width:140px">Resident</td><td style="padding:8px 0;color:#1a1a1a;font-weight:600">${firstName} ${lastName}</td></tr>`
      : "",
    email
      ? `<tr><td style="padding:8px 0;color:#666">Email</td><td style="padding:8px 0;color:#1a1a1a;font-weight:600"><a href="mailto:${email}">${email}</a></td></tr>`
      : "",
    phone
      ? `<tr><td style="padding:8px 0;color:#666">Phone</td><td style="padding:8px 0;color:#1a1a1a;font-weight:600">${phone}</td></tr>`
      : "",
  ]
    .filter(Boolean)
    .join("");

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "State & William Lofts <notifications@wssastatewilliamlofts.com>",
      to: RECIPIENTS,
      ...(email ? { replyTo: email as string } : {}),
      subject: `Maintenance Request${category ? ` — ${category}` : ""}: ${unit}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
          <h2 style="color:#1a1a1a;margin-bottom:4px">New maintenance request</h2>
          <p style="color:#666;margin-top:0;margin-bottom:24px">Unit: <strong>${unit}</strong>${category ? ` &mdash; <strong>${category}</strong>` : ""}</p>
          ${contactRows ? `<table style="width:100%;border-collapse:collapse;margin-bottom:24px">${contactRows}</table>` : ""}
          <p style="color:#666;margin-bottom:8px;font-size:14px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em">Issue description</p>
          <p style="color:#1a1a1a;background:#f5f5f5;padding:16px;border-radius:8px;white-space:pre-wrap;">${description}</p>
          ${transcriptHtml}
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to send maintenance email:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
