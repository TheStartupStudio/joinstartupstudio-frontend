import { useState } from 'react'

export const useValidation = (formData, setFormSubmitted) => {
  const [errors, setErrors] = useState({})

  const isFormValid = Object.keys(formData).every((key) => {
    const value = formData[key]
    return !(value === undefined || value === null || value === '')
  })

  const validate = () => {
    let newErrors = {}
    for (const key in formData) {
      if (key === 'isSelected') {
        continue
      }

      const value = formData[key]

      if (value === false || value === '') {
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
