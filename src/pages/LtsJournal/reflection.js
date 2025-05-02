import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import axiosInstance from '../../utils/AxiosInstance'
import {
  faInfo,
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
import { fetchLtsCoursefinishedContent } from '../../redux/course/Actions';

function LtsJournalReflection(props) {
  const dispatch = useDispatch()
  const journalId = props.journal?.id;
  const journalEntryId = props.journalEntry?.id;
  const entryId = props.entry?.id;
  const history = useHistory();
  const currentLanguage = useSelector((state) => state.lang.locale);
  let [content, setContent] = useState(props.entry?.content || '');
  let [editing, setEditing] = useState(true); // Editable by default
  let [saving, setSaving] = useState(false);
  const [notSaved, setNotSaved] = useState(false);
  const [foulWords, setFoulWords] = useState(null);
  const loggedUser = useSelector((state) => state.user.user.user);
  const unblockHandle = useRef();
  const [showNotSavedModal, setShowNotSavedModal] = useState(false);
  const [nextTarget, setNextTarget] = useState(null);
  const [contentDidUpdate, setContentDidUpdate] = useState(false);
  const [showInfoBoxModal, setShowInfoBoxModal] = useState(false);
  const [infoBoxTitle, setInfoBoxTitle] = useState(null);
  const [infoBoxContent, setInfoBoxContent] = useState(null);
  const closeModal = () => setShowNotSavedModal(false);

  const continueWithoutSaving = (location) => {
    setEditing(false);
    setShowNotSavedModal(false);
    history.push(location.pathname);
  };

  const showModal = (location) => {
    setNextTarget(location);
    setShowNotSavedModal(true);
  };

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
        'link',
      ],
    ],
  };

  const quillFormats = [
    'header',
    'bold',
    'italic',
    'underline',
    'list',
    'bullet',
    'link',
    'blockquote',
    'align',
  ];

  const handleContentChange = (value) => {
    setContent(value);

    // Pass all necessary data to parent
    props.onContentChange?.(value, {
      content: value,
      journalId: props.journal?.id,
      journalEntryId: props.journalEntry?.id,
      entryId: props.entry?.id,
      foulWords: foulWords
    });

    detectFoulWords(removeHtmlFromString(value), (data) => {
      setFoulWords(data);
    });
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit('enter', content);
    }
  };

  useEffect(() => {
    if (unblockHandle.current) {
      unblockHandle.current();
    }


    // unblockHandle.current = history.block((targetLocation) => {
    //   if (!showNotSavedModal && notSaved) {
    //     showModal(targetLocation);
    //     return false; // Prevent navigation
    //   }
    //   return true; // Allow navigation
    // });

    return () => {
      if (unblockHandle.current) {
        unblockHandle.current();
        unblockHandle.current = null;
      }
    };
  }, [history /*, showNotSavedModal, notSaved*/]);

  return (
    <>
      <ToastContainer
        className="customToast"
        position="bottom-left"
        autoClose={5000}
      />
      <div
        style={{ marginBottom: 0, position: 'relative' }}
        className={`journal-entries__entry-reflection ${!entryId ? 'journal-entries__entry-reflection--new' : ''
          } ${editing ? 'journal-entries__entry-reflection--editing' : ''}`}
      >
        <div
          className={`journal-entries__entry-reflection-body`}
          style={{ borderRadius: 0, border: '0px' }}
        >
          {props.journalEntry?.popupContent ? (
            <span
              className="journal-entries__entry-reflection-body_info-btn"
              onClick={() => {
                setInfoBoxTitle(props.journalEntry.title);
                setInfoBoxContent(props.popupContent);
                setShowInfoBoxModal(true);
              }}
            >
              <FontAwesomeIcon icon={faInfo} />
            </span>
          ) : null}
          {editing ? (
            <>
              <ReactQuill
                placeholder="Write your reflection..."
                theme="snow"
                value={content}
                onChange={handleContentChange}
                onKeyDown={handleKeyDown} // Submit on Enter
                modules={quillModules}
                formats={quillFormats}
              />
            </>
          ) : (
            <div
              className="journal-entries__entry-reflection-body-content-after"
              onClick={() => setEditing(true)}
              dangerouslySetInnerHTML={{ __html: content || 'Click to edit...' }}
            ></div>
          )}
        </div>

        {foulWords && (
          <div className="p-2 foul-words-notice">
            {FoulWords.printMessage(foulWords)}
          </div>
        )}
      </div>
      <NotSavedModal
        show={showNotSavedModal}
        onHide={closeModal}
        continue={() => continueWithoutSaving(nextTarget)}
      />
      {showInfoBoxModal && (
        <ReflectionInfoBox
          show={showInfoBoxModal}
          onHide={() => setShowInfoBoxModal(false)}
          title={infoBoxTitle}
          content={infoBoxContent}
        />
      )}
    </>
  );
}

export default injectIntl(LtsJournalReflection, {
  withRef: false,
});