import { getConnection } from "typeorm"
import { Product } from "../models/product"
import { ProductOption } from "../models/product-option"

async function updateProductOptions() {
  const connection = getConnection()
  const productRepository = connection.getRepository(Product)
  const productOptionRepository = connection.getRepository(ProductOption)

  try {
    // Get all products with their options
    const products = await productRepository.find({ relations: ["options"] })

    for (const product of products) {
      const sortedOptions = [...product.options].sort((a, b) => {
        if (a.title.toLowerCase() === 'width') return -1
        if (b.title.toLowerCase() === 'width') return 1
        if (a.title.toLowerCase() === 'length') return 1
        if (b.title.toLowerCase() === 'length') return -1
        return 0
      })

      // Update each option's position
      for (let i = 0; i < sortedOptions.length; i++) {
        await productOptionRepository.update(sortedOptions[i].id, {
          position: i,
          metadata: {
            ...sortedOptions[i].metadata,
            display_order: i
          }
        })
      }
    }

    console.log("Successfully updated product options order")
  } catch (error) {
    console.error("Error updating options:", error)
  } finally {
    await connection.close()
  }
}

updateProductOptions()