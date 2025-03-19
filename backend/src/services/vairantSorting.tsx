import { TransactionBaseService } from "@medusajs/medusa"
import { EntityManager } from "typeorm"

class VariantSortService extends TransactionBaseService {
  protected readonly manager_: EntityManager
  protected readonly transactionManager_: EntityManager

  constructor(container) {
    super(container)
  }

  async sortVariants<T extends { title?: string; options?: any[] }>(variants: T[]): Promise<T[]> {
    return variants.sort((a, b) => {
      // Check if either variant has "width" in its options
      const hasWidth = (variant: T) => {
        return variant.options?.some(opt => 
          opt.title?.toLowerCase().includes('width') || 
          opt.value?.toLowerCase().includes('width')
        )
      }

      // Prioritize width options
      const aHasWidth = hasWidth(a)
      const bHasWidth = hasWidth(b)

      if (aHasWidth && !bHasWidth) return -1
      if (!aHasWidth && bHasWidth) return 1

      // For non-width options, sort numerically
      const getNumber = (str?: string): number => {
        if (!str) return Infinity
        const match = str.match(/(\d+)/)
        return match ? parseInt(match[1], 10) : Infinity
      }

      // Try to get number from variant title first
      let aNum = getNumber(a.title)
      let bNum = getNumber(b.title)

      // If no numbers in titles, try options
      if (aNum === Infinity && a.options?.length) {
        aNum = getNumber(a.options[0].value)
      }
      if (bNum === Infinity && b.options?.length) {
        bNum = getNumber(b.options[0].value)
      }

      return aNum - bNum
    })
  }
}

export default VariantSortService