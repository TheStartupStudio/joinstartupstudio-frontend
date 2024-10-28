import React, { useEffect, useState } from 'react'
import { FaPencil } from 'react-icons/fa6'
import LtsButton from '../LTSButtons/LTSButton'
import './JournalTextEditor.css'
import ReactQuill from 'react-quill'
import moment from 'moment/moment'
import { useSelector } from 'react-redux'
import IntlMessages from '../../utils/IntlMessages'
import { useRouteMatch } from 'react-router-dom'

const JournalTextEditor = ({
  userData,
  handleChange,
  handleSave,
  value,
  title,
  previewMode,
  alignFooter
}) => {


  const currentLanguage = useSelector((state) => state.lang.locale)
  const [content, setContent] = useState('')

  useEffect(() => {
    if (!!userData) {
      setContent(value)
    } else {
      setContent('')
    }
  }, [userData, value])

  const handleChangeContent = (value) => {
    setContent(value)
  }
  const onSaveContent = () => {
    handleSave?.({ content: content })
  }

  return (
    <div
      style={{
        marginTop: '40px '
      }}
    >
      <div className='journal_text_editor-title'>{title}</div>
      {previewMode !== 'on' && (
        <div className='journal_text_editor-input_box journal-entries__entry-reflection-body'>
          <ReactQuill
            theme='snow'
            name='textQuillStandart'
            modules={quillModules}
            formats={quillFormats}
            onChange={handleChangeContent}
            value={content}
          />
          <div className='journal_text_editor-save_button-box'>
            <LtsButton name='Save' onClick={onSaveContent} />
          </div>
        </div>
      )}
      {previewMode === 'on' && (
        <div className='journal_text_editor-input_box journal-entries__entry-reflection-body'>
          <div
            dangerouslySetInnerHTML={{ __html: content }}
            className={'journal_text_editor-display_content'}
          />
        </div>
      )}

      <div className={'journal_text_editor-footer-box'}>
        <div className={`journal_text_editor-footer d-flex justify-content-between align-items-${alignFooter ?? 'end'}`}>
          {userData?.submitted && (
            <span>
              <strong>Submitted:</strong>
              {moment(userData?.submitted)
                .locale(currentLanguage)
                .format('MMM DD, YYYY HH:mm')}
            </span>
          )}
          {/*<span>*/}
          {/*<FaPencil*/}
          {/*  className="journal_text_editor-footer_pencil-icon"*/}
          {/*  width={16}*/}
          {/*  height={16}*/}
          {/*/>*/}
          {/*</span>*/}
        </div>
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
