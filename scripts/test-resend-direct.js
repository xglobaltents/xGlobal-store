import { Resend } from "resend";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

async function testResendDirect() {
  try {
    // Get environment variables
    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL;
    
    if (!apiKey) {
      console.error("RESEND_API_KEY is not set in environment");
      process.exit(1);
    }
    
    if (!fromEmail) {
      console.error("RESEND_FROM_EMAIL is not set in environment");
      process.exit(1);
    }
    
    // Use test email address from command line arg or default
    const testEmail = process.argv[2] || "test@example.com";
    
    console.log(`Sending test email directly to ${testEmail} from ${fromEmail}`);
    
    // Initialize Resend directly
    const resend = new Resend(apiKey);
    
    // Send test email
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: testEmail,
      subject: "Test Email from Direct Script",
      html: "<h1>Test Email</h1><p>This is a test email sent directly from the Resend API.</p>",
    });
    
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent successfully:", data);
    }
  } catch (error) {
    console.error("Exception occurred:", error);
  }
}

testResendDirect();
