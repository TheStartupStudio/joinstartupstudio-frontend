import { useState, useEffect } from 'react'

const isEmptyValue = (value) => {
  if (value === null || value === undefined) return true
  if (typeof value === 'string' && !value.trim()) return true
  if (typeof value === 'number' && isNaN(value)) return true
  if (Array.isArray(value) && value.length === 0) return true
  if (typeof value === 'object' && isEmptyObject(value)) return true
  return false
}

const isEmptyObject = (obj) => {
  if (obj === null || obj === undefined) {
    return true
  }
  return Object.keys(obj).length === 0 && obj.constructor === Object
}

const useIsFormEmpty = (formData, fieldsAllowedToBeEmpty = []) => {
  const [isFormEmpty, setIsFormEmpty] = useState(true)

  useEffect(() => {
    if (!formData || typeof formData !== 'object') {
      setIsFormEmpty(true)
      return
    }

    const isEmpty = Object.keys(formData).every((key) => {
      if (fieldsAllowedToBeEmpty.includes(key)) {
        return true
      }

      const value = formData[key]
      return isEmptyValue(value)
    })

    setIsFormEmpty(isEmpty)
  }, [formData, fieldsAllowedToBeEmpty])

  return isFormEmpty
}

export default useIsFormEmpty
