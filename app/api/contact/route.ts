import { Resend } from "resend";
import { NextResponse } from "next/server";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  company: z.string().min(2),
  role: z.string().optional(),
  application: z.string().min(3),
  timeline: z.string().optional(),
  message: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = contactSchema.parse(body);

    const { name, email, company, role, application, timeline, message } = data;

    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      console.error("RESEND_API_KEY is not configured");
      return NextResponse.json(
        { error: "Email service not configured. Please contact us directly at nagulapallysamanth@gmail.com" },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);

    // Send the main inquiry to you
    const { error } = await resend.emails.send({
      from: "BraggSense Website <onboarding@resend.dev>",
      to: "nagulapallysamanth@gmail.com",
      replyTo: email,
      subject: `New BraggSense Inquiry — ${name} (${company})`,
      html: `
        <div style="font-family: system-ui, sans-serif; max-width: 620px; margin: 0 auto; padding: 24px; color: #111;">
          <h2 style="margin: 0 0 24px; font-size: 22px; border-bottom: 1px solid #eee; padding-bottom: 12px;">New Contact Form Submission</h2>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; width: 140px; color: #666; font-weight: 500;">Name</td>
              <td style="padding: 8px 0;"><strong>${name}</strong></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666; font-weight: 500;">Email</td>
              <td style="padding: 8px 0;"><a href="mailto:${email}">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666; font-weight: 500;">Company</td>
              <td style="padding: 8px 0;">${company}</td>
            </tr>
            ${role ? `
            <tr>
              <td style="padding: 8px 0; color: #666; font-weight: 500;">Role</td>
              <td style="padding: 8px 0;">${role}</td>
            </tr>` : ""}
            <tr>
              <td style="padding: 8px 0; color: #666; font-weight: 500;">Application</td>
              <td style="padding: 8px 0;">${application}</td>
            </tr>
            ${timeline ? `
            <tr>
              <td style="padding: 8px 0; color: #666; font-weight: 500;">Timeline</td>
              <td style="padding: 8px 0;">${timeline}</td>
            </tr>` : ""}
            ${message ? `
            <tr>
              <td style="padding: 8px 0; color: #666; font-weight: 500; vertical-align: top;">Details</td>
              <td style="padding: 8px 0; white-space: pre-line;">${message}</td>
            </tr>` : ""}
          </table>

          <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #eee; font-size: 13px; color: #666;">
            Submitted via braggsense.com contact form • Reply directly to this email to respond to ${name}.
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }

    // Send a confirmation to the submitter (best effort)
    try {
      await resend.emails.send({
        from: "BraggSense Technologies <onboarding@resend.dev>",
        to: email,
        subject: "Thank you — we've received your inquiry",
        html: `
          <div style="font-family: system-ui, sans-serif; max-width: 620px; margin: 0 auto; padding: 32px 24px; color: #111;">
            <p style="margin: 0 0 16px;">Hi ${name.split(" ")[0]},</p>
            
            <p style="margin: 0 0 16px;">Thank you for reaching out to BraggSense Technologies. We've received your inquiry and a member of our team will contact you within one business day.</p>
            
            <p style="margin: 24px 0 8px; font-weight: 500;">Your submission summary:</p>
            <ul style="margin: 0 0 24px; padding-left: 20px; color: #333;">
              <li><strong>Application:</strong> ${application}</li>
              ${timeline ? `<li><strong>Timeline:</strong> ${timeline}</li>` : ""}
            </ul>
            
            <p style="margin: 0 0 8px;">In the meantime, you can explore our technology and products:</p>
            <p style="margin: 0;">
              <a href="https://your-domain.com/technology" style="color: #00c4d4;">Technology →</a><br>
              <a href="https://your-domain.com/products" style="color: #00c4d4;">Products →</a>
            </p>
            
            <p style="margin-top: 32px; font-size: 13px; color: #666;">— The BraggSense Team<br>
            <a href="mailto:info@braggsense.com" style="color: #666;">info@braggsense.com</a></p>
          </div>
        `,
      });
    } catch (confirmationErr) {
      // Non-fatal — we still want to return success to the user
      console.warn("Failed to send confirmation email:", confirmationErr);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
