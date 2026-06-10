import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

const RECIPIENTS = ["afarah@wssallc.com", "zfarah@wssallc.com"];

export async function POST(request: Request) {
  let body: Record<string, string>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { unit, description } = body;

  if (!unit || !description) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    await resend.emails.send({
      from: "State & William Lofts <notifications@wssallc.com>",
      to: RECIPIENTS,
      subject: `Maintenance Request: ${unit}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
          <h2 style="color:#1a1a1a;margin-bottom:4px">New maintenance request</h2>
          <p style="color:#666;margin-top:0;margin-bottom:24px">Unit: <strong>${unit}</strong></p>
          <p style="color:#666;margin-bottom:8px;font-size:14px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em">Issue description</p>
          <p style="color:#1a1a1a;background:#f5f5f5;padding:16px;border-radius:8px;white-space:pre-wrap;">${description}</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to send maintenance email:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
