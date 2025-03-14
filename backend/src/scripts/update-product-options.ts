import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function updateProductOptions() {
  try {
    // Get all products with their options
    const products = await prisma.product.findMany({
      include: {
        options: true
      }
    })

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
        await prisma.product_option.update({
          where: {
            id: sortedOptions[i].id
          },
          data: {
            position: i,
            metadata: {
              ...sortedOptions[i].metadata,
              display_order: i
            }
          }
        })
      }
    }

    console.log("Successfully updated product options order")
  } catch (error) {
    console.error("Error updating options:", error)
  } finally {
    await prisma.$disconnect()
  }
}

updateProductOptions()