import { useEffect, useRef } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Tooltip as BSTooltip } from 'bootstrap'

const Tooltip = ({ text, children }) => {
  const tooltipRef = useRef(null)
  const tooltipInstance = useRef(null)

  useEffect(() => {
    const shouldEnableTooltip = window.innerWidth >= 1024

    // Don't initialize if screen too small
    if (!tooltipRef.current || !shouldEnableTooltip) return

    try {
      // Cleanup any existing
      tooltipInstance.current?.dispose()

      // Initialize tooltip
      tooltipInstance.current = new BSTooltip(tooltipRef.current, {
        title: text,
        placement: 'bottom',
        trigger: 'hover',
        offset: [10, -10]
      })

      return () => {
        tooltipInstance.current?.dispose()
        tooltipInstance.current = null
      }
    } catch (error) {
      console.error('Tooltip initialization error:', error)
    }
  }, [text])

  return (
    <span
      ref={tooltipRef}
      style={{
        cursor: window.innerWidth >= 1024 ? 'pointer' : 'default'
      }}
    >
      {children}
    </span>
  )
}

export default Tooltip
