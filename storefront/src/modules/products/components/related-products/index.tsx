import Product from "../product-preview"
import { getRegion } from "@lib/data/regions"
import { getProductsList } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"

type RelatedProductsProps = {
  product: HttpTypes.StoreProduct
  countryCode: string
}

export default async function RelatedProducts({
  product,
  countryCode,
}: RelatedProductsProps) {
  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  const queryParams = {
    region_id: region.id,
    category_id: product.categories?.[0]?.id,
    collection_id: product.collection_id ? [product.collection_id] : undefined,
    is_giftcard: false,
    limit: 8,
  }

  try {
    const { response } = await getProductsList({
      queryParams,
      countryCode,
    })

    const relatedProducts = response.products
      .filter(p => p.id !== product.id)
      .slice(0, 4)

    if (!relatedProducts.length) {
      return null
    }

    return (
      <div className="relative">
        <div 
          className="content-container py-12 border-t border-gray-200"
          style={{ 
            position: 'relative',
            zIndex: 0,
            marginBottom: '120px'
          }}
        >
          <div className="flex flex-col items-center text-center mb-8">
            <span className="text-base-regular text-gray-600 mb-6">
              Related Tents
            </span>
            <p className="text-2xl-regular text-ui-fg-base max-w-lg">
              You might also want to check out these tents
            </p>
          </div>

          <ul 
            className="grid grid-cols-2 small:grid-cols-4 gap-x-4 gap-y-8"
            style={{ position: 'relative', zIndex: 0 }}
          >
            {relatedProducts.map((p) => (
              <li 
                key={p.id} 
                className="block"
                style={{ position: 'relative', zIndex: 0 }}
              >
                <Product region={region} product={p} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error fetching related products:", error)
    return null
  }
}