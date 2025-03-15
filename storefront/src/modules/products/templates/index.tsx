import React, { Suspense } from "react"
import { HttpTypes } from "@medusajs/types"
import ProductActions from "@modules/products/components/product-actions"
import ProductActionsWrapper from "./product-actions-wrapper"
import ProductInfo from "./product-info"
// ...other imports

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product,
  region,
  countryCode,
}) => {
  if (!product || !product.id) {
    return null
  }

  // Ensure product has sorted options
  const sortedProduct = {
    ...product,
    options: [...(product.options || [])].sort((a, b) => {
      if (a.title.toLowerCase() === 'width') return -1
      if (b.title.toLowerCase() === 'width') return 1
      if (a.title.toLowerCase() === 'length') return 1
      if (b.title.toLowerCase() === 'length') return -1
      return 0
    })
  }

  return (
    <>
      <div className="content-container flex flex-col small:flex-row small:items-start py-6 relative">
        <div className="flex flex-col small:sticky small:top-48 small:py-0 small:max-w-[300px] w-full py-8 gap-y-6">
          <ProductInfo product={sortedProduct} />
        </div>
        <div className="block w-full relative mt-6">
          <ImageGallery images={sortedProduct.images || []} />
        </div>
        <div className="flex flex-col small:sticky small:top-48 small:py-0 small:max-w-[300px] w-full py-8 gap-y-12">
          <Suspense
            fallback={
              <ProductActions disabled={true} product={null} region={region} />
            }
          >
            <ProductActionsWrapper id={sortedProduct.id} region={region} />
          </Suspense>
        </div>
      </div>
    </>
  )
}

export default ProductTemplate