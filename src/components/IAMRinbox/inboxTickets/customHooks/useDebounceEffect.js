import { useEffect } from 'react'
import { debounce } from 'lodash'

const useDebouncedEffect = (callback, dependencies, delay) => {
  useEffect(() => {
    const debouncedCallback = debounce(callback, delay)
    debouncedCallback()

    return () => {
      debouncedCallback.cancel()
    }
  }, [callback, dependencies, delay])
}

export default useDebouncedEffect
