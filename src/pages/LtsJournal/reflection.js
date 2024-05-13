import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useSelector } from 'react-redux'
import axiosInstance from '../../utils/AxiosInstance'
import {
  faInfo,
  faInfoCircle,
  faPencilAlt,
  faSpinner
} from '@fortawesome/free-solid-svg-icons'
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
import { useHistory } from 'react-router-dom'
import NotSavedModal from '../../components/Modals/notSavedNoteModal'
import _ from 'lodash'
import { ReflectionInfoBox } from '../../components/Modals/ReflectionInfoBox'

function LtsJournalReflection(props) {
  const journalId = props.journal.id
  const journalEntryId = props.journalEntry.id
  const entryId = props.entry?.id
  const history = useHistory()
  const currentLanguage = useSelector((state) => state.lang.locale)
  let [content, setContent] = useState(props.entry?.content || '')
  let [editing, setEditing] = useState(false)
  let [saving, setSaving] = useState(false)
  const [notSaved, setNotSaved] = useState(false)
  const [foulWords, setFoulWords] = useState(null)
  const loggedUser = useSelector((state) => state.user.user.user)
  const unblockHandle = useRef()
  const [showNotSavedModal, setShowNotSavedModal] = useState(false)
  const [nextTarget, setNextTarget] = useState(null)
  const [contentDidUpdate, setContentDidUpdate] = useState(false)
  const [showInfoBoxModal, setShowInfoBoxModal] = useState(false)
  const [infoBoxTitle, setInfoBoxTitle] = useState(null)
  const [infoBoxContent, setInfoBoxContent] = useState(null)
  const closeModal = () => setShowNotSavedModal(false)

  const continueWithoutSaving = (location) => {
    setEditing(false)
    setShowNotSavedModal(false)
    history.push(location.pathname)
  }

  const showModal = (location) => {
    setNextTarget(location)
    setShowNotSavedModal(true)
  }

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

  const handleSubmit = async (from, value) => {
    if (saving) return

    setSaving(true)
    setContentDidUpdate(props.entry?.content !== value)

    if (foulWords) {
      await FoulWords.register(loggedUser.id, foulWords, JOURNALS)
      setFoulWords(null)
    }

    const myTraining = history.location.pathname.includes('my-training')

    try {
      if (!entryId) {
        let { data } = await axiosInstance.post(
          `/ltsJournals/${journalId}/entries/${journalEntryId}/userEntries`,
          from == 'debounce'
            ? { content: value, trainingId: myTraining ? journalId : null }
            : { content, trainingId: myTraining ? journalId : null }
        )

        props.saved && props.saved(data)
        setNotSaved(false)
      } else {
        let { data } = await axiosInstance.put(
          `/ltsJournals/${journalId}/entries/${journalEntryId}/userEntries/${entryId}`,
          from == 'debounce'
            ? { content: value, trainingId: myTraining ? journalId : null }
            : { content, trainingId: myTraining ? journalId : null }
        )

        props.saved &&
          props.saved({
            ...props,
            data,
            updatedAt: moment().locale(currentLanguage).toString()
          })

        setEditing(true)
        setNotSaved(false)
      }
      setContentDidUpdate(false)
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.errors.map((e) => e.message).join('.'))
      } else if (error.request) {
        toast.error(
          'Something went wrong, please try to save the answer again.'
        )
      } else {
        toast.error(`Error: ${error.message}`)
      }
    } finally {
      setSaving(false)
      setEditing(false)
    }
  }

  const handleContentChange = (value) => {
    setContent(value)
    setNotSaved(true)
    setContentDidUpdate(false)
    // debounce(handleSubmit, value)
    detectFoulWords(removeHtmlFromString(value), (data) => {
      setFoulWords(data)
    })
  }

  useEffect(() => {
    unblockHandle.current = history.block((targetLocation) => {
      if (
        !showNotSavedModal &&
        notSaved
        // && props.history.location.pathname != targetLocation.pathname
      ) {
        showModal(targetLocation)

        return false
      }
      return true
    })
    return function () {
      unblockHandle.current.current && unblockHandle.current.current()
    }
  })

  function handleConfirm() {
    if (unblockHandle) {
      unblockHandle.current()
    }
    // navigate to some other page or do some routing action now
    // history.push("/any/other/path")
  }

  const debounce = useCallback(
    _.debounce(async (func, value) => {
      func('debounce', value)
    }, 5000),
    []
  )
  return (
    <>
      <ToastContainer
        className="customToast"
        position="bottom-left"
        autoClose={5000}
      />
      <div
        style={{ marginBottom: 0, position: 'relative' }}
        className={`journal-entries__entry-reflection ${
          !entryId ? 'journal-entries__entry-reflection--new' : ''
        } ${editing ? 'journal-entries__entry-reflection--editing' : ''}`}
      >
        {/* <div className="journal-entries__entry-reflection-header">
          <div className="journal-entries__entry-reflection-date">
            {entryId && (
              <>
                {props.entry?.createdAt && (
                  <span>
                    <strong>
                      <IntlMessages id="journals.started" />
                    </strong>
                    {moment(props.entry?.createdAt)
                      .locale(currentLanguage)
                      .format('MMM DD, YYYY HH:mm')}
                  </span>
                )}
                {props.entry?.updatedAt && (
                  <span>
                    <strong>
                      <IntlMessages id="journals.edited" />
                    </strong>
                    {moment(props.entry?.updatedAt)
                      .locale(currentLanguage)
                      .format('MMM DD, YYYY HH:mm')}
                  </span>
                )}
              </>
            )}
          </div>
          <div className="journal-entries__entry-reflection-actions">
            {entryId && !editing && (
              <FontAwesomeIcon
                onClick={() => setEditing(true)}
                icon={faPencilAlt}
              />
            )}
            {(!entryId || editing) && (
              <>
                {saving && (
                  <div className="" style={{ color: '#01c5d1' }}>
                    <FontAwesomeIcon icon={faSpinner} className="" spin />
                  </div>
                )}
              </>
            )}
          </div>
        </div> */}
        <div
          className="journal-entries__entry-reflection-body"
          style={{ borderRadius: 0, border: '0px' }}
        >
          {props.journalEntry.popupContent ? (
            <span
              className="journal-entries__entry-reflection-body_info-btn"
              onClick={() => {
                setInfoBoxTitle(props.journalEntry.title)
                setInfoBoxContent(props.journalEntry.popupContent)
                setShowInfoBoxModal(true)
              }}
            >
              <FontAwesomeIcon icon={faInfo} />
            </span>
          ) : null}
          {
            // !entryId ||
            editing ? (
              <ReactQuill
                placeholder={''}
                theme="snow"
                name="textQuillStandart"
                value={content}
                onChange={handleContentChange}
                modules={quillModules}
                formats={quillFormats}
              />
            ) : (
              <div
                className="journal-entries__entry-reflection-body-content"
                dangerouslySetInnerHTML={{ __html: content }}
                style={{ border: 0 }}
              ></div>
            )
          }
        </div>

        {foulWords && (
          <div className="p-2 foul-words-notice">
            {FoulWords.printMessage(foulWords)}
          </div>
        )}

        <div
          style={{ marginTop: 0, padding: '0 8px', backgroundColor: '#fff' }}
          className="journal-entries__entry-reflection-footer d-flex justify-content-between"
        >
          <div
            className="journal-entries__entry-reflection-header"
            style={{
              width: '100%',
              padding: props.entry?.createdAt || !editing ? 6 : 0,
              borderTop:
                props.entry?.createdAt || !editing
                  ? '2px solid rgb(229, 229, 229)'
                  : '0px'
            }}
          >
            <div className="journal-entries__entry-reflection-date">
              {entryId && (
                <>
                  {props.entry?.createdAt && (
                    <span>
                      <strong>
                        <IntlMessages id="journals.started" />
                      </strong>
                      {moment(props.entry?.createdAt)
                        .locale(currentLanguage)
                        .format('MMM DD, YYYY HH:mm')}
                    </span>
                  )}
                  {props.entry?.updatedAt && (
                    <span>
                      <strong>
                        <IntlMessages id="journals.edited" />
                      </strong>
                      {moment(props.entry?.updatedAt)
                        .locale(currentLanguage)
                        .format('MMM DD, YYYY HH:mm')}
                    </span>
                  )}
                </>
              )}
            </div>
            <div className="journal-entries__entry-reflection-actions">
              {props.isEditable && editing && (
                <button
                  className="button"
                  onClick={handleSubmit}
                  disabled={saving}
                  style={{
                    position: 'absolute',
                    bottom: props.entry?.createdAt || !editing ? 35 : 10,
                    right: 10
                  }}
                >
                  <IntlMessages id={'journals.save'} />
                </button>
              )}
              {props.isEditable && !editing && (
                <div>
                  <FontAwesomeIcon
                    onClick={() => setEditing(true)}
                    icon={faPencilAlt}
                  />
                </div>
              )}

              {props.isEditable && (!entryId || editing) && (
                <>
                  {saving && (
                    <div className="" style={{ color: '#01c5d1' }}>
                      <FontAwesomeIcon icon={faSpinner} className="" spin />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
          {/*{*/}
          {/*  <div style={{ display: 'flex', gap: 20 }}>*/}
          {/*    <div>*/}
          {/*      Started: <span>date</span>*/}
          {/*    </div>*/}
          {/*    <div>*/}
          {/*      Edited: <span>date</span>*/}
          {/*    </div>*/}
          {/*  </div>*/}
          {/*}*/}

          {/*{!editing && (*/}
          {/*  <div onClick={() => setEditing(true)}>*/}
          {/*    <FontAwesomeIcon icon={faPencilAlt} />*/}
          {/*  </div>*/}
          {/*)}*/}
          {/*{!entryId && props.showCancel === true && (*/}
          {/*  <button className="button" onClick={() => props?.cancel()}>*/}
          {/*    <IntlMessages id={'journals.cancel'} />*/}
          {/*  </button>*/}
          {/*)}*/}
          {/*{entryId && editing && (*/}
          {/*  <button className="button" onClick={deleteReflection}>*/}
          {/*    <IntlMessages id={'journals.delete'} />*/}
          {/*  </button>*/}
          {/*)}*/}
          {/*{notSaved && !saving && contentDidUpdate && (*/}
          {/*  <button className="button" onClick={handleSubmit} disabled={saving}>*/}
          {/*    <IntlMessages id={'journals.save'} />*/}
          {/*  </button>*/}
          {/*)}*/}
        </div>
      </div>
      <NotSavedModal
        show={showNotSavedModal}
        onHide={closeModal}
        continue={() => continueWithoutSaving(nextTarget)}
      />{' '}
      {showInfoBoxModal && (
        <ReflectionInfoBox
          show={showInfoBoxModal}
          onHide={() => setShowInfoBoxModal(false)}
          title={infoBoxTitle}
          content={infoBoxContent}
        />
      )}
    </>
  )
}

export default injectIntl(LtsJournalReflection, {
  withRef: false
})
