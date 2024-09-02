import { useEffect, useState } from 'react'

export const useForm = (initialState, initialData, mode = 'add', loading) => {
  const [formData, setFormData] = useState(initialState)

  useEffect(() => {
    if (mode === 'edit' && initialData && !loading) {
      setFormData(initialData)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData, initialData, mode, loading])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData({ ...formData, [name]: value })
  }

  const handleChangeCheckbox = (event, behaviour = 'default') => {
    if (behaviour === 'my-school') {
      const { name, checked } = event.target

      setFormData({ ...formData, [name]: !checked })
    } else {
      const { name, checked } = event.target

      setFormData({ ...formData, [name]: checked })
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

  const handleChangeSelect = (event, fieldName1, fieldName2) => {
    if (fieldName1) {
      const { id, name } = event
      setFormData((prevState) => ({
        ...prevState,
        [fieldName1]: id,
        [fieldName2]: name
      }))
    } else {
      const { value, name } = event
      setFormData((prevState) => ({ ...prevState, [name]: value }))
    }
  }

  const handleChangeDropdown = (selectedOptions, mode, name) => {
    if (mode === 'add') {
      setFormData((prevState) => ({
        ...prevState,
        [name]: selectedOptions.map((option) => option.name)
      }))
    } else {
      if (Array.isArray(selectedOptions)) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          [name]: selectedOptions
            .map((option) => ({
              id: option?.id,
              name: option?.name
            }))
            .filter((option) => option.id && option.name)
        }))
      } else {
        setFormData((prevFormData) => ({
          ...prevFormData,
          [name]: selectedOptions
            ? { id: selectedOptions.id, name: selectedOptions.name }
            : null
        }))
      }
    }
  }

  return {
    formData,
    handleChange,
    handleChangeFile,
    handleChangeCheckbox,
    handleChangeEditor,
    handleChangeSelect,
    handleChangeDropdown
  }
}
