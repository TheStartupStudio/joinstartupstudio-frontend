import { useState, useEffect } from 'react'

export const useForm = (initialState, briefing, mode) => {
  const [formData, setFormData] = useState(initialState)

  useEffect(() => {
    if (mode === 'edit' && briefing) {
      setFormData(briefing)
    }
  }, [mode, briefing])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData({ ...formData, [name]: value })
  }

  const handleChangeEditor = (value, name) => {
    setFormData((prevState) => ({ ...prevState, [name]: value }))
  }

  return { formData, handleChange, handleChangeEditor }
}

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

      if (
        !formData[key] ||
        (typeof formData[key] === 'string' && !formData[key].trim())
      ) {
        newErrors[key] = `${key} cannot be empty`
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
