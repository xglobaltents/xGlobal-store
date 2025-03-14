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
  
      // Sort options if present
      if (data.options) {
        data.options = data.options.sort((a, b) => {
          if (a.title === 'Width') return -1
          if (b.title === 'Width') return 1
          if (a.title === 'Length') return 1
          if (b.title === 'Length') return -1
          return 0
        })
      }
  
      const product = await productService.update(id, {
        ...data,
        metadata: {
          ...data.metadata,
          options_order: ['Width', 'Length']
        }
      })
  
      res.json({ product })
    } catch (error) {
      console.error("Error updating product:", error)
      res.status(400).json({ error: error.message })
    }
  }