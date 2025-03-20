import { Product, ProductVariant } from "@medusajs/medusa"
import { useCallback } from "react"

export const useAdminVariantSorting = () => {
  const sortVariants = useCallback((variants: ProductVariant[]) => {
    if (!Array.isArray(variants)) return []

    const widthVariants: ProductVariant[] = []
    const numberedVariants: ProductVariant[] = []
    const otherVariants: ProductVariant[] = []

    // Helper for box number extraction
    const getBoxNumber = (variant: ProductVariant) => {
      const match = variant.title?.match(/(\d+)\s*Box/i)
      return match ? parseInt(match[1], 10) : Infinity
    }

    variants.forEach(variant => {
      const hasWidth = variant.options?.some(opt => 
        opt.title?.toLowerCase().includes('width')
      )
      
      if (hasWidth) {
        widthVariants.push(variant)
      } else if (getBoxNumber(variant) !== Infinity) {
        numberedVariants.push(variant)
      } else {
        otherVariants.push(variant)
      }
    })

    // Sort numbered variants
    numberedVariants.sort((a, b) => getBoxNumber(a) - getBoxNumber(b))

    return [...widthVariants, ...numberedVariants, ...otherVariants]
  }, [])

  return { sortVariants }
}