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
    // Skip sorting for specific option types
    const optionTitle = option.title.toLowerCase()
    if (optionTitle === 'width' || optionTitle === 'length') {
      return values
    }

    return [...values].sort((a, b) => {
      // Extract numbers from strings
      const getNumber = (str: string) => {
        // Look for first number in the string
        const match = str.match(/\d+/)
        if (!match) return { num: Infinity, original: str }
        return {
          num: parseInt(match[0], 10),
          original: str
        }
      }

      const aValue = getNumber(a)
      const bValue = getNumber(b)

      // Compare numbers first
      if (aValue.num !== bValue.num) {
        return aValue.num - bValue.num
      }

      // If numbers are equal, maintain original order
      return values.indexOf(a) - values.indexOf(b)
    })
  }, [values, option.title])

  // Debug logging
  React.useEffect(() => {
    console.log(`Sorting ${option.title}:`, {
      original: values,
      sorted: sortedValues
    })
  }, [option.title, values, sortedValues])

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