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

    // Sort width variants by their numeric values if any
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

    // Sort other variants by numeric values
    otherVariants.sort((a, b) => {
      const getNumber = (str?: string): number => {
        if (!str) return Infinity
        const match = str.match(/(\d+)/)
        return match ? parseInt(match[1], 10) : Infinity
      }

      const aNum = getNumber(a.title) || getNumber(a.options?.[0]?.value)
      const bNum = getNumber(b.title) || getNumber(b.options?.[0]?.value)

      return aNum - bNum
    })

    // Combine the sorted arrays with width variants first
    return [...widthVariants, ...otherVariants]
  }
}

export default VariantSortService