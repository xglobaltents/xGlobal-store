import React, { useEffect, useState } from "react"
import { HttpTypes } from "@medusajs/types"
import ProductActions from "@modules/products/components/product-actions"

type ProductActionsWrapperProps = {
  id: string
  region: HttpTypes.StoreRegion
}

const ProductActionsWrapper: React.FC<ProductActionsWrapperProps> = ({ id, region }) => {
  const [product, setProduct] = useState<HttpTypes.StoreProduct | null>(null)

  useEffect(() => {
    // Fetch product data
    const fetchProduct = async () => {
      const response = await fetch(`/api/products/${id}`)
      const data = await response.json()

      // Sort options to ensure Width comes before Length
      const sortedProduct = {
        ...data,
        options: [...(data.options || [])].sort((a, b) => {
          if (a.title.toLowerCase() === 'width') return -1
          if (b.title.toLowerCase() === 'width') return 1
          if (a.title.toLowerCase() === 'length') return 1
          if (b.title.toLowerCase() === 'length') return -1
          return 0
        })
      }

      setProduct(sortedProduct)
    }

    fetchProduct()
  }, [id])

  if (!product) {
    return null
  }

  return <ProductActions product={product} region={region} />
}

export default ProductActionsWrapper