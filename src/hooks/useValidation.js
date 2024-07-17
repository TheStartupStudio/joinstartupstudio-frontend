import { useState } from 'react'

// This is for Editor
const stripHtmlTags = (html) => {
  const tmp = document.createElement('div')
  tmp.innerHTML = html
  return tmp.textContent || tmp.innerText || ''
}

export const useValidation = (
  formData,
  setFormSubmitted,
  optionalFields = []
) => {
  const [errors, setErrors] = useState({})

  const isFormValid = Object.keys(formData).every((key) => {
    const value = formData[key]
    if (typeof value === 'string' && key !== 'isSelected') {
      return stripHtmlTags(value).trim() !== ''
    }
    return !(value === undefined || value === null || value === '')
  })

  const validate = () => {
    let newErrors = {}
    for (const key in formData) {
      if (key === 'isSelected') {
        continue
      }
      if (optionalFields.includes(key)) {
        continue
      }

      const value = formData[key]
      console.log('value', value)

      if (
        (typeof value === 'string' && stripHtmlTags(value).trim() === '') ||
        value === false ||
        value === ''
      ) {
        if (typeof value === 'boolean') {
          newErrors[key] = `${key} cannot be false`
        } else {
          newErrors[key] = `${key} cannot be empty`
        }
      }
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (callback) => {
    setFormSubmitted(true)
    if (validate()) {
      callback()
    }
  }

  return { errors, isFormValid, handleSubmit }
}
