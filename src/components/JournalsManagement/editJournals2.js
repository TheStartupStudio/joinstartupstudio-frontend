import React, { useEffect, useState } from 'react'
import axiosInstance from '../../utils/AxiosInstance'
import Select, { components } from 'react-select'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileUpload } from '@fortawesome/free-solid-svg-icons'
import { toast } from 'react-toastify'
import './index.css'
import searchIcon from '../../assets/images/search-icon.png'
import copy from '../../assets/images/copy.svg'
import 'react-quill/dist/quill.snow.css'
import KendoTextEditor from './TextEditor'
import { EditorTools } from '@progress/kendo-react-editor'
import '@progress/kendo-theme-default/dist/all.css'
import { v4 as uuidv4 } from 'uuid'

const CheckboxData = (props) => {
  const randomUUID = uuidv4()
  const [checkboxes, setCheckboxes] = useState(props.checkbox)

  useEffect(() => {
    setCheckboxes(props.checkbox)
  }, [props.checkbox])

  useEffect(() => {
    props.handleChange(checkboxes)
  }, [checkboxes])
  const handleChangeCheckboxes =
    (...value) =>
    (name) => {
      const [checkboxValue, checkboxLabelIndex] = value
      if (typeof checkboxLabelIndex === 'undefined') {
        const newCheckboxes = { ...checkboxes }
        newCheckboxes[name] = checkboxValue
        return setCheckboxes(newCheckboxes)
      } else {
        const newCheckboxes = { ...checkboxes }
        let newCheckboxLabels = [...newCheckboxes.checkboxes]
        newCheckboxLabels[checkboxLabelIndex][name] = checkboxValue
        setCheckboxes(newCheckboxes)
      }
    }
  return (
    <>
      <div>
        <div>Checkboxes Title:</div>
        <input
          type="text"
          key="title"
          className="w-100 p-2"
          name="title"
          value={checkboxes?.title}
          onChange={(e) => handleChangeCheckboxes(e.target.value)('title')}
        />
      </div>
      {checkboxes?.checkboxes?.map((data, index) => {
        const checkboxLabelIndex = index
        return (
          <>
            <div>
              <div>#{index + 1} Checkbox </div>
              <input
                type="text"
                className="w-100 p-2"
                name="checkboxLabel"
                value={data?.label}
                onChange={(e) =>
                  handleChangeCheckboxes(
                    e.target.value,
                    checkboxLabelIndex
                  )('label')
                }
              />
            </div>
          </>
        )
      })}
      <div
        className={'d-flex justify-content-end mb-4'}
        onClick={() => {
          let newCheckboxes = [...checkboxes.checkboxes]
          newCheckboxes.push({
            isChecked: false,
            label: '',
            uuid: randomUUID
          })
          setCheckboxes({ ...checkboxes, checkboxes: newCheckboxes })
        }}
      >
        <div class={'btn btn-primary '}>Add new checkbox</div>
      </div>
    </>
  )
}

const CustomContent = (props) => {
  const randomUUID = uuidv4()
  const [breakdown, setBreakdown] = useState(props.breakdown)
  const [sortedComponents, setSortedComponents] = useState([])
  useEffect(() => {
    setBreakdown(props.breakdown)
  }, [props.breakdown])

  useEffect(() => {
    let highestOrder = 0

    sortedComponents.forEach((item) => {
      if (item.order > highestOrder) {
        highestOrder = item.order
      }
    })
    props.handleSetHighestOrder(highestOrder)
  }, [sortedComponents])

  const handleEditCheckboxes = (e, checkBoxIndex) => {
    props.handleChangeCheckboxes(
      'checkboxesData',
      e,
      checkBoxIndex,
      props.breakdownIndex
    )
  }
  // const condition = props.breakdown?.customContent?.images?.map(
  //   (image) => image.button
  // )
  useEffect(() => {
    if (props.breakdown?.customContent) {
      const checkboxesDataCopy =
        props.breakdown?.customContent?.checkboxesData?.slice() || []
      const textEditorDataCopy =
        props.breakdown?.customContent?.textEditorData?.slice() || []
      const paragraphsCopy =
        props.breakdown?.customContent?.paragraphs?.slice() || []
      const buttonsCopy = props.breakdown?.customContent?.buttons?.slice() || []
      const imagesCopy = props.breakdown?.customContent?.images?.slice() || []
      setSortedComponents(
        [
          ...checkboxesDataCopy,
          ...textEditorDataCopy,
          ...paragraphsCopy,
          ...buttonsCopy,
          ...imagesCopy
        ].sort((a, b) => a.order - b.order)
      )
    }
  }, [
    props.breakdown?.customContent?.paragraphs?.length,
    props.breakdown?.customContent?.checkboxesData?.length,
    props.breakdown?.customContent?.textEditorData?.length,
    props.breakdown?.customContent?.buttons?.length,
    props.breakdown?.customContent?.images?.length,
    props.breakdown?.customContent?.paragraphs,
    props.breakdown?.customContent?.checkboxesData,
    props.breakdown?.customContent?.textEditorData,
    props.breakdown?.customContent?.buttons,
    props.breakdown?.customContent?.images,
    JSON.stringify(
      props.breakdown?.customContent?.images?.map((image) => image.button)
    )

    // condition
  ])

  // useEffect(() => {
  //   debugger
  // }, [condition])
  const handleOrderChange = (index, newOrder) => {
    const selectedItem = sortedComponents[index]
    const newData = [...sortedComponents]
    newData.splice(index, 1)
    newData.splice(newOrder - 1, 0, selectedItem)
    const updatedData = newData.map((item, index) => {
      item.order = index + 1
      return item
    })
    setSortedComponents(updatedData)
  }

  const [gridColumns, setGridColumns] = useState(4)
  const [imageGalleryUUID, setImageGalleryIndexUUID] = useState(null)

  const handleChangeGridValues = (value, uuid) => {
    setGridColumns(value)
    setImageGalleryIndexUUID(uuid)
  }

  useEffect(() => {
    props.handleChangeGridColumns(gridColumns, imageGalleryUUID)
  }, [gridColumns])

  const firstImageUUID = sortedComponents?.filter(
    (sc) => sc?.type === 'image'
  )[0]?.uuid
  const firstImageUUIDIndex = sortedComponents?.findIndex(
    (sc) => sc?.uuid === firstImageUUID
  )

  const uuid2 = sortedComponents?.filter((sc) => sc?.type === 'image')[0]?.uuid

  const findGC = sortedComponents?.find((sc) => sc.uuid === uuid2)

  return (
    <>
      {sortedComponents.map((data, index) => {
        return (
          <>
            <>
              {data.type === 'paragraph' && (
                <React.Fragment key={index}>
                  <div className="d-flex justify-content-end">
                    <div className="input-group mb-3" style={{ width: 150 }}>
                      <span className="input-group-text">Order:</span>
                      <input
                        type="number"
                        className="form-control"
                        value={data.order}
                        onChange={(e) =>
                          handleOrderChange(index, Number(e.target.value))
                        }
                      />
                    </div>
                  </div>
                  <KendoTextEditor
                    key="paragraph"
                    value={data?.paragraph}
                    minHeight={200}
                    handleChange={(e) => {
                      const uuid = data?.uuid
                      return props.handleChangeParagraph(
                        'paragraph',
                        e,
                        index,
                        props.breakdownIndex,
                        uuid
                      )
                    }}
                  />
                </React.Fragment>
              )}
            </>
            {data.type === 'checkbox' && (
              <React.Fragment>
                <div className={'d-flex justify-content-end'}>
                  <div className="input-group mb-3" style={{ width: 150 }}>
                    <span className="input-group-text">Order:</span>
                    <input
                      type="number"
                      className="form-control"
                      value={data.order}
                      onChange={(e) =>
                        handleOrderChange(index, Number(e.target.value))
                      }
                    />
                  </div>
                </div>
                <CheckboxData
                  checkbox={data}
                  key={index}
                  index={index}
                  breakdownIndex={props.breakdownIndex}
                  handleChange={(e) => handleEditCheckboxes(e, index)}
                />
              </React.Fragment>
            )}
            {data.type === 'textEditor' && (
              <React.Fragment key={index}>
                <div className={'d-flex justify-content-end'}>
                  <div className="input-group mb-3" style={{ width: 150 }}>
                    <span className="input-group-text">Order:</span>
                    <input
                      type="number"
                      className="form-control"
                      value={data.order}
                      onChange={(e) =>
                        handleOrderChange(index, Number(e.target.value))
                      }
                    />
                  </div>
                </div>
                <div>Title</div>
                <input
                  type="text"
                  key="title"
                  className="w-100 p-2"
                  name="title"
                  value={data?.title}
                  onChange={(e) => {
                    const uuid = data?.uuid
                    return props.handleChangeTextEditor(
                      'title',
                      e.target.value,
                      index,
                      props.breakdownIndex,
                      uuid
                    )
                  }}
                />

                <KendoTextEditor
                  key="content"
                  value={data?.content}
                  minHeight={200}
                  handleChange={(e) => {
                    const uuid = data?.uuid
                    return props.handleChangeTextEditor(
                      'content',
                      e,
                      index,
                      props.breakdownIndex,
                      uuid
                    )
                  }}
                />
              </React.Fragment>
            )}
            {data.type === 'button' && (
              <React.Fragment key={index}>
                <div className={'d-flex justify-content-end'}>
                  <div className="input-group mb-3" style={{ width: 150 }}>
                    <span className="input-group-text">Order:</span>
                    <input
                      type="number"
                      className="form-control"
                      value={data.order}
                      onChange={(e) =>
                        handleOrderChange(index, Number(e.target.value))
                      }
                    />
                  </div>
                </div>
                <div>Title</div>
                <input
                  type="text"
                  key="title"
                  className="w-100 p-2"
                  name="title"
                  value={data?.title}
                  onChange={(e) => {
                    const uuid = data?.uuid
                    return props.handleChangeButtons(
                      'title',
                      e.target.value,
                      index,
                      props.breakdownIndex,
                      uuid
                    )
                  }}
                />

                <div>Popup Content</div>
                <KendoTextEditor
                  key="content"
                  value={data?.popupContent}
                  minHeight={200}
                  handleChange={(e) => {
                    const uuid = data?.uuid
                    return props.handleChangeButtons(
                      'popupContent',
                      e,
                      index,
                      props.breakdownIndex,
                      uuid
                    )
                  }}
                />

                <div>Position</div>
                <input
                  type="text"
                  key="position"
                  className="w-100 p-2"
                  name="position"
                  value={data?.position}
                  onChange={(e) => {
                    const uuid = data?.uuid
                    return props.handleChangeButtons(
                      'position',
                      e.target.value,
                      index,
                      props.breakdownIndex,
                      uuid
                    )
                  }}
                />
              </React.Fragment>
            )}
            {data.type === 'image' && (
              <React.Fragment key={index}>
                {/*<div className={'d-flex justify-content-end'}>*/}
                {/*  <div className="input-group mb-3" style={{ width: 150 }}>*/}
                {/*    <span className="input-group-text">Order:</span>*/}
                {/*    <input*/}
                {/*      type="number"*/}
                {/*      className="form-control"*/}
                {/*      value={data.order}*/}
                {/*      onChange={(e) =>*/}
                {/*        handleOrderChange(index, Number(e.target.value))*/}
                {/*      }*/}
                {/*    />*/}
                {/*  </div>*/}
                {/*</div>*/}
                {firstImageUUIDIndex === index && (
                  <div className={'d-flex justify-content-start'}>
                    <div className="input-group mb-3" style={{ width: 200 }}>
                      <span className="input-group-text">Grid column:</span>
                      <input
                        type="number"
                        className="form-control"
                        value={+findGC.gridColumns}
                        onChange={(e) => {
                          const uuid = data?.uuid
                          return handleChangeGridValues(
                            e.target.value,
                            firstImageUUID
                          )
                        }}
                      />
                    </div>
                  </div>
                )}
                <div>Image</div>
                <KendoTextEditor
                  key="image"
                  value={data?.image}
                  minHeight={200}
                  handleChange={(e) => {
                    const uuid = data?.uuid
                    return props.handleChangeImages(
                      'image',
                      e,
                      index,
                      props.breakdownIndex,
                      uuid
                    )
                  }}
                />

                <div>Popup Content</div>
                <KendoTextEditor
                  key="content"
                  value={data?.description}
                  minHeight={200}
                  handleChange={(e) => {
                    const uuid = data?.uuid
                    return props.handleChangeImages(
                      'description',
                      e,
                      index,
                      props.breakdownIndex,
                      uuid
                    )
                  }}
                />

                <div>Button</div>
                {Object.keys(data.button).length > 0 && (
                  <React.Fragment key={index}>
                    <div>Title</div>
                    <input
                      type="text"
                      key="title"
                      className="w-100 p-2"
                      name="title"
                      value={data?.button?.title}
                      onChange={(e) => {
                        const uuid = data?.uuid
                        return props.handleChangeImages(
                          'title',
                          e.target.value,
                          index,
                          props.breakdownIndex,
                          uuid,
                          'button'
                        )
                      }}
                    />

                    <div>Popup Content</div>
                    <KendoTextEditor
                      key="content"
                      value={data?.button?.popupContent}
                      minHeight={200}
                      handleChange={(e) => {
                        const uuid = data?.uuid
                        return props.handleChangeImages(
                          'popupContent',
                          e,
                          index,
                          props.breakdownIndex,
                          uuid,
                          'button'
                        )
                      }}
                    />

                    <div>Position</div>
                    <input
                      type="text"
                      key="position"
                      className="w-100 p-2"
                      name="position"
                      value={data?.button?.position}
                      onChange={(e) => {
                        const uuid = data?.uuid
                        return props.handleChangeImages(
                          'position',
                          e.target.value,
                          index,
                          props.breakdownIndex,
                          uuid,
                          'button'
                        )
                      }}
                    />
                  </React.Fragment>
                )}
                <div
                  className={
                    'd-flex justify-content-center align-items-center '
                  }
                  onClick={() => {
                    const uuid = data?.uuid
                    props.handleAddButtonImage(uuid)
                  }}
                >
                  <div class={'btn btn-secondary d-flex align-items-center'}>
                    Add a button
                  </div>
                </div>
              </React.Fragment>
            )}
          </>
        )
      })}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: 6,
          padding: 10
        }}
      >
        <div
          className={'d-flex justify-content-center align-items-center '}
          onClick={() => {
            props.handleAddParagraph()
          }}
        >
          <div class={'btn btn-secondary d-flex align-items-center '}>
            Add a paragraph
          </div>
        </div>
        <div
          className={'d-flex justify-content-center align-items-center '}
          onClick={() => {
            props.handleAddTextEditor()
          }}
        >
          <div class={'btn btn-secondary d-flex align-items-center'}>
            Add a text editor
          </div>
        </div>
        <div
          className={'d-flex justify-content-center align-items-center '}
          onClick={() => {
            props.handleAddCheckbox()
          }}
        >
          <div class={'btn btn-secondary d-flex align-items-center'}>
            Add a checkbox
          </div>
        </div>
        <div
          className={'d-flex justify-content-center align-items-center '}
          onClick={() => {
            props.handleAddButton()
          }}
        >
          <div class={'btn btn-secondary d-flex align-items-center'}>
            Add a button
          </div>
        </div>
        <div
          className={'d-flex justify-content-center align-items-center '}
          onClick={() => {
            props.handleAddImage()
          }}
        >
          <div class={'btn btn-secondary d-flex align-items-center'}>
            Add image component
          </div>
        </div>
      </div>
    </>
  )
}

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
  const [highestOrder, setHighestOrder] = useState(null)
  const [nextOrder, setNextOrder] = useState(null)
  const randomUUID = uuidv4()

  const handleSetHighestOrder = (order) => {
    // setHighestOrder(order)
    setNextOrder(+order + 1)
  }

  const breakdownInitialState = [
    {
      // id: '',
      content: '',
      title: '',
      type: '',
      breakdownImages: [
        {
          breakDownImage: '',
          description: '',
          breakdownId: ''
        }
      ],
      customContent: {
        paragraphs: [],
        textEditorData: [],
        checkboxesData: [],
        buttons: [],
        images: [
          {
            image: '',
            description: '',
            button: {}
          }
        ]
      }
    }
  ]

  const [breakdowns, setBreakdowns] = useState(breakdownInitialState)
  useEffect(() => {
    // getJournals()
    getJournals2()
    getJournals2Weeks()
  }, [])

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
    setSelectedJournal({
      value: e.value,
      label: e.label
    })
    setBreakdowns(e.value?.breakdowns)
  }

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
        type: selectedJournal?.value?.type,
        customContent: selectedJournal?.value?.customContent
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

  const handleChangeTextEditorData = (
    name,
    value,
    dataIndex,
    breakdownIndex,
    uuid
  ) => {
    setBreakdowns((prevBreakdowns) => {
      return prevBreakdowns.map((data, bindex) => {
        if (bindex === breakdownIndex) {
          const updatedCustomContent = data.customContent?.textEditorData?.map(
            (editorData, eIndex) => {
              const foundedIndex =
                data.customContent?.textEditorData?.findIndex(
                  (paragraph, index) => paragraph.uuid === uuid
                )
              if (eIndex === foundedIndex) {
                return { ...editorData, [name]: value }
              }
              return editorData
            }
          )
          return {
            ...data,
            customContent: {
              ...data.customContent,
              textEditorData: updatedCustomContent
            }
          }
        }
        return data
      })
    })
  }

  const handleChangeParagraph = (
    name,
    value,
    dataIndex,
    breakdownIndex,
    uuid
  ) => {
    setBreakdowns((prevBreakdowns) => {
      return prevBreakdowns.map((data, bindex) => {
        if (bindex === breakdownIndex) {
          const updatedCustomContent = data.customContent?.paragraphs?.map(
            (paragraph, eIndex) => {
              const foundedIndex = data.customContent?.paragraphs?.findIndex(
                (paragraph, index) => paragraph.uuid === uuid
              )
              if (eIndex === foundedIndex) {
                return { ...paragraph, [name]: value }
              }
              return paragraph
            }
          )
          return {
            ...data,
            customContent: {
              ...data.customContent,
              paragraphs: updatedCustomContent
            }
          }
        }
        return data
      })
    })
  }
  const handleChangeCheckboxes = (
    name,
    value,
    dataIndex,
    breakdownIndex,
    uuid
  ) => {
    setBreakdowns((prevBreakdowns) => {
      return prevBreakdowns.map((data, bindex) => {
        if (bindex === breakdownIndex) {
          const updatedCheckboxesData = data.customContent?.checkboxesData?.map(
            (editorData, eIndex) => {
              const foundedIndex =
                data.customContent?.checkboxesData?.findIndex(
                  (paragraph, index) => paragraph.uuid === uuid
                )
              if (eIndex === foundedIndex) {
                return { ...editorData, [name]: value }
              }
              return editorData
            }
          )
          return {
            ...data,
            customContent: {
              ...data.customContent,
              checkboxesData: updatedCheckboxesData
            }
          }
        }
        return data
      })
    })
  }

  const handleChangeButtons = (
    name,
    value,
    dataIndex,
    breakdownIndex,
    uuid
  ) => {
    setBreakdowns((prevBreakdowns) => {
      const newBreakdowns = [...prevBreakdowns]
      const newBreakdown = { ...newBreakdowns[breakdownIndex] }
      const newButtons = [...newBreakdown?.customContent?.buttons]

      const buttonIndex = newButtons.findIndex((button) => button.uuid === uuid)
      if (buttonIndex !== -1) {
        const newButton = { ...newButtons[buttonIndex], [name]: value }
        newButtons[buttonIndex] = newButton
        newBreakdown.customContent.buttons = newButtons
        newBreakdowns[breakdownIndex] = newBreakdown
      }

      return newBreakdowns
    })
  }

  const handleChangeImages = (
    name,
    value,
    dataIndex,
    breakdownIndex,
    uuid,
    button
  ) => {
    setBreakdowns((prevBreakdowns) => {
      const newBreakdowns = [...prevBreakdowns]
      const newBreakdown = { ...newBreakdowns[breakdownIndex] }
      const newImages = [...newBreakdown?.customContent?.images]

      const imageIndex = newImages.findIndex((image) => image.uuid === uuid)
      if (imageIndex !== -1) {
        const newImage = { ...newImages[imageIndex] }
        if (button) {
          newImage.button = { ...newImage.button, [name]: value }
        } else {
          newImage[name] = value
        }
        newImages[imageIndex] = newImage
        newBreakdown.customContent.images = newImages
        newBreakdowns[breakdownIndex] = newBreakdown
      }

      return newBreakdowns
    })
  }

  // const highestOrder = sortedComponents.find((sc)=>Math.max(sc.order))

  const addTextEditorData = (breakdownIndex) => {
    const newTextEditorData = {
      title: '',
      content: '',
      type: 'textEditor',
      order: nextOrder,
      uuid: randomUUID
    }

    setNextOrder((prev) => prev + 1)

    setBreakdowns((prevState) => {
      const updatedBreakdowns = [...prevState]
      if (!updatedBreakdowns[breakdownIndex]?.customContent) {
        updatedBreakdowns[breakdownIndex].customContent = {}
      }

      const textEditorData =
        updatedBreakdowns[breakdownIndex]?.customContent?.textEditorData

      if (!textEditorData) {
        updatedBreakdowns[breakdownIndex].customContent.textEditorData = [
          { newTextEditorData }
        ]
      }
      updatedBreakdowns[breakdownIndex]?.customContent?.textEditorData?.push(
        newTextEditorData
      )
      return updatedBreakdowns
    })
  }

  const addParagraph = (breakdownIndex) => {
    const newParagraph = {
      paragraph: '',
      type: 'paragraph',
      order: +nextOrder,
      uuid: randomUUID
    }
    setNextOrder((prev) => prev + 1)

    setBreakdowns((prevState) => {
      const updatedBreakdowns = [...prevState]
      if (!updatedBreakdowns[breakdownIndex]?.customContent) {
        updatedBreakdowns[breakdownIndex].customContent = {}
      }
      const newParagraphs =
        updatedBreakdowns[breakdownIndex]?.customContent?.paragraphs

      if (!newParagraphs) {
        updatedBreakdowns[breakdownIndex].customContent.paragraphs = [
          { newParagraph }
        ]
      }
      newParagraphs?.push(newParagraph)
      debugger
      return updatedBreakdowns
    })
  }
  const addCheckbox = (breakdownIndex) => {
    const newCheckbox = {
      title: '',
      type: 'checkbox',
      order: nextOrder,
      uuid: randomUUID,
      checkboxes: [
        {
          checked: false,
          label: ''
        },
        {
          checked: false,
          label: ''
        },
        {
          checked: false,
          label: ''
        }
      ]
    }
    setNextOrder((prev) => prev + 1)
    setBreakdowns((prevState) => {
      const updatedBreakdowns = [...prevState]
      if (!updatedBreakdowns[breakdownIndex]?.customContent) {
        updatedBreakdowns[breakdownIndex].customContent = {}
      }

      const checkboxesData =
        updatedBreakdowns[breakdownIndex]?.customContent?.checkboxesData

      if (!checkboxesData) {
        updatedBreakdowns[breakdownIndex].customContent.checkboxesData = [
          { newCheckbox }
        ]
      }
      updatedBreakdowns[breakdownIndex]?.customContent?.checkboxesData?.push(
        newCheckbox
      )
      return updatedBreakdowns
    })
  }

  const addButton = (breakdownIndex) => {
    const newButton = {
      title: '',
      popupContent: '',
      position: '',
      type: 'button',
      order: nextOrder,
      uuid: randomUUID
    }
    setNextOrder((prev) => prev + 1)

    setBreakdowns((prevState) => {
      const updatedBreakdowns = [...prevState]
      if (!updatedBreakdowns[breakdownIndex]?.customContent) {
        updatedBreakdowns[breakdownIndex].customContent = {
          buttons: []
        }
      }

      const buttons =
        updatedBreakdowns[breakdownIndex]?.customContent?.buttons ?? []

      if (!buttons) {
        updatedBreakdowns[breakdownIndex].customContent.buttons = [newButton]
      } else {
        updatedBreakdowns[breakdownIndex].customContent.buttons.push(newButton)
      }
      return updatedBreakdowns
    })
  }

  const [gridColumns, setGridColumns] = useState()
  const [imageGalleryUUID, setImageGalleryUUID] = useState()

  const handleChangeGridColumns = (value, uuid, breakdownIndex) => {
    setGridColumns(value)
    setImageGalleryUUID(uuid)

    let newBreakdowns = [...breakdowns]
    let newBreakdown = { ...newBreakdowns[breakdownIndex] }

    let newImages = [...(newBreakdown?.customContent?.images ?? [])]

    if (newBreakdown.customContent === null) {
      newBreakdown.customContent = {}
    }

    newImages = newImages?.map((image) => {
      return { ...image, gridColumns: value }
    })

    newBreakdown.customContent.images = newImages
    newBreakdowns[breakdownIndex] = newBreakdown

    setBreakdowns(newBreakdowns)
  }

  const addImage = (breakdownIndex) => {
    const newImage = {
      image: '',
      description: '',
      button: {},
      type: 'image',
      order: nextOrder,
      uuid: randomUUID,
      gridColumns: gridColumns
    }

    setNextOrder((prev) => prev + 1)

    setBreakdowns((prevState) => {
      const updatedBreakdowns = [...prevState]

      if (!updatedBreakdowns[breakdownIndex]?.customContent) {
        updatedBreakdowns[breakdownIndex].customContent = {
          images: []
        }
      }

      const images = updatedBreakdowns[breakdownIndex]?.customContent?.images

      if (!images) {
        updatedBreakdowns[breakdownIndex].customContent.images = [newImage]
      } else {
        updatedBreakdowns[breakdownIndex].customContent.images = [
          ...images,
          newImage
        ]
      }
      return updatedBreakdowns
    })
  }

  const addButtonImage = (breakdownIndex, uuid) => {
    const newButton = {
      title: '',
      popupContent: '',
      position: '',
      type: 'button',
      order: nextOrder,
      uuid: randomUUID
    }

    setBreakdowns((prevState) => {
      const updatedBreakdowns = [...prevState]

      // Get the index of the breakdown where you want to add the new button
      if (!updatedBreakdowns[breakdownIndex]?.customContent) {
        updatedBreakdowns[breakdownIndex].customContent = {
          images: []
        }
      }

      const images = updatedBreakdowns[breakdownIndex]?.customContent?.images
      const foundedIndex = images.findIndex((image) => image.uuid === uuid)

      if (foundedIndex !== -1) {
        const foundedButton = images[foundedIndex]
        foundedButton.button = newButton
      }

      return updatedBreakdowns
    })
  }

  const handleOrderChange = (index, newOrder) => {
    const selectedItem = breakdowns[index]
    const newData = [...breakdowns]
    newData.splice(index, 1)
    newData.splice(newOrder - 1, 0, selectedItem)
    const updatedData = newData.map((item, index) => {
      item.breakdownOrder = index + 1
      return item
    })
    setBreakdowns(updatedData)
  }

  const deleteBreakdown = async (id) => {
    await axiosInstance
      .delete(`LtsJournals/${id}/editJournal2`)
      .then(async (res) => {
        const newBreakdowns = [...breakdowns]
        const findBreakdownIndex = newBreakdowns.findIndex(
          (breakdown) => breakdown.id === id
        )
        newBreakdowns.splice(findBreakdownIndex, 1)
        const updatedBreakdowns = newBreakdowns.map((item, index) => {
          if (item.breakdownOrder > findBreakdownIndex + 1) {
            item.breakdownOrder = item.breakdownOrder - 1
          }
          return item
        })

        await axiosInstance
          .put(`LtsJournals/${selectedJournal.value.id}/editJournal2`, {
            breakdowns: updatedBreakdowns
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

        setBreakdowns(updatedBreakdowns)
        toast.success('Breakdown deleted successfully!')
        setLoading(false)
      })
      .catch((err) => {
        toast.error('An error occurred, please try again!')
        setLoading(false)
      })
  }

  const handleDeleteBreakdown = (breakdownIndex) => {
    const newBreakdowns = [...breakdowns]
    const breakdownId = newBreakdowns[breakdownIndex].id
    deleteBreakdown(breakdownId)
    // setBreakdowns(newBreakdowns)
  }

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

              {breakdowns
                ?.slice()
                ?.sort((a, b) => a.breakdownOrder - b.breakdownOrder)
                ?.map((breakdown, breakdownIndex) => {
                  return (
                    <div>
                      <div style={{ fontWeight: 600 }}>
                        Breakdown {breakdownIndex + 1}
                      </div>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <div
                          className="input-group  d-flex align-items-center"
                          style={{ width: 260 }}
                        >
                          <span className="input-group-text">
                            Breakdown Order:
                          </span>
                          <input
                            type="number"
                            className="form-control"
                            value={breakdown.breakdownOrder}
                            onChange={(e) =>
                              handleOrderChange(
                                breakdownIndex,
                                Number(e.target.value)
                              )
                            }
                          />
                        </div>
                        <div className={'d-flex align-items-center '}>
                          <button
                            className={'btn btn-danger'}
                            onClick={() => {
                              return handleDeleteBreakdown(breakdownIndex)
                            }}
                          >
                            Delete breakdown
                          </button>
                        </div>
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
                              handleChangeBreakdown(
                                breakdownIndex,
                                'content',
                                e
                              )
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

                      {breakdown.type === 'type-3' && (
                        <>
                          <CustomContent
                            handleSetHighestOrder={handleSetHighestOrder}
                            breakdown={breakdown}
                            handleChangeGridColumns={(value, uuid) =>
                              handleChangeGridColumns(
                                value,
                                uuid,
                                breakdownIndex
                              )
                            }
                            breakdownTextEditor={
                              breakdown?.customContent?.textEditorData
                            }
                            breakdownParagraph={
                              breakdown?.customContent?.paragraphs
                            }
                            breakdownCheckboxes={
                              breakdown?.customContent?.checkboxesData
                            }
                            breakdownIndex={breakdownIndex}
                            handleChangeTextEditor={handleChangeTextEditorData}
                            handleChangeParagraph={handleChangeParagraph}
                            handleChangeButtons={handleChangeButtons}
                            handleChangeImages={handleChangeImages}
                            handleChangeCheckboxes={(...e) =>
                              handleChangeCheckboxes(e)
                            }
                            handleAddCheckbox={() => {
                              addCheckbox(breakdownIndex)
                            }}
                            handleAddButton={() => {
                              addButton(breakdownIndex)
                            }}
                            handleAddImage={() => {
                              addImage(breakdownIndex)
                            }}
                            handleAddButtonImage={(uuid) => {
                              addButtonImage(breakdownIndex, uuid)
                            }}
                            handleAddTextEditor={() => {
                              addTextEditorData(breakdownIndex)
                            }}
                            handleAddParagraph={() => {
                              addParagraph(breakdownIndex)
                            }}
                          />
                        </>
                      )}
                    </div>
                  )
                })}
              <div className={'d-flex justify-content-between gap-2'}>
                <div
                  className={'d-flex justify-content-end mb-4'}
                  onClick={() => {
                    let newBreakdowns = [...breakdowns]
                    newBreakdowns.push({
                      ...breakdownInitialState[0],
                      type: 'type-1'
                    })
                    setBreakdowns(newBreakdowns)
                  }}
                >
                  <div class={'btn btn-warning '}>Add breakdown 1</div>
                </div>
                {/*<div*/}
                {/*  className={'d-flex justify-content-end mb-4'}*/}
                {/*  onClick={() => {*/}
                {/*    let newBreakdowns = [...breakdowns]*/}
                {/*    newBreakdowns.push({*/}
                {/*      ...breakdownInitialState[0],*/}
                {/*      type: 'type-2'*/}
                {/*    })*/}
                {/*    setBreakdowns(newBreakdowns)*/}
                {/*  }}*/}
                {/*>*/}
                {/*  <div class={'btn btn-secondary '}>Add breakdown 2</div>*/}
                {/*</div>{' '}*/}
                <div
                  className={'d-flex justify-content-end mb-4'}
                  onClick={() => {
                    let newBreakdowns = [...breakdowns]
                    newBreakdowns.push({
                      ...breakdownInitialState[0],
                      type: 'type-3'
                    })
                    setBreakdowns(newBreakdowns)
                  }}
                >
                  <div class={'btn btn-warning '}>Add breakdown 2</div>
                </div>
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
