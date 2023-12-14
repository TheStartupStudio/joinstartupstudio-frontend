import React from 'react'
import ModalWrapper from '../../../components/Modals/Spotlight/ModalWrapper'
import LtsButton from '../../../components/LTSButtons/LTSButton'
import ReactQuill from 'react-quill'

function MyContentModal(props) {
  return (
    <ModalWrapper
      title={'Write your own' + ' ' + props.title}
      show={props.show}
      onHide={props.onHide}
      class={'my-spark__content-modal'}
    >
      <div className={''}>
        <div>
          <ReactQuill
            theme="snow"
            name={'textEditorContent'}
            id={'textEditorContent'}
            className="instructor-debrief-editor w-100 rounded-0 "
            onChange={(e) => props.handleChangeContent(e)}
            value={props.content}
          />
        </div>
        <LtsButton
          align={'end'}
          name={'Save'}
          width={'25%'}
          onClick={props.onSave}
        />
      </div>
    </ModalWrapper>
  )
}

export default MyContentModal
