import React, { useState, useEffect, useRef } from 'react'
import { Modal } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import {
  faGlobe,
  faFileUpload,
  faLink
} from '@fortawesome/free-solid-svg-icons'
import axiosInstance from '../../../utils/AxiosInstance'
import { toast } from 'react-toastify'
import ImageCropper from '../../ImageCropper'
import { readFile } from '../../../utils/canvasUtils'
import { useDispatch, useSelector } from 'react-redux'
import { setImageCropperData, setCroppedImage } from '../../../redux'
import '../../Portfolio/Experience/style.css'
import IntlMessages from '../../../utils/IntlMessages'
import ReactQuill from 'react-quill'

export const EditJournalBrandBoxModal = (props) => {
  const defaultData = {
    column: props.column,
    content: '',
    id: props.id,
    journalId: props.journalId
  }

  const COLUMN = {
    type: 'TYPE OF SHOT',
    action: 'ACTION',
    narration: 'NARRATION',
    music: 'MUSIC'
  }

  const [data, setData] = useState(defaultData)
  const [loading, setLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState('')
  const inputImage = React.useRef(null)
  const [content, setContent] = useState('')

  const general = useSelector((state) => state.general)
  const dispatch = useDispatch()

  useEffect(() => setContent(props.content), [props.content])

  const handleChange = (value) => {
    setContent(value)
  }

  const addExperience = async () => {
    setLoading(true)
    const newExperience = {
        id: defaultData.id,
        journalId: defaultData.journalId,
        content: content,
        column: defaultData.column
    }
    if (newExperience.type == '') {
        setLoading(false)
        return toast.error('Please fill in all the fields.')
      }

    await axiosInstance
      .patch('/LtsJournals/journal-brand-box', newExperience)
      .then(() => {
        setLoading(false)
        props.onShow()
        toast.success(<IntlMessages id='alert.my_account.success_change' />)
        setSelectedImage()
        setData(defaultData)
      })
      .catch((err) => {
        toast.error(<IntlMessages id='alerts.something_went_wrong' />)
        setLoading(false)
      })
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

  return (
    <>
      <Modal
        show={props.show}
        onHide={props.onHide}
        backdrop='static'
        keyboard={false}
        className='edit-modal edit-profile-modal edit-experience-modal'
      >
        <Modal.Header className='pb-0 mx-4 general-modal-header'>
          <h3 className='mt-4 mb-0 contact-bio'>
            EDIT {COLUMN[defaultData['column']]}
          </h3>
          <button
            type='button'
            className='btn-close me-1 me-md-1 mb-md-2 ms-2 ms-md-0 mt-2 mt-md-0 my-auto'
            aria-label='Close'
            onClick={() => {
              props.onHide()
              setSelectedImage()
              setData(defaultData)
            }}
          />
        </Modal.Header>
        <Modal.Body className='px-4'>
          <div className='row'>
            <div className="col-12">
                <input type="text" value={COLUMN[defaultData['column']]} style={{marginBottom: '15px'}} disabled/>
            </div>
            <div className='col-12'>
              <ReactQuill
                placeholder={''}
                theme="snow"
                name="textQuillStandart"
                value={content}
                onChange={handleChange}
                modules={quillModules}
                formats={quillFormats}
              />
            </div>
            <div className='row mx-0'>
              <div className='col-12 text-end'>
                <button
                  className='float-end edit-account mt-4'
                  disabled={loading}
                  onClick={() => addExperience()}
                >
                  {loading ? (
                    <span className='spinner-border spinner-border-sm' />
                  ) : (
                    'SAVE'
                  )}
                </button>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  )
}
