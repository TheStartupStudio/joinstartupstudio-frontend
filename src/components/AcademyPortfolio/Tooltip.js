import { useEffect, useRef } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Tooltip as BSTooltip } from 'bootstrap'

const Tooltip = ({ text, children }) => {
  const tooltipRef = useRef(null)
  const tooltipInstance = useRef(null)

  useEffect(() => {
    if (tooltipRef.current) {
      tooltipInstance.current = new BSTooltip(tooltipRef.current, {
        title: text,
        placement: 'bottom',
        trigger: 'hover',
        offset: [10, -10]
      })

      const showTooltip = () => tooltipInstance.current?.show()
      const hideTooltip = () => tooltipInstance.current?.hide()

      tooltipRef.current.addEventListener('mouseenter', showTooltip)
      tooltipRef.current.addEventListener('mouseleave', hideTooltip)

      return () => {
        if (tooltipRef.current) {
          // Double-check tooltipRef.current is available
          tooltipRef.current.removeEventListener('mouseenter', showTooltip)
          tooltipRef.current.removeEventListener('mouseleave', hideTooltip)
        }
        if (tooltipInstance.current) {
          tooltipInstance.current.dispose()
          tooltipInstance.current = null
        }
      }
    }
  }, [text])

  return (
    <span ref={tooltipRef} style={{ cursor: 'pointer' }}>
      {children}
    </span>
  )
}

export default Tooltip
