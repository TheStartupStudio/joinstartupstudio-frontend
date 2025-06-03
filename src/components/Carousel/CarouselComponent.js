import React, { useState, useEffect } from 'react'
import './Carousel.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChevronLeft,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons'

const CarouselComponent = ({
  className,
  data,
  itemsToShow = 1,
  breakPoints = [],
  renderItems,
  transitionDuration = '0.5s',
  transitionTimingFunction = 'ease-in-out',
  initialActiveIndex = 0
}) => {
  const [activeIndex, setActiveIndex] = useState(initialActiveIndex)
  const [currentItemsToShow, setCurrentItemsToShow] = useState(itemsToShow)
  const [totalPages, setTotalPages] = useState(
    Math.ceil(data?.length / itemsToShow)
  )

  const totalItems = data?.length
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

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      let newItemsToShow = itemsToShow

      for (const breakpoint of breakPoints) {
        if (width >= breakpoint.width) {
          newItemsToShow = breakpoint.itemsToShow
        }
      }

      setCurrentItemsToShow(newItemsToShow)
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [breakPoints, itemsToShow])

  useEffect(() => {
    const newTotalPages = Math.ceil(totalItems / currentItemsToShow)
    setTotalPages(newTotalPages)

    setActiveIndex((prevIndex) => Math.min(prevIndex, newTotalPages - 1))
  }, [currentItemsToShow, totalItems])

  useEffect(() => {
    setActiveIndex(initialActiveIndex)
  }, [initialActiveIndex])

  return (
    <div className={`my-carousel `}>
      <div
        className='inner'
        style={{
          transform: `translateX(-${activeIndex * 100}%)`,
          transition: `transform ${transitionDuration} ${transitionTimingFunction}`
        }}
      >
        {data?.map((item, index) => (
          <div
            key={index}
            className={`carousel-slide-item ${className}`}
            style={{
              width: `${100 / currentItemsToShow}%`
            }}
          >
            {renderItems(item, index)}
          </div>
        ))}
      </div>

      {displayIndicators && (
        <div className='d-flex mt-4 gap-4 justify-content-center mt-5'>
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

export default CarouselComponent
