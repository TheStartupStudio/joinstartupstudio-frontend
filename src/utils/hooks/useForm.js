import { useEffect, useState } from 'react'

export const useForm = (initialState, initialData, mode, loading) => {
  const [formData, setFormData] = useState(initialState)

  useEffect(() => {
    if (mode === 'edit' && initialData && !loading) {
      setFormData(initialData)
    } else if (!loading) {
      setFormData(initialState)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData, mode, loading])

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
