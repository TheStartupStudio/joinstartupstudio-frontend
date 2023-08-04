import React, { useEffect, useState } from 'react'

const PositionSelector = (props) => {
  const [selectedPosition, setSelectedPosition] = useState(
    props.selectedPosition ?? 'start'
  )

  // console.log(props.selectedPosition)
  //
  // console.log('selectedPosition', selectedPosition)
  const handleChangeSelectedPosition = (position) => {
    // console.log(position)
    setSelectedPosition(position)
  }
  useEffect(() => {
    props.handleChangeSelectedPosition(selectedPosition)
  }, [selectedPosition])
  return (
    <div className="col-md-12">
      <label
        htmlFor="chooseClasses"
        style={{ fontSize: '14px', fontWeight: 'bold' }}
      >
        Button position
      </label>
      <select
        style={{ outline: 'none' }}
        className="form-select form-select-md mb-3  shadow-none"
        onChange={(e) => handleChangeSelectedPosition(e.target.value)}
        value={props.selectedPosition}
        name="chooseClasses"
      >
        <option value={'start'}>Start</option>
        <option value={'center'}>Center</option>
        <option value={'end'}>End</option>
      </select>
    </div>
  )
}
export default PositionSelector
