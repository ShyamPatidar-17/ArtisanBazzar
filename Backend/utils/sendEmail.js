// utils/sendEmail.js
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendMail = async (to, subject, html) => {
  try {
    const response = await resend.emails.send({
      from:"Artisan Bazzar <onboarding@resend.dev>",
      to,
      subject,
      html,
    });

    // Log full response for debugging (id may be undefined in sandbox)
    console.log(`✅ Email sent to: ${to}`);
    if (response?.id) {
      console.log(`   → Message ID: ${response.id}`);
    } else {
      console.log("   → Resend API response:", response);
    }

    return true;
  } catch (error) {
    console.error("❌ Email sending failed:", error.message);
    if (error.response) console.error("   → Details:", error.response);
    return false;
  }
};
