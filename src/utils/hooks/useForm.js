import { useEffect, useState } from 'react'

export const useForm = (initialState, actualState, mode, loading) => {
  const [formData, setFormData] = useState(initialState)

  useEffect(() => {
    if (mode === 'edit' && !loading) {
      setFormData(actualState)
    }
  }, [actualState, loading, mode])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData({ ...formData, [name]: value })
  }

  const handleChangeCheckbox = (event) => {
    const { name, checked } = event.target

    setFormData({ ...formData, [name]: checked })
  }

  const handleChangeFile = (event) => {
    const { name, files } = event.target
    setFormData({ ...formData, [name]: files[0] })
  }

  const handleChangeEditor = (event, name) => {
    const value = event.html
    setFormData((prevState) => ({ ...prevState, [name]: value }))
  }

  return {
    formData,
    handleChange,
    handleChangeFile,
    handleChangeCheckbox,
    handleChangeEditor
  }
}
