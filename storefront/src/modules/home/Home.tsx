import React from 'react'
import Hero from './components/hero'
import FeaturedProducts from './components/featured-products'
import { getCollectionsWithProducts } from '@lib/data/collections'
import { getRegion } from '@lib/data/regions'

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
  const region = await getRegion(countryCode)
  const countryName = countryNames[countryCode] || region?.name || countryCode

  if (!region) {
    return {
      title: `xGlobal Tents Supplier and Manufacturer in ${countryName}`,
      description: "The Leading Tent Manufacturer, Tents Including Aluminum Tents, Modular Tent Structures",
    }
  }

  return {
    title: `xGlobal Tents Supplier and Manufacturer in ${countryName}`,
    description: `The Leading Tent Manufacturer in ${countryName}, Tents Including Aluminum Tents, Modular Tent Structures`,
  }
}

const Home: React.FC<{ params: { countryCode: string } }> = ({ params: { countryCode } }) => {
  const [collections, setCollections] = React.useState(null)
  const [region, setRegion] = React.useState(null)
  const countryName = countryNames[countryCode] || region?.name || countryCode

  React.useEffect(() => {
    async function fetchData() {
      const collectionsData = await getCollectionsWithProducts(countryCode)
      const regionData = await getRegion(countryCode)
      setCollections(collectionsData)
      setRegion(regionData)
    }
    fetchData()
  }, [countryCode])

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

export default Home