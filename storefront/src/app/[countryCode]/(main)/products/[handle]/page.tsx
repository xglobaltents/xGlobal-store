import { Metadata } from "next"
import { notFound } from "next/navigation"

import ProductTemplate from "@modules/products/templates"
import { getRegion, listRegions } from "@lib/data/regions"
import { getProductByHandle, getProductsList } from "@lib/data/products"

type Props = {
  params: { countryCode: string; handle: string }
}

export async function generateStaticParams() {
  const regions = await listRegions()
  if (!regions) return []

  const countryCodes = regions
    .map((r) => r.countries?.map((c) => c.iso_2))
    .flat()
    .filter((code): code is string => Boolean(code))

  const products = await Promise.all(
    countryCodes.map(async (countryCode) => {
      const { response } = await getProductsList({ countryCode })
      return response.products
    })
  ).then((productArrays) => productArrays.flat())

  return countryCodes.flatMap((countryCode) =>
    products.map((product) => ({
      countryCode,
      handle: product.handle,
    }))
  )
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

  const jsonLd = {
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
  }

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
      'script:ld+json': [JSON.stringify(jsonLd)]
    }
  }
}

export default async function ProductPage({ params }: Props) {
  const region = await getRegion(params.countryCode)

  if (!region) {
    notFound()
  }

  const product = await getProductByHandle(params.handle, region.id)
  if (!product) {
    notFound()
  }

  const structuredData = {
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
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/${params.countryCode}/products/${params.handle}`,
      seller: {
        '@type': 'Organization',
        name: 'xGlobal Tents'
      }
    }
  }

  return (
    <>
      <ProductTemplate
        product={product}
        region={region}
        countryCode={params.countryCode}
        optionsOrder={['Width', 'Length']}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
    </>
  )
}