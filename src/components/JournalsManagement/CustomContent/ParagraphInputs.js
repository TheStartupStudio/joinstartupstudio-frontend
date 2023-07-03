import React from 'react'
import KendoTextEditor from '../TextEditor'

const ParagraphInputs = (props) => {
  return (
    <React.Fragment key={props.index}>
      <KendoTextEditor
        key="paragraph"
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
    </React.Fragment>
  )
}

export default ParagraphInputs
