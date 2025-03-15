import { Metadata } from "next"
import { notFound } from "next/navigation"
import { cache } from 'react'
import ProductTemplate from "@modules/products/templates"
import RelatedProducts from "@modules/products/components/related-products"
import { getRegion, listRegions } from "@lib/data/regions"
import { getProductByHandle, getProductsList } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"

type Props = {
  params: { countryCode: string; handle: string }
}

type SafeProduct = Omit<HttpTypes.StoreProduct, 'variants' | 'options'> & {
  variants: NonNullable<HttpTypes.StoreVariant[]>
  options: NonNullable<HttpTypes.StoreProductOption[]>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const region = await getRegion(params.countryCode)
  if (!region) return {}

  const product = await getProductByHandle(params.handle, region.id)
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

// Cache the product fetch to prevent multiple requests
const getProduct = cache(async (handle: string, regionId: string): Promise<SafeProduct | null> => {
  try {
    const product = await getProductByHandle(handle, regionId)
    
    // Early return if no product or invalid product
    if (!product?.id || !product.variants || !product.options) {
      console.error('Invalid product data:', { 
        id: product?.id,
        hasVariants: Boolean(product?.variants),
        hasOptions: Boolean(product?.options)
      })
      return null
    }

    // Ensure variants and options are arrays
    const variants = Array.isArray(product.variants) ? product.variants : []
    const options = Array.isArray(product.options) ? product.options : []

    // Create safe product with guaranteed non-null arrays
    const safeProduct: SafeProduct = {
      ...product,
      variants,
      options: options.sort((a, b) => {
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

export default async function ProductPage({ params }: Props) {
  try {
    const region = await getRegion(params.countryCode)
    if (!region) {
      notFound()
    }

    const product = await getProduct(params.handle, region.id)
    if (!product || !product.variants.length) {
      console.error('Product not found or invalid:', {
        handle: params.handle,
        hasProduct: Boolean(product),
        variantsLength: product?.variants?.length
      })
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
      }
    }

    return (
      <>
        <ProductTemplate
          product={product}
          region={region}
          countryCode={params.countryCode}
        />
        <RelatedProducts 
          product={product}
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