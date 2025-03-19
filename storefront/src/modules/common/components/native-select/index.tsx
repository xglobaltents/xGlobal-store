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

    // Enhanced numeric sorting
    const sortedChildren = Children.toArray(children).sort((a, b) => {
      if (isValidElement(a) && isValidElement(b)) {
        // Get values and convert to numbers, handling edge cases
        const getValue = (element: React.ReactElement) => {
          const value = element.props.value || element.props.children?.toString() || ''
          const matches = value.match(/^\d+|^\d+[A-Za-z]+|\d+/)
          return matches ? parseInt(matches[0], 10) : Infinity
        }
        
        const aValue = getValue(a)
        const bValue = getValue(b)
        
        // Sort numerically
        return aValue - bValue
      }
      return 0
    })

    // ...rest of the component code remains the same...