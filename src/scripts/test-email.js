/**
 * Test script to verify email sending works
 */
import { Resend } from "resend"
import dotenv from "dotenv"
import path from "path"

// Load environment variables from project root
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

async function main() {
  console.log("Testing email sender...")
  
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.error("RESEND_API_KEY environment variable is not set")
    process.exit(1)
  }
  
  const from = process.env.RESEND_FROM_EMAIL
  if (!from) {
    console.error("RESEND_FROM_EMAIL environment variable is not set")
    process.exit(1)
  }
  
  const testEmail = process.env.TEST_EMAIL
  if (!testEmail) {
    console.error("TEST_EMAIL environment variable not set. Please specify a recipient email address.")
    process.exit(1)
  }
  
  console.log(`Sending test email from ${from} to ${testEmail}`)
  
  try {
    const resend = new Resend(apiKey)
    const result = await resend.emails.send({
      from: from,
      to: testEmail,
      subject: "Test Email from xGlobal-tents",
      html: "<h1>Test Email</h1><p>If you receive this email, the email provider is working correctly.</p>",
    })
    
    console.log("Email sent successfully:", result)
  } catch (error) {
    console.error("Failed to send email:", error.message)
    console.error(error.stack)
    process.exit(1)
  }
}

main()
  .then(() => {
    console.log("Script completed")
    process.exit(0)
  })
  .catch((err) => {
    console.error("Script failed:", err)
    process.exit(1)
  })
