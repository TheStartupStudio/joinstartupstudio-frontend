import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import axiosInstance from '../../utils/AxiosInstance'
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import { injectIntl } from 'react-intl'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import IntlMessages from '../../utils/IntlMessages'
import moment from 'moment'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { toast, ToastContainer } from 'react-toastify'
import { detectFoulWords, removeHtmlFromString } from '../../utils/helpers'
import FoulWords from '../../utils/FoulWords'
import { JOURNALS } from '../../utils/constants'

function LtsJournalReflection(props) {
  const journalId = props.journal.id
  const journalEntryId = props.journalEntry.id
  const entryId = props.entry?.id

  const currentLanguage = useSelector((state) => state.lang.locale)

  let [content, setContent] = useState(props.entry?.content || '')
  let [editing, setEditing] = useState(false)
  let [saving, setSaving] = useState(false)
  const [foulWords, setFoulWords] = useState(null)
  const loggedUser = useSelector((state) => state.user.user.user)

  const quillModules = {
    toolbar: [
      [{ header: 1 }, { header: 2 }],
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

  const deleteReflection = async () => {
    try {
      await axiosInstance.delete(
        `/ltsJournals/${journalId}/entries/${journalEntryId}/userEntries/${entryId}`
      )

      props.deleted && props.deleted({ entryId })
    } catch (err) {}
  }

  const handleSubmit = async () => {
    if (saving) return

    setSaving(true)

    if (foulWords) {
      await FoulWords.register(loggedUser.id, foulWords, JOURNALS)
      setFoulWords(null)
    }

    try {
      if (!entryId) {
        let { data } = await axiosInstance.post(
          `/ltsJournals/${journalId}/entries/${journalEntryId}/userEntries`,
          {
            content
          }
        )

        props.saved && props.saved(data)
      } else {
        await axiosInstance.put(
          `/ltsJournals/${journalId}/entries/${journalEntryId}/userEntries/${entryId}`,
          {
            content
          }
        )

        props.saved &&
          props.saved({
            ...props,
            content,
            updatedAt: moment().locale(currentLanguage).toString()
          })

        setEditing(false)
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.errors.map((e) => e.message).join('.'))
      } else if (error.request) {
        console.log(error.request)
      } else {
        toast.error(`Error: ${error.message}`)
      }
    } finally {
      setSaving(false)
    }
  }

  const handleContentChange = (value) => {
    setContent(value)
    detectFoulWords(removeHtmlFromString(value), (data) => {
      setFoulWords(data)
    })
  }

  return (
    <>
      <ToastContainer
        className='customToast'
        position='bottom-left'
        autoClose={5000}
      />
      <div
        className={`journal-entries__entry-reflection ${
          !entryId ? 'journal-entries__entry-reflection--new' : ''
        } ${editing ? 'journal-entries__entry-reflection--editing' : ''}`}
      >
        <div className='journal-entries__entry-reflection-header'>
          <div className='journal-entries__entry-reflection-date'>
            {entryId && (
              <>
                {props.entry?.createdAt && (
                  <span>
                    <strong>
                      <IntlMessages id='journals.started' />
                    </strong>
                    {moment(props.entry?.createdAt)
                      .locale(currentLanguage)
                      .format('MMM DD, YYYY HH:mm')}
                  </span>
                )}
                {props.entry?.updatedAt && (
                  <span>
                    <strong>
                      <IntlMessages id='journals.edited' />
                    </strong>
                    {moment(props.entry?.updatedAt)
                      .locale(currentLanguage)
                      .format('MMM DD, YYYY HH:mm')}
                  </span>
                )}
              </>
            )}
          </div>
          <div className='journal-entries__entry-reflection-actions'>
            {/* {entryId && !editing && (
              <FontAwesomeIcon
                onClick={() => setEditing(true)}
                icon={faPencilAlt}
              />
            )} */}

            {(!entryId || editing) && (
              <button className='button' onClick={handleSubmit}>
                <IntlMessages
                  id={
                    saving
                      ? 'general.saving'
                      : entryId
                      ? 'journals.save'
                      : 'journals.add'
                  }
                />
              </button>
            )}
          </div>
        </div>
        <div className='journal-entries__entry-reflection-body'>
          {!entryId || editing ? (
            <ReactQuill
              placeholder={''}
              theme='snow'
              name='textQuillStandart'
              value={content}
              onChange={(value) => handleContentChange(value)}
              modules={quillModules}
              formats={quillFormats}
            />
          ) : (
            <div
              className='journal-entries__entry-reflection-body-content'
              dangerouslySetInnerHTML={{ __html: content }}
            ></div>
          )}
        </div>

        {foulWords && (
          <div className='p-2 foul-words-notice'>
            <IntlMessages id='foul_words.notice' />
          </div>
        )}

        <div className='journal-entries__entry-reflection-footer'>
          {!entryId && props.showCancel === true && (
            <button className='button' onClick={() => props?.cancel()}>
              <IntlMessages id={'journals.cancel'} />
            </button>
          )}
          {entryId && editing && (
            <button className='button' onClick={deleteReflection}>
              <IntlMessages id={'journals.delete'} />
            </button>
          )}
        </div>
      </div>
    </>
  )
}

export default injectIntl(LtsJournalReflection, {
  withRef: false
})
