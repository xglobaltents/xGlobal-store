import { Metadata } from "next"
import { notFound } from "next/navigation"

import ProductTemplate from "@modules/products/templates"
import { getRegion, listRegions } from "@lib/data/regions"
import { getProductByHandle, getProductsList } from "@lib/data/products"

type Props = {
  params: { countryCode: string; handle: string }
}

export async function generateStaticParams() {
  const countryCodes = await listRegions().then(
    (regions) =>
      regions
        ?.map((r) => r.countries?.map((c) => c.iso_2))
        .flat()
        .filter(Boolean) as string[]
  )

  if (!countryCodes) {
    return null
  }

  const products = await Promise.all(
    countryCodes.map((countryCode) => {
      return getProductsList({ countryCode })
    })
  ).then((responses) =>
    responses.map(({ response }) => response.products).flat()
  )

  const staticParams = countryCodes
    ?.map((countryCode) =>
      products.map((product) => ({
        countryCode,
        handle: product.handle,
      }))
    )
    .flat()

  return staticParams
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = params
  const region = await getRegion(params.countryCode)

  if (!region) {
    notFound()
  }

  const product = await getProductByHandle(handle, region.id)

  if (!product) {
    notFound()
  }

  // Add Schema.org Product structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description || product.title,
    image: product.thumbnail || [],
    sku: product.id,
    brand: {
      '@type': 'Brand',
      name: 'xGlobal Tents'
    },
    offers: {
      '@type': 'Offer',
      availability: product.quantity > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      price: product.variants[0]?.prices[0]?.amount || 0,
      priceCurrency: region.currency_code?.toUpperCase(),
      priceValidUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      seller: {
        '@type': 'Organization',
        name: 'xGlobal Tents'
      }
    }
  }

  return {
    title: `${product.title} | xGlobal Tents`,
    description: `${product.title}`,
    openGraph: {
      title: `${product.title} | xGlobal Tents`,
      description: `${product.title}`,
      images: product.thumbnail ? [product.thumbnail] : [],
    },
    other: {
      'script:ld+json': JSON.stringify(jsonLd),
    }
  }
}

export default async function ProductPage({ params }: Props) {
  const region = await getRegion(params.countryCode)

  if (!region) {
    notFound()
  }

  const pricedProduct = await getProductByHandle(params.handle, region.id)
  if (!pricedProduct) {
    notFound()
  }

  return (
    <ProductTemplate
      product={pricedProduct}
      region={region}
      countryCode={params.countryCode}
    />
  )
}