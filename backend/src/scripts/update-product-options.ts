import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function updateProductOptions() {
  try {
    // Get all products with their options
    const products = await prisma.product_option.findMany({
      orderBy: {
        created_at: 'asc'
      }
    })

    // Update the position of options based on title
    for (const option of products) {
      const position = option.title === 'Width' ? 0 : 1
      await prisma.product_option.update({
        where: { id: option.id },
        data: { position }
      })
    }

    console.log('Successfully updated product options order')
  } catch (error) {
    console.error('Error updating options:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateProductOptions()