import { useState, useEffect } from 'react'
import { ToastContainer, toast } from 'react-toastify'

const defaultValues = {
  title: '',
  link: '',
  type: null,
  SelectedTags: [],
}

const initialErrors = {
  save: {
    title: 'Title is required',
  },
  submit: {
    tags: 'Please select precisely 3 tags',
    title: 'Title is required',
    type: 'Type is required',
    link_journal: 'Please add a link or import a journal entry.',
  },
}

const useUploadForm = (submit, defaultValuesInput) => {
  const [values, setValues] = useState(defaultValuesInput || defaultValues)
  const [errors, setErrors] = useState(initialErrors)
  const [showErrors, setShowErrors] = useState()

  useEffect(() => {
    let errors = { save: {}, submit: {} }
    if (!values?.title) {
      errors.save.title = 'Title is required'
      errors.submit.title = 'Title is required'
    }

    if (!values?.link && !values?.imported_journal_entry) {
      errors.submit.link_journal =
        'Please add a link or import a journal entry.'
    }

    if (!values?.type) errors.submit.type = 'Type is required'
    Array.isArray(values?.SelectedTags) &&
      values.SelectedTags.forEach((tag) => {
        if (!tag.explanation)
          errors.submit[`explanation-${tag.id}`] = `Explanation is required`
      })
    if (values?.SelectedTags?.length < 1) {
      errors.save.tags = 'Please select at least 1 tag'
      errors.submit.tags = 'Please select at least 1 tag'
    } else if (values?.SelectedTags?.length > 3) {
      errors.save.tags = 'Please select a maximum of 3 tags'
      errors.submit.tags = 'Please select a maximum of 3 tags'
    }

    setErrors(errors)
  }, [values])

  const handleChange = (event, tag) => {
    event.persist && event.persist()

    let name = event.target.name
    let val = event.target.value

    if (['title', 'type', 'link', 'imported_journal_entry'].includes(name)) {
      setValues({
        ...values,
        [name]: val ?? null,
      })
    } else if (name.includes('explanation')) {
      const updatedSelectedTags = values?.SelectedTags?.map((row) => {
        if (row.id === tag.id) row.explanation = val
        return row
      })

      setValues({
        ...values,
        SelectedTags: updatedSelectedTags,
      })
    } else if (name?.includes('checkbox')) {
      let checked = event.target.checked

      let updatedSelectedTags = values?.SelectedTags ?? []
      if (checked && updatedSelectedTags.length >= 3) {
        toast.error('You can not select more than 3 tags!', {
          position: 'bottom-left',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
        })
        return
      }

      if (checked) {
        updatedSelectedTags = [
          ...updatedSelectedTags,
          { ...tag, explanation: '' },
        ]
      } else {
        updatedSelectedTags = updatedSelectedTags.filter(
          (row) => row.id !== tag.id
        )
      }

      // let updatedSelectedTags = checked
      //   ? [...values?.SelectedTags, { ...tag, explanation: '' }]
      //   : values?.SelectedTags?.filter((row) => row.id !== tag.id)

      setValues({
        ...values,
        SelectedTags: updatedSelectedTags,
      })
    }
    ;<ToastContainer />
  }

  const handleSubmit = (event) => {
    if (event) event.preventDefault()

    //get which button user clicked SAVE or SUBMIT
    const type = event.nativeEvent.submitter.name
    if (
      Object.keys(errors[type]).length === 0 &&
      Object.keys(values).length !== 0
    ) {
      showErrors && setShowErrors()
      submit(values, type)
    } else {
      setShowErrors(type)
    }
  }

  return {
    values,
    errors,
    showErrors,
    handleChange,
    handleSubmit,
    resetValues: setValues,
  }
}

export default useUploadForm
