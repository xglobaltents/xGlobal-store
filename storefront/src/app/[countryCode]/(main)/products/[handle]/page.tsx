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

  // Sort the product options to ensure Width comes before Length
  const sortedProduct = {
    ...product,
    options: [...(product.options || [])].sort((a, b) => {
      if (a.title.toLowerCase() === 'width') return -1
      if (b.title.toLowerCase() === 'width') return 1
      if (a.title.toLowerCase() === 'length') return 1
      if (b.title.toLowerCase() === 'length') return -1
      return 0
    }),
    variants: product.variants || []
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: sortedProduct.title,
    description: sortedProduct.description || sortedProduct.title,
    image: sortedProduct.thumbnail ? [sortedProduct.thumbnail] : [],
    sku: sortedProduct.id,
    mpn: sortedProduct.id,
    brand: {
      '@type': 'Brand',
      name: 'xGlobal Tents'
    },
    offers: sortedProduct.variants?.length ? {
      '@type': 'Offer',
      availability: sortedProduct.quantity > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      price: sortedProduct.variants[0]?.prices?.[0]?.amount ?? 0,
      priceCurrency: region.currency_code?.toUpperCase() ?? 'USD',
      priceValidUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/${params.countryCode}/products/${handle}`,
      seller: {
        '@type': 'Organization',
        name: 'xGlobal Tents'
      }
    } : null
  }

  return {
    title: `${sortedProduct.title} | xGlobal Tents`,
    description: `${sortedProduct.description || sortedProduct.title}`,
    openGraph: {
      title: `${sortedProduct.title} | xGlobal Tents`,
      description: `${sortedProduct.description || sortedProduct.title}`,
      images: sortedProduct.thumbnail ? [sortedProduct.thumbnail] : [],
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

  // Sort the product options to ensure Width comes before Length
  const sortedProduct = {
    ...product,
    options: [...(product.options || [])].sort((a, b) => {
      if (a.title.toLowerCase() === 'width') return -1
      if (b.title.toLowerCase() === 'width') return 1
      if (a.title.toLowerCase() === 'length') return 1
      if (b.title.toLowerCase() === 'length') return -1
      return 0
    }),
    variants: product.variants || []
  }

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: sortedProduct.title,
    description: sortedProduct.description || sortedProduct.title,
    image: sortedProduct.thumbnail ? [sortedProduct.thumbnail] : [],
    sku: sortedProduct.id,
    mpn: sortedProduct.id,
    brand: {
      '@type': 'Brand',
      name: 'xGlobal Tents'
    },
    offers: sortedProduct.variants?.length ? {
      '@type': 'Offer',
      availability: sortedProduct.quantity > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      price: sortedProduct.variants[0]?.prices?.[0]?.amount ?? 0,
      priceCurrency: region.currency_code?.toUpperCase() ?? 'USD',
      priceValidUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/${params.countryCode}/products/${params.handle}`,
      seller: {
        '@type': 'Organization',
        name: 'xGlobal Tents'
      }
    } : null
  }

  return (
    <>
      <ProductTemplate
        product={sortedProduct}
        region={region}
        countryCode={params.countryCode}
      />
      {structuredData.offers && (
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