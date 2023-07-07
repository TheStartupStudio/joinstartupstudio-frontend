import React, { useEffect, useState } from 'react'
import { EditorTools } from '@progress/kendo-react-editor'
import BreakdownPopup from '../../components/Modals/BreakdownPopup'
import KendoTextEditor from '../../components/JournalsManagement/TextEditor'
import BreakdownCheckboxes from './BreakdownCheckboxes'

const BreakdownCustomContent = (props) => {
  const [checkboxValues, setCheckboxValues] = useState([])
  const [openPopup, setOpenPopup] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [activeIndex, setActiveIndex] = useState(-1)

  const handleOpenPopup = () => {
    setOpenPopup(true)
  }

  const handleClosePopup = () => {
    setOpenPopup(false)
  }

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
  const images = props.customContent?.images || []

  const sortedComponents = [
    ...(props.customContent?.checkboxesData || []),
    ...(props.customContent?.textEditorData || []),
    ...(props.customContent?.paragraphs || []),
    ...(props.customContent?.buttons || []),
    ...(props.customContent?.popupButtons || []),
    props.customContent?.imageGallery || {},
    { type: 'image', images }
  ].sort((a, b) => a.order - b.order)

  const ImageGallery = (props) => {
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

    const justifyContent = (index, gridColumns) => {
      if (index % gridColumns === 0) {
        return 'start'
      } else if (index % gridColumns === gridColumns - 1) {
        return 'end'
      } else {
        return 'center'
      }
    }

    return (
      <>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: props.gridColumns
              ? `repeat(${props.gridColumns}, 1fr)`
              : '1fr 1fr 1fr 1fr',
            borderBottom:
              selectedImage && props.hasBorderBottom
                ? '1px solid #efefef'
                : '0px solid #fff'
          }}
        >
          {props.images?.map((image, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: justifyContent(index, props.gridColumns),
                overflow: 'hidden',
                maxHeight: '150px'
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

        {selectedImage &&
          Object.keys(selectedImage?.button).length > 0 &&
          selectedImage?.button?.title && (
            <div
              className={`d-flex justify-content-${
                selectedImage?.button?.position
                  ? selectedImage?.button?.position
                  : 'end'
              }`}
            >
              <button
                style={{
                  backgroundColor: '#51c7df',
                  color: '#fff',
                  fontSize: 11
                }}
                onClick={() => handleOpenPopup()}
                className="px-5 py-3 border-0 color transform text-uppercase my-1"
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

  return (
    <div
      className={'accordion-content'}
      style={{ padding: '30px 55px !important' }}
    >
      {sortedComponents.map((data, index) => {
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
              <div className={`d-flex justify-content-${data.position}`}>
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
            {data?.type === 'image' && (
              <ImageGallery
                images={data?.images}
                gridColumns={data?.gridColumns}
                hasBorderBottom={data?.borderBottom}
              />
            )}
            {data?.type === 'popupButton' && (
              <>
                <div className={`d-flex justify-content-${data?.position}`}>
                  <button
                    style={{
                      backgroundColor: '#51c7df',
                      color: '#fff',
                      fontSize: 14
                    }}
                    onClick={() => {
                      handleOpenPopup()
                    }}
                    className="px-4 py-2 border-0 color transform text-uppercase my-1"
                  >
                    {data?.title}
                  </button>
                </div>
                <BreakdownPopup
                  show={openPopup}
                  onHide={handleClosePopup}
                  popupContent={data?.popupContent}
                />
              </>
            )}
          </>
        )
      })}
    </div>
  )
}

export default BreakdownCustomContent
