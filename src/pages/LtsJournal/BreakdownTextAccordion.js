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
import BreakdownCustomContent from './BreakdownCustomContent'
import BreakdownCheckboxes from './BreakdownCheckboxes'
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
        {/*{isExpanded && props.breakdown.type === 'type-2' && <ImageGallery />}*/}
        {isExpanded && props.breakdown.type === 'type-3' && (
          <BreakdownCustomContent
            customContent={props.breakdown?.customContent}
          />
        )}
      </div>
    </>
  )
}

export default BreakdownTextAccordion
