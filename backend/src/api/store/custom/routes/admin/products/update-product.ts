import { 
    ProductService,
    Request, 
    Response 
  } from "@medusajs/medusa"
  
  export async function POST(
    req: Request, 
    res: Response
  ): Promise<void> {
    const productService: ProductService = req.scope.resolve("productService")
    
    try {
      const { id } = req.params
      const data = req.body
  
      // Fetch current product with options
      const currentProduct = await productService.retrieve(id, {
        relations: ['options']
      })
  
      // Sort options with Width first
      const sortedOptions = currentProduct.options.sort((a, b) => {
        if (a.title.toLowerCase() === 'width') return -1
        if (b.title.toLowerCase() === 'width') return 1
        if (a.title.toLowerCase() === 'length') return 1
        if (b.title.toLowerCase() === 'length') return -1
        return 0
      })
  
      // Update each option's position explicitly
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
          ...currentProduct.metadata,
          options_order: ['Width', 'Length'],
          options_priority: {
            Width: 0,
            Length: 1
          }
        }
      })
  
      // Retrieve updated product
      const updatedProduct = await productService.retrieve(id, {
        relations: ['options']
      })
  
      res.json({ product: updatedProduct })
    } catch (error) {
      console.error("Error updating product:", error)
      res.status(400).json({ error: error.message })
    }
  }