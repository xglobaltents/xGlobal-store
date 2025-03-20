import React from "react"
import { HttpTypes } from "@medusajs/types"
import ProductActions from "@modules/products/components/product-actions"
import ProductActionsWrapper from "./product-actions-wrapper"
import ProductInfo from "./product-info"
import ImageGallery from "@modules/products/components/image-gallery"
import ProductTabs from "@modules/products/components/product-tabs"

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
  if (!product?.id || !Array.isArray(product.variants)) {
    return null
  }

  // Combined sorting logic in one useMemo
  const sortedProduct = React.useMemo(() => {
    // Sort variants by box numbers (1 Box, 2 Box, 3 Box)
    const sortedVariants = [...(product.variants || [])].sort((a, b) => {
      const getNumber = (str?: string) => {
        const match = str?.match(/(\d+)\s*Box/i)
        return match ? parseInt(match[1], 10) : Infinity
      }

      const aNum = getNumber(a.title)
      const bNum = getNumber(b.title)

      // If both have numbers, sort numerically
      if (aNum !== Infinity && bNum !== Infinity) {
        return aNum - bNum
      }
      return 0
    })

    // Sort options to prioritize width
    const sortedOptions = [...(product.options || [])].sort((a, b) => {
      if (a.title.toLowerCase() === 'width') return -1
      if (b.title.toLowerCase() === 'width') return 1
      return 0
    })

    return {
      ...product,
      variants: sortedVariants,
      options: sortedOptions,
      images: product.images || []
    }
  }, [product])

  return (
    <div className="content-container flex flex-col py-6 relative" style={{ isolation: 'isolate' }}>
      <div className="grid grid-cols-1 small:grid-cols-12 gap-x-8">
        {/* Product Info Column */}
        <div className="small:col-span-3 py-8" style={{ position: 'relative', zIndex: 20 }}>
          <div className="sticky top-20">
            <ProductInfo product={sortedProduct} />
            <div className="mt-8">
              <ProductTabs product={sortedProduct} />
            </div>
          </div>
        </div>

        {/* Image Gallery Column */}
        <div 
          className="small:col-span-6 h-full py-8 flex justify-center" 
          style={{ position: 'relative', zIndex: 10 }}
        >
          <div className="w-full max-w-[800px]">
            <ImageGallery images={sortedProduct.images} />
          </div>
        </div>

        {/* Product Actions Column */}
        <div 
          className="small:col-span-3 py-8" 
          style={{ position: 'relative', zIndex: 30 }}
        >
          <div className="sticky top-20">
            <ProductActionsWrapper 
              id={sortedProduct.id} 
              region={region}
              initialProduct={sortedProduct}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductTemplate