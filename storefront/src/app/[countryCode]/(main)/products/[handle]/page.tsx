import { Metadata } from "next"
import { notFound } from "next/navigation"
import { cache } from 'react'
import ProductTemplate from "@modules/products/templates"
import { getRegion, listRegions } from "@lib/data/regions"
import { getProductByHandle, getProductsList } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"

type Props = {
  params: { countryCode: string; handle: string }
}

type SafeProduct = Omit<HttpTypes.StoreProduct, 'variants' | 'options'> & {
  variants: HttpTypes.StoreVariant[]
  options: HttpTypes.StoreProductOption[]
}

// Cache the product fetch to prevent multiple requests
const getProduct = cache(async (handle: string, regionId: string): Promise<SafeProduct | null> => {
  try {
    const product = await getProductByHandle(handle, regionId)
    if (!product?.id) return null

    // Ensure we have valid variants and options
    if (!Array.isArray(product.variants) || !Array.isArray(product.options)) {
      console.error('Invalid product structure:', { 
        hasVariants: Array.isArray(product.variants),
        hasOptions: Array.isArray(product.options)
      })
      return null
    }

    // Create a safe product with guaranteed arrays
    const safeProduct: SafeProduct = {
      ...product,
      variants: product.variants,
      options: product.options.sort((a, b) => {
        if (a.title.toLowerCase() === 'width') return -1
        if (b.title.toLowerCase() === 'width') return 1
        if (a.title.toLowerCase() === 'length') return 1
        if (b.title.toLowerCase() === 'length') return -1
        return 0
      })
    }

    return safeProduct
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
})

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const region = await getRegion(params.countryCode)
  if (!region) return {}

  const product = await getProduct(params.handle, region.id)
  if (!product) return {}

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
    }
  }
}

export default async function ProductPage({ params }: Props) {
  try {
    const region = await getRegion(params.countryCode)
    if (!region) {
      notFound()
    }

    const product = await getProduct(params.handle, region.id)
    if (!product) {
      notFound()
    }

    // Only create structuredData if we have valid product data
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
      offers: product.variants?.[0] ? {
        '@type': 'Offer',
        availability: product.variants[0].inventory_quantity > 0 
          ? 'https://schema.org/InStock' 
          : 'https://schema.org/OutOfStock',
        price: product.variants[0].prices?.[0]?.amount ?? 0,
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
          product={product}
          region={region}
          countryCode={params.countryCode}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </>
    )
  } catch (error) {
    console.error('Error in ProductPage:', error)
    return notFound()
  }
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