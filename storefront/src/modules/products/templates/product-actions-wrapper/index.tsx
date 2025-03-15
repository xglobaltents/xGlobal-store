"use client"

import React, { useEffect, useState } from "react"
import { HttpTypes } from "@medusajs/types"
import ProductActions from "@modules/products/components/product-actions"
import { getProductById } from "@lib/data/products"

type ProductActionsWrapperProps = {
  id: string
  region: HttpTypes.StoreRegion
}

const ProductActionsWrapper: React.FC<ProductActionsWrapperProps> = ({ id, region }) => {
  const [product, setProduct] = useState<HttpTypes.StoreProduct | null>(null)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Use the existing Medusa client to fetch product
        const { product: fetchedProduct } = await getProductById(id)
        
        if (fetchedProduct) {
          // Sort options to ensure Width comes before Length
          const sortedProduct = {
            ...fetchedProduct,
            options: [...(fetchedProduct.options || [])].sort((a, b) => {
              if (a.title.toLowerCase() === 'width') return -1
              if (b.title.toLowerCase() === 'width') return 1
              if (a.title.toLowerCase() === 'length') return 1
              if (b.title.toLowerCase() === 'length') return -1
              return 0
            })
          }
          setProduct(sortedProduct)
        }
      } catch (error) {
        console.error("Error fetching product:", error)
      }
    }

    if (id) {
      fetchProduct()
    }
  }, [id])

  if (!product) {
    return <ProductActions disabled={true} product={null} region={region} />
  }

  return <ProductActions product={product} region={region} />
}

export default ProductActionsWrapper