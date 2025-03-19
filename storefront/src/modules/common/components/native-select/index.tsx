import { ChevronUpDown } from "@medusajs/icons"
import { clx } from "@medusajs/ui"
import {
  SelectHTMLAttributes,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  Children,
  isValidElement,
} from "react"

export type NativeSelectProps = {
  placeholder?: string
  errors?: Record<string, unknown>
  touched?: Record<string, unknown>
} & SelectHTMLAttributes<HTMLSelectElement>

const NativeSelect = forwardRef<HTMLSelectElement, NativeSelectProps>(
  (
    { placeholder = "Select...", defaultValue, className, children, ...props },
    ref
  ) => {
    const innerRef = useRef<HTMLSelectElement>(null)
    const [isPlaceholder, setIsPlaceholder] = useState(false)

    useImperativeHandle<HTMLSelectElement | null, HTMLSelectElement | null>(
      ref,
      () => innerRef.current
    )

    useEffect(() => {
      if (innerRef.current && innerRef.current.value === "") {
        setIsPlaceholder(true)
      } else {
        setIsPlaceholder(false)
      }
    }, [innerRef.current?.value])

    // Improved numeric sorting for variants
    const sortedChildren = Children.toArray(children).sort((a, b) => {
      if (isValidElement(a) && isValidElement(b)) {
        // Extract numeric values, handling all possible formats
        const extractNumber = (element: React.ReactElement) => {
          const text = element.props.children?.toString() || ''
          // Match any number at the start of the string
          const numberMatch = text.match(/^(\d+)/)
          if (numberMatch) {
            return parseInt(numberMatch[1], 10)
          }
          // Fallback to value prop if no number in text
          const valueMatch = element.props.value?.toString().match(/^(\d+)/)
          return valueMatch ? parseInt(valueMatch[1], 10) : Infinity
        }

        const aNum = extractNumber(a)
        const bNum = extractNumber(b)

        // Sort numerically
        if (aNum !== bNum) {
          return aNum - bNum
        }

        // If numbers are equal, sort by full text
        const aText = a.props.children?.toString() || ''
        const bText = b.props.children?.toString() || ''
        return aText.localeCompare(bText)
      }
      return 0
    })

    return (
      <div className="relative w-full max-w-[800px] mx-auto">
        <div
          onFocus={() => innerRef.current?.focus()}
          onBlur={() => innerRef.current?.blur()}
          className={clx(
            "relative flex items-center text-base-regular border border-ui-border-base bg-ui-bg-subtle rounded-md hover:bg-ui-bg-field-hover w-full",
            className,
            {
              "text-ui-fg-muted": isPlaceholder,
            }
          )}
          style={{ maxWidth: '100%' }}
        >
          <select
            ref={innerRef}
            defaultValue={defaultValue}
            {...props}
            className="appearance-none w-full bg-transparent border-none px-4 py-2.5 transition-colors duration-150 outline-none"
          >
            <option disabled value="">
              {placeholder}
            </option>
            {sortedChildren}
          </select>
          <span className="absolute right-4 inset-y-0 flex items-center pointer-events-none">
            <ChevronUpDown />
          </span>
        </div>
      </div>
    )
  }
)

NativeSelect.displayName = "NativeSelect"

export default NativeSelect