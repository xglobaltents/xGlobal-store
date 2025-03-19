import { MedusaContainer } from "@medusajs/medusa"
import { asFunction } from "awilix"
import VariantSortService from "../services/vairantSorting"

export default async (container: MedusaContainer): Promise<void> => {
  try {
    container.register({
      variantSortService: asFunction((cradle) => {
        return new VariantSortService(cradle)
      }).singleton(),
    })

    // Get logger from container
    const logger = container.resolve("logger")
    logger.info("✨ Variant Sort Service loaded")

  } catch (error) {
    const logger = container.resolve("logger")
    logger.error("Failed to load Variant Sort Service")
    logger.error(error)
    throw error
  }
}