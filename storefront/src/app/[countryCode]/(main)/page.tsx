import { Metadata } from "next"

import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import { getCollectionsWithProducts } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"

export default async function Home({
  params: { countryCode },
}: {
  params: { countryCode: string }
}) {
  const collections = await getCollectionsWithProducts(countryCode)
  const region = await getRegion(countryCode)

  if (!collections || !region) {
    return null
  }

  const storeUrl = `/${countryCode}/store`

  // Dynamically set metadata title with country name
  const metadata: Metadata = {
    title: `xGlobal Tents Supplier and Manufacturer in ${region.name}`,
    description:
      "The Leading Tent Manufacturer, Tents Including Aluminum Tents, Modular Tent Structures",
  }

  return (
    <>
      <Hero storeUrl={storeUrl} />
      <div className="py-12">
        <ul className="flex flex-col gap-x-6">
          <FeaturedProducts collections={collections} region={region} />
        </ul>
      </div>
    </>
  )
}