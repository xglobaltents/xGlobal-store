import { TransactionBaseService } from "@medusajs/medusa"
import { EntityManager } from "typeorm"

class VariantSortService extends TransactionBaseService {
  protected readonly manager_: EntityManager
  protected readonly transactionManager_: EntityManager

  constructor(container) {
    super(container)
  }

  async sortVariants<T extends { title?: string; options?: any[] }>(variants: T[]): Promise<T[]> {
    // First separate width variants from others
    const widthVariants: T[] = []
    const otherVariants: T[] = []

    variants.forEach(variant => {
      // Check for width in options or title
      const hasWidth = variant.options?.some(opt => 
        opt.title?.toLowerCase().includes('width') || 
        opt.value?.toLowerCase().includes('width')
      ) || variant.title?.toLowerCase().includes('width')

      if (hasWidth) {
        widthVariants.push(variant)
      } else {
        otherVariants.push(variant)
      }
    })

    // Sort width variants numerically
    widthVariants.sort((a, b) => {
      const getWidthNumber = (variant: T) => {
        const widthOption = variant.options?.find(opt => 
          opt.title?.toLowerCase().includes('width') || 
          opt.value?.toLowerCase().includes('width')
        )
        const value = widthOption?.value || variant.title || ''
        const match = value.match(/(\d+)/)
        return match ? parseInt(match[1], 10) : Infinity
      }

      return getWidthNumber(a) - getWidthNumber(b)
    })

    // Sort other variants by box numbers
    otherVariants.sort((a, b) => {
      const getBoxNumber = (variant: T): number => {
        // Try to get number from title first
        const titleMatch = variant.title?.match(/(\d+)\s*Box/i)
        if (titleMatch) return parseInt(titleMatch[1], 10)

        // Try to get number from options
        const boxOption = variant.options?.find(opt => 
          opt.value?.toLowerCase().includes('box')
        )
        const optionMatch = boxOption?.value.match(/(\d+)\s*Box/i)
        if (optionMatch) return parseInt(optionMatch[1], 10)

        return Infinity
      }

      return getBoxNumber(a) - getBoxNumber(b)
    })

    // Combine arrays with width variants first
    return [...widthVariants, ...otherVariants]
  }
}

export default VariantSortService