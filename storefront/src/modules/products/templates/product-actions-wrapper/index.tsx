"use client"

import React, { useEffect, useState } from "react"
import { HttpTypes } from "@medusajs/types"
import ProductActions from "@modules/products/components/product-actions"
import { getProductById } from "@lib/data/products"

type ProductActionsWrapperProps = {
  id: string
  region: HttpTypes.StoreRegion
  initialProduct: HttpTypes.StoreProduct
}

const ProductActionsWrapper: React.FC<ProductActionsWrapperProps> = ({ 
  id, 
  region,
  initialProduct 
}) => {
  const [product, setProduct] = useState<HttpTypes.StoreProduct>(initialProduct)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true)
        const { product: fetchedProduct } = await getProductById(id)
        
        if (fetchedProduct) {
          const sortedProduct = {
            ...fetchedProduct,
            variants: fetchedProduct.variants || [],
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
      } finally {
        setIsLoading(false)
      }
    }

    // Only fetch if we have an ID
    if (id && id !== product?.id) {
      fetchProduct()
    }
  }, [id, product?.id])

  if (isLoading) {
    return <ProductActions disabled={true} product={product} region={region} />
  }

  if (!product?.variants?.length) {
    return null
  }

  return <ProductActions product={product} region={region} />
}

export default ProductActionsWrapper