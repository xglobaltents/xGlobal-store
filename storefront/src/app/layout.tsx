import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import "styles/globals.css"
import "./styles.css"

// Define organization structured data
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://xglobaltents.com",
  logo: "/logos/logo.webp",
  name: "xGlobal Tents",
  legalName: "xGlobal Tents Limited",
  telephone: "+447777777777",
  sameAs: ["https://www.linkedin.com/company/xglobal-tents/"]
}

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  other: {
    'script:ld+json': [JSON.stringify(organizationJsonLd)]
  }
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light">
      <body>
        <main className="relative">{props.children}</main>
      </body>
    </html>
  )
}