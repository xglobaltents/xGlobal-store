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

type SafeProduct = HttpTypes.StoreProduct & {
  variants: NonNullable<HttpTypes.StoreVariant[]>
  options: NonNullable<HttpTypes.StoreProductOption[]>
}

// Cache the product fetch to prevent multiple requests
const getProduct = cache(async (handle: string, regionId: string): Promise<SafeProduct | null> => {
  try {
    const product = await getProductByHandle(handle, regionId)
    if (!product || !product.id) return null

    // Ensure we have valid variants and options
    const variants = product.variants || []
    const options = product.options || []
    
    if (!Array.isArray(variants) || !Array.isArray(options)) {
      console.error('Invalid product data structure:', { variants, options })
      return null
    }

    return {
      ...product,
      variants,
      options: [...options].sort((a, b) => {
        if (a.title.toLowerCase() === 'width') return -1
        if (b.title.toLowerCase() === 'width') return 1
        if (a.title.toLowerCase() === 'length') return 1
        if (b.title.toLowerCase() === 'length') return -1
        return 0
      })
    } as SafeProduct
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
    if (!product || !Array.isArray(product.variants)) {
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
        availability: (product.variants[0]?.inventory_quantity || 0) > 0 
          ? 'https://schema.org/InStock' 
          : 'https://schema.org/OutOfStock',
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
  } catch (error) {
    console.error('Error in ProductPage:', error)
    notFound()
  }
}