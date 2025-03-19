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
      // Function to extract number from string
      const getNumber = (str: string) => {
        // Remove any whitespace and try to find a number
        const cleaned = str.trim()
        const match = cleaned.match(/^(\d+)/)
        return match ? parseInt(match[1], 10) : Infinity
      }

      // Get numeric values
      const aNum = getNumber(a)
      const bNum = getNumber(b)

      // Compare numbers
      if (aNum !== bNum) {
        return aNum - bNum
      }

      // If numbers are the same, maintain original order
      return values.indexOf(a) - values.indexOf(b)
    })
  }, [values])

  // Debug logging to verify sorting
  React.useEffect(() => {
    console.log('Original values:', values)
    console.log('Sorted values:', sortedValues)
  }, [values, sortedValues])

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