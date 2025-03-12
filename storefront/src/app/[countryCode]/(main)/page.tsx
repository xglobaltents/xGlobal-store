import { Metadata } from "next"
import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import { getCollectionsWithProducts } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"

export async function generateMetadata({ params: { countryCode } }): Promise<Metadata> {
  const region = await getRegion(countryCode)

  if (!region) {
    return {
      title: "xGlobal Tents Supplier and Manufacturer",
      description: "The Leading Tent Manufacturer, Tents Including Aluminum Tents, Modular Tent Structures",
    }
  }

  return {
    title: `xGlobal Tents Supplier and Manufacturer in ${region.name}`,
    description: `The Leading Tent Manufacturer in ${region.name}, Tents Including Aluminum Tents, Modular Tent Structures`,
  }
}

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