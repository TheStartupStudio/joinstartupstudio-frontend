import React from 'react'

const WidgetInput = (props) => {
  const hasError =
    props.generateButtonClicked &&
    props.value?.length === 0 &&
    props.validation?.isRequired

  return (
    <div className={'my-spark_widget-details__input_container'}>
      <label
        htmlFor={props.title}
        className={'my-spark_widget-details__input_label'}
      >
        {props.title}
      </label>

      <input
        className={`my-1 py-2 px-2 w-100 my-spark_widget-details__input text-dark ${
          hasError ? 'input-error' : ''
        } `}
        type="text"
        name={props.title}
        placeholder={props.placeholder}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        onBlur={(e) => {
          if (props.generateButtonClicked) {
            props.onBlur(e.target.value)
          }
        }}
      />
      {hasError && (
        <div className={'error-message'}>{props.validation.message}</div>
      )}

      <div className={'my-spark_input-description'}>{props.description}</div>
    </div>
  )
}

export default WidgetInput
