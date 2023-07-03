import React from 'react'
import KendoTextEditor from '../TextEditor'

const TextEditorInputs = (props) => {
  return (
    <>
      <div>Title</div>
      <input
        type="text"
        key="title"
        className="w-100 p-2"
        name="title"
        value={props.data?.title}
        onChange={(e) => {
          const uuid = props.data?.uuid
          return props.handleChangeTextEditor([
            'title',
            e.target.value,
            props.index,
            props.breakdownIndex,
            uuid
          ])
        }}
      />

      <KendoTextEditor
        key="content"
        value={props.data?.content}
        minHeight={200}
        handleChange={(e) => {
          const uuid = props.data?.uuid
          return props.handleChangeTextEditor([
            'content',
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

export default TextEditorInputs
