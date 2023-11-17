import React from 'react'

const MySparkInput = (props) => {
  return (
    <div className={'my-spark_widget-details__input_container'}>
      <label
        htmlFor={props.title}
        className={'my-spark_widget-details__input_label'}
      >
        {props.title}
      </label>

      <input
        className="my-1 py-2 px-2 w-100 my-spark_widget-details__input text-dark"
        type="text"
        name={props.title}
        placeholder={props.placeholder}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      />

      <div className={'my-spark_input-description'}>{props.description}</div>
    </div>
  )
}

export default MySparkInput
