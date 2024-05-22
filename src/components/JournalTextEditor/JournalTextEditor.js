import React, { useEffect, useState } from 'react'
import { FaPencil } from 'react-icons/fa6'
import LtsButton from '../LTSButtons/LTSButton'
import './JournalTextEditor.css'
import ReactQuill from 'react-quill'
import moment from 'moment/moment'
import { useSelector } from 'react-redux'
import IntlMessages from '../../utils/IntlMessages'

const JournalTextEditor = ({
  userData,
  handleChange,
  handleSave,
  value,
  title
}) => {
  const currentLanguage = useSelector((state) => state.lang.locale)
  const [contentValue, setContentValue] = useState('')

  useEffect(() => {
    if (value) setContentValue(value)
  }, [value])

  const handleChangeContent = (value) => {
    console.log('value', value)
    setContentValue(value)
  }
  // console.log(props)
  const onSaveContent = () => {
    handleSave?.({ content: contentValue })
  }

  return (
    <div>
      <div className="journal_text_editor-title">{title}</div>
      <div className="journal_text_editor-input_box journal-entries__entry-reflection-body">
        {!userData ? (
          <ReactQuill
            theme="snow"
            name="textQuillStandart"
            modules={quillModules}
            formats={quillFormats}
            onChange={handleChangeContent}
            value={contentValue}
          />
        ) : (
          <div>{'Display journal content'}</div>
        )}
        <div className="journal_text_editor-save_button-box">
          <LtsButton name="Save" onClick={onSaveContent} />
        </div>
      </div>
      <div
        className="journal_text_editor-footer d-flex justify-content-between align-items-center"
        style={{
          width: '100%',
          padding: 6,
          borderTop: '2px solid rgb(229, 229, 229)'
        }}
      >
        {new Date() && (
          <span>
            <strong>Submitted:</strong>
            {moment(new Date())
              .locale(currentLanguage)
              .format('MMM DD, YYYY HH:mm')}
          </span>
        )}
        <span>
          <FaPencil
            className="journal_text_editor-footer_pencil-icon"
            width={16}
            height={16}
          />
        </span>
      </div>
    </div>
  )
}

export default JournalTextEditor

const quillModules = {
  toolbar: [
    [{ header: '1' }, { header: '2' }],
    [
      'bold',
      'italic',
      'underline',
      { list: 'ordered' },
      { list: 'bullet' },
      { align: [] },
      'blockquote',
      'link'
    ]
  ]
}

const quillFormats = [
  'header',
  'bold',
  'italic',
  'underline',
  'list',
  'bullet',
  'link',
  'blockquote',
  'align'
]
