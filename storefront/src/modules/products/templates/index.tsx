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

  const sortedProduct = React.useMemo(() => {
    // Create a copy of variants for sorting
    const sortedVariants = [...product.variants].sort((a, b) => {
      // Extract numbers from variant options
      const getOptionNumber = (variant: HttpTypes.StoreVariant) => {
        const boxOption = variant.options?.find(opt => 
          opt.value.toLowerCase().includes('box')
        )
        if (!boxOption) return Infinity
        
        const match = boxOption.value.match(/^(\d+)/)
        return match ? parseInt(match[1], 10) : Infinity
      }

      const aNum = getOptionNumber(a)
      const bNum = getOptionNumber(b)

      return aNum - bNum
    })

    // Sort options to prioritize Box options
    const sortedOptions = [...(product.options || [])].sort((a, b) => {
      const aTitle = a.title.toLowerCase()
      const bTitle = b.title.toLowerCase()

      if (aTitle.includes('box')) return -1
      if (bTitle.includes('box')) return 1
      if (aTitle === 'width') return -1
      if (bTitle === 'width') return 1
      if (aTitle === 'length') return -1
      if (bTitle === 'length') return 1
      return 0
    })

    return {
      ...product,
      variants: sortedVariants,
      images: product.images || [],
      options: sortedOptions
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