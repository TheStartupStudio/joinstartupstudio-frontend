import { useEffect, useState } from 'react'
import { validatePassword } from '../utils/helpers'
import { toast } from 'react-toastify'

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
  const [submitLoading, setLoading] = useState(false)
  const [isMounted, setIsMounted] = useState(true)

  useEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
  }, [])

  // const isFormValid =
  //   formData &&
  //   Object.keys(formData)?.every((key) => {
  //     const value = formData[key]
  //     if (typeof value === 'string' && key !== 'isSelected') {
  //       return stripHtmlTags(value).trim() !== ''
  //     }
  //     return !(value === undefined || value === null || value === '')
  //   })

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

      if (key === 'password' && !validatePassword(formData[key])) {
        newErrors[
          key
        ] = `${key} must contain at least 8 characters and it should have at least one number, lowercase & uppercase character.`
      }

      if (Array.isArray(value) && !value.length) {
        newErrors[key] = `${key} cannot be empty`
      }

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

  // const handleSubmit = (callback) => {
  //   setFormSubmitted(true)
  //   if (validate()) {
  //     callback()
  //   }
  // }
  const handleSubmit = async (callback) => {
    setFormSubmitted(true)
    if (validate()) {
      setLoading(true)
      try {
        await callback()
      } catch (error) {
        toast.error(
          error.message || 'An error occurred while submitting the form.'
        )
      } finally {
        if (isMounted) setLoading(false)
      }
    }
  }

  return { errors, handleSubmit, submitLoading }
}
