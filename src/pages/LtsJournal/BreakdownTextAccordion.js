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

    const [checkboxValues, setCheckboxValues] = useState([
      {
        title: 'In completing this task did you:',
        checkboxes: [
          {
            checked: false,
            label: 'Give each student an opportunity to use their voice.'
          },
          {
            checked: false,
            label: 'Conduct at least one news briefing to start class.'
          },
          {
            checked: false,
            label:
              'Give students adequate time to complete work inside of their Journal or Portfolio.'
          }
        ]
      }
    ])

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

    const [textEditorData, setTextEditorData] = useState([
      {
        title:
          'Please submit any questions or feedback regarding this task in the curriculum to the LTS team.',
        value: `"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, 
                 totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                 Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui 
                 ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, 
                 sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam,
                 quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? 
                 Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, 
                 vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?"`
      }
    ])
    const newData = {
      checkboxes: checkboxValues,
      textEditorData: textEditorData
    }

    console.log(newData)
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
    return (
      <div className={'accordion-content'}>
        <>
          {checkboxValues.map((checkbox, index) => {
            return (
              <BreakdownCheckboxes
                data={checkbox}
                handleChange={(e, checkboxValue) =>
                  handleChangeCheckboxes(e, checkboxValue, index)
                }
              />
            )
          })}
          <>
            {textEditorData.map((data, index) => {
              return (
                <>
                  <div>{data.title}</div>
                  <KendoTextEditor
                    key={index}
                    value={data?.value}
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
              )
            })}
          </>
        </>

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
                // makeImageWhiteAndBlack
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
      </div>
    </>
  )
}

export default BreakdownTextAccordion
