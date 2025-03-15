import { Metadata } from "next"
import { notFound } from "next/navigation"
import { cache } from 'react'
import ProductTemplate from "@modules/products/templates"
import { getRegion, listRegions } from "@lib/data/regions"
import { getProductByHandle, getProductsList } from "@lib/data/products"

type Props = {
  params: { countryCode: string; handle: string }
}

// Cache the product fetch to prevent multiple requests
const getProduct = cache(async (handle: string, regionId: string) => {
  const product = await getProductByHandle(handle, regionId)
  if (!product) return null
  
  return {
    ...product,
    variants: product.variants || [],
    options: [...(product.options || [])].sort((a, b) => {
      if (a.title.toLowerCase() === 'width') return -1
      if (b.title.toLowerCase() === 'width') return 1
      if (a.title.toLowerCase() === 'length') return 1
      if (b.title.toLowerCase() === 'length') return -1
      return 0
    })
  }
})

export default async function ProductPage({ params }: Props) {
  const region = await getRegion(params.countryCode)
  if (!region) {
    notFound()
  }

  const product = await getProduct(params.handle, region.id)
  if (!product) {
    notFound()
  }

  const structuredData = product.variants.length ? {
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
      price: product.variants[0]?.prices?.[0]?.amount ?? 0,
      priceCurrency: region.currency_code?.toUpperCase() ?? 'USD',
      priceValidUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/${params.countryCode}/products/${params.handle}`,
      seller: {
        '@type': 'Organization',
        name: 'xGlobal Tents'
      }
    }
  } : null

  return (
    <>
      <ProductTemplate
        product={product}
        region={region}
        countryCode={params.countryCode}
      />
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      )}
    </>
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const region = await getRegion(params.countryCode)
  if (!region) return {}

  const product = await getProduct(params.handle, region.id)
  if (!product) return {}

  const jsonLd = product.variants.length ? {
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
      price: product.variants[0]?.prices?.[0]?.amount ?? 0,
      priceCurrency: region.currency_code?.toUpperCase() ?? 'USD',
      priceValidUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/${params.countryCode}/products/${params.handle}`,
      seller: {
        '@type': 'Organization',
        name: 'xGlobal Tents'
      }
    }
  } : null

  return {
    title: `${product.title} | xGlobal Tents`,
    description: product.description || product.title,
    openGraph: {
      title: `${product.title} | xGlobal Tents`,
      description: product.description || product.title,
      images: product.thumbnail ? [product.thumbnail] : [],
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/${params.countryCode}/products/${params.handle}`,
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/${params.countryCode}/products/${params.handle}`,
    },
    other: {
      'script:ld+json': jsonLd ? [JSON.stringify(jsonLd)] : []
    }
  }
}