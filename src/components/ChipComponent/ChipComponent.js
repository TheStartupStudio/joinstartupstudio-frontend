import React from 'react'
import './ChipComponent.css'

function ChipComponent({ label }) {
  return (
    <div className={'filled-chip'}>
      <div className={'filled-chip-content'}>{label}</div>
    </div>
  )
}

export default ChipComponent