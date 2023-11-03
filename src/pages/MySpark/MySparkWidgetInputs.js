import React from 'react'
import { Collapse } from 'react-bootstrap'
import MySparkInput from './MySparkInput'

function MySparkWidgetInputs(props) {
  const handleInputChange = (inputName, value, type) => {
    props.onChange(inputName, value, type)
  }

  const renderInputs = (inputs, inputType) => {
    return inputs.map((input) => (
      <MySparkInput
        key={input.title}
        title={input.title}
        description={input.description}
        placeholder={input.placeholder}
        value={input.value}
        onChange={(value) => handleInputChange(input.title, value, inputType)}
      />
    ))
  }

  return (
    <>
      {renderInputs(props.shownInputs, 'shownInputs')}

      <Collapse in={props.showAdvanced} className="advanced-inputs">
        <div id="example-collapse-text">
          {renderInputs(props.hiddenInputs, 'hiddenInputs')}
        </div>
      </Collapse>
    </>
  )
}

export default MySparkWidgetInputs
