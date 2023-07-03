import { v4 as uuidv4 } from 'uuid'
import React, { useEffect, useState } from 'react'

const Checkboxes = (props) => {
  const randomUUID = uuidv4()
  const [checkboxes, setCheckboxes] = useState(props.checkbox)

  useEffect(() => {
    setCheckboxes(props.checkbox)
  }, [props.checkbox])

  useEffect(() => {
    props.handleChange(checkboxes)
  }, [checkboxes])
  const handleChangeCheckboxes =
    (...value) =>
    (name) => {
      const [checkboxValue, checkboxLabelIndex] = value
      if (typeof checkboxLabelIndex === 'undefined') {
        const newCheckboxes = { ...checkboxes }
        newCheckboxes[name] = checkboxValue
        return setCheckboxes(newCheckboxes)
      } else {
        const newCheckboxes = { ...checkboxes }
        let newCheckboxLabels = [...newCheckboxes.checkboxes]
        newCheckboxLabels[checkboxLabelIndex][name] = checkboxValue
        setCheckboxes(newCheckboxes)
      }
    }
  return (
    <>
      <div>
        <div>Checkboxes Title:</div>
        <input
          type="text"
          key="title"
          className="w-100 p-2"
          name="title"
          value={checkboxes?.title}
          onChange={(e) => handleChangeCheckboxes(e.target.value)('title')}
        />
      </div>
      {checkboxes?.checkboxes?.map((data, index) => {
        const checkboxLabelIndex = index
        return (
          <>
            <div>
              <div>#{index + 1} Checkbox </div>
              <input
                type="text"
                className="w-100 p-2"
                name="checkboxLabel"
                value={data?.label}
                onChange={(e) =>
                  handleChangeCheckboxes(
                    e.target.value,
                    checkboxLabelIndex
                  )('label')
                }
              />
            </div>
          </>
        )
      })}
      <div
        className={'d-flex justify-content-end mb-4'}
        onClick={() => {
          let newCheckboxes = [...checkboxes.checkboxes]
          newCheckboxes.push({
            isChecked: false,
            label: '',
            uuid: randomUUID
          })
          setCheckboxes({ ...checkboxes, checkboxes: newCheckboxes })
        }}
      >
        <div class={'btn btn-primary '}>Add new checkbox</div>
      </div>
    </>
  )
}
export default Checkboxes
