import React, { useEffect, useState } from 'react'

function MySelectInput(props) {
  const [selectedOptionValue, setSelectedOptionValue] = useState(
    props.value || ''
  )
  const [options, setOptions] = useState([])

  useEffect(() => {
    if (props.options) setOptions(props.options)
  }, [props.options])

  const handleChange = (event) => {
    setSelectedOptionValue(event.target.value)
    props.onChange(event.target.value)
  }

  return (
    <div className={'my-spark_widget-details__input_container'}>
      <label
        htmlFor={props.title}
        className={'my-spark_widget-details__input_label'}
      >
        {props.title}
      </label>

      <select
        id="selectInput"
        value={selectedOptionValue}
        onChange={handleChange}
        defaultValue={props.value}
        className="my-1 py-2 px-2 w-100 my-spark_widget-details__input text-dark "
      >
        {options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.name}
          </option>
        ))}
      </select>

      <div className={'my-spark_input-description'}>{props.description}</div>
    </div>
  )
}

export default MySelectInput
