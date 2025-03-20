import { useAdminVariantSorting } from "../../../hooks/sorting"
import { Product } from "@medusajs/medusa"
import React, { useMemo } from "react"
import { Table, IconButton, useToggleState } from "@medusajs/ui"
import { EditIcon, TrashIcon } from "@medusajs/icons"
import { getProductVariantInventory, getProductVariantPrice } from "@lib/util/get-product-variant"

type Props = {
  product: Product
  onEdit?: (variantId: string) => void
  onDelete?: (variantId: string) => void
}

const ProductVariantsSection = ({ product, onEdit, onDelete }: Props) => {
  const { sortVariants } = useAdminVariantSorting()
  
  const sortedVariants = useMemo(() => {
    return sortVariants(product?.variants || [])
  }, [product?.variants, sortVariants])

  return (
    <div className="p-4">
      <div className="mb-4">
        <h3 className="text-lg font-medium">Product Variants</h3>
      </div>

      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Title</Table.HeaderCell>
            <Table.HeaderCell>SKU</Table.HeaderCell>
            <Table.HeaderCell>Inventory</Table.HeaderCell>
            <Table.HeaderCell>Price</Table.HeaderCell>
            <Table.HeaderCell>Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {sortedVariants.map((variant) => (
            <Table.Row key={variant.id}>
              <Table.Cell>{variant.title}</Table.Cell>
              <Table.Cell>{variant.sku || "-"}</Table.Cell>
              <Table.Cell>
                {getProductVariantInventory(variant)}
              </Table.Cell>
              <Table.Cell>
                {getProductVariantPrice(variant, product)}
              </Table.Cell>
              <Table.Cell>
                <div className="flex gap-2">
                  {onEdit && (
                    <IconButton
                      variant="secondary"
                      size="small"
                      onClick={() => onEdit(variant.id)}
                    >
                      <EditIcon />
                    </IconButton>
                  )}
                  {onDelete && (
                    <IconButton
                      variant="danger"
                      size="small"
                      onClick={() => onDelete(variant.id)}
                    >
                      <TrashIcon />
                    </IconButton>
                  )}
                </div>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  )
}

export default ProductVariantsSection