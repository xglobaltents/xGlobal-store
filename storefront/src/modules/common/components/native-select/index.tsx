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

    // New sorting logic that prioritizes numeric order
    const sortedChildren = Children.toArray(children).sort((a, b) => {
      if (!isValidElement(a) || !isValidElement(b)) return 0

      const getValue = (element: React.ReactElement) => {
        const value = element.props.value?.toString() || ''
        const text = element.props.children?.toString() || ''
        const numValue = text.match(/^\d+/) || value.match(/^\d+/)
        return numValue ? parseInt(numValue[0], 10) : Infinity
      }

      const aValue = getValue(a)
      const bValue = getValue(b)

      // Primary sort by numeric value
      if (aValue !== bValue) {
        return aValue - bValue
      }

      // Secondary sort by full text for equal numbers
      const aText = a.props.children?.toString() || ''
      const bText = b.props.children?.toString() || ''
      return aText.localeCompare(bText)
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