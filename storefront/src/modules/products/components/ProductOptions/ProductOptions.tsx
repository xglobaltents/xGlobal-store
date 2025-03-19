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
    // Skip sorting for width/length
    const optionTitle = option.title.toLowerCase()
    if (optionTitle === 'width' || optionTitle === 'length') {
      return values
    }

    // Sort numerically for other options
    return [...values].sort((a, b) => {
      const getNumber = (str: string) => {
        const match = str.match(/(\d+)/)
        return match ? parseInt(match[1], 10) : Infinity
      }

      const aNum = getNumber(a)
      const bNum = getNumber(b)

      return aNum - bNum
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