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

    // Convert children to array and sort
    const childArray = Children.toArray(children)
      .filter(isValidElement)
      .sort((a, b) => {
        const aProps = a.props as { value: string; children: string }
        const bProps = b.props as { value: string; children: string }

        // Extract numbers from start of strings
        const aMatch = aProps.value?.match(/^\d+/) || aProps.children?.toString().match(/^\d+/)
        const bMatch = bProps.value?.match(/^\d+/) || bProps.children?.toString().match(/^\d+/)

        // Convert to numbers for comparison
        const aNum = aMatch ? parseInt(aMatch[0], 10) : Infinity
        const bNum = bMatch ? parseInt(bMatch[0], 10) : Infinity

        return aNum - bNum
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
            {childArray}
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