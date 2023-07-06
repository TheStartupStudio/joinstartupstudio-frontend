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
import { useHistory, useParams } from 'react-router-dom'
import PositionSelector from '../PositionSelector/PositionSelector'
import CustomContent from './CustomContent/CustomContent'

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
      content: '',
      title: '',
      type: '',
      customContent: {
        paragraphs: [],
        buttons: [],
        popupButtons: [],
        imageGallery: {}
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
              journal.category +
              ' - ' +
              `${journal.type ? journal.type : ''}  ${
                journal.type ? '-' : ''
              } ` +
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

    setBreakdowns(
      e.value?.breakdowns
        ?.slice()
        ?.sort((a, b) => a.breakdownOrder - b.breakdownOrder)
    )
  }

  const history = useHistory()

  useEffect(() => {
    const journalId = selectedJournal?.value?.id
    if (journalId) {
      const url = `/edit-journals2/${journalId}`
      history.push(url)
    }
  }, [selectedJournal?.value?.id])

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
      const newData = response.data.map((data) => ({
        ...data,
        type: 'task'
      }))
      console.log(newData)
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
      const newData = response.data.map((data) => ({
        ...data,
        type: 'week'
      }))
      setJournals((prevJournals) => [...prevJournals, ...newData])
      setFetchingJournals(false)
      // setBreakdowns(data.breakdowns)
    } catch (error) {
      console.error(error)
    }
  }

  const { journalId } = useParams()
  const handleSubmit = async () => {
    setLoading(true)
    await axiosInstance
      .put(`LtsJournals/${journalId}/editJournal2`, {
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

  const handleChangePopupButtons = (
    name,
    value,
    dataIndex,
    breakdownIndex,
    uuid
  ) => {
    setBreakdowns((prevBreakdowns) => {
      const newBreakdowns = [...prevBreakdowns]
      const newBreakdown = { ...newBreakdowns[breakdownIndex] }
      const newButtons = [...newBreakdown?.customContent?.popupButtons]

      const buttonIndex = newButtons.findIndex((button) => button.uuid === uuid)
      if (buttonIndex !== -1) {
        const newButton = { ...newButtons[buttonIndex], [name]: value }
        newButtons[buttonIndex] = newButton
        newBreakdown.customContent.popupButtons = newButtons
        newBreakdowns[breakdownIndex] = newBreakdown
      }

      return newBreakdowns
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
      const customContent = newBreakdown?.customContent

      if (!customContent || !customContent?.imageGallery) {
        return prevBreakdowns
      }
      const newImages = [...customContent?.imageGallery?.images]
      const imageIndex = newImages?.findIndex((image) => image?.uuid === uuid)

      if (imageIndex !== -1) {
        const newImage = { ...newImages[imageIndex] }
        if (button === 'button') {
          newImage.button = { ...newImage?.button, [name]: value }
        } else {
          newImage[name] = value
        }
        newImages[imageIndex] = newImage
        customContent.imageGallery.images = newImages
        if (name === 'gridColumns' || name === 'position') {
          customContent.imageGallery = {
            ...customContent?.imageGallery,
            [name]: value
          }
        }
        newBreakdown.customContent = customContent
        newBreakdowns[breakdownIndex] = newBreakdown
      }

      return newBreakdowns
    })
  }

  const addTextEditorData = (breakdownIndex) => {
    const highestOrder = getHighestOrder(
      breakdowns[breakdownIndex].customContent
    )
    const newTextEditorData = {
      title: '',
      content: '',
      type: 'textEditor',
      // order: nextOrder,
      order: highestOrder,
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

  const getHighestOrder = (customContent) => {
    let flattenedArray = []

    for (let key in customContent) {
      if (Array.isArray(customContent[key])) {
        flattenedArray = flattenedArray.concat(customContent[key])
      }
    }

    let highestOrder = 0

    flattenedArray.forEach((item) => {
      if (item.order > highestOrder) {
        highestOrder = item.order
      }
    })

    let order = null
    if (highestOrder === 0) {
      order = 1
    } else {
      order = highestOrder + 1
    }
    return order
  }
  const addParagraph = (breakdownIndex) => {
    const highestOrder = getHighestOrder(
      breakdowns[breakdownIndex].customContent
    )

    const newParagraph = {
      paragraph: '',
      type: 'paragraph',
      // order: +nextOrder,
      order: highestOrder,
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
      // debugger
      return updatedBreakdowns
    })
  }

  const addPopupButton = (breakdownIndex) => {
    const highestOrder = getHighestOrder(
      breakdowns[breakdownIndex].customContent
    )
    const newButton = {
      title: '',
      popupContent: '',
      position: 'end',
      type: 'popupButton',
      // order: nextOrder,
      order: highestOrder,
      uuid: randomUUID
    }
    setNextOrder((prev) => prev + 1)

    setBreakdowns((prevState) => {
      const updatedBreakdowns = [...prevState]
      if (!updatedBreakdowns[breakdownIndex]?.customContent) {
        updatedBreakdowns[breakdownIndex].customContent = {
          popupButtons: []
        }
      }
      const buttons =
        updatedBreakdowns[breakdownIndex]?.customContent?.popupButtons

      if (!buttons) {
        updatedBreakdowns[breakdownIndex].customContent.popupButtons = [
          newButton
        ]
      } else {
        updatedBreakdowns[breakdownIndex]?.customContent?.popupButtons?.push(
          newButton
        )
      }

      return updatedBreakdowns
    })
  }

  const addButton = (breakdownIndex) => {
    const highestOrder = getHighestOrder(
      breakdowns[breakdownIndex].customContent
    )
    const newButton = {
      title: '',
      popupContent: '',
      position: 'end',
      type: 'button',
      // order: nextOrder,
      order: highestOrder,
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
        updatedBreakdowns[breakdownIndex]?.customContent?.buttons?.push(
          newButton
        )
      }
      return updatedBreakdowns
    })
  }

  const handleChangeGridColumns = (value, uuid, breakdownIndex) => {
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
    const randomImageUUID = uuidv4()
    const randomImageGalleryUUID = uuidv4()
    // const randomUUID = uuidv4()
    const highestOrder = getHighestOrder(
      breakdowns[breakdownIndex].customContent
    )

    const newImage = {
      image: '',
      description: '',
      button: {},
      uuid: randomImageUUID
      // order: highestOrder
    }

    setNextOrder((prev) => prev + 1)

    setBreakdowns((prevState) => {
      const updatedBreakdowns = [...prevState]
      if (!updatedBreakdowns[breakdownIndex]?.customContent) {
        updatedBreakdowns[breakdownIndex].customContent = {
          imageGallery: {
            type: 'image',
            uuid: randomImageGalleryUUID,
            gridColumns: 4,
            images: [newImage]
          }
        }
      } else {
        const customContent = updatedBreakdowns[breakdownIndex].customContent
        if (!customContent.imageGallery) {
          customContent.imageGallery = {
            type: 'image',
            uuid: randomImageGalleryUUID,
            gridColumns: 4,
            images: [newImage],
            order: highestOrder
          }
        } else {
          if (!customContent.imageGallery.images) {
            customContent.imageGallery.images = []
            customContent.imageGallery.type = 'image'
            customContent.imageGallery.uuid = randomUUID
            customContent.imageGallery.gridColumns = 4
            customContent.imageGallery.order = highestOrder
          }
          customContent.imageGallery.images.push(newImage)
        }
      }
      return updatedBreakdowns
    })
  }

  const addButtonImage = (breakdownIndex, uuid) => {
    const buttonImageRandomUUID = uuidv4()
    const imageGalleryRandomUUID = uuidv4()
    const newButton = {
      title: '',
      popupContent: '',
      position: 'end',
      type: 'button',
      order: nextOrder
      // uuid: buttonImageRandomUUID
    }

    setBreakdowns((prevState) => {
      const updatedBreakdowns = [...prevState]

      if (!updatedBreakdowns[breakdownIndex]?.customContent) {
        updatedBreakdowns[breakdownIndex].customContent = {
          imageGallery: {
            type: 'image',
            uuid: imageGalleryRandomUUID,
            gridColumns: 4,
            images: []
          }
        }
      }

      const images =
        updatedBreakdowns[breakdownIndex]?.customContent?.imageGallery?.images
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

  const deleteBreakdown = async (id, breakdownIndex) => {
    const newBreakdowns = [...breakdowns]

    if (id) {
      await axiosInstance
        .delete(`LtsJournals/${id}/editJournal2`)
        .then(async (res) => {
          const findBreakdownIndex = newBreakdowns.findIndex(
            (breakdown) => breakdown.id === id
          )

          newBreakdowns.splice(findBreakdownIndex, 1)
          let updatedBreakdowns = newBreakdowns.map((item, index) => {
            if (item.breakdownOrder > findBreakdownIndex + 1) {
              item.breakdownOrder = item.breakdownOrder - 1
            }
            return item
          })

          if (updatedBreakdowns) {
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
          }

          setBreakdowns(updatedBreakdowns)
          toast.success('Breakdown deleted successfully!')
          setLoading(false)
        })
        .catch((err) => {
          toast.error('An error occurred, please try again!')
          setLoading(false)
        })
    } else {
      newBreakdowns.splice(breakdownIndex, 1)
      setBreakdowns(
        newBreakdowns.map((item, index) => {
          if (item.breakdownOrder > breakdownIndex + 1) {
            item.breakdownOrder = item.breakdownOrder - 1
          }
          return item
        })
      )
    }
  }

  const handleDeleteBreakdown = (breakdownIndex) => {
    const newBreakdowns = [...breakdowns]
    const breakdownId = newBreakdowns[breakdownIndex].id
    deleteBreakdown(breakdownId, breakdownIndex)
    // setBreakdowns(newBreakdowns)
  }

  const [breakdownOrder, setBreakdownOrder] = useState(null)
  useEffect(() => {
    let highestOrder = 0

    breakdowns.forEach((item) => {
      if (item.breakdownOrder > highestOrder) {
        highestOrder = item.breakdownOrder
      }
    })
    setBreakdownOrder(highestOrder)
  }, [breakdowns])

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

              {breakdowns?.map((breakdown, breakdownIndex) => {
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
                            handleChangeBreakdown(breakdownIndex, 'content', e)
                          }
                        />
                      </>
                    )}

                    {breakdown.type === 'type-3' && (
                      <>
                        <CustomContent
                          handleSetHighestOrder={handleSetHighestOrder}
                          breakdown={breakdown}
                          handleChangeGridColumns={(value, uuid) =>
                            handleChangeGridColumns(value, uuid, breakdownIndex)
                          }
                          breakdownIndex={breakdownIndex}
                          handleChangeParagraph={handleChangeParagraph}
                          handleChangeButtons={handleChangeButtons}
                          handleChangePopupButtons={handleChangePopupButtons}
                          handleChangeImages={handleChangeImages}
                          handleAddPopupButton={() => {
                            addPopupButton(breakdownIndex)
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
                      type: 'type-1',
                      breakdownOrder: breakdownOrder + 1
                    })
                    setBreakdownOrder((prev) => prev + 1)
                    setBreakdowns(newBreakdowns)
                  }}
                >
                  <div class={'btn btn-warning '}>Add breakdown 1</div>
                </div>
                <div
                  className={'d-flex justify-content-end mb-4'}
                  onClick={() => {
                    let newBreakdowns = [...breakdowns]
                    newBreakdowns.push({
                      ...breakdownInitialState[0],
                      type: 'type-3',
                      breakdownOrder: breakdownOrder + 1
                    })
                    setBreakdownOrder((prev) => prev + 1)
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
