import { Metadata } from "next"
import { notFound } from "next/navigation"

import ProductTemplate from "@modules/products/templates"
import { getRegion, listRegions } from "@lib/data/regions"
import { getProductByHandle, getProductsList } from "@lib/data/products"

type Props = {
  params: { countryCode: string; handle: string }
}

export async function generateStaticParams() {
  // ...existing generateStaticParams code...
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

  // Create Schema.org Product structured data
  const jsonLd = [{
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description || product.title,
    image: product.thumbnail ? [product.thumbnail] : [],
    sku: product.id,
    mpn: product.id,
    brand: {
      '@type': 'Brand',
      name: 'xGlobal Tents'
    },
    offers: {
      '@type': 'Offer',
      availability: product.quantity > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      price: product.variants?.[0]?.prices?.[0]?.amount ?? 0,
      priceCurrency: region.currency_code?.toUpperCase() ?? 'USD',
      priceValidUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/${params.countryCode}/products/${handle}`,
      seller: {
        '@type': 'Organization',
        name: 'xGlobal Tents'
      }
    }
  }]

  return {
    title: `${product.title} | xGlobal Tents`,
    description: `${product.description || product.title}`,
    openGraph: {
      title: `${product.title} | xGlobal Tents`,
      description: `${product.description || product.title}`,
      images: product.thumbnail ? [product.thumbnail] : [],
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/${params.countryCode}/products/${handle}`,
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/${params.countryCode}/products/${handle}`,
    },
    other: {
      'script:ld+json': jsonLd.map(item => JSON.stringify(item))
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