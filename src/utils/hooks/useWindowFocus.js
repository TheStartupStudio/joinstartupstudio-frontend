import { useState, useEffect } from 'react'
import _ from 'lodash'

// const useWindowFocus = () => {
//   const [isWindowFocused, setIsWindowFocused] = useState(true)
//
//   useEffect(() => {
//     const handleFocus = () => {
//       setIsWindowFocused(true)
//     }
//
//     const handleBlur = () => {
//       setIsWindowFocused(false)
//     }
//
//     window.addEventListener('focus', handleFocus)
//     window.addEventListener('blur', handleBlur)
//
//     return () => {
//       window.removeEventListener('focus', handleFocus)
//       window.removeEventListener('blur', handleBlur)
//     }
//   }, [])
//
//   return isWindowFocused
// }

const useWindowFocus = () => {
  const [isWindowFocused, setIsWindowFocused] = useState(true)

  const debouncedHandleFocusChange = _.debounce(() => {
    setIsWindowFocused(document.hasFocus())
  }, 500) // Adjust the delay as needed

  useEffect(() => {
    window.addEventListener('focus', debouncedHandleFocusChange)
    window.addEventListener('blur', debouncedHandleFocusChange)

    return () => {
      window.removeEventListener('focus', debouncedHandleFocusChange)
      window.removeEventListener('blur', debouncedHandleFocusChange)
    }
  }, [])

  return isWindowFocused
}

export default useWindowFocus
