import React from 'react'

const OrderInput = (props) => {
  return (
    <div>
      <div className="d-flex justify-content-end">
        <div className="input-group mb-3" style={{ width: 150 }}>
          <span className="input-group-text">Order:</span>
          <input
            type="number"
            className="form-control"
            value={props.data?.order}
            onChange={(e) =>
              props.handleOrderChange(props.index, Number(e.target.value))
            }
          />
        </div>
      </div>
    </div>
  )
}

export default OrderInput
