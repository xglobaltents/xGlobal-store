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
    limit: 8, // Fetch more to ensure we have enough after filtering
  }

  try {
    const { response } = await getProductsList({
      queryParams,
      countryCode,
    })

    // Filter out current product and limit to 4 items
    const relatedProducts = response.products
      .filter(p => p.id !== product.id)
      .slice(0, 4)

    if (!relatedProducts.length) {
      return null
    }

    return (
      <div className="content-container py-12 border-t border-gray-200 relative z-0">
        <div className="flex flex-col items-center text-center mb-8">
          <span className="text-base-regular text-gray-600 mb-6">
            Related Tents
          </span>
          <p className="text-2xl-regular text-ui-fg-base max-w-lg">
            You might also want to check out these tents
          </p>
        </div>

        {/* Add relative positioning and z-0 to ensure proper stacking */}
        <ul className="grid grid-cols-2 small:grid-cols-4 gap-x-4 gap-y-8 relative z-0">
          {relatedProducts.map((p) => (
            <li key={p.id} className="relative z-0">
              <Product region={region} product={p} />
            </li>
          ))}
        </ul>
      </div>
    )
  } catch (error) {
    console.error("Error fetching related products:", error)
    return null
  }
}