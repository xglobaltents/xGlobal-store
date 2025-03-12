import Head from "next/head"

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
  const title = `xGlobal Tents Supplier and Manufacturer in ${region.name}`
  const description = `The Leading Tent Manufacturer in ${region.name}, Tents Including Aluminum Tents, Modular Tent Structures`

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Head>
      <Hero storeUrl={storeUrl} />
      <div className="py-12">
        <ul className="flex flex-col gap-x-6">
          <FeaturedProducts collections={collections} region={region} />
        </ul>
      </div>
    </>
  )
}