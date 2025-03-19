import { TransactionBaseService } from "@medusajs/medusa"
import { EntityManager } from "typeorm"

class VariantSortService extends TransactionBaseService {
  protected manager_: EntityManager
  protected transactionManager_: EntityManager

  constructor(container) {
    super(container)
  }

  async sortVariants<T extends { title?: string }>(variants: T[]): Promise<T[]> {
    return variants.sort((a, b) => {
      const getNumber = (str?: string): number => {
        const match = str?.match(/^(\d+)/)
        return match ? parseInt(match[1], 10) : Infinity
      }

      const aNum = getNumber(a.title)
      const bNum = getNumber(b.title)

      return aNum - bNum
    })
  }
}

export default VariantSortService