import React, { useEffect, useRef, useState } from 'react'
import './BreakdownTextAccordion.css'
import {
  faAngleDown,
  faAngleUp,
  faArrowDown,
  faArrowUp
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axiosInstance from '../../utils/AxiosInstance'
import { Helmet } from 'react-helmet'
import KendoTextEditor from '../../components/JournalsManagement/TextEditor'
import { Editor, EditorTools } from '@progress/kendo-react-editor'
import BreakdownPopup from '../../components/Modals/BreakdownPopup'
const BreakdownTextAccordion = (props) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleAccordion = () => {
    setIsExpanded(!isExpanded)
  }
  const [imagesData, setImagesData] = useState([])
  useEffect(() => {
    const getData = async () => {
      try {
        let response = await axiosInstance.get(
          `/ltsJournals/journal-breakdown-images`
        )

        setImagesData(
          response.data.filter(
            (data) => data.breakdownId === props.breakdown.id
          )
        )
      } catch (err) {}
    }
    getData()
  }, [])
  const ImageGallery = () => {
    const [selectedImage, setSelectedImage] = useState(null)
    const [activeIndex, setActiveIndex] = useState(-1)
    const handleImageClick = (image, index) => {
      setSelectedImage(image)
      setActiveIndex(index)
    }

    return (
      <div className={'accordion-content'}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            paddingTop: '1rem',
            gap: '20px'
          }}
        >
          {imagesData.map((image, index) => (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                filter:
                  activeIndex !== -1
                    ? index !== activeIndex
                      ? 'grayscale(100%)'
                      : 'grayscale(0%)'
                    : 'grayscale(0%)'
              }}
              key={index}
              dangerouslySetInnerHTML={{ __html: image.breakDownImage }}
              alt={image.alt}
              onClick={() => {
                handleImageClick(image, index)
              }}
            />
          ))}
        </div>
        {selectedImage && (
          <div
            style={{ fontFamily: 'Montserrat' }}
            dangerouslySetInnerHTML={{ __html: selectedImage.description }}
          />
        )}
      </div>
    )
  }
  const ImageGallery2 = (props) => {
    console.log(props)
    const [selectedImage, setSelectedImage] = useState(null)
    const [activeIndex, setActiveIndex] = useState(-1)
    const handleImageClick = (image, index) => {
      setSelectedImage(image)
      setActiveIndex(index)
    }

    return (
      <>
        {/*{props.imagesData?.map((image, index) => (*/}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            filter:
              activeIndex !== -1
                ? props.index !== activeIndex
                  ? 'grayscale(100%)'
                  : 'grayscale(0%)'
                : 'grayscale(0%)'
          }}
          key={props.index}
          dangerouslySetInnerHTML={{ __html: props.data.image }}
          alt={'image'}
          onClick={() => {
            handleImageClick(props.data, props.index)
          }}
        />
        {/*))}*/}
        {selectedImage && (
          <div
            style={{ fontFamily: 'Montserrat' }}
            dangerouslySetInnerHTML={{ __html: selectedImage.description }}
          />
        )}
      </>
    )
  }
  const CustomContent = (props) => {
    const [checkboxValues, setCheckboxValues] = useState([])

    const handleChangeCheckboxes = (e, checkboxIndex, index) => {
      const newValues = checkboxValues?.map((checkbox, i) => {
        if (i === index) {
          const updatedCheckboxes = checkbox?.checkboxes?.map((check, idx) => {
            if (idx === checkboxIndex) {
              return {
                ...check,
                checked: e
              }
            }
            return check
          })
          return { ...checkbox, checkboxes: updatedCheckboxes }
        } else {
          return checkbox
        }
      })

      setCheckboxValues(newValues)
    }

    const BreakdownCheckboxes = (props) => {
      return (
        <>
          <div>{props.data?.title}</div>
          {props.data?.checkboxes?.map((data, index) => {
            return (
              <div class="form-check  ">
                <input
                  className="form-check-input "
                  type="checkbox"
                  checked={data.checked}
                  id="flexCheckDefault"
                  onChange={(e) => props.handleChange(e.target.checked, index)}
                />
                <label
                  className="form-check-label"
                  htmlFor="flexCheckDefault"
                  style={{ marginTop: '0.125rem' }}
                >
                  {data.label}
                </label>
              </div>
            )
          })}
        </>
      )
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

    const [textEditorData, setTextEditorData] = useState([])
    const [paragraphs, setParagraphs] = useState([])

    useEffect(() => {
      setCheckboxValues(props.customContent?.checkboxesData)
      setTextEditorData(props.customContent?.textEditorData)
      setParagraphs(props.customContent?.paragraphs)
    }, [props.customContent])

    const handleChangeEditorValue = (e, dataIndex) => {
      const newValues = textEditorData.map((data, index) => {
        if (dataIndex === index) {
          return {
            ...data,
            value: e
          }
        }
        return data
      })

      setTextEditorData(newValues)
    }
    const images = props.customContent.images

    const sortedComponents = [
      ...props.customContent.checkboxesData,
      ...props.customContent.textEditorData,
      ...props.customContent.paragraphs,
      ...props.customContent.buttons,
      { type: 'image', images }
    ].sort((a, b) => a.order - b.order)

    const NewComponent = (props) => {
      const [openPopup, setOpenPopup] = useState(false)
      const [selectedImage, setSelectedImage] = useState(null)
      const [activeIndex, setActiveIndex] = useState(-1)

      const handleOpenPopup = () => {
        setOpenPopup(true)
      }

      const handleClosePopup = () => {
        setOpenPopup(false)
      }
      const handleImageClick = (image, index) => {
        setSelectedImage(image)
        setActiveIndex(index)
      }
      return (
        <>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr 1fr'
            }}
          >
            {props.images?.map((image, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  height: '150px'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    objectFit: 'contain',
                    filter:
                      activeIndex !== -1
                        ? index !== activeIndex
                          ? 'grayscale(100%)'
                          : 'grayscale(0%)'
                        : 'grayscale(0%)'
                  }}
                  dangerouslySetInnerHTML={{ __html: image.image }}
                  alt={'image'}
                  onClick={() => {
                    handleImageClick(image, index)
                  }}
                />
              </div>
            ))}
          </div>
          {selectedImage && (
            <div
              style={{ fontFamily: 'Montserrat' }}
              dangerouslySetInnerHTML={{ __html: selectedImage?.description }}
            />
          )}

          {selectedImage && Object.keys(selectedImage?.button).length > 0 && (
            <div className={'d-flex justify-content-end'}>
              <button
                style={{
                  backgroundColor: '#51c7df',
                  color: '#fff',
                  fontSize: 14
                }}
                onClick={() => handleOpenPopup()}
                className="px-4 py-2 border-0 color transform text-uppercase my-1"
              >
                {selectedImage?.button?.title}
              </button>
            </div>
          )}
          <BreakdownPopup
            show={openPopup}
            onHide={handleClosePopup}
            popupContent={selectedImage?.button?.popupContent}
          />
        </>
      )
    }

    console.log(sortedComponents)
    return (
      <div className={'accordion-content'}>
        {sortedComponents.map((data, index) => {
          {
            console.log(data.images)
          }
          return (
            <>
              <>
                {data.type === 'paragraph' && (
                  <div
                    key={index}
                    style={{ fontFamily: 'Montserrat' }}
                    dangerouslySetInnerHTML={{ __html: data.paragraph }}
                  />
                )}
              </>
              {data.type === 'checkbox' && (
                <BreakdownCheckboxes
                  data={data}
                  handleChange={(e, checkboxValue) =>
                    handleChangeCheckboxes(e, checkboxValue, index)
                  }
                />
              )}
              {data.type === 'textEditor' && (
                <>
                  <div>{data.title}</div>
                  <KendoTextEditor
                    minHeight={150}
                    key={index}
                    value={data?.content}
                    handleChange={(e) => handleChangeEditorValue(e, index)}
                    tools={[
                      [Bold, Italic],
                      [AlignLeft, AlignCenter, AlignRight, AlignJustify],
                      [Indent, Outdent],
                      [OrderedList, UnorderedList],
                      FontSize,
                      FontName,
                      FormatBlock,
                      [Undo, Redo],
                      [Link, Unlink, InsertImage, ViewHtml]
                    ]}
                  />
                </>
              )}
              {data.type === 'button' && (
                <div className={'d-flex justify-content-end'}>
                  <button
                    style={{
                      backgroundColor: '#51c7df',
                      color: '#fff',
                      fontSize: 14
                    }}
                    // onClick={openTaskEventModal}
                    className="px-4 py-2 border-0 color transform text-uppercase my-1"
                  >
                    {data.title}
                  </button>
                </div>
              )}
              {data?.type === 'image' && <NewComponent images={data?.images} />}
            </>
          )
        })}
      </div>
    )
  }

  return (
    <>
      <div className="accordion">
        <div className="accordion-header" onClick={toggleAccordion}>
          <div className={'accordion-header-title'}>{props?.title}</div>
          <span className={`accordion-icon ${isExpanded ? 'expanded' : ''}`}>
            {isExpanded ? (
              <FontAwesomeIcon
                icon={faAngleDown}
                className="me-2 me-md-0 arrow"
              />
            ) : (
              <FontAwesomeIcon
                icon={faAngleDown}
                className="me-2 me-md-0 arrow"
              />
            )}
          </span>
        </div>
        {isExpanded && props.breakdown.type === 'type-1' && (
          <div
            className="accordion-content"
            dangerouslySetInnerHTML={{ __html: props.content }}
          />
        )}
        {isExpanded && props.breakdown.type === 'type-2' && <ImageGallery />}
        {isExpanded && props.breakdown.type === 'type-3' && (
          <CustomContent customContent={props.breakdown?.customContent} />
        )}
      </div>
    </>
  )
}

export default BreakdownTextAccordion
