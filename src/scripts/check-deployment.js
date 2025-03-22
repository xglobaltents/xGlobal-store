/**
 * Pre-deployment check script
 */
import dotenv from "dotenv"
import fs from "fs"
import path from "path"

// Load environment variables
dotenv.config()

function checkRequiredEnvVars() {
  const required = [
    "RESEND_API_KEY",
    "RESEND_FROM_EMAIL",
    "BACKEND_URL"
  ]
  
  const missing = []
  for (const env of required) {
    if (!process.env[env]) {
      missing.push(env)
    }
  }
  
  if (missing.length > 0) {
    console.error("ERROR: Missing required environment variables:", missing.join(", "))
    return false
  }
  
  return true
}

function checkModuleFiles() {
  const requiredFiles = [
    "./src/modules/email-notifications/index.ts",
    "./src/modules/email-notifications/email-templates-service.ts",
    "./src/modules/email-notifications/templates/base.tsx",
    "./src/modules/email-notifications/templates/invite.tsx",
    "./src/modules/email-notifications/templates/reset-password.tsx",
    "./src/modules/email-notifications/templates/order-confirmation.tsx"
  ]
  
  const missing = []
  for (const file of requiredFiles) {
    if (!fs.existsSync(path.resolve(process.cwd(), file))) {
      missing.push(file)
    }
  }
  
  if (missing.length > 0) {
    console.error("ERROR: Missing required module files:", missing.join(", "))
    return false
  }
  
  return true
}

async function main() {
  console.log("Running pre-deployment checks...")
  
  const envVarsOk = checkRequiredEnvVars()
  const filesOk = checkModuleFiles()
  
  if (!envVarsOk || !filesOk) {
    console.error("Pre-deployment checks failed. Please fix the issues before deploying.")
    process.exit(1)
  }
  
  console.log("All pre-deployment checks passed.")
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Check failed with error:", err)
    process.exit(1)
  })
