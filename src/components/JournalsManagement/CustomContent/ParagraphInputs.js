import React from 'react'
import KendoTextEditor from '../TextEditor'

const ParagraphInputs = (props) => {
  return (
    <React.Fragment key={props.index}>
      <KendoTextEditor
        key='paragraph'
        value={props.data?.paragraph}
        minHeight={200}
        handleChange={(e) => {
          const uuid = props.data?.uuid
          return props.handleChangeParagraph([
            'paragraph',
            e,
            props.index,
            props.breakdownIndex,
            uuid
          ])
        }}
      />
      <QuillEditorBox
        title='Popup Content'
        key='content'
        value={image?.button?.popupContent}
        minHeight={200}
        onChange={(e) => {
          const uuid = image?.uuid
          return props.handleChangeImages(
            'popupContent',
            e,
            index,
            props.breakdownIndex,
            uuid,
            'button'
          )
        }}
      />
    </React.Fragment>
  )
}

export default ParagraphInputs
