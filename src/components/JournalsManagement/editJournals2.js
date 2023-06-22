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
import 'react-quill/dist/quill.snow.css'
import KendoTextEditor from './TextEditor'
import { Editor, EditorTools } from '@progress/kendo-react-editor'
import '@progress/kendo-theme-default/dist/all.css'
export default function EditJournals2(props) {
  const [journals, setJournals] = useState([])
  const [journalOptions, setJournalOptions] = useState([])
  const [selectedJournal, setSelectedJournal] = useState(null)
  const [updatedJournal, setUpdatedJournal] = useState()
  const [loading, setLoading] = useState(false)
  const [fetchingJournals, setFetchingJournals] = useState(true)
  const [selectedImage, setSelectedImage] = useState(null)
  const [imageUploadingLoader, setImageUploadingLoader] = useState(false)
  const [uploadedImageUrl, setUploadedImageUrl] = useState(false)
  const [breakdowns, setBreakdowns] = useState([
    {
      id: '',
      content: '',
      title: '',
      type: '',
      breakdownImages: [
        {
          breakDownImage: '',
          description: '',
          breakdownId: ''
        }
      ]
    }
  ])

  console.log(breakdowns)

  useEffect(() => {
    // getJournals()
    getJournals2()
    getJournals2Weeks()
  }, [])

  console.log(journals)

  useEffect(() => {
    if (journals?.length) {
      setJournalOptions(
        journals.map((journal, index) => {
          return {
            label:
              `${journal.type ? journal.type : ''}  ${
                journal.type ? '-' : ''
              } ` +
              journal.category +
              ' - ' +
              journal.title,
            value: journal,
            key: index
          }
        })
      )
    }
  }, [journals])

  const handleJournalSelect = (e) => {
    console.log(e)
    setSelectedJournal({
      value: e.value,
      label: e.label
    })
    setBreakdowns(e.value?.breakdowns)
  }

  console.log(selectedJournal)

  const getJournals = async () => {
    await axiosInstance
      .get('/ltsJournals/journals-descriptions')
      .then(({ data }) => {
        setJournals(data.filter((d) => d.category.includes('new')))
        setFetchingJournals(false)
      })
      .catch((e) => e)
  }

  const getJournals2 = async () => {
    try {
      const response = await axiosInstance.get(
        '/ltsJournals/journals-descriptions2'
      )
      const newData = response.data.filter((d) => d.category.includes('new'))
      setJournals((prevJournals) => [...prevJournals, ...newData])
      setFetchingJournals(false)
      // setBreakdowns(data.breakdowns)
    } catch (error) {
      console.error(error)
    }
  }

  const getJournals2Weeks = async () => {
    try {
      const response = await axiosInstance.get(
        '/ltsJournals/journals-descriptions2-weeks'
      )
      setJournals((prevJournals) => [...prevJournals, ...response.data])
      setFetchingJournals(false)
      // setBreakdowns(data.breakdowns)
    } catch (error) {
      console.error(error)
    }
  }
  const handleSubmit = async () => {
    setLoading(true)
    await axiosInstance
      .put(`LtsJournals/${selectedJournal.value.id}/editJournal2`, {
        breakdowns: breakdowns,
        paragraph: selectedJournal.value?.paragraph,
        title: selectedJournal?.value?.title,
        type: selectedJournal?.value?.type
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
    console.log(name, value)

    setSelectedJournal((prevState) => ({
      ...prevState,
      value: { ...prevState.value, [name]: value }
    }))
  }
  console.log(selectedJournal)
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

  const handleChangeBreakdown = (index, name, value) => {
    const newBreakdowns = [...breakdowns]
    newBreakdowns[index][name] = value
    setBreakdowns(newBreakdowns)
  }

  const [breakdownImages, setBreakdownImages] = useState([
    {
      breakDownImage: '',
      description: '',
      breakdownId: ''
    }
  ])

  // useEffect(()=>{
  //   const newBreakdowns = [...breakdowns];
  //   newBreakdowns
  //   setBreakdowns()
  // },[])
  const handleSetImages = (breakdownImages, index) => {
    const newBreakdowns = [...breakdowns]
    newBreakdowns[index].breakdownImages = breakdownImages
    setBreakdowns(newBreakdowns)
  }

  const handleChangeBreakdownImages = (
    name,
    value,
    breakdownIndex,
    imageIndex
  ) => {
    console.log(name, value, breakdownIndex, imageIndex)
    const newBreakdowns = [...breakdowns]
    const newBreakdown = newBreakdowns[breakdownIndex]
    const breakdownImages = [...newBreakdown.breakdownImages]
    breakdownImages[imageIndex][name] = value
    newBreakdown.breakdownImages = breakdownImages
    newBreakdowns[breakdownIndex] = newBreakdown
    setBreakdowns(newBreakdowns)
  }

  const {
    Bold,
    Italic,
    Underline,
    Strikethrough,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    Indent,
    Outdent,
    OrderedList,
    UnorderedList,
    Undo,
    Redo,
    FontSize,
    FontName,
    FormatBlock,
    Link,
    Unlink,
    InsertImage,
    ViewHtml
  } = EditorTools

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
                    `<img src="${uploadedImageUrl}" class="w-100"><br>`
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
        <div style={{ width: 530 }} className="mt-2">
          <div>Title</div>
          <input
            type="text"
            className="w-100 p-2"
            name="title"
            value={selectedJournal?.value?.title}
            onChange={handleJournalUpdate}
          />
          <div>Paragraph</div>
          <textarea
            className="p-2 w-100 mt-2"
            value={selectedJournal?.value?.paragraph}
            onChange={handleJournalUpdate}
            name="paragraph"
            id=""
            cols="30"
            rows="4"
          ></textarea>

          {
            <>
              <div>BREAKDOWNS</div>
              {breakdowns?.map((breakdown, breakdownIndex) => {
                return (
                  <div>
                    <div style={{ fontWeight: 600 }}>
                      Breakdown {breakdownIndex + 1}
                    </div>
                    <div>Breakdown title</div>
                    <input
                      type="text"
                      className="w-100 p-2"
                      name="title"
                      value={breakdown?.title}
                      onChange={(e) =>
                        handleChangeBreakdown(
                          breakdownIndex,
                          'title',
                          e.target.value
                        )
                      }
                    />
                    {breakdown.type === 'type-1' && (
                      <>
                        <div>Breakdown content</div>
                        <KendoTextEditor
                          value={breakdown?.content}
                          handleChange={(e) =>
                            handleChangeBreakdown(breakdownIndex, 'content', e)
                          }
                        />
                      </>
                    )}
                    {breakdown.type === 'type-2' && (
                      <>
                        {breakdown?.breakdownImages?.map(
                          (breakdownImage, imageIndex) => {
                            return (
                              <>
                                <div>`Image {imageIndex + 1}`</div>
                                <div className={'bg-white'}>
                                  <div>Image</div>
                                  <KendoTextEditor
                                    tools={[
                                      [
                                        AlignLeft,
                                        AlignCenter,
                                        AlignRight,
                                        AlignJustify
                                      ],

                                      [Link, Unlink, InsertImage, ViewHtml]
                                    ]}
                                    minHeight={200}
                                    value={breakdownImage.breakDownImage}
                                    handleChange={(e) =>
                                      handleChangeBreakdownImages(
                                        'breakDownImage',
                                        e,
                                        breakdownIndex,
                                        imageIndex
                                      )
                                    }
                                  />
                                  {/*<input*/}
                                  {/*  type="text"*/}
                                  {/*  className="w-100 p-2 "*/}
                                  {/*  name="breakDownImage"*/}
                                  {/*  value={breakdownImage.breakDownImage}*/}
                                  {/*  onChange={(e) =>*/}
                                  {/*    handleChangeBreakdownImages(*/}
                                  {/*      'breakDownImage',*/}
                                  {/*      e.target.value,*/}
                                  {/*      breakdownIndex,*/}
                                  {/*      imageIndex*/}
                                  {/*    )*/}
                                  {/*  }*/}
                                  {/*/>{' '}*/}
                                  <div>Description</div>
                                  <div>
                                    <KendoTextEditor
                                      tools={[
                                        [Bold, Italic],
                                        [
                                          AlignLeft,
                                          AlignCenter,
                                          AlignRight,
                                          AlignJustify
                                        ],
                                        [Indent, Outdent],
                                        [OrderedList, UnorderedList],
                                        FontSize,
                                        FontName,
                                        FormatBlock,
                                        [Undo, Redo],
                                        [Link, Unlink, InsertImage, ViewHtml]
                                      ]}
                                      minHeight={200}
                                      value={breakdownImage.description}
                                      handleChange={(e) =>
                                        handleChangeBreakdownImages(
                                          'description',
                                          e,
                                          breakdownIndex,
                                          imageIndex
                                        )
                                      }
                                    />
                                  </div>
                                  {/*<textarea*/}
                                  {/*  className="w-100 p-2 "*/}
                                  {/*  name="description"*/}
                                  {/*  rows="2"*/}
                                  {/*  value={breakdownImage.description}*/}
                                  {/*  onChange={(e) =>*/}
                                  {/*    handleChangeBreakdownImages(*/}
                                  {/*      'description',*/}
                                  {/*      e.target.value,*/}
                                  {/*      breakdownIndex,*/}
                                  {/*      imageIndex*/}
                                  {/*    )*/}
                                  {/*  }*/}
                                  {/*/>*/}
                                </div>
                              </>
                            )
                          }
                        )}
                        <div
                          className={'d-flex justify-content-end mb-4'}
                          onClick={() => {
                            let newBreakdownImages = [
                              ...breakdown.breakdownImages
                            ]
                            const breakdownImage = {
                              breakDownImage: '',
                              breakdownId: '',
                              description: ''
                            }
                            newBreakdownImages.push(breakdownImage)

                            return handleSetImages(
                              newBreakdownImages,
                              breakdownIndex
                            )
                          }}
                        >
                          <div class={'btn btn-secondary '}>Add image</div>
                        </div>
                      </>
                    )}
                  </div>
                )
              })}
              <div
                className={'d-flex justify-content-end mb-4'}
                onClick={() => {
                  let newBreakdowns = [...breakdowns]
                  newBreakdowns.push({
                    content: '',
                    title: '',
                    type: 'type-1',
                    breakdownImages: [
                      {
                        breakDownImage: '',
                        description: '',
                        breakdownId: ''
                      }
                    ]
                  })
                  setBreakdowns(newBreakdowns)
                }}
              >
                <div class={'btn btn-secondary '}>Add breakdown 1</div>
              </div>
              <div
                className={'d-flex justify-content-end mb-4'}
                onClick={() => {
                  let newBreakdowns = [...breakdowns]
                  newBreakdowns.push({
                    content: '',
                    title: '',
                    type: 'type-2',
                    breakdownImages: [
                      {
                        breakDownImage: '',
                        description: '',
                        breakdownId: ''
                      }
                    ]
                  })
                  setBreakdowns(newBreakdowns)
                }}
              >
                <div class={'btn btn-secondary '}>Add breakdown 2</div>
              </div>
            </>
          }

          <button
            className="float-end mt-2 px-md-5 save-button add-new-note-button-text"
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
