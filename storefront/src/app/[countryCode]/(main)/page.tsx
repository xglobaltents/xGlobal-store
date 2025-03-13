import { Metadata } from "next"
import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import { getCollectionsWithProducts } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"

// Map country codes to country names
const countryNames: { [key: string]: string } = {
  AO: "Angola",
  AT: "Austria",
  BH: "Bahrain",
  BW: "Botswana",
  TD: "Chad",
  CG: "Congo",
  GQ: "Equatorial Guinea",
  FR: "France",
  GA: "Gabon",
  DE: "Germany",
  IQ: "Iraq",
  KW: "Kuwait",
  NL: "Netherlands",
  NG: "Nigeria",
  OM: "Oman",
  QA: "Qatar",
  RW: "Rwanda",
  SA: "Saudi Arabia",
  ZA: "South Africa",
  SS: "South Sudan",
  SE: "Sweden",
  AE: "United Arab Emirates",
}

export async function generateMetadata({ params: { countryCode } }): Promise<Metadata> {
  const countryName = countryNames[countryCode] || "Default Country Name";

  return {
    title: `xGlobal Tents Supplier and Manufacturer in ${countryName}`,
    description: `The Leading Tent Manufacturer in ${countryName}, Tents Including Aluminum Tents, Modular Tent Structures`,
  }
}

export default async function Home({
  params: { countryCode },
}: {
  params: { countryCode: string }
}) {
  const collections = await getCollectionsWithProducts(countryCode)
  const region = await getRegion(countryCode)
  const countryName = countryNames[countryCode] || "Default Country Name";

  if (!collections || !region) {
    return null
  }

  const storeUrl = `/${countryCode}/store`

  return (
    <>
      <Hero storeUrl={storeUrl} countryName={countryName} />
      <div className="py-12">
        <ul className="flex flex-col gap-x-6">
          <FeaturedProducts collections={collections} region={region} />
        </ul>
      </div>
    </>
  )
}