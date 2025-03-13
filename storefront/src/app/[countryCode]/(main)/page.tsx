import { Metadata } from "next"
import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import { getCollectionsWithProducts } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"

// Map country codes to country names
const countryNames: { [key: string]: string } = {
  AE: "United Arab Emirates",
  AO: "Angola",
  AT: "Austria",
  BH: "Bahrain",
  BW: "Botswana",
  CD: "Democratic Republic of the Congo",
  CG: "Congo",
  CI: "Côte d'Ivoire",
  CM: "Cameroon",
  //DE: "Germany",
  DZ: "Algeria",
  EG: "Egypt",
  ET: "Ethiopia",
  FR: "France",
  GA: "Gabon",
  GB: "United Kingdom",
  GH: "Ghana",
  GQ: "Equatorial Guinea",
  IQ: "Iraq",
  JO: "Jordan",
  KE: "Kenya",
  KW: "Kuwait",
  LY: "Libya",
  MA: "Morocco",
  ML: "Mali",
  MW: "Malawi",
  NG: "Nigeria",
  NL: "Netherlands",
  OM: "Oman",
  QA: "Qatar",
  RW: "Rwanda",
  SA: "Saudi Arabia",
  SD: "Sudan",
  SE: "Sweden",
  SN: "Senegal",
  SO: "Somalia",
  SS: "South Sudan",
  TD: "Chad",
  TN: "Tunisia",
  TZ: "Tanzania",
  UG: "Uganda",
  ZA: "South Africa",
  ZM: "Zambia",
  ZW: "Zimbabwe"
}

export async function generateMetadata({ params: { countryCode } }): Promise<Metadata> {
  const region = await getRegion(countryCode);
  const countryName = countryNames[countryCode.toUpperCase()] || region?.name || countryCode;

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
  const countryName = countryNames[countryCode.toUpperCase()] || region?.name || countryCode;

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