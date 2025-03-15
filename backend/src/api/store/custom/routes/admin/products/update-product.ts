import { ProductService } from "@medusajs/medusa"

export async function POST(req, res) {
  const productService = req.scope.resolve("productService")
  
  try {
    const { id } = req.params
    const data = req.body

    // Fetch current product with options
    const product = await productService.retrieve(id, {
      relations: ['options', 'variants', 'variants.prices']
    })

    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    // Sort options with Width first
    const sortedOptions = [...product.options].sort((a, b) => {
      if (a.title.toLowerCase() === 'width') return -1
      if (b.title.toLowerCase() === 'width') return 1
      if (a.title.toLowerCase() === 'length') return 1
      if (b.title.toLowerCase() === 'length') return -1
      return 0
    })

    // Update each option's position and metadata
    for (let i = 0; i < sortedOptions.length; i++) {
      await productService.updateOption(id, sortedOptions[i].id, {
        position: i,
        metadata: {
          display_order: i,
          priority: sortedOptions[i].title.toLowerCase() === 'width' ? 0 : 1
        }
      })
    }

    // Update product metadata
    await productService.update(id, {
      metadata: {
        ...product.metadata,
        options_order: ['Width', 'Length']
      }
    })

    // Fetch updated product
    const updatedProduct = await productService.retrieve(id, {
      relations: ['options', 'variants', 'variants.prices']
    })

    res.json({ product: updatedProduct })
  } catch (error) {
    console.error("Error updating product:", error)
    res.status(500).json({ error: error.message })
  }
}