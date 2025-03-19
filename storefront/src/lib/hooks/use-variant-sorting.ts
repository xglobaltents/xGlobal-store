import { useMemo } from "react"
import { Product, ProductVariant } from "@medusajs/medusa"

export const useVariantSorting = (product: Product) => {
  return useMemo(() => {
    if (!product?.variants) return []

    const widthVariants: ProductVariant[] = []
    const numberedVariants: ProductVariant[] = []
    const otherVariants: ProductVariant[] = []

    // Helper function to get numeric value
    const getNumericValue = (str?: string): number => {
      if (!str) return Infinity
      const match = str.match(/(\d+)/)
      return match ? parseInt(match[1], 10) : Infinity
    }

    // Categorize variants
    product.variants.forEach(variant => {
      // Check for width in options
      const hasWidth = variant.options?.some(opt => 
        opt.title?.toLowerCase().includes('width') || 
        opt.value?.toLowerCase().includes('width')
      )

      // Check for numeric value in title or first option
      const hasNumber = variant.title?.match(/\d+/) || 
                       variant.options?.[0]?.value?.match(/\d+/)

      if (hasWidth) {
        widthVariants.push(variant)
      } else if (hasNumber) {
        numberedVariants.push(variant)
      } else {
        otherVariants.push(variant)
      }
    })

    // Sort width variants if they have numbers
    widthVariants.sort((a, b) => {
      const aValue = getNumericValue(a.options?.[0]?.value || a.title)
      const bValue = getNumericValue(b.options?.[0]?.value || b.title)
      return aValue - bValue
    })

    // Sort numbered variants (1,2,3)
    numberedVariants.sort((a, b) => {
      const aValue = getNumericValue(a.title) || 
                    getNumericValue(a.options?.[0]?.value)
      const bValue = getNumericValue(b.title) || 
                    getNumericValue(b.options?.[0]?.value)
      return aValue - bValue
    })

    // Sort other variants alphabetically
    otherVariants.sort((a, b) => 
      (a.title || '').localeCompare(b.title || '')
    )

    // Debug logging
    console.log('Sorted variants:', {
      width: widthVariants.map(v => v.title),
      numbered: numberedVariants.map(v => v.title),
      other: otherVariants.map(v => v.title)
    })

    // Return combined array with width first, then numbered, then others
    return [...widthVariants, ...numberedVariants, ...otherVariants]
  }, [product])
}