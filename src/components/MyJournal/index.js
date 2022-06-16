import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import moment from 'moment'
import 'moment/locale/es'
import IntlMessages from '../../utils/IntlMessages'
import axiosInstance from '../../utils/AxiosInstance'

export default function MyJournalItems({ journalValue, journalId, itemOrder }) {
  const [textQuillStandart, setTextQuillStandart] = useState('')
  const currentLanguage = useSelector((state) => state.lang.locale)
  const [timeOutI, setTimeOutI] = useState(0)

  const quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }]
    ]
  }

  const quillFormats = [
    'header',
    'bold',
    'italic',
    'underline',
    'list',
    'bullet',
    'link'
  ]

  const handleChangeQuillStandart = (textQuillStandart) => {
    setTextQuillStandart(textQuillStandart)
  }

  useEffect(() => {
    if (journalValue.value && journalValue.order == itemOrder) {
      setTextQuillStandart(journalValue.value)
    }
  }, [journalValue])

  useEffect(() => {
    if (textQuillStandart.length > 0) {
      if (timeOutI) clearTimeout(timeOutI)
      setTimeOutI(
        setTimeout(() => {
          saveJournal()
        }, 300)
      )
    }
  }, [textQuillStandart])

  const saveJournal = async () => {
    const params = {
      itemId: journalValue.order ? journalValue.order : 1,
      order: journalValue.order ? journalValue.order : 1,
      content: textQuillStandart
    }
    return await axiosInstance
      .post(`/userItems/userItems/${journalId}`, params)
      .then((res) => res)
      .catch((err) => err)
  }

  return (
    <React.Fragment>
      <div className='mt-2'>
        <div className='row journal-date'>
          <div className='col-lg-4'>
            <IntlMessages id='journals.started' />
            <span
              style={{
                paddingRight: '4px',
                color: '#BBBDBF'
              }}
              className='ms-1'
            >
              {journalValue.createdAt
                ? moment(journalValue.createdAt)
                    .locale(currentLanguage)
                    .format('MMM DD, YYYY')
                : null}{' '}
              {journalValue.createdAt
                ? moment(journalValue.createdAt)
                    .locale(currentLanguage)
                    .format('hh:mm:ss')
                : null}
            </span>
          </div>
          <div className='col-lg-4'>
            <IntlMessages id='my_notes.edited' />
            <span
              style={{
                paddingRight: '4px',
                color: '#BBBDBF'
              }}
              className='ms-1'
            >
              {journalValue.dateEdited
                ? moment(journalValue.dateEdited)
                    .locale(currentLanguage)
                    .format('MMM DD, YYYY')
                : null}{' '}
              {journalValue.dateEdited
                ? moment(journalValue.dateEdited)
                    .locale(currentLanguage)
                    .format('hh:mm:ss')
                : null}
            </span>
          </div>
        </div>
        <div className='mt-2 journal-react-quill'>
          <ReactQuill
            theme='snow'
            name='textQuillStandart'
            className='react-quill-on-jurnals'
            value={textQuillStandart}
            onChange={handleChangeQuillStandart}
            modules={quillModules}
            formats={quillFormats}
          />
        </div>
      </div>
    </React.Fragment>
  )
}
