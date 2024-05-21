import React, { useEffect, useMemo, useRef, useState } from 'react'
import axiosInstance from '../../utils/AxiosInstance'
import Select, { components } from 'react-select'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileUpload, faPlay } from '@fortawesome/free-solid-svg-icons'
import { toast } from 'react-toastify'
import './index.css'
import searchIcon from '../../assets/images/search-icon.png'
import copy from '../../assets/images/copy.svg'
import 'react-quill/dist/quill.snow.css'
import KendoTextEditor from './TextEditor'
import { EditorTools } from '@progress/kendo-react-editor'
import '@progress/kendo-theme-default/dist/all.css'
import { v4 as uuidv4 } from 'uuid'
import { useHistory, useParams } from 'react-router-dom'
import PositionSelector from '../PositionSelector/PositionSelector'
import CustomContent from './CustomContent/CustomContent'
import AccordionItemWrapper from '../../pages/LtsJournal/AccordionItemWrapper'
import LtsButton from '../LTSButtons/LTSButton'
import { useDispatch, useSelector } from 'react-redux'
import { readFile } from '../../utils/canvasUtils'
import { setImageCropperData } from '../../redux'
import { SlCloudUpload } from 'react-icons/sl'
import ImageCropper from '../ImageCropper'
import { ReflectionInfoBox } from '../Modals/ReflectionInfoBox'
import LtsJournalReflection from '../../pages/LtsJournal/reflection'
import ReactTable from '../ReactTable/ReactTable'
import MediaLightbox from '../MediaLightbox'
import InterviewModal from './InterviewModal'
import InterviewedMentorModal from './InterviewedMentorModal'
import AccordionModal from './AccordionModal'
import { FaEdit, FaTrash } from 'react-icons/fa'

export default function MentorshipJournal(props) {
  const [journals, setJournals] = useState([])
  const [journalOptions, setJournalOptions] = useState([])
  const [selectedJournal, setSelectedJournal] = useState({})
  const [loading, setLoading] = useState(false)
  const [fetchingJournals, setFetchingJournals] = useState(true)
  const [imageUploadingLoader, setImageUploadingLoader] = useState(false)
  const [uploadedImageUrl, setUploadedImageUrl] = useState(false)
  const [accordions, setAccordions] = useState([])
  const [selectedAccordion, setSelectedAccordion] = useState({})

  const [showAccordionModal, setShowAccordionModal] = useState(false)

  const handleShowAccordionModal = () => {
    setShowAccordionModal(true)
  }

  const handleHideAccordionModal = () => {
    setShowAccordionModal(false)
    setSelectedAccordion(null)
  }

  useEffect(() => {
    getJournals2()
  }, [])

  useEffect(() => {
    if (selectedJournal.value?.ltsJournalAccordions)
      setAccordions(selectedJournal.value?.ltsJournalAccordions)
  }, [selectedJournal.value?.ltsJournalAccordions])

  useEffect(() => {
    if (journals?.length) {
      setJournalOptions(
        journals
          .map((journal, index) => {
            return {
              label:
                `${journal.category ? journal.category : ''}` +
                ' - ' +
                `${journal.type ? journal.type : ''}  ${
                  journal.type ? '-' : ''
                } ` +
                journal.title,
              value: journal,
              key: index
            }
          })
          .sort((a, b) => {
            if (a.value.category && b.value.category) {
              return a.value.category.localeCompare(b.value.category)
            }
          })
      )
    }
  }, [journals])

  const handleJournalSelect = (e) => {
    setSelectedJournal({
      value: e.value,
      label: e.label
    })
  }

  const history = useHistory()

  useEffect(() => {
    const journalId = selectedJournal?.value?.id
    if (journalId && selectedJournal?.value?.type) {
      const url = `/edit-mentorship-journal/${selectedJournal?.value?.type}/${journalId}`
      history.push(url)
    }
  }, [selectedJournal?.value?.id])

  const getJournals2 = async () => {
    await axiosInstance
      .get('/ltsJournals/journals-descriptions')
      .then(({ data }) => {
        setJournals(data.filter((data) => data.category === 'my-mentorship'))
        setFetchingJournals(false)
      })
      .catch((e) => e)
  }

  const { journalId, type } = useParams()

  const handleSubmit = async () => {
    setLoading(true)
    await axiosInstance
      .put(`LtsJournals/${journalId}/editJournal2`, {
        paragraph: selectedJournal?.value?.paragraph
      })
      .then((res) => {
        setJournals(
          journals.map((journal) =>
            res.data.id === journal.id ? res.data : journal
          )
        )
        setSelectedJournal((prevState) => ({
          ...prevState,
          value: res.data?.updatedJournal?.journal
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
            <img
              src={searchIcon}
              alt="#"
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

  const onAddAccordion = (newAccordion) => {
    setAccordions([...accordions, newAccordion])
  }
  const onUpdateAccordion = (updatedAccordion) => {
    setAccordions(
      accordions.map((acc) =>
        acc.id === updatedAccordion.id ? updatedAccordion : acc
      )
    )
  }
  const handleDeleteAccordion = async (row) => {
    try {
      await axiosInstance.delete(`/manageJournals/accordion/${row?.id}`)
      setAccordions(accordions.filter((acc) => acc.id !== row?.id))
    } catch (error) {
      console.error('Error deleting accordion:', error)
    }
  }

  const getColumns = ({ onSelectRow, onEdit, onDelete }) => [
    {
      Header: 'Title',
      accessor: 'title',
      Cell: ({ row }) => {
        return <div>{row.original.title}</div>
      }
    },
    {
      Header: 'Actions',
      accessor: 'id',
      Cell: ({ row }) => (
        <div>
          <button
            onClick={() => onEdit?.(row.original)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              marginRight: '8px'
            }}
          >
            <FaEdit size={20} color="#99CC33" />
          </button>
          <button
            onClick={() => onDelete?.(row.original)}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <FaTrash size={20} color="#FE43A1" />
          </button>
        </div>
      )
    }
  ]

  return (
    <div>
      {!fetchingJournals ? (
        <div className="row">
          <div className="col-9">
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
              classNamePrefix="vyrill"
              // autoFocus={false}
            />
          </div>
          <div className="col-3 image-upload-widget d-flex align-items-center">
            <label htmlFor="file-input" className="d-flex m-0 p-0">
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
              <p style={{ color: '#01c5d1' }} className="ms-2 p-0 my-auto">
                Uploading image, please wait!
              </p>
            )}

            {!uploadedImageUrl && !imageUploadingLoader && (
              <p className="ms-2 p-0 my-auto" style={{ color: '#707070' }}>
                Upload image to generate html
              </p>
            )}

            {uploadedImageUrl && !imageUploadingLoader && (
              <span
                className="input-group-text bg-transparent text-dark ms-2 w-100 justify-content-center"
                style={{ borderLeft: '0px !important' }}
                onClick={() => {
                  toast.success(
                    'HTML Code Copied, you can paste it on the journal content!'
                  )
                  navigator.clipboard.writeText(
                    `<img src='${uploadedImageUrl}' class='w-100'><br>`
                  )
                }}
              >
                <span
                  className="copy-portfolio-span"
                  style={{ fontSize: '15px' }}
                >
                  Copy Generated Html Code
                  <img src={copy} width="22px" alt="#" className="ms-2" />
                </span>
              </span>
            )}

            <input
              type="file"
              name="myImage"
              className="d-none"
              id="file-input"
              disabled={imageUploadingLoader}
              onChange={(event) => {
                // setSelectedImage(event.target.files[0]);
                imageUpload(event.target.files[0])
              }}
            />
          </div>
        </div>
      ) : (
        <div className="d-flex justify-content-center align-items-center flex-column mt-5 pt-5">
          <div className="lds-facebook">
            <div></div>
            <div></div>
            <div></div>
          </div>
          <p style={{ color: '#01c5d1' }}>Loading journals, please wait!</p>
        </div>
      )}
      {selectedJournal && (
        <div className={'row'}>
          <div className="mt-2 col-md-6">
            <div>Title</div>
            <input
              type="text"
              className="w-100 p-2"
              name="title"
              value={selectedJournal?.value?.title}
              onChange={handleJournalUpdate}
            />
            <LtsButton
              onClick={onAddAccordion}
              name={`Add new accordion`}
              align={'end'}
              width={'30%'}
            />
            {accordions && accordions?.length > 0 && (
              <>
                <ReactTable
                  data={accordions?.sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                  )}
                  getColumns={getColumns}
                  onAdd={handleShowAccordionModal}
                  onEdit={(row) => {
                    handleShowAccordionModal(row)
                    setSelectedAccordion(row)
                  }}
                  onDelete={handleDeleteAccordion}
                />
              </>
            )}

            <button
              className="float-end mt-2 px-md-5 save-button add-new-note-button-text"
              style={{ fontSize: '16px', height: 'auto' }}
              onClick={() => {
                return handleSubmit()
              }}
              disabled={loading}
            >
              {loading ? 'SAVING..' : 'SAVE'}
            </button>
          </div>

          <AccordionModal
            show={showAccordionModal}
            onHide={handleHideAccordionModal}
            selectedAccordion={selectedAccordion}
            setSelectedAccordion={setSelectedAccordion}
            selectedJournal={selectedJournal}
            onAddAccordion={onAddAccordion}
            onUpdateAccordion={onUpdateAccordion}
          />
        </div>
      )}
    </div>
  )
}
