import { Resend } from "resend";
import { render } from "@react-email/render";
import dotenv from "dotenv";
import { InviteEmail } from "./modules/resend/templates/invite-email";

dotenv.config();

async function main() {
  // Check if API key exists
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set in .env file");
    process.exit(1);
  }

  const fromEmail = process.env.RESEND_FROM_EMAIL;
  if (!fromEmail) {
    console.error("RESEND_FROM_EMAIL is not set in .env file");
    process.exit(1);
  }

  // Test email address (replace with your own)
  const testEmail = process.argv[2] || "test@example.com";
  
  console.log(`Sending test email to ${testEmail} from ${fromEmail}`);

  try {
    // Initialize Resend
    const resend = new Resend(apiKey);

    // Create test data
    const inviteUrl = "https://dashboard.xglobal-tents.app/invite?token=test-token";
    
    // Render email using React template
    const emailHtml = render(
      InviteEmail({
        inviteUrl,
        userEmail: testEmail,
        displayName: "Test User",
      })
    );

    // Send email
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: testEmail,
      subject: "Test Invitation Email",
      html: emailHtml,
    });

    if (error) {
      console.error("Failed to send email:", error);
    } else {
      console.log("Email sent successfully!", data);
    }
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

main().catch(console.error);
