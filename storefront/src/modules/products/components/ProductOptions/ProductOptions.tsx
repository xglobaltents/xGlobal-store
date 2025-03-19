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
    // Always prioritize width
    const optionTitle = option.title.toLowerCase()
    if (optionTitle === 'width') {
      return values
    }

    // Handle numeric sorting (e.g., for box options)
    return [...values].sort((a, b) => {
      const getBoxNumber = (str: string) => {
        // Extract number from strings like "1 Box", "2 Box", etc.
        const match = str.toLowerCase().match(/(\d+)/)
        return match ? parseInt(match[1], 10) : Infinity
      }

      // Get numeric values
      const aNum = getBoxNumber(a)
      const bNum = getBoxNumber(b)

      // Sort numerically if both have numbers
      if (aNum !== Infinity && bNum !== Infinity) {
        return aNum - bNum
      }

      // Keep original order for non-numeric values
      return values.indexOf(a) - values.indexOf(b)
    })
  }, [values, option.title])

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