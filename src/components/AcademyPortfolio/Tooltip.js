import { useEffect, useRef } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Tooltip as BSTooltip } from 'bootstrap'

const Tooltip = ({ text, children }) => {
  const tooltipRef = useRef(null)

  useEffect(() => {
    if (tooltipRef.current) {
      new BSTooltip(tooltipRef.current, {
        title: text,
        placement: 'bottom',
        trigger: 'hover'
      })
    }
  }, [text])

  return (
    <span ref={tooltipRef} data-bs-toggle='tooltip'>
      {children}
    </span>
  )
}

export default Tooltip
