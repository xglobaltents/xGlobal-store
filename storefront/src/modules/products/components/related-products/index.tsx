import Product from "../product-preview"
import { getRegion } from "@lib/data/regions"
import { getProductsList } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"

type RelatedProductsProps = {
  product: HttpTypes.StoreProduct
  countryCode: string
}

type StoreProductParamsWithTags = HttpTypes.StoreProductParams & {
  tags?: string[]
}

type StoreProductWithTags = HttpTypes.StoreProduct & {
  tags?: { value: string }[]
}

export default async function RelatedProducts({
  product,
  countryCode,
}: RelatedProductsProps) {
  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  // Related products query parameters
  const queryParams: StoreProductParamsWithTags = {
    region_id: region.id,
    is_giftcard: false,
    limit: 4 // Limit to 4 related products
  }

  // First try to get products from same collection
  if (product.collection_id) {
    queryParams.collection_id = [product.collection_id]
  }

  // Then try products with same tags
  const productWithTags = product as StoreProductWithTags
  if (productWithTags.tags?.length) {
    queryParams.tags = productWithTags.tags
      .map((t) => t.value)
      .filter(Boolean) as string[]
  }

  // If no collection or tags, try getting products from same category
  if (!product.collection_id && !productWithTags.tags?.length) {
    if (product.categories?.[0]?.id) {
      queryParams.category_id = [product.categories[0].id]
    }
  }

  try {
    const { response } = await getProductsList({
      queryParams,
      countryCode,
    })

    const products = response.products.filter(
      (p) => p.id !== product.id // Exclude current product
    ).slice(0, 4) // Ensure we only show 4 products

    if (!products.length) {
      return null
    }

    return (
      <div className="product-page-constraint py-12 border-t border-gray-200">
        <div className="flex flex-col items-center text-center mb-8">
          <span className="text-base-regular text-gray-600 mb-6">
            Related Tents
          </span>
          <p className="text-2xl-regular text-ui-fg-base max-w-lg">
            You might also want to check out these tents
          </p>
        </div>

        <ul className="grid grid-cols-2 small:grid-cols-3 medium:grid-cols-4 gap-x-6 gap-y-8">
          {products.map((p) => (
            <li key={p.id}>
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