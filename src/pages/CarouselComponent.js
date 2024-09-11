import React, { useState } from 'react'
import './Carousel.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChevronLeft,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons'

export const Carousel = ({
  data,
  itemsToShow = 1,
  renderItems,
  addItemComponent
}) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const totalItems = data?.length

  const totalPages = Math.ceil(totalItems / itemsToShow)
  const displayIndicators = totalPages > 1

  const updateIndex = (direction) => {
    setActiveIndex((prevIndex) => {
      let newIndex = prevIndex + direction

      if (newIndex < 0) {
        newIndex = totalPages - 1
      } else if (newIndex >= totalPages) {
        newIndex = 0
      }

      return newIndex
    })
  }

  return (
    <div className='my-carousel'>
      <div
        className='inner'
        style={{
          transform: `translateX(-${activeIndex * 100}%)`
        }}
      >
        {data?.map((item, index) => (
          <div
            key={index}
            className='carousel-slide-item'
            style={{
              width: `${100 / itemsToShow}%`
            }}
          >
            {renderItems(item)}
          </div>
        ))}
      </div>
      {addItemComponent && (
        <div style={{ padding: '0 20px', marginTop: 20 }}>
          {addItemComponent}
        </div>
      )}

      {displayIndicators && (
        <div className='d-flex mt-4 gap-4'>
          <FontAwesomeIcon
            icon={faChevronLeft}
            className='carousel-indicator-button me-4'
            onClick={() => updateIndex(-1)}
          />
          {Array.from({ length: totalPages }).map((_, index) => (
            <div
              key={index}
              className={`carousel-indicator ${
                activeIndex === index ? 'active' : ''
              }`}
              onClick={() => setActiveIndex(index)}
            />
          ))}
          <FontAwesomeIcon
            icon={faChevronRight}
            className='carousel-indicator-button ms-4'
            onClick={() => updateIndex(1)}
          />
        </div>
      )}
    </div>
  )
}
