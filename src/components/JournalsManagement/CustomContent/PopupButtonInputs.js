import React from 'react'
import KendoTextEditor from '../TextEditor'
import PositionSelector from '../../PositionSelector/PositionSelector'

const PopupButtonInputs = (props) => {
  return (
    <>
      <div>Popup Button Title</div>
      <input
        type="text"
        key="title"
        className="w-100 p-2"
        name="title"
        value={props.data?.title}
        onChange={(e) => {
          const uuid = props.uuid
          return props.handleChangePopupButtons([
            'title',
            e.target.value,
            props.index,
            props.breakdownIndex,
            uuid
          ])
        }}
      />
      <div>Popup Content</div>
      <KendoTextEditor
        key="content"
        value={props.data?.popupContent}
        minHeight={200}
        handleChange={(e) => {
          const uuid = props.data?.uuid
          return props.handleChangePopupButtons([
            'popupContent',
            e,
            props.index,
            props.breakdownIndex,
            uuid
          ])
        }}
      />

      <PositionSelector
        selectedPosition={props.data?.position}
        handleChangeSelectedPosition={(e) => {
          const uuid = props.data?.uuid
          return props.handleChangePopupButtons([
            'position',
            e,
            props.index,
            props.breakdownIndex,
            uuid
          ])
        }}
      />
    </>
  )
}

export default PopupButtonInputs
