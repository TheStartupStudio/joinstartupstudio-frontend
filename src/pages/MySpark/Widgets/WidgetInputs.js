import React from 'react'
import { Collapse } from 'react-bootstrap'
import WidgetInput from './WidgetInput'
import MySparkSelectInput from './WidgetSelectInput'

function WidgetInputs(props) {
  const handleInputChange = (inputName, value, type) => {
    props.onChange(inputName, value, type)
  }

  const handleInputBlur = (inputName, value, type) => {
    props.onBlur(inputName, value, type)
  }

  const renderInputs = (inputs, inputType) => {
    return inputs?.map((input) => {
      const InputComponent = input?.isSelectInput
        ? MySparkSelectInput
        : WidgetInput

      return (
        <InputComponent
          key={input?.title}
          title={input?.title}
          description={input?.description}
          placeholder={input?.placeholder}
          value={input?.value}
          options={input?.options}
          onChange={(value) =>
            handleInputChange(input?.title, value, inputType)
          }
          onBlur={(value) => handleInputBlur(input?.title, value, inputType)}
          validation={input?.validation}
          generateButtonClicked={props.generateButtonClicked}
        />
      )
    })
  }

  const filterInputs = (inputs, filter) => {
    return inputs?.filter((input) =>
      filter === 'shownInputs' ? !input?.isHidden : input?.isHidden
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

export default WidgetInputs
