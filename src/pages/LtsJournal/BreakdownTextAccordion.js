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

    const myFunction = () => {
      console.log('Clicked')
    }

    useEffect(() => {
      const button = document.querySelector('.my-btn')
      button.addEventListener('click', myFunction)

      return () => {
        button.removeEventListener('click', myFunction)
      }
    }, [])

    return (
      <div className={'accordion-content'}>
        <div>
          <div>Test button</div>
          <div
            style={{ fontFamily: 'Montserrat' }}
            dangerouslySetInnerHTML={{
              __html: `
              <div>
                <button
                  class="my-btn"
                  style="background-color:violet; color:#fff; padding: 10px 6px"
                >
                  Click here
                </button>
              </div>
            `
            }}
          />
        </div>

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
