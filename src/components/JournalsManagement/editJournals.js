import React, { useState, useEffect, useContext } from 'react'
import axiosInstance from '../../utils/AxiosInstance'
import Select, { components } from 'react-select'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserPlus, faFileUpload } from '@fortawesome/free-solid-svg-icons'
import ReactQuill from 'react-quill'
import parse from 'html-react-parser'
import { toast } from 'react-toastify'
import './index.css'
import searchIcon from '../../assets/images/search-icon.png'
import copy from '../../assets/images/copy.svg'

export default function EditJournals(props) {
  const [journals, setJournals] = useState([])
  const [journalOptions, setJournalOptions] = useState([])
  const [selectedJournal, setSelectedJournal] = useState(null)
  const [updatedJournal, setUpdatedJournal] = useState()
  const [loading, setLoading] = useState(false)
  const [fetchingJournals, setFetchingJournals] = useState(true)
  const [selectedImage, setSelectedImage] = useState(null)
  const [imageUploadingLoader, setImageUploadingLoader] = useState(false)
  const [uploadedImageUrl, setUploadedImageUrl] = useState(false)

  // const quillModules = {
  //   toolbar: [
  //     // [{ size: ['small', false, 'large', 'huge'] }],
  //     [{ header: [1, 2, 3, 4, 5, 6] }],
  //     [('bold', 'italic')], // toggled buttons
  //     ['blockquote'],
  //     [{ list: 'bullet' }, { list: 'ordered' }],
  //     [{ align: null }, { align: 'center' }, { align: 'right' }],
  //     ['link', 'image', 'video']
  //   ]
  // }

  // const quillFormats = [
  //   'header',
  //   'font',
  //   'type',
  //   'size',
  //   'bold',
  //   'italic',
  //   'underline',
  //   'align',
  //   'strike',
  //   'script',
  //   'blockquote',
  //   'background',
  //   'list',
  //   'bullet',
  //   'indent',
  //   'link',
  //   'image',
  //   'color',
  //   'code-block'
  // ]

  useEffect(() => {
    getJournals()
  }, [])

  useEffect(() => {
    if (journals?.length) {
      setJournalOptions(
        journals.map((journal, index) => {
          return {
            label: journal.category + ' - ' + journal.title,
            value: journal,
            key: index
          }
        })
      )
    }
  }, [journals])

  const handleJournalSelect = (e) => {
    setSelectedJournal({ value: e.value, label: e.label })
  }

  const getJournals = async () => {
    await axiosInstance
      .get('/ltsJournals/journals-descriptions')
      .then(({ data }) => {
        setJournals(data)
        setFetchingJournals(false)
      })
      .catch((e) => e)
  }

  const handleSubmit = async () => {
    setLoading(true)
    await axiosInstance
      .put(`LtsJournals/${selectedJournal.value.id}/editJournal`, {
        content: selectedJournal.value?.content,
        title: selectedJournal?.value?.title
      })
      .then((res) => {
        setJournals(
          journals.map((journal) =>
            res.data.id === journal.id ? res.data : journal
          )
        )
        setSelectedJournal((prevState) => ({
          ...prevState,
          value: res.data
        }))
        toast.success('Journal modified successfully!')
        setLoading(false)
      })
      .catch((err) => {
        toast.error('An error occurred, please try again!')
        setLoading(false)
      })
  }

  const imageUpload = async (image) => {
    setImageUploadingLoader(true)
    const formData = new FormData()
    formData.append('img', image)

    await axiosInstance
      .post('/upload/journal-img', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then((response) => {
        setImageUploadingLoader(false)
        setUploadedImageUrl(response.data.fileLocation)
        toast.success('Image uploaded successfully!')
      })
      .catch((err) => {
        setImageUploadingLoader(false)
        return toast.error('Image upload failed, please try again!')
      })
  }

  const handleJournalUpdate = (event) => {
    const { name, value } = event.target

    setSelectedJournal((prevState) => ({
      ...prevState,
      value: { ...prevState.value, [name]: value }
    }))
  }

  const ValueContainer = ({ children, ...props }) => {
    return (
      components.ValueContainer && (
        <components.ValueContainer {...props}>
          {!!children && (
            // <FontAwesomeIcon
            //   icon={faFileUpload}
            //   style={{
            //     color: '#333d3d',
            //     height: '37px',
            //     width: '36px',
            //     position: 'absolute',
            //     left: '6'
            //     // cursor: 'pointer'
            //   }}
            //   onClick={props.closeChat}
            // />
            <img
              src={searchIcon}
              alt='#'
              style={{
                color: '#333d3d',
                height: '25px',
                width: '25px',
                position: 'absolute',
                left: '10px'
                // cursor: 'pointer'
              }}
            />
          )}
          {children}
        </components.ValueContainer>
      )
    )
  }

  return (
    <div>
      {!fetchingJournals ? (
        <div className='row'>
          <div className='col-9'>
            <Select
              value={
                selectedJournal?.label
                  ? { label: selectedJournal?.label }
                  : {
                      label: 'SEARCH JOURNALS BY NAME OR CATEGORY'
                    }
              }
              onChange={handleJournalSelect}
              options={journalOptions}
              placeholder={'SEARCH FOR A JOURNAL'}
              // openMenuOnClick={false}
              // isDisabled={selectDisabled}
              theme={(theme) => ({
                ...theme,
                borderRadius: 0,
                outLine: 'none',
                colors: {
                  ...theme.colors,
                  // primary25: 'hotpink',
                  primary: '#e4e4e4',
                  neutral0: '#e4e4e4',
                  opacity: 1,
                  zIndex: 100
                },
                spacing: {
                  ...theme.spacing,
                  controlHeight: 32
                },
                zIndex: 100
              })}
              styles={{
                control: (provided, state) => ({
                  ...provided,
                  boxShadow: 'none',
                  border: 'none',
                  height: 15,
                  fontSize: '14px',
                  height: '50px'
                }),
                menu: (base) => ({
                  ...base,
                  border: 'none',
                  boxShadow: 'none',
                  fontSize: '14px'
                }),
                valueContainer: (base) => ({
                  ...base,
                  paddingLeft: 50
                })
              }}
              components={{
                ValueContainer,
                DropdownIndicator: () => null,
                IndicatorSeparator: () => null
              }}
              classNamePrefix='vyrill'
              // autoFocus={false}
            />
          </div>
          <div className='col-3 image-upload-widget d-flex align-items-center'>
            <label htmlFor='file-input' className='d-flex m-0 p-0'>
              <FontAwesomeIcon
                icon={faFileUpload}
                style={{
                  color: '#333d3d',
                  height: '30px',
                  width: '30px',
                  cursor: 'pointer'
                }}
              />
            </label>

            {imageUploadingLoader && (
              <p style={{ color: '#01c5d1' }} className='ms-2 p-0 my-auto'>
                Uploading image, please wait!
              </p>
            )}

            {!uploadedImageUrl && !imageUploadingLoader && (
              <p className='ms-2 p-0 my-auto' style={{ color: '#707070' }}>
                Upload image to generate html
              </p>
            )}

            {uploadedImageUrl && !imageUploadingLoader && (
              <span
                className='input-group-text bg-transparent text-dark ms-2 w-100 justify-content-center'
                style={{ borderLeft: '0px !important' }}
                onClick={() => {
                  toast.success(
                    'HTML Code Copied, you can paste it on the journal content!'
                  )
                  navigator.clipboard.writeText(
                    `<img src="${uploadedImageUrl}" class="w-100"><br>`
                  )
                }}
              >
                <span
                  className='copy-portfolio-span'
                  style={{ fontSize: '15px' }}
                >
                  Copy Generated Html Code
                  <img src={copy} width='22px' alt='#' className='ms-2' />
                </span>
              </span>
            )}

            <input
              type='file'
              name='myImage'
              className='d-none'
              id='file-input'
              disabled={imageUploadingLoader}
              onChange={(event) => {
                // setSelectedImage(event.target.files[0]);
                imageUpload(event.target.files[0])
              }}
            />
          </div>
        </div>
      ) : (
        <div className='d-flex justify-content-center align-items-center flex-column mt-5 pt-5'>
          <div className='lds-facebook'>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <p style={{ color: '#01c5d1' }}>Loading journals, please wait!</p>
        </div>
      )}
      {selectedJournal && (
        <div className='mt-2'>
          {/* <ReactQuill
          theme='snow'
          name='value'
          className='mb-5 w-100 p-0 '
          style={{ height: '400px' }}
          value={
            selectedJournal?.value?.content
              ? selectedJournal?.value?.content
              : ''
          }
          onChange={(e) => handleQuillInput(e)}
          // modules={quillModules}
          placeholder={'Write here…'}
          // formats={quillFormats}
        /> */}

          <input
            type='text'
            className='w-100 p-2'
            name='title'
            value={selectedJournal?.value?.title}
            onChange={handleJournalUpdate}
            // style={{widt}}
            // placeholder='Title (Example: Copywriter)'
          />

          <textarea
            className='p-2 w-100 mt-2'
            value={selectedJournal?.value?.content}
            onChange={handleJournalUpdate}
            name='content'
            id=''
            cols='30'
            rows='16'
          ></textarea>
          <button
            className='float-end mt-2 px-md-5 save-button add-new-note-button-text'
            style={{ fontSize: '16px', height: 'auto' }}
            onClick={() => handleSubmit()}
            disabled={loading}
          >
            {loading ? 'SAVING..' : 'SAVE'}
          </button>
        </div>
      )}
    </div>
  )
}
