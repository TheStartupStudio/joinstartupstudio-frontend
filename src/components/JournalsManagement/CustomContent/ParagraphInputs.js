import React from 'react'
import KendoTextEditor from '../TextEditor'
import { QuillEditorBox } from '../../../ui/ContentItems'

const ParagraphInputs = (props) => {
  return (
    <React.Fragment key={props.index}>
      <QuillEditorBox
        key='paragraph'
        value={props.data?.paragraph}
        minHeight={200}
        onChange={(e) => {
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

    </React.Fragment>
  )
}

export default ParagraphInputs
