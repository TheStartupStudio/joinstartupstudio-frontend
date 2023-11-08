import React from 'react'
import { Collapse } from 'react-bootstrap'
import MySparkInput from './MySparkInput'
import MySparkSelectInput from './MySparkSelectInput'

function MySparkWidgetInputs(props) {
  const handleInputChange = (inputName, value, type) => {
    props.onChange(inputName, value, type)
  }

  const renderInputs = (inputs, inputType) => {
    return inputs?.map((input) =>
      !input.isSelectInput ? (
        <MySparkInput
          key={input.title}
          title={input.title}
          description={input.description}
          placeholder={input.placeholder}
          value={input.value}
          onChange={(value) => handleInputChange(input.title, value, inputType)}
        />
      ) : (
        <MySparkSelectInput
          key={input.title}
          title={input.title}
          description={input.description}
          placeholder={input.placeholder}
          value={input.value}
          options={input.options}
          onChange={(value) => handleInputChange(input.title, value, inputType)}
        />
      )
    )
  }

  const filterInputs = (inputs, filter) => {
    return inputs?.filter((input) =>
      filter === 'shownInputs' ? !input.isHidden : input.isHidden
    )
  }

  return (
    <>
      {renderInputs(filterInputs(props.widgetInputs, 'shownInputs'))}

      <Collapse in={props.showAdvanced} className="advanced-inputs">
        <div id="example-collapse-text">
          {renderInputs(filterInputs(props.widgetInputs, 'hiddenInputs'))}
        </div>
      </Collapse>
    </>
  )
}

export default MySparkWidgetInputs
