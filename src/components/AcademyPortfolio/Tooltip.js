import { useEffect, useRef } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Tooltip as BSTooltip } from 'bootstrap'

const Tooltip = ({ text, children }) => {
  const tooltipRef = useRef(null)
  const tooltipInstance = useRef(null)

  useEffect(() => {
    if (!tooltipRef.current) return

    try {
      tooltipInstance.current?.dispose()
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
    <span ref={tooltipRef} style={{ cursor: 'pointer' }}>
      {children}
    </span>
  )
}

export default Tooltip
