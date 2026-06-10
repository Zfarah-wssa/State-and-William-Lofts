import { Resend } from "resend";
import { NextResponse } from "next/server";

const RECIPIENTS = ["afarah@wssallc.com", "zfarah@wssallc.com"];

export async function POST(request: Request) {
  let body: Record<string, string>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { unitName, firstName, lastName, email, phone, notes, roommates } = body;

  if (!firstName || !lastName || !email || !unitName) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "State & William Lofts <notifications@wssastatewilliamlofts.com>",
      to: RECIPIENTS,
      replyTo: email,
      subject: `Interest Form: ${unitName} — State & William Lofts`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
          <h2 style="color:#1a1a1a;margin-bottom:4px">New interest form submission</h2>
          <p style="color:#666;margin-top:0;margin-bottom:24px">Unit: <strong>${unitName}</strong></p>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:8px 0;color:#666;width:140px">First name</td><td style="padding:8px 0;color:#1a1a1a;font-weight:600">${firstName}</td></tr>
            <tr><td style="padding:8px 0;color:#666">Last name</td><td style="padding:8px 0;color:#1a1a1a;font-weight:600">${lastName}</td></tr>
            <tr><td style="padding:8px 0;color:#666">Email</td><td style="padding:8px 0;color:#1a1a1a;font-weight:600"><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td style="padding:8px 0;color:#666">Phone</td><td style="padding:8px 0;color:#1a1a1a;font-weight:600">${phone}</td></tr>
            ${roommates ? `<tr><td style="padding:8px 0;color:#666;vertical-align:top">Roommates</td><td style="padding:8px 0;color:#1a1a1a">${roommates.replace(/\n/g, "<br>")}</td></tr>` : ""}
            ${notes ? `<tr><td style="padding:8px 0;color:#666;vertical-align:top">Notes</td><td style="padding:8px 0;color:#1a1a1a">${notes.replace(/\n/g, "<br>")}</td></tr>` : ""}
          </table>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to send email:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
