import { useEffect, useState } from 'react'

export const useForm = (initialState, initialData, mode, loading) => {
  const [formData, setFormData] = useState(initialState)
  console.log('formData', formData)

  useEffect(() => {
    if (mode === 'edit' && initialData && !loading) {
      setFormData(initialData)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData, initialData, mode, loading])

  const handleChange = (event) => {
    console.log('event', event)
    const { name, value } = event.target
    setFormData({ ...formData, [name]: value })
  }

  const handleChangeCheckbox = (event, type = 'bool', maxLimit = 3) => {
    if (type === 'bool') {
      const { name, checked } = event.target

      setFormData({ ...formData, [name]: checked })
    } else if (type === 'array') {
      const { name, value, checked } = event.target

      setFormData((prevState) => {
        const currentValues = prevState[name]

        if (checked) {
          if (currentValues.length >= maxLimit) {
            alert(`You can select up to ${maxLimit} items only.`)
            return prevState
          }

          return { ...prevState, [name]: [...currentValues, value] }
        } else {
          return {
            ...prevState,
            [name]: currentValues.filter((item) => item !== value)
          }
        }
      })
    } else if (type === 'str') {
      const { name, value, checked } = event.target
      setFormData({ ...formData, [name]: value.toLowerCase() })
    }
  }

  const handleChangeFile = (event) => {
    const { name, files } = event.target
    setFormData({ ...formData, [name]: files[0] })
  }

  const handleChangeEditor = (event, name) => {
    const value = event.html
    setFormData((prevState) => ({ ...prevState, [name]: value }))
  }

  const handleChangeSelect = (event) => {
    const { value, name } = event
    setFormData((prevState) => ({ ...prevState, [name]: value }))
  }

  return {
    formData,
    handleChange,
    handleChangeFile,
    handleChangeCheckbox,
    handleChangeEditor,
    handleChangeSelect
  }
}
