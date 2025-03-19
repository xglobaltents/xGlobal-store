import { ProductOption } from "@medusajs/medusa"
import React from "react"

type OptionProps = {
  option: ProductOption
  current: string
  values: string[]
  updateOption: (value: string) => void
}

const ProductOptions: React.FC<OptionProps> = ({ 
  option, 
  values, 
  current, 
  updateOption 
}) => {
  const sortedValues = React.useMemo(() => {
    // Create a new array to avoid mutating the original
    return [...values].sort((a, b) => {
      // Extract numbers for comparison
      const aMatch = a.match(/^(\d+)/)
      const bMatch = b.match(/^(\d+)/)
      
      const aNum = aMatch ? parseInt(aMatch[1], 10) : Infinity
      const bNum = bMatch ? parseInt(bMatch[1], 10) : Infinity

      // Sort by numbers first
      if (aNum !== bNum) {
        return aNum - bNum
      }
      
      // If numbers are equal, use the original order
      return values.indexOf(a) - values.indexOf(b)
    })
  }, [values])

  return (
    <div className="flex flex-col gap-y-3">
      <span className="text-sm">Select {option.title}</span>
      <div className="flex flex-wrap gap-2" data-testid="product-options">
        {sortedValues.map((v) => (
          <button
            key={v}
            onClick={() => updateOption(v)}
            className={`border text-small-regular h-10 rounded-rounded p-2 flex-1 ${
              v === current 
                ? "border-ui-border-interactive" 
                : "border-ui-border-base hover:shadow-elevation-card-rest"
            }`}
            data-testid="option-button"
          >
            {v}
          </button>
        ))}
      </div>
    </div>
  )
}

export default ProductOptions