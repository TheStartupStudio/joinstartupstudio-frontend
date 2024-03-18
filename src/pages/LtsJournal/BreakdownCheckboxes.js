import React from 'react'

const BreakdownCheckboxes = (props) => {
  return (
    <>
      <div>{props.data?.title}</div>
      {props.data?.checkboxes?.map((data, index) => {
        return (
          <div className="form-check  ">
            <input
              className="form-check-input "
              type="checkbox"
              checked={data.checked}
              id="flexCheckDefault"
              onChange={(e) => props.handleChange(e.target.checked, index)}
            />
            <label
              className="form-check-label"
              htmlFor="flexCheckDefault"
              style={{ marginTop: '0.125rem' }}
            >
              {data.label}
            </label>
          </div>
        )
      })}
    </>
  )
}

export default BreakdownCheckboxes
