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
    // Create a new array to sort
    const variantsCopy = [...product.variants]
    
    // Helper function to extract number from variant
    const getVariantNumber = (variant: HttpTypes.StoreVariant): number => {
      // Try to get number from title first
      const titleNumber = variant.title?.match(/\d+/)?.[0]
      if (titleNumber) return parseInt(titleNumber, 10)

      // Try to get number from options
      const optionNumber = variant.options?.[0]?.value?.match(/\d+/)?.[0]
      if (optionNumber) return parseInt(optionNumber, 10)

      return Infinity
    }

    // Sort variants by numeric value
    variantsCopy.sort((a, b) => {
      const aNumber = getVariantNumber(a)
      const bNumber = getVariantNumber(b)
      
      // Debug logging
      console.log(`Sorting: ${a.title}(${aNumber}) vs ${b.title}(${bNumber})`)
      
      return aNumber - bNumber
    })

    return {
      ...product,
      variants: variantsCopy,
      images: product.images || [],
      options: [...(product.options || [])].sort((a, b) => {
        if (a.title.toLowerCase() === 'width') return -1
        if (b.title.toLowerCase() === 'width') return 1
        if (a.title.toLowerCase() === 'length') return 1
        if (b.title.toLowerCase() === 'length') return -1
        return 0
      })
    }
  }, [product])

  // Debug output
  React.useEffect(() => {
    console.log('Final sorted variants:', sortedProduct.variants.map(v => ({
      title: v.title,
      options: v.options?.map(o => o.value)
    })))
  }, [sortedProduct])

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